import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoritesStore = create(
    persist(
        (set) => ({
            favorites: [],

            addFavorite: (product) =>
                set((state) => ({
                    favorites: [...state.favorites, product]
                })),

            removeFavorite: (productId) =>
                set((state) => ({
                    favorites: state.favorites.filter((item) => item.id !== productId)
                })),

            isFavorite: (productId) =>
                set((state) => state.favorites.some((item) => item.id === productId)),

            clearFavorites: () => set({ favorites: [] })
        }),
        {
            name: 'favorites-storage'
        }
    )
);

export default useFavoritesStore; 