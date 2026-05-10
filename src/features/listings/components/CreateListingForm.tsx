import { useState, type FormEvent } from 'react';
import { Loader2, Home, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createListing } from '../api';
import { useListingsStore } from '../store';
import type { Listing } from '../types';

interface CreateListingFormProps {
  onSuccess?: (listing: Listing) => void;
}

export function CreateListingForm({ onSuccess }: CreateListingFormProps) {
  const addListing = useListingsStore((s) => s.addListing);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = title.trim();
    const numericPrice = Number(price);
    if (!trimmed) {
      setError('El título es obligatorio.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError('El precio por noche debe ser mayor a 0.');
      return;
    }

    setLoading(true);
    try {
      const listing = await createListing({ title: trimmed, price: numericPrice });
      addListing(listing);
      setTitle('');
      setPrice('');
      onSuccess?.(listing);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })
          ?.response?.data?.error?.message ??
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No pudimos crear el alojamiento. Inténtalo nuevamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Detalles básicos</h2>
          <p className="text-sm text-muted-foreground">
            Empieza con lo esencial. Después podrás añadir más detalles.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold">
          Título del alojamiento
        </Label>
        <div className="relative">
          <Home className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="title"
            type="text"
            required
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Depto acogedor en Santa Cruz"
            className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-base outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {title.length}/120 caracteres
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-semibold">
          Precio por noche
        </Label>
        <div className="relative">
          <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="price"
            type="number"
            inputMode="decimal"
            min="1"
            step="1"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="50"
            className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-20 text-base outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            USD
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <p className="text-xs text-muted-foreground sm:mr-auto">
          Al publicar aceptas las condiciones de anfitrión.
        </p>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 rounded-full px-8 text-base font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publicando...
            </>
          ) : (
            'Publicar alojamiento'
          )}
        </Button>
      </div>
    </form>
  );
}
