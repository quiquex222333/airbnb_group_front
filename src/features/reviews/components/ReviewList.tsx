import { Star, MessageSquareText } from 'lucide-react';
import type { Review } from '../types';
import { ReviewCard } from './ReviewCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
}

const computeAverage = (reviews: Review[]) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export function ReviewList({ reviews, loading = false }: ReviewListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
        <MessageSquareText className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-3 text-lg font-bold">Aún no hay reseñas</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Sé la primera persona en compartir tu experiencia con este alojamiento.
        </p>
      </div>
    );
  }

  const avg = computeAverage(reviews);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-3xl border border-border bg-card px-5 py-4 shadow-sm">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Star className="h-5 w-5 fill-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{avg.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">
            {reviews.length} reseña{reviews.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((r, idx) => (
          <ReviewCard key={r.reviewId ?? `${r.listingId}-${idx}`} review={r} />
        ))}
      </div>
    </div>
  );
}
