import React from 'react';
import './ShinyButton.css';

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  textColor?: string;
  shineColor?: string;
  speed?: string;
  delay?: string;
  spread?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

export default function ShinyButton({
  children,
  onClick,
  className = '',
  textColor = '#b5b5b5',
  shineColor = 'rgba(200, 200, 200, 0.8)',
  speed = '2s',
  delay = '0s',
  spread = 120,
  direction = 'left',
}: ShinyButtonProps) {
  const getDirectionStyles = () => {
    switch (direction) {
      case 'left':
        return {
          background: `linear-gradient(
            120deg,
            transparent 0%,
            transparent 30%,
            ${shineColor} 50%,
            transparent 70%,
            transparent 100%
          )`,
        };
      case 'right':
        return {
          background: `linear-gradient(
            -120deg,
            transparent 0%,
            transparent 30%,
            ${shineColor} 50%,
            transparent 70%,
            transparent 100%
          )`,
        };
      case 'top':
        return {
          background: `linear-gradient(
            180deg,
            transparent 0%,
            transparent 30%,
            ${shineColor} 50%,
            transparent 70%,
            transparent 100%
          )`,
        };
      case 'bottom':
        return {
          background: `linear-gradient(
            0deg,
            transparent 0%,
            transparent 30%,
            ${shineColor} 50%,
            transparent 70%,
            transparent 100%
          )`,
        };
      default:
        return {};
    }
  };

  return (
    <button
      onClick={onClick}
      className={`shiny-button ${className}`}
      style={{
        color: textColor,
        '--shine-speed': speed,
        '--shine-delay': delay,
        '--shine-spread': `${spread}deg`,
      } as React.CSSProperties}
    >
      <span className="shiny-button-text">{children}</span>
      <span
        className="shiny-button-shine"
        style={getDirectionStyles()}
      />
    </button>
  );
}
