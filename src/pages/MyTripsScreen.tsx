import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Plane, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/layout/EmptyState';
import { Button } from '@/components/ui/button';
import { BookingCard } from '@/features/bookings/components/BookingCard';
import { useBookingsStore } from '@/features/bookings/store';
import { getBookingById } from '@/features/bookings/api';

export default function MyTripsScreen() {
  const navigate = useNavigate();
  const myBookings = useBookingsStore((s) => s.myBookings);
  const addBooking = useBookingsStore((s) => s.addBooking);
  const removeBooking = useBookingsStore((s) => s.removeBooking);
  const [lookupId, setLookupId] = useState('');
  const [lookingUp, setLookingUp] = useState(false);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    const id = lookupId.trim();
    if (!id) return;
    setLookingUp(true);
    try {
      const booking = await getBookingById(id);
      addBooking(booking);
      toast.success('Reserva encontrada');
      setLookupId('');
      navigate(`/trips/${encodeURIComponent(booking.bookingId)}`);
    } catch (err: unknown) {
      const status =
        (err as { response?: { status?: number } })?.response?.status ?? 0;
      if (status === 404) {
        toast.error('No encontramos esa reserva');
      } else {
        toast.error('Error consultando la reserva');
      }
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <DashboardLayout
      title="Mis viajes"
      description="Aquí ves las reservas que has creado o consultado."
      actions={
        <Button className="rounded-full" onClick={() => navigate('/trips/new')}>
          <Plus className="mr-1.5 h-4 w-4" /> Nueva reserva
        </Button>
      }
    >
      <form
        onSubmit={handleLookup}
        className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Buscar por bookingId"
            className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
        <Button
          type="submit"
          disabled={lookingUp || !lookupId.trim()}
          className="h-11 rounded-full px-6"
        >
          {lookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
        </Button>
      </form>

      {myBookings.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="Aún no tienes reservas"
          description="Cuando crees una reserva o busques una por bookingId, aparecerá aquí."
          action={
            <Button className="rounded-full" onClick={() => navigate('/trips/new')}>
              <Plus className="mr-1.5 h-4 w-4" /> Crear mi primera reserva
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {myBookings.map((b) => (
            <div key={b.bookingId} className="flex flex-col gap-2">
              <BookingCard booking={b} />
              <button
                type="button"
                onClick={() => {
                  removeBooking(b.bookingId);
                  toast('Removido de tu lista local');
                }}
                className="flex items-center justify-center gap-1.5 self-end rounded-full px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" /> Quitar de la lista
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
