import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFading(true);
            setTimeout(onComplete, 800);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0e27] transition-opacity duration-800',
        fading && 'opacity-0 pointer-events-none'
      )}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <img
            src="/images/attatech-logo.png"
            alt="AttaTech"
            className="w-24 h-24 object-contain animate-pulse"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">AttaTech</h2>
          <p className="text-blue-400 text-sm tracking-widest uppercase">Loading</p>
        </div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="text-white/60 text-sm font-mono">
          {Math.min(Math.round(progress), 100)}%
        </span>
      </div>
    </div>
  );
}
