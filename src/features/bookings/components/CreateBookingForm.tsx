import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Loader2, CalendarRange, Users, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createBooking } from '../api';
import { useBookingsStore } from '../store';
import type { Booking } from '../types';

interface CreateBookingFormProps {
  initialListingId?: string;
  defaultPricePerNight?: number;
  onSuccess?: (booking: Booking) => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export function CreateBookingForm({
  initialListingId = '',
  defaultPricePerNight,
  onSuccess,
}: CreateBookingFormProps) {
  const addBooking = useBookingsStore((s) => s.addBooking);
  const [listingId, setListingId] = useState(initialListingId);
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [guests, setGuests] = useState(1);
  const [totalAmount, setTotalAmount] = useState<number>(defaultPricePerNight ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = useMemo(() => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return 0;
    const diff = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (defaultPricePerNight && nights > 0) {
      setTotalAmount(defaultPricePerNight * nights);
    }
  }, [defaultPricePerNight, nights]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!listingId.trim()) {
      setError('Necesitas un listingId para reservar.');
      return;
    }
    if (nights <= 0) {
      setError('La fecha de salida debe ser posterior a la de entrada.');
      return;
    }
    if (guests < 1) {
      setError('Debe haber al menos 1 huésped.');
      return;
    }
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      setError('El monto total debe ser mayor a 0.');
      return;
    }

    setLoading(true);
    try {
      const booking = await createBooking({
        listingId: listingId.trim(),
        checkIn,
        checkOut,
        guests,
        totalAmount,
      });
      addBooking(booking);
      onSuccess?.(booking);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })
          ?.response?.data?.error?.message ??
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No pudimos completar la reserva. Inténtalo nuevamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
    >
      <div className="space-y-2">
        <Label htmlFor="listingId" className="text-sm font-semibold">
          Listing ID
        </Label>
        <div className="relative">
          <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="listingId"
            type="text"
            required
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            placeholder="listing-demo-123"
            className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 font-mono text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border p-3 sm:grid-cols-2">
        <div className="rounded-xl px-3 py-2">
          <Label htmlFor="checkIn" className="text-[11px] font-bold uppercase tracking-wide">
            Check-in
          </Label>
          <input
            id="checkIn"
            type="date"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full bg-transparent text-sm font-medium text-foreground outline-none"
          />
        </div>
        <div className="rounded-xl border-t border-border px-3 py-2 sm:border-t-0 sm:border-l">
          <Label htmlFor="checkOut" className="text-[11px] font-bold uppercase tracking-wide">
            Check-out
          </Label>
          <input
            id="checkOut"
            type="date"
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full bg-transparent text-sm font-medium text-foreground outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="guests" className="text-sm font-semibold">
            Huéspedes
          </Label>
          <div className="relative">
            <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="guests"
              type="number"
              min={1}
              max={20}
              required
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalAmount" className="text-sm font-semibold">
            Monto total
          </Label>
          <div className="relative">
            <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="totalAmount"
              type="number"
              min={1}
              step="1"
              required
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-16 outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              USD
            </span>
          </div>
        </div>
      </div>

      {nights > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <CalendarRange className="h-4 w-4" />
            {nights} noche{nights > 1 ? 's' : ''}
          </span>
          <span className="font-semibold">${totalAmount} USD total</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-full text-base font-semibold sm:w-auto sm:self-end sm:px-10"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reservando...
          </>
        ) : (
          'Confirmar reserva'
        )}
      </Button>
    </form>
  );
}
