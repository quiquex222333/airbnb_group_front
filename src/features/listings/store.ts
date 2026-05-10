import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Listing } from './types';
import { apiClient } from '@/features/auth/api';

interface ListingsState {
  myListings: Listing[];
  allListings: Listing[];  // 👈 NUEVO — para guests
  addListing: (listing: Listing) => void;
  removeListing: (listingId: string) => void;
  fetchMyListings: () => Promise<void>;   // 👈 NUEVO
  fetchAllListings: () => Promise<void>;  // 👈 NUEVO
  clear: () => void;
}

export const useListingsStore = create<ListingsState>()(
  persist(
    (set) => ({
      myListings: [],
      allListings: [],
      addListing: (listing) =>
        set((state) => {
          if (state.myListings.some((l) => l.listingId === listing.listingId)) return state;
          return { myListings: [listing, ...state.myListings] };
        }),
      removeListing: (listingId) =>
        set((state) => ({
          myListings: state.myListings.filter((l) => l.listingId !== listingId),
        })),
      fetchMyListings: async () => {
        const { data } = await apiClient.get('/listings/my');
        set({ myListings: data.listings ?? [] });
      },
      fetchAllListings: async () => {
        const { data } = await apiClient.get('/listings');
        set({ allListings: data.listings ?? [] });
      },
      clear: () => set({ myListings: [], allListings: [] }),
    }),
    {
      name: 'airbnb-my-listings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);