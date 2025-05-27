/**
 * @file media.ts
 * @description Type definitions for media asset types and qualities.
 */

/**
 * Represents the type of media asset based on file extension.
 * - `image`: For image formats like JPG, PNG
 * - `video`: For video formats like MP4, MOV
 * - `other`: For unclassified formats
 */
export type MediaAssetType = "image" | "video" | "other";

/**
 * Represents the quality variant of a media asset.
 * - `orig`: Original quality
 * - `large`, `medium`, `small`, `thumb`: Standard size tiers
 * - `unknown`: When the quality can't be determined from the URL
 */
export type MediaAssetQuality =
  | "orig"
  | "large"
  | "medium"
  | "small"
  | "thumb"
  | "unknown";
