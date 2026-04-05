import React, { useRef, useState } from 'react';
import clsx from 'clsx';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const Parallax3DCard: React.FC<ParallaxProps> = ({ children, className, maxTilt = 20 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const xPct = (x - centerX) / centerX;
    const yPct = (y - centerY) / centerY;
    
    // Hyper-exaggerated rotation
    const rotateX = -yPct * maxTilt;
    const rotateY = xPct * maxTilt;
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out',
      boxShadow: `${-xPct * 20}px ${yPct * 20}px 35px rgba(91,106,240,0.3)`,
      '--glare-x': `${glareX}%`,
      '--glare-y': `${glareY}%`,
      '--glare-opacity': '1',
      zIndex: 100
    } as any);
  };
  
  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '--glare-opacity': '0',
      zIndex: 10
    } as any);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "card hover:border-border2 border border-border1 dark:border-[#1F2937] transition-all duration-200 relative overflow-hidden",
        className
      )}
      style={{ ...style, transformStyle: 'preserve-3d' }}
    >
      <div 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: (style as any)['--glare-opacity'] || 0,
          background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.6) 0%, transparent 70%)`
        }}
      />
      <div className="relative z-20 h-full w-full" style={{ transform: 'translateZ(40px)' }}>
        {children}
      </div>
    </div>
  );
};
