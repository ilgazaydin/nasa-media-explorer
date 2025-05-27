/**
 * @file media.ts
 * @description Clean and frontend-friendly models for media data used across the app.
 * These are transformed versions of the raw API responses, tailored for UI components and logic.
 */

import { MediaAssetQuality, MediaAssetType } from "../types/media";

/**
 * Represents a paginated media result set.
 */
export interface MediaList {
  items: MediaItem[];
  totalHits?: number;
}

/**
 * Represents a single media item shown in listings or detail views.
 */
export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  dateCreated: string;
  thumbnailUrl: string;
  fullImageUrl?: string;
  mediaType: string;
  keywords: string[];
}

/**
 * Metadata for a media item, fetched via NASA's metadata API.
 */
export interface MediaMetadata {
  id: string;
  title?: string;
  description?: string;
  dateCreated?: string;
  keywords: string[];
  creator?: string;
  center?: string;
  mediaType?: string;
  imageSize?: string;
  fileSize?: string;
  copyright?: string;
  sourceUrl?: string;
}

/**
 * Represents an individual downloadable asset (e.g., image, video) of a media item.
 */
export interface MediaAsset {
  url: string;
  type: MediaAssetType;
  quality: MediaAssetQuality;
  extension: string;
}
