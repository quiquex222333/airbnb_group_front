import { CalendarDays, Users, Tag, Clock, MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Booking } from '../types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BookingDetailProps {
  booking: Booking;
}

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const formatDateTime = (iso?: string) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('es-BO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
};

const computeNights = (a?: string, b?: string) => {
  if (!a || !b) return 0;
  const d1 = new Date(a);
  const d2 = new Date(b);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 0;
  const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 ? Math.round(diff) : 0;
};

export function BookingDetail({ booking }: BookingDetailProps) {
  const navigate = useNavigate();
  const nights = computeNights(booking.checkIn, booking.checkOut);
  const pricePerNight = nights > 0 ? Math.round((booking.totalAmount / nights) * 100) / 100 : booking.totalAmount;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <header className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Reserva</p>
          <h1 className="mt-1 break-all font-mono text-xl font-bold">{booking.bookingId}</h1>
          {booking.status && (
            <span className="mt-3 inline-block rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold capitalize">
              {booking.status}
            </span>
          )}
        </header>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Tu estadía</h2>
          <Separator className="my-4" />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> Check-in
              </dt>
              <dd className="mt-1 text-base font-semibold">{formatDate(booking.checkIn)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> Check-out
              </dt>
              <dd className="mt-1 text-base font-semibold">{formatDate(booking.checkOut)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Users className="h-4 w-4" /> Huéspedes
              </dt>
              <dd className="mt-1 text-base font-semibold">{booking.guests}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Clock className="h-4 w-4" /> Noches
              </dt>
              <dd className="mt-1 text-base font-semibold">{nights || '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold">Alojamiento</h2>
          <Separator className="my-4" />
          <p className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">listingId:</span>
            <span className="break-all font-mono text-sm font-semibold">{booking.listingId}</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 rounded-full"
            onClick={() =>
              navigate(`/listings/${encodeURIComponent(booking.listingId)}/reviews`)
            }
          >
            <MessageSquareText className="mr-1.5 h-3.5 w-3.5" /> Reseñas del alojamiento
          </Button>
        </section>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-md">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground text-base font-semibold">${pricePerNight} USD</span>{' '}
            por noche
          </p>
          <Separator className="my-4" />
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">
                ${pricePerNight} × {nights || 0} noche{nights === 1 ? '' : 's'}
              </dt>
              <dd>${(pricePerNight * (nights || 0)).toFixed(0)} USD</dd>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-bold">
              <dt>Total</dt>
              <dd>${booking.totalAmount} USD</dd>
            </div>
          </dl>
          {booking.createdAt && (
            <p className="mt-4 text-xs text-muted-foreground">
              Reservado el {formatDateTime(booking.createdAt)}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
