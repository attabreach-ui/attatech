import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  staggerDelay?: number;
}

export function TextReveal({
  text,
  className,
  tag: Tag = 'h2',
  delay = 0,
  staggerDelay = 0.05,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  const words = text.split(' ');

  return (
    <div ref={ref} className={cn('inline', className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.25em]"
        >
          <Tag
            className={cn('inline-block', className)}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
              transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * staggerDelay}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * staggerDelay}s`,
            }}
          >
            {word}
          </Tag>
        </span>
      ))}
    </div>
  );
}
