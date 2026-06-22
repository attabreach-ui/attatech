import { useCountUp } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const { ref, count } = useCountUp(end, duration);

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}{count}{suffix}
    </span>
  );
}
