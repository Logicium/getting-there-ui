/**
 * Types for video data
 */

/**
 * Video data from CMS
 */
export interface CMSVideo {
  id: number;
  documentId: string;
  title: string;
  Description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Author: string;
  Category: string;
  video: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats: any | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  tags: Array<{ id: number; tag: string }>;
}

/**
 * Processed video data for display
 */
export interface VideoData {
  id: string;
  title: string;
  presenter: string;
  description: string;
  fullDescription: string;
  duration: string;
  category: string;
  views: string;
  isFree: boolean;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
}
