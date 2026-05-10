import { apiClient } from '@/features/auth/api';
import type { CreateReviewPayload, Review } from './types';

interface CreateReviewResponse {
  review?: Review;
  message?: string;
}

interface GetReviewsResponse {
  reviews?: Review[];
  items?: Review[];
}

export const createReview = async (payload: CreateReviewPayload): Promise<Review> => {
  const { data } = await apiClient.post<CreateReviewResponse>('/reviews', payload);
  return data.review ?? { ...payload };
};

export const getReviewsByListing = async (listingId: string): Promise<Review[]> => {
  const { data } = await apiClient.get<GetReviewsResponse | Review[]>(
    `/reviews/listing/${listingId}`,
  );
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.reviews)) return data.reviews;
  if (Array.isArray(data.items)) return data.items;
  return [];
};
