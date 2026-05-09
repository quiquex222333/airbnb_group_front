import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ReviewList } from '@/features/reviews/components/ReviewList';
import { CreateReviewForm } from '@/features/reviews/components/CreateReviewForm';
import { getReviewsByListing } from '@/features/reviews/api';
import type { Review } from '@/features/reviews/types';

export default function ListingReviewsScreen() {
  const navigate = useNavigate();
  const { listingId = '' } = useParams<{ listingId: string }>();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getReviewsByListing(listingId);
      setReviews(data);
    } catch (err: unknown) {
      const status =
        (err as { response?: { status?: number } })?.response?.status ?? 0;
      setError(
        status === 404
          ? 'No encontramos reseñas para este alojamiento.'
          : 'No pudimos cargar las reseñas.',
      );
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return (
    <DashboardLayout
      title="Reseñas del alojamiento"
      description="Lee lo que dicen otros viajeros y comparte tu experiencia."
      actions={
        <Button variant="outline" className="rounded-full" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Volver
        </Button>
      }
    >
      <div className="rounded-3xl border border-border bg-card px-6 py-4 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          listingId
        </p>
        <p className="mt-1 break-all font-mono text-sm font-semibold">{listingId}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {error ? (
            <div className="flex items-start gap-3 rounded-3xl border border-destructive/20 bg-destructive/5 p-5">
              <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-full"
                  onClick={loadReviews}
                >
                  Reintentar
                </Button>
              </div>
            </div>
          ) : (
            <ReviewList reviews={reviews} loading={loading} />
          )}
        </div>

        <aside className="lg:col-span-1">
          <CreateReviewForm
            listingId={listingId}
            onSuccess={(review) => {
              toast.success('¡Gracias por tu reseña!');
              setReviews((prev) => [review, ...prev]);
            }}
          />
        </aside>
      </div>
    </DashboardLayout>
  );
}
