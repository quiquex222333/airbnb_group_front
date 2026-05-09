export interface Listing {
  listingId: string;
  ownerId?: string;
  title: string;
  price: number;
  hostId?: string;
  description?: string;
  city?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface CreateListingPayload {
  title: string;
  price: number;
}
