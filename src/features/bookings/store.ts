import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Booking } from './types';

interface BookingsState {
  myBookings: Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (bookingId: string) => void;
  clear: () => void;
}

/**
 * Backend no expone GET de "mis reservas", así que persistimos
 * localmente las que el usuario crea o consulta por ID.
 */
export const useBookingsStore = create<BookingsState>()(
  persist(
    (set) => ({
      myBookings: [],
      addBooking: (booking) =>
        set((state) => {
          const filtered = state.myBookings.filter(
            (b) => b.bookingId !== booking.bookingId,
          );
          return { myBookings: [booking, ...filtered] };
        }),
      removeBooking: (bookingId) =>
        set((state) => ({
          myBookings: state.myBookings.filter((b) => b.bookingId !== bookingId),
        })),
      clear: () => set({ myBookings: [] }),
    }),
    {
      name: 'airbnb-my-bookings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
