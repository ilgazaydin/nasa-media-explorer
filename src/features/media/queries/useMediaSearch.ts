/**
 * @file useSearchMedia.ts
 * @description React Query hook for performing an infinite search on NASA media content.
 *
 * - Uses `useInfiniteQuery` to support infinite scroll pagination
 * - Fetches results from NASA's media search API via `fetchMediaSearch`
 * - Each page returns a `MediaList` with media items and total hits
 * - Automatically increments page number with `getNextPageParam`
 *
 * @param {UseSearchMediaOptions} options - Search and filter options
 * @param {string} options.query - The search query string
 * @param {string[]} [options.mediaTypes] - Optional list of media types to filter by (e.g., ['image', 'video'])
 * @param {number} [options.yearStart] - Optional start year filter
 * @param {number} [options.yearEnd] - Optional end year filter
 *
 * @returns A `useInfiniteQuery` result including:
 *   - `data`: Paginated `MediaList[]`
 *   - `fetchNextPage`, `hasNextPage`: Controls for infinite scroll
 *   - Standard loading, error, and status indicators
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMediaSearch } from "../api/search";
import { transformMediaItem } from "../mappers/transformMediaItem";
import { MediaList } from "../model/media";
import { queryKeys } from "./queryKeys";
import { PAGE_SIZE } from "@/constants/media";
import { InfiniteData } from "@tanstack/react-query";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

interface UseSearchMediaOptions {
  query?: string;
  mediaTypes?: string[];
  yearStart?: number;
  yearEnd?: number;
}

export const useSearchMedia = ({
  query = "",
  mediaTypes = [],
  yearStart,
  yearEnd,
}: UseSearchMediaOptions) => {
  return useInfiniteQuery<
    MediaList,
    Error,
    InfiniteData<MediaList>,
    unknown[],
    number
  >({
    queryKey: queryKeys.mediaSearchInfinite(
      query,
      mediaTypes.join(","),
      yearStart,
      yearEnd
    ),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchMediaSearch({
        ...(query ? { q: query } : {}),
        media_type:
          mediaTypes.length > 0 ? mediaTypes.join(",") : "image,video,audio",
        year_start: yearStart,
        year_end: yearEnd,
        page: pageParam,
        page_size: PAGE_SIZE,
      });

      return {
        items: transformMediaItem(response.collection.items),
        totalHits: response.collection.metadata?.total_hits,
      };
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.items.length < PAGE_SIZE ? undefined : pages.length + 1,
    initialPageParam: 1,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
