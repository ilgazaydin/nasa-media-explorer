/**
 * @file transformMediaAssets.ts
 * @description Utility functions to transform raw media asset URLs into structured MediaAsset objects.
 */

import { MediaAsset } from "../model/media";

/**
 * Determines the media type based on file extension.
 *
 * @param {string} url - The URL of the media asset.
 * @returns {"image" | "video" | "other"} - The detected media type.
 */
const getType = (url: string): "image" | "video" | "other" => {
  if (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg"))
    return "image";
  if (url.endsWith(".mp4") || url.endsWith(".mov")) return "video";
  return "other";
};

/**
 * Determines the quality of the media based on filename markers.
 *
 * @param {string} url - The URL of the media asset.
 * @returns {MediaAsset["quality"]} - The extracted quality level.
 */
const getQuality = (url: string): MediaAsset["quality"] => {
  if (url.includes("~orig")) return "orig";
  if (url.includes("~large")) return "large";
  if (url.includes("~medium")) return "medium";
  if (url.includes("~small")) return "small";
  if (url.includes("~thumb")) return "thumb";
  return "unknown";
};

/**
 * Transforms an array of raw NASA asset URLs into structured MediaAsset objects.
 *
 * @param {{ href: string }[]} urls - The raw asset URLs from NASA API.
 * @returns {MediaAsset[]} - Transformed media assets with type, quality, and extension metadata.
 */
export const transformMediaAssets = (urls: { href: string }[]): MediaAsset[] =>
  urls.map(({ href }) => ({
    url: href,
    type: getType(href),
    quality: getQuality(href),
    extension: href.split(".").pop()?.toLowerCase() || "",
  }));
