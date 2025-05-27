/**
 * @file queryKeys.ts
 * @description Centralized definition of React Query keys for all media-related queries.
 * These keys help with caching, invalidation, and identification of specific data fetches.
 *
 * - `mediaSearchInfinite`: Key for paginated search queries, includes query + filter params.
 * - `mediaAssets`: Key for fetching media assets (images, videos) by NASA ID.
 * - `mediaMetadata`: Key for fetching parsed metadata for a media item.
 * - `mediaItemById`: Key for searching a single media item by its NASA ID.
 * - `mediaMetadataLocation`: Key for retrieving the metadata JSON file URL for a media item.
 */

export const queryKeys = {
  mediaSearchInfinite: (
    query: string,
    mediaType: string = "image",
    yearStart?: number,
    yearEnd?: number
  ) => ["mediaSearchInfinite", { query, mediaType, yearStart, yearEnd }],
  mediaAssets: (nasaId: string) => ["mediaAssets", nasaId],
  mediaMetadata: (nasaId: string) => ["mediaMetadata", nasaId],
  mediaItemById: (nasaId: string) => ["mediaItemById", nasaId],
  mediaMetadataLocation: (nasaId: string) => ["mediaMetadataLocation", nasaId],
};
