/**
 * @file useFavourites.ts
 * @description A custom React hook to manage favourite media items using localStorage.
 * Provides functions to toggle favourites and check if an item is already favourited.
 */

import { MediaItem } from "../model/media";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const STORAGE_KEY = "favouriteMedia";

/**
 * Hook for managing user's favourite media items.
 *
 * @returns {{
 *   favourites: MediaItem[];
 *   toggleFavourite: (item: MediaItem) => void;
 *   isFavourited: (id: string) => boolean;
 * }} An object containing the current favourites, a toggle function, and a checker function.
 *
 * @example
 * const { favourites, toggleFavourite, isFavourited } = useFavourites();
 */
export const useFavourites = () => {
  const [favourites, setFavourites] = useLocalStorage<MediaItem[]>(
    STORAGE_KEY,
    []
  );

  const toggleFavourite = (item: MediaItem) => {
    setFavourites((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isFavourited = (id: string) => {
    return favourites.some((f) => f.id === id);
  };

  return {
    favourites,
    toggleFavourite,
    isFavourited,
  };
};
