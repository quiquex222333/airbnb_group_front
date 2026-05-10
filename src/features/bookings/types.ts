export interface Booking {
  bookingId: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status?: string;
  userId?: string;
  createdAt?: string;
}

export interface CreateBookingPayload {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
}
