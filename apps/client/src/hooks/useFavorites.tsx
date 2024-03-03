import { Listing } from '../types.d';
import { create } from 'zustand';

interface UseFavoritesStore {
  favorites: Listing[] | null;
  fetch: (accessToken: string) => void;
  addFavorite: (favorite: Listing) => void;
  removeFavorite: (id: string) => void;
}

const useFavorites = create<UseFavoritesStore>(set => ({
  favorites: null,
  fetch: async (accessToken) => {
    const res = await fetch('/api/users/favorites-listings', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    set({ favorites: await res.json() });
  },
  addFavorite: (favorite) => {
    set(state => ({ favorites: state.favorites ? [...state.favorites, favorite] : [favorite] }));
  },
  removeFavorite: (id) => {
    set(state => ({ favorites: state.favorites ? state.favorites.filter(favorite => favorite.id !== id) : null }));
  },
}));

export default useFavorites;
