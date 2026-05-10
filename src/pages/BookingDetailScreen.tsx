import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { BookingDetail } from '@/features/bookings/components/BookingDetail';
import { useBookingsStore } from '@/features/bookings/store';
import { getBookingById } from '@/features/bookings/api';
import type { Booking } from '@/features/bookings/types';

export default function BookingDetailScreen() {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const cached = useBookingsStore((s) =>
    s.myBookings.find((b) => b.bookingId === bookingId),
  );
  const addBooking = useBookingsStore((s) => s.addBooking);

  const [booking, setBooking] = useState<Booking | null>(cached ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const fresh = await getBookingById(bookingId);
        if (cancelled) return;
        setBooking(fresh);
        addBooking(fresh);
      } catch (err: unknown) {
        if (cancelled) return;
        const status =
          (err as { response?: { status?: number } })?.response?.status ?? 0;
        setError(
          status === 404
            ? 'No encontramos esta reserva.'
            : 'No pudimos cargar el detalle de la reserva.',
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBooking();
    return () => {
      cancelled = true;
    };
  }, [bookingId, addBooking]);

  return (
    <DashboardLayout
      title="Detalle de reserva"
      description="Información completa de tu reserva consultada en el backend."
      actions={
        <Button variant="outline" className="rounded-full" onClick={() => navigate('/trips')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Volver
        </Button>
      }
    >
      {loading && !booking && (
        <div className="grid place-items-center rounded-3xl border border-border bg-card py-20 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Cargando reserva...</p>
        </div>
      )}

      {error && !booking && (
        <div className="flex flex-col items-start gap-3 rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">{error}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Verifica que el bookingId sea correcto e inténtalo de nuevo.
          </p>
          <Button variant="outline" className="rounded-full" onClick={() => navigate('/trips')}>
            Volver a Mis viajes
          </Button>
        </div>
      )}

      {booking && <BookingDetail booking={booking} />}
    </DashboardLayout>
  );
}
