import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Plane, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/layout/EmptyState';
import { Button } from '@/components/ui/button';
import { BookingCard } from '@/features/bookings/components/BookingCard';
import { useBookingsStore } from '@/features/bookings/store';
import { useListingsStore } from '@/features/listings/store';

export default function MyTripsScreen() {
  const navigate = useNavigate();
  const myBookings = useBookingsStore((s) => s.myBookings);
  const removeBooking = useBookingsStore((s) => s.removeBooking);
  const fetchMyBookings = useBookingsStore((s) => s.fetchMyBookings);
  const allListings = useListingsStore((s) => s.allListings);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar reservas desde la API al montar
  useEffect(() => {
    fetchMyBookings().finally(() => setIsLoading(false));
  }, []);

  // Filtrar por nombre del listing o fecha
  const filtered = myBookings.filter((b) => {
    const listing = allListings.find((l) => l.listingId === b.listingId);
    const listingName = listing?.title?.toLowerCase() ?? b.listingId.toLowerCase();
    const q = search.toLowerCase();
    return listingName.includes(q) || b.checkIn.includes(q) || b.checkOut.includes(q);
  });

  return (
    <DashboardLayout
      title="Mis viajes"
      description="Aquí ves las reservas que has creado."
      actions={
        <Button className="rounded-full" onClick={() => navigate('/trips/new')}>
          <Plus className="mr-1.5 h-4 w-4" /> Nueva reserva
        </Button>
      }
    >
      {/* Buscador por nombre o fecha */}
      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por alojamiento o fecha (ej: 2026-05)"
            className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="Aún no tienes reservas"
          description="Cuando crees una reserva aparecerá aquí."
          action={
            <Button className="rounded-full" onClick={() => navigate('/trips/new')}>
              <Plus className="mr-1.5 h-4 w-4" /> Crear mi primera reserva
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((b) => {
            const listing = allListings.find((l) => l.listingId === b.listingId);
            return (
              <div key={b.bookingId} className="flex flex-col gap-2">
                <BookingCard booking={b} listingName={listing?.title} />
                <button
                  type="button"
                  onClick={() => {
                    removeBooking(b.bookingId);
                    toast('Removido de tu lista');
                  }}
                  className="flex items-center justify-center gap-1.5 self-end rounded-full px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" /> Quitar de la lista
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}