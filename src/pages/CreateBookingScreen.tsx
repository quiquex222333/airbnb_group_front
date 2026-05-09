import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreateBookingForm } from '@/features/bookings/components/CreateBookingForm';
import { useListingsStore } from '@/features/listings/store';

export default function CreateBookingScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialListingId = params.get('listingId') ?? '';

  const myListings = useListingsStore((s) => s.myListings);
  const matchedListing = useMemo(
    () => myListings.find((l) => l.listingId === initialListingId),
    [myListings, initialListingId],
  );

  return (
    <DashboardLayout
      title="Reservar alojamiento"
      description="Confirma las fechas de tu estadía y genera tu reserva."
      actions={
        <Button variant="outline" className="rounded-full" onClick={() => navigate('/trips')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Mis viajes
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CreateBookingForm
            initialListingId={initialListingId}
            defaultPricePerNight={matchedListing?.price}
            onSuccess={(booking) => {
              toast.success('Reserva creada', {
                description: `bookingId: ${booking.bookingId}`,
              });
              navigate(`/trips/${encodeURIComponent(booking.bookingId)}`);
            }}
          />
        </div>

        <aside className="space-y-4">
          {matchedListing && (
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Reservando
              </p>
              <h3 className="mt-1 text-lg font-bold">{matchedListing.title}</h3>
              <Separator className="my-3" />
              <p className="text-sm">
                <span className="font-semibold">${matchedListing.price} USD</span>
                <span className="text-muted-foreground"> por noche</span>
              </p>
              <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">
                {matchedListing.listingId}
              </p>
            </div>
          )}

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Reserva protegida</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu solicitud viaja con tu sesión autenticada. Recibirás un{' '}
              <span className="font-semibold text-foreground">bookingId</span> único que podrás
              consultar en cualquier momento.
            </p>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
