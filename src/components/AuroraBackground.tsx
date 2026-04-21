import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Use a softer spring for a fluid, lagging effect
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 150 });

  // Create opposite movement for depth
  const oppositeX = useTransform(smoothX, (v) => -v * 0.8);
  const oppositeY = useTransform(smoothY, (v) => -v * 0.8);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position relative to the center in pixels to give a much stronger movement
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      
      // Move by up to half the screen width/height for a dramatic aurora shift
      mouseX.set(x * 0.5);
      mouseY.set(y * 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col text-slate-200">
      {/* Aurora glow layers */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full mix-blend-screen filter blur-[120px] opacity-50 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(59,130,246,0) 70%)',
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[70vw] md:h-[70vw] rounded-full mix-blend-screen filter blur-[140px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(14,165,233,0) 70%)',
          x: oppositeX,
          y: oppositeY,
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* A third, more cyan/teal layer for that true aurora feel */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[100px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(45,212,191,0.5) 0%, rgba(0,0,0,0) 70%)',
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          scale: [0.9, 1.2, 0.9],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Dot matrix texture overlay */}
      <div className="absolute inset-0 bg-dot-matrix opacity-30 pointer-events-none z-0" mask-image="radial-gradient(ellipse at center, black 40%, transparent 80%)" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
