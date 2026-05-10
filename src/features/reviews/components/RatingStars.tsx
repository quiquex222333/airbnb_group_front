import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
} as const;

export function RatingStars({
  value,
  onChange,
  size = 'md',
  readOnly = false,
  className,
}: RatingStarsProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = !readOnly && Boolean(onChange);
  const display = hover ?? value;
  const sizeClass = SIZE_MAP[size];

  return (
    <div
      className={cn('inline-flex items-center gap-1', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Selecciona una calificación' : `${value} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={interactive ? () => setHover(star) : undefined}
            onMouseLeave={interactive ? () => setHover(null) : undefined}
            onClick={interactive ? () => onChange?.(star) : undefined}
            className={cn(
              'transition-transform',
              interactive && 'cursor-pointer hover:scale-110 active:scale-95',
              !interactive && 'cursor-default',
            )}
            aria-checked={star === value}
            aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClass,
                'transition-colors',
                filled ? 'fill-primary text-primary' : 'fill-transparent text-muted-foreground/40',
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
