/**
 * @file useMediaMetadata.ts
 * @description Custom React Query hook to fetch and transform detailed metadata for a given NASA media item.
 *
 * - First fetches the metadata location using `fetchMetadataLocation`
 * - Then uses that location to fetch raw metadata via `fetchMetadata`
 * - Transforms the raw metadata with `transformMediaMetadata`
 * - Handles query chaining using `enabled` flags
 *
 * @param nasaId - The NASA ID of the media item
 * @returns An object containing:
 *   - `data`: Transformed `MediaMetadata` or `undefined`
 *   - `isLoading`: Combined loading state of both queries
 *   - `isError`: Combined error state of both queries
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { fetchMetadataLocation, fetchMetadata } from "../api/metadata";
import { transformMediaMetadata } from "../mappers/transformMediaMetadata";
import { MediaMetadata } from "../model/media";

export const useMediaMetadata = (nasaId: string) => {
  const locationQuery = useQuery({
    queryKey: queryKeys.mediaMetadataLocation(nasaId),
    queryFn: () => fetchMetadataLocation(nasaId),
    enabled: !!nasaId,
  });

  const metadataQuery = useQuery({
    queryKey: queryKeys.mediaMetadata(nasaId),
    queryFn: () => fetchMetadata(locationQuery.data!.location),
    enabled: !!locationQuery.data,
  });

  const mapped: MediaMetadata | undefined = metadataQuery.data
    ? transformMediaMetadata(metadataQuery.data, nasaId)
    : undefined;

  return {
    data: mapped,
    isLoading: locationQuery.isLoading || metadataQuery.isLoading,
    isError: locationQuery.isError || metadataQuery.isError,
  };
};
