import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  className?: string;
  textClassName?: string;
  initial?: { y: string; opacity: number };
  animate?: { y: number; opacity: number };
  exit?: { y: string; opacity: number };
  transition?: object;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last';
  splitBy?: 'characters' | 'words' | 'lines';
  auto?: boolean;
  loop?: boolean;
}

export function RotatingText({
  texts,
  rotationInterval = 2000,
  className = '',
  textClassName = '',
  initial = { y: '100%', opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: '-120%', opacity: 0 },
  transition = { duration: 0.5, ease: 'easeOut' },
  staggerDuration = 0.025,
  staggerFrom = 'last',
  splitBy = 'characters',
  auto = true,
  loop = true,
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotate = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === texts.length - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [texts.length, loop]);

  useEffect(() => {
    if (!auto || texts.length <= 1) return;

    const interval = setInterval(rotate, rotationInterval);
    return () => clearInterval(interval);
  }, [auto, rotationInterval, texts.length, rotate]);

  const currentText = texts[currentIndex];

  const splitText = (text: string) => {
    if (splitBy === 'words') {
      return text.split(' ');
    }
    if (splitBy === 'lines') {
      return text.split('\n');
    }
    return text.split('');
  };

  const characters = splitText(currentText);

  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="inline-flex flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {characters.map((char, i) => {
            const index = staggerFrom === 'last' ? characters.length - 1 - i : i;
            return (
              <motion.span
                key={i}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay: index * staggerDuration,
                }}
                className={textClassName}
                style={{ display: 'inline-block', whiteSpace: splitBy === 'words' ? 'pre' : 'pre-wrap' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
