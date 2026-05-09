export interface Review {
  reviewId?: string;
  listingId: string;
  rating: number;
  comment: string;
  authorName?: string;
  userId?: string;
  createdAt?: string;
}

export interface CreateReviewPayload {
  listingId: string;
  rating: number;
  comment: string;
}
