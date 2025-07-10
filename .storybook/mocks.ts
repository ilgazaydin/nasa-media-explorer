// Storybook-specific mocks without vitest dependencies
import type { MediaItem } from '../src/features/media/model/media';

// Use the same placeholder image as the main application
const PLACEHOLDER_THUMBNAIL = "https://svs.gsfc.nasa.gov/vis/a010000/a012300/a012321/s1-1920.jpg";

export const mockMediaItem: MediaItem = {
  id: 'demo-image-001',
  title: 'Earth from Space - Apollo 17',
  description: 'A stunning view of Earth captured by the Apollo 17 crew in 1972. This iconic photograph shows our planet in all its glory, suspended in the darkness of space.',
  keywords: ['earth', 'space', 'apollo', 'photography'],
  dateCreated: '2023-10-01',
  mediaType: 'image',
  thumbnailUrl: PLACEHOLDER_THUMBNAIL,
  fullImageUrl: PLACEHOLDER_THUMBNAIL,
};

export const mockVideoMediaItem: MediaItem = {
  id: 'demo-video-001',
  title: 'Mars Rover Landing Sequence',
  description: 'Watch the incredible landing sequence of the Mars Perseverance rover as it touches down on the Red Planet.',
  keywords: ['mars', 'rover', 'landing', 'perseverance'],
  dateCreated: '2023-09-15',
  mediaType: 'video',
  thumbnailUrl: PLACEHOLDER_THUMBNAIL,
};

export const mockAudioMediaItem: MediaItem = {
  id: 'demo-audio-001',
  title: 'Sounds of Jupiter',
  description: 'Listen to the haunting sounds of Jupiter captured by the Juno spacecraft as it orbits the gas giant.',
  keywords: ['jupiter', 'sounds', 'juno', 'spacecraft'],
  dateCreated: '2023-08-20',
  mediaType: 'audio',
  thumbnailUrl: PLACEHOLDER_THUMBNAIL,
};
