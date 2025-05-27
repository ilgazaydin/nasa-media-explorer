/**
 * @file transformMediaMetadata.ts
 * @description Transforms raw NASA metadata into a frontend-friendly MediaMetadata object.
 */

import { APIMediaMetadata } from "../model/api";
import { MediaMetadata } from "../model/media";

/**
 * Converts raw metadata returned by NASA's metadata endpoint into a clean, typed MediaMetadata object.
 *
 * @param {APIMediaMetadata} raw - The raw metadata object from NASA's metadata API.
 * @param {string} nasaId - The NASA ID used to fetch the metadata.
 * @returns {MediaMetadata} A structured metadata object with fallback handling for optional fields.
 */
export const transformMediaMetadata = (
  raw: APIMediaMetadata,
  nasaId: string
): MediaMetadata => ({
  id: nasaId,
  title: raw["AVAIL:Title"],
  description: raw["AVAIL:Description"] || raw["AVAIL:Description508"],
  dateCreated: raw["AVAIL:DateCreated"],
  keywords: raw["AVAIL:Keywords"] ?? [],
  creator: raw["AVAIL:SecondaryCreator"] || raw["AVAIL:Creator"],
  center: raw["AVAIL:Center"],
  mediaType: raw["AVAIL:MediaType"],
  imageSize: raw["Composite:ImageSize"],
  fileSize: raw["File:FileSize"],
  copyright: raw["Photoshop:CopyrightFlag"] ? "Yes" : "No",
  sourceUrl: raw["AVAIL:Description"]?.match(/https?:\/\/[^\s]+/)?.[0],
});
