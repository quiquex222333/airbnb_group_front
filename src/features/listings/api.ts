import { apiClient } from '@/features/auth/api';
import type { CreateListingPayload, Listing } from './types';

interface CreateListingResponse {
  listing: Listing;
  message?: string;
}

export const createListing = async (payload: CreateListingPayload): Promise<Listing> => {
  const { data } = await apiClient.post<CreateListingResponse>('/listings', payload);
  return data.listing;
};
