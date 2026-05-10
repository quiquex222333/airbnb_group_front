import { useNavigate } from 'react-router-dom';
import { Heart, MessageSquareText, CalendarPlus, MapPin } from 'lucide-react';
import type { Listing } from '../types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store';

interface ListingCardProps {
  listing: Listing;
  variant?: 'compact' | 'full';
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop';

const FALLBACK_IMAGES = [
  FALLBACK_IMAGE,
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop',
];

const pickFallback = (id: string) => {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const idx = Math.abs(hash) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[idx];
};

export function ListingCard({ listing, variant = 'compact' }: ListingCardProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const image = listing.imageUrl || pickFallback(listing.listingId);

    // No mostrar Reservar si el listing es del usuario actual
  const isOwner = user?.cognitoSub === listing.ownerId;

  return (
    <article
      className={cn(
        'group relative flex flex-col gap-3',
        variant === 'full' && 'rounded-3xl border border-border bg-card p-4 shadow-sm',
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <img
          src={image}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label="Guardar"
          className="absolute right-3 top-3 rounded-full p-2 transition-colors hover:bg-white/20"
        >
          <Heart className="h-6 w-6 stroke-[2px] text-white drop-shadow" />
        </button>
        <div className="absolute left-3 top-3 rounded-full border border-border bg-card/90 px-3 py-1 text-[12px] font-bold shadow-sm backdrop-blur-sm">
          Nuevo
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold text-foreground">{listing.title}</h3>
          {listing.city && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {listing.city}
            </p>
          )}
          <p className="mt-1 text-sm">
            <span className="font-semibold text-foreground">${listing.price} USD</span>
            <span className="text-muted-foreground"> por noche</span>
          </p>
        </div>
      </div>

      {variant === 'full' && (
        <div className="mt-1 flex flex-wrap gap-2">
          {!isOwner && (  // 👈 solo si no es el dueño
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => navigate(`/trips/new?listingId=${encodeURIComponent(listing.listingId)}`)}
            >
              <CalendarPlus className="mr-1 h-3.5 w-3.5" /> Reservar
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => navigate(`/listings/${encodeURIComponent(listing.listingId)}/reviews`)}
          >
            <MessageSquareText className="mr-1 h-3.5 w-3.5" /> Reseñas
          </Button>
        </div>
      )}
    </article>
  );
}
