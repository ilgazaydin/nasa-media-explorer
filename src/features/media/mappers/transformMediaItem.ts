/**
 * @file transformMediaItem.ts
 * @description Transforms raw NASA API media search results into structured MediaItem objects.
 */

import { MediaItem } from "../model/media";

const PLACEHOLDER_THUMBNAIL =
  "https://svs.gsfc.nasa.gov/vis/a010000/a012300/a012321/s1-1920.jpg";

/**
 * Transforms an array of raw NASA media items into frontend-friendly MediaItem objects.
 *
 * @param {any[]} items - Raw media item entries returned from NASA's search endpoint.
 * @returns {MediaItem[]} - Transformed media items with clean shape and fallback thumbnail support.
 */
export const transformMediaItem = (items: any[]): MediaItem[] => {
  return items
    .filter((item) => item?.data?.[0])
    .map((item) => {
      const data = item.data[0];
      const links = item.links?.[0] || {};

      return {
        id: data.nasa_id,
        title: data.title,
        description: data.description,
        dateCreated: data.date_created,
        thumbnailUrl: links.href || PLACEHOLDER_THUMBNAIL,
        mediaType: data.media_type,
        keywords: data.keywords ?? [],
      };
    });
};
