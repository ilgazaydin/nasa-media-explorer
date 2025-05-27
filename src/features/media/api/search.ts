/**
 * @file search.ts
 * @description Provides API functions for performing media searches and fetching individual media items
 * from NASA's Image and Video Library API.
 */

import { nasaApi } from "@/lib/api/nasa";
import { APIMediaList } from "../model/api";

export interface SearchMediaParams {
  q?: string;
  media_type: string;
  year_start?: number;
  year_end?: number;
  page?: number;
  page_size?: number;
}
/**
 * Fetches a paginated list of media items from NASA's API based on query and filters.
 *
 * @param {SearchMediaParams} params - Search filters and pagination options.
 * @returns {Promise<MediaList>} A promise that resolves to the transformed media list.
 *
 * @example
 * const media = await fetchMediaSearch({ query: "mars", yearStart: 2000, yearEnd: 2020 });
 */
export const fetchMediaSearch = async (
  params: SearchMediaParams
): Promise<APIMediaList> => nasaApi.get("/search", { params });

/**
 * Fetches a single media item by its NASA ID.
 *
 * @param {string} id - The unique NASA ID of the media item.
 * @returns {Promise<APIMediaList["collection"]["items"]>} A promise resolving to the raw API item(s).
 *
 * @example
 * const item = await fetchMediaItemById("PIA12345");
 */

export const fetchMediaItemById = async (id: string): Promise<APIMediaList> =>
  nasaApi.get("/search", { params: { nasa_id: id } });
