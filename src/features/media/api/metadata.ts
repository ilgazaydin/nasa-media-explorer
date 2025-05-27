/**
 * @file metadata.ts
 * @description Provides utility functions to fetch metadata for a specific NASA media item.
 * Includes endpoints for both metadata location and actual metadata content.
 */

import { http } from "@/lib/http";
import { APIMediaMetadataLocation, APIMediaMetadata } from "../model/api";

/**
 * Fetches the URL of the raw metadata JSON for a given NASA media item.
 *
 * @param {string} nasaId - The unique NASA ID of the media item.
 * @returns {Promise<string>} A promise that resolves to the metadata JSON file URL.
 *
 * @example
 * const url = await fetchMetadataLocation("PIA12345");
 */
export const fetchMetadataLocation = async (
  nasaId: string
): Promise<APIMediaMetadataLocation> =>
  http.get<APIMediaMetadataLocation>(`/metadata/${nasaId}`);

/**
 * Fetches the raw metadata JSON from the given URL.
 *
 * @param {string} url - The URL pointing to the metadata JSON file.
 * @returns {Promise<APIMediaMetadata>} A promise that resolves to the raw metadata object.
 *
 * @example
 * const metadata = await fetchMetadata("https://images-assets.nasa.gov/.../metadata.json");
 */
export const fetchMetadata = async (url: string): Promise<APIMediaMetadata> =>
  http.get(url);
