/**
 * @file asset.ts
 * @description Fetches all available media asset URLs (e.g., images, videos, audio) for a given NASA media item.
 *
 * @function fetchMediaAssets
 * @param {string} nasaId - The unique identifier of the media item provided by NASA.
 * @returns {Promise<APIMediaAsset>} A promise that resolves to an array of asset URLs.
 *
 * @example
 * const assets = await fetchMediaAssets("PIA01234");
 * console.log(assets); // [{ href: "https://..." }, ...]
 */

import { nasaApi } from "@/lib/api/nasa";
import { APIMediaAsset } from "../model/api";

export const fetchMediaAssets = async (
  nasaId: string
): Promise<APIMediaAsset> => nasaApi.get(`/asset/${nasaId}`);
