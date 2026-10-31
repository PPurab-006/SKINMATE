import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SplitSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspectRatio?: string;
}

export const SplitSlider: React.FC<SplitSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Baseline',
  afterLabel = 'AI Simulation',
  className = '',
  aspectRatio = 'aspect-[4/5]'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl border border-white/10 bg-editorial-surface ${aspectRatio} ${className} cursor-ew-resize`}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After image (Full background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Before image (Clipped with polygon) */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Dividing Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-editorial-lime shadow-[0_0_12px_rgba(212,248,60,0.8)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-editorial-bg/95 border-2 border-editorial-lime flex items-center justify-center shadow-lg text-editorial-lime backdrop-blur-md">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M8 7l-5 5 5 5V7zm8 0v10l5-5-5-5z" />
          </svg>
        </div>
      </div>

      {/* Floating Labels */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white/90 rounded-md border border-white/10">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <span className="px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider bg-editorial-lime/90 backdrop-blur-md text-black font-bold rounded-md shadow-md">
          {afterLabel}
        </span>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
        <span className="px-3 py-1 text-2xs uppercase tracking-widest text-white/70 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
          Drag slider to compare
        </span>
      </div>
    </div>
  );
};
