import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let x = 0, y = 0, targetX = 0, targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setHidden(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
        setHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
        setHovering(false);
      }
    };

    const handleMouseLeave = () => setHidden(true);

    let raf: number;
    const animate = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      if (cursor) {
        cursor.style.transform = `translate(${x - (hovering ? 20 : 4)}px, ${y - (hovering ? 20 : 4)}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseleave', handleMouseLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, [hovering]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <div
      ref={cursorRef}
      className={cn(
        'fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 border-blue-500 mix-blend-difference transition-[width,height,border-width] duration-200 ease-out',
        hovering ? 'w-10 h-10 border-blue-400 bg-blue-500/10' : 'w-2 h-2',
        hidden && 'opacity-0'
      )}
      style={{ willChange: 'transform' }}
    />
  );
}
