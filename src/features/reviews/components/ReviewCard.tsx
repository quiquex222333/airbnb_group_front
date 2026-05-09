import type { Review } from '../types';
import { RatingStars } from './RatingStars';

interface ReviewCardProps {
  review: Review;
}

const formatDate = (iso?: string) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const initials = (name?: string) => {
  if (!name) return 'AN';
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials(review.authorName)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{review.authorName ?? 'Anónimo'}</p>
          <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
        </div>
      </div>
      <div className="mt-3">
        <RatingStars value={review.rating} size="sm" readOnly />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{review.comment}</p>
    </article>
  );
}
