/**
 * @file useMediaAssets.ts
 * @description Custom React Query hook for fetching and transforming media assets (images, videos, etc.) from NASA's asset endpoint.
 *
 * - Fetches asset data using `fetchMediaAssets`
 * - Transforms the raw response into structured `MediaAsset[]` format using `transformMediaAssets`
 * - Disabled when `nasaId` is not provided
 *
 * @param nasaId - The NASA ID of the media item to fetch assets for
 * @returns React Query result containing an array of `MediaAsset` items
 */

import { useQuery } from "@tanstack/react-query";
import { MediaAsset } from "../model/media";
import { fetchMediaAssets } from "../api/asset";
import { transformMediaAssets } from "../mappers/transformMediaAssets";

export const useMediaAssets = (nasaId: string) => {
  return useQuery<MediaAsset[], Error>({
    queryKey: ["mediaAssets", nasaId],
    queryFn: async () => {
      const assets = await fetchMediaAssets(nasaId);
      return transformMediaAssets(assets.collection.items);
    },
    enabled: !!nasaId,
  });
};
