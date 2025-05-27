/**
 * @file useMediaItemById.ts
 * @description Custom React Query hook to fetch and transform a single media item by its NASA ID.
 *
 * - Uses `fetchMediaItemById` to get raw media data from the NASA search API
 * - Transforms the response using `transformMediaItem`
 * - Returns the first matched item or `null` if not found
 * - Disabled if `id` is falsy
 *
 * @param id - The NASA ID of the media item
 * @returns React Query result with a single `MediaItem` or `null`
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { MediaItem } from "../model/media";
import { transformMediaItem } from "../mappers/transformMediaItem";
import { fetchMediaItemById } from "../api/search";

export const useMediaItemById = (id: string) => {
  return useQuery<MediaItem | null, Error>({
    queryKey: queryKeys.mediaItemById(id),
    queryFn: async () => {
      const items = await fetchMediaItemById(id);
      const transformed = transformMediaItem(items.collection.items);
      return transformed?.[0] ?? null;
    },
    enabled: !!id,
  });
};
