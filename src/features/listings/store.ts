import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Listing } from './types';

interface ListingsState {
  myListings: Listing[];
  addListing: (listing: Listing) => void;
  removeListing: (listingId: string) => void;
  clear: () => void;
}

/**
 * Backend no expone GET /listings, así que guardamos localmente
 * los listings que el usuario crea desde esta sesión / dispositivo.
 * No es la fuente de verdad — solo conveniencia para la UI.
 */
export const useListingsStore = create<ListingsState>()(
  persist(
    (set) => ({
      myListings: [],
      addListing: (listing) =>
        set((state) => {
          if (state.myListings.some((l) => l.listingId === listing.listingId)) {
            return state;
          }
          return { myListings: [listing, ...state.myListings] };
        }),
      removeListing: (listingId) =>
        set((state) => ({
          myListings: state.myListings.filter((l) => l.listingId !== listingId),
        })),
      clear: () => set({ myListings: [] }),
    }),
    {
      name: 'airbnb-my-listings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
