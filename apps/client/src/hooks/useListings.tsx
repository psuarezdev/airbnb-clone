import { create } from 'zustand';
import { Listing } from '../types.d';

interface ListingsStore {
  listings: Listing[];
  fetch: (query?: string) => void;
  addListing: (listing: Listing) => void;
  removeListing: (id: string) => void;
}

const useListings = create<ListingsStore>(set => ({
  listings: [],
  fetch: async (query) => {
    const res = await fetch(`/api/listings${query}`);
    set({ listings: await res.json() });
  },
  addListing: (listing) => set(state => ({ listings: [listing, ...state.listings] })),
  removeListing: (id) => set(state => ({ listings: state.listings.filter(l => l.id !== id) })),
}));

export default useListings;
