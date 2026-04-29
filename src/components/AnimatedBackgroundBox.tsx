import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedBackgroundBoxProps {
  texts: string[];
  rotationInterval?: number;
  className?: string;
  textClassName?: string;
}

export function AnimatedBackgroundBox({
  texts,
  rotationInterval = 2000,
  className = '',
  textClassName = '',
}: AnimatedBackgroundBoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boxWidth, setBoxWidth] = useState<number | 'auto'>('auto');
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const currentText = texts[currentIndex];

  // Measure text width and update box width with animation
  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth;
      setBoxWidth(width + 24); // Add padding (px-3 = 12px each side)
    }
  }, [currentText]);

  // Split text into characters for stagger animation
  const characters = currentText.split('');

  return (
    <motion.span
      animate={{ width: boxWidth }}
      className={`inline-flex items-center justify-center py-1 rounded-lg bg-[#9d82f5] overflow-hidden whitespace-nowrap ${className}`}
      transition={{
        width: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      }}
      style={{ willChange: 'width' }}
    >
      {/* Hidden span to measure text width */}
      <span
        ref={textRef}
        className="invisible absolute whitespace-nowrap"
        style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
      >
        {currentText}
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className={`inline-flex px-3 ${textClassName}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {characters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: i * 0.07, // Stagger From: First, Duration: 0.07
              }}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
