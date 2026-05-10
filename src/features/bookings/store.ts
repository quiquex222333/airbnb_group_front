import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Booking } from './types';
import { apiClient } from '@/features/auth/api';

interface BookingsState {
  myBookings: Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (bookingId: string) => void;
  fetchMyBookings: () => Promise<void>;  // NUEVO
  clear: () => void;
}

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set) => ({
      myBookings: [],
      addBooking: (booking) =>
        set((state) => {
          const filtered = state.myBookings.filter((b) => b.bookingId !== booking.bookingId);
          return { myBookings: [booking, ...filtered] };
        }),
      removeBooking: (bookingId) =>
        set((state) => ({
          myBookings: state.myBookings.filter((b) => b.bookingId !== bookingId),
        })),
      fetchMyBookings: async () => {
        const { data } = await apiClient.get('/bookings/my');
        set({ myBookings: data.bookings ?? [] });
      },
      clear: () => set({ myBookings: [] }),
    }),
    {
      name: 'airbnb-my-bookings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);