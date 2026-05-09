import { apiClient } from '@/features/auth/api';
import type { Booking, CreateBookingPayload } from './types';

interface CreateBookingResponse {
  booking: Booking;
  message?: string;
}

interface GetBookingResponse {
  booking?: Booking;
  bookingId?: string;
  listingId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  totalAmount?: number;
  status?: string;
  userId?: string;
  createdAt?: string;
}

export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const { data } = await apiClient.post<CreateBookingResponse>('/bookings', payload);
  return data.booking;
};

export const getBookingById = async (bookingId: string): Promise<Booking> => {
  const { data } = await apiClient.get<GetBookingResponse>(`/bookings/${bookingId}`);
  if (data.booking) return data.booking;
  return {
    bookingId: data.bookingId ?? bookingId,
    listingId: data.listingId ?? '',
    checkIn: data.checkIn ?? '',
    checkOut: data.checkOut ?? '',
    guests: data.guests ?? 0,
    totalAmount: data.totalAmount ?? 0,
    status: data.status,
    userId: data.userId,
    createdAt: data.createdAt,
  };
};
