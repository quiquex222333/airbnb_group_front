import { useNavigate } from 'react-router-dom';
import { CalendarDays, Users, ArrowRight, Tag } from 'lucide-react';
import type { Booking } from '../types';
import { Button } from '@/components/ui/button';

interface BookingCardProps {
  booking: Booking;
  listingName?: string;
}

const formatDate = (iso: string) => {
  if (!iso) return '—';
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

const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
};

export function BookingCard({ booking, listingName }: BookingCardProps) {
  const navigate = useNavigate();
  const status = booking.status?.toLowerCase();
  const statusClass = status ? statusStyles[status] ?? 'bg-muted text-muted-foreground border-border' : null;

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Reserva</p>
          <h3 className="mt-1 truncate font-mono text-sm font-semibold text-foreground">
            {booking.bookingId}
          </h3>
          <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <span className="truncate">{listingName ?? booking.listingId}</span>
          </p>
        </div>
        {statusClass && (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusClass}`}
          >
            {status}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-muted/40 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" /> Check-in
          </p>
          <p className="mt-1 font-semibold">{formatDate(booking.checkIn)}</p>
        </div>
        <div className="rounded-2xl bg-muted/40 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" /> Check-out
          </p>
          <p className="mt-1 font-semibold">{formatDate(booking.checkOut)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" /> {booking.guests}
          </span>
          <span className="font-semibold">${booking.totalAmount} USD</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => navigate(`/trips/${encodeURIComponent(booking.bookingId)}`)}
        >
          Ver detalle <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </article>
  );
}
