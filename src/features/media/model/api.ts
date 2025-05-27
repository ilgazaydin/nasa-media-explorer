/**
 * @file api.ts
 * @description Type definitions for raw responses from the NASA media API.
 */

/**
 * Represents a raw API response from a media search query.
 */
export interface APIMediaList {
  collection: {
    items: APIMediaItem[];
    metadata?: { total_hits: number };
    links?: Array<{
      rel: string;
      prompt: string;
      href: string;
    }>;
  };
}

/**
 * Represents an individual item in a search response.
 */
export interface APIMediaItem {
  href: string;
  data: Array<{
    title: string;
    description: string;
    date_created: string;
    photographer?: string;
    keywords?: string[];
    media_type: string;
    nasa_id: string;
    year_start?: string;
  }>;
  links: Array<{
    href: string;
    rel: string;
    render?: string;
  }>;
}

/**
 * Represents the raw metadata object returned from NASA metadata API.
 * Keys are dynamic, e.g., "AVAIL:Title", "File:FileSize", etc.
 */
export interface APIMediaMetadata {
  [key: string]: any;
}

/**
 * Contains the URL location of the metadata JSON.
 */
export interface APIMediaMetadataLocation {
  [key: string]: any;
}

/**
 * Represents the list of asset files associated with a media item.
 */
export interface APIMediaAsset {
  collection: {
    items: { href: string }[];
  };
}
