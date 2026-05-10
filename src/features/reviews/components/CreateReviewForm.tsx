import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createReview } from '../api';
import type { Review } from '../types';
import { RatingStars } from './RatingStars';

interface CreateReviewFormProps {
  listingId: string;
  onSuccess?: (review: Review) => void;
}

export function CreateReviewForm({ listingId, onSuccess }: CreateReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = comment.trim();
    if (rating < 1 || rating > 5) {
      setError('La calificación debe estar entre 1 y 5.');
      return;
    }
    if (trimmed.length < 5) {
      setError('Cuéntanos un poco más sobre tu experiencia.');
      return;
    }

    setLoading(true);
    try {
      const review = await createReview({ listingId, rating, comment: trimmed });
      setComment('');
      setRating(5);
      onSuccess?.(review);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })
          ?.response?.data?.error?.message ??
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No pudimos publicar tu reseña. Inténtalo nuevamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-bold">Comparte tu experiencia</h3>
        <p className="text-sm text-muted-foreground">
          Tu reseña ayudará a otros viajeros a tomar mejores decisiones.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Tu calificación</Label>
        <div className="flex items-center gap-3">
          <RatingStars value={rating} onChange={setRating} size="lg" />
          <span className="text-sm font-semibold text-muted-foreground">{rating}/5</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment" className="text-sm font-semibold">
          Tu reseña
        </Label>
        <textarea
          id="comment"
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={600}
          rows={5}
          placeholder="¿Qué te gustó del alojamiento? ¿Lo recomendarías?"
          className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
        <p className="text-right text-xs text-muted-foreground">{comment.length}/600</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-full text-sm font-semibold sm:w-auto sm:self-end sm:px-8"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publicando...
          </>
        ) : (
          'Publicar reseña'
        )}
      </Button>
    </form>
  );
}
