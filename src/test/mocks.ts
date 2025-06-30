import { vi } from 'vitest';
import { MediaItem, MediaAsset, MediaMetadata, MediaList } from '../features/media/model/media';

// Mock Media Items
export const mockMediaItem: MediaItem = {
  id: 'nasa-id-1',
  title: 'Mars Rover Landing',
  dateCreated: '2023-01-15',
  thumbnailUrl: 'https://images-assets.nasa.gov/image/nasa-id-1/nasa-id-1~thumb.jpg',
  mediaType: 'image',
  keywords: ['mars', 'rover', 'landing', 'space']
};

export const mockVideoMediaItem: MediaItem = {
  id: 'nasa-video-1',
  title: 'ISS Space Walk',
  dateCreated: '2023-02-10',
  thumbnailUrl: 'https://images-assets.nasa.gov/video/nasa-video-1/nasa-video-1~thumb.jpg',
  mediaType: 'video',
  keywords: ['iss', 'spacewalk', 'astronaut']
};

export const mockAudioMediaItem: MediaItem = {
  id: 'nasa-audio-1',
  title: 'Apollo 11 Communications',
  dateCreated: '1969-07-20',
  thumbnailUrl: 'https://images-assets.nasa.gov/audio/nasa-audio-1/nasa-audio-1~thumb.jpg',
  mediaType: 'audio',
  keywords: ['apollo', 'moon', 'communications']
};

// Mock Media Assets
export const mockMediaAssets: MediaAsset[] = [
  {
    type: 'image',
    url: 'https://images-assets.nasa.gov/image/nasa-id-1/nasa-id-1~orig.jpg',
    quality: 'orig',
    extension: 'jpg'
  },
  {
    type: 'image',
    url: 'https://images-assets.nasa.gov/image/nasa-id-1/nasa-id-1~large.jpg',
    quality: 'large',
    extension: 'jpg'
  },
  {
    type: 'image',
    url: 'https://images-assets.nasa.gov/image/nasa-id-1/nasa-id-1~medium.jpg',
    quality: 'medium',
    extension: 'jpg'
  }
];

export const mockVideoAssets: MediaAsset[] = [
  {
    type: 'video',
    url: 'https://images-assets.nasa.gov/video/nasa-video-1/nasa-video-1~orig.mp4',
    quality: 'orig',
    extension: 'mp4'
  },
  {
    type: 'video',
    url: 'https://images-assets.nasa.gov/video/nasa-video-1/nasa-video-1~small.mp4',
    quality: 'small',
    extension: 'mp4'
  }
];

export const mockAudioAssets: MediaAsset[] = [
  {
    type: 'other',
    url: 'https://images-assets.nasa.gov/audio/nasa-audio-1/nasa-audio-1~orig.mp3',
    quality: 'orig',
    extension: 'mp3'
  }
];

// Mock Media Metadata
export const mockMediaMetadata: MediaMetadata = {
  id: 'nasa-id-1',
  title: 'Mars Rover Landing',
  description: 'A detailed view of the Mars rover landing sequence captured by the Perseverance mission.',
  keywords: ['mars', 'rover', 'landing', 'space', 'perseverance'],
  dateCreated: '2023-01-15',
  mediaType: 'image',
  center: 'JPL',
  creator: 'NASA/JPL-Caltech'
};

// Mock Media Lists
export const mockMediaList: MediaList = {
  items: [mockMediaItem, mockVideoMediaItem],
  totalHits: 2
};

export const mockEmptyMediaList: MediaList = {
  items: [],
  totalHits: 0
};

// Mock API Responses
export const mockNasaApiResponse = {
  collection: {
    items: [
      {
        href: 'https://images-assets.nasa.gov/image/nasa-id-1/collection.json',
        data: [
          {
            nasa_id: 'nasa-id-1',
            title: 'Mars Rover Landing',
            date_created: '2023-01-15T00:00:00Z',
            keywords: ['mars', 'rover', 'landing', 'space'],
            media_type: 'image',
            description: 'A detailed view of the Mars rover landing sequence.',
            center: 'JPL',
            photographer: 'NASA/JPL-Caltech'
          }
        ],
        links: [
          {
            href: 'https://images-assets.nasa.gov/image/nasa-id-1/nasa-id-1~thumb.jpg',
            rel: 'preview',
            render: 'image'
          }
        ]
      }
    ],
    metadata: {
      total_hits: 1
    }
  }
};

export const mockNasaEmptyResponse = {
  collection: {
    items: [],
    metadata: {
      total_hits: 0
    }
  }
};

// Mock React Query Hook Returns
export const mockUseMediaSearchReturn = {
  data: {
    pages: [mockMediaList],
    pageParams: [1]
  },
  isLoading: false,
  error: null,
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  isSuccess: true,
  isError: false,
  isPending: false,
  status: 'success' as const
};

export const mockUseMediaItemReturn = {
  data: mockMediaItem,
  isLoading: false,
  error: null,
  isSuccess: true,
  isError: false,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isStale: false,
  isFetching: false,
  isFetched: true,
  isFetchedAfterMount: true,
  isPlaceholderData: false,
  status: 'success' as const,
  fetchStatus: 'idle' as const,
  refetch: vi.fn(),
  remove: vi.fn(),
};

export const mockUseMediaAssetsReturn = {
  data: mockMediaAssets,
  isLoading: false,
  error: null,
  isSuccess: true,
  isError: false,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isStale: false,
  isFetching: false,
  isFetched: true,
  isFetchedAfterMount: true,
  isPlaceholderData: false,
  status: 'success' as const,
  fetchStatus: 'idle' as const,
  refetch: vi.fn(),
  remove: vi.fn(),
};

export const mockUseMediaMetadataReturn = {
  data: mockMediaMetadata,
  isLoading: false,
  error: null,
  isSuccess: true,
  isError: false,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isStale: false,
  isFetching: false,
  isFetched: true,
  isFetchedAfterMount: true,
  isPlaceholderData: false,
  status: 'success' as const,
  fetchStatus: 'idle' as const,
  refetch: vi.fn(),
  remove: vi.fn(),
};

// Error state variants
export const mockUseMediaMetadataErrorReturn = {
  data: undefined,
  isLoading: false,
  error: new Error('Test error'),
  isSuccess: false,
  isError: true,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isStale: false,
  isFetching: false,
  isFetched: true,
  isFetchedAfterMount: true,
  isPlaceholderData: false,
  status: 'error' as const,
  fetchStatus: 'idle' as const,
  refetch: vi.fn(),
  remove: vi.fn(),
};

// Utility function to create custom mock returns
export const createMockUseQueryReturn = <T>(data: T, overrides?: Partial<any>) => ({
  data,
  isLoading: false,
  error: null,
  isSuccess: true,
  isError: false,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isStale: false,
  isFetching: false,
  isFetched: true,
  isFetchedAfterMount: true,
  isPlaceholderData: false,
  status: 'success' as const,
  fetchStatus: 'idle' as const,
  refetch: vi.fn(),
  remove: vi.fn(),
  ...overrides,
});

// Common mock functions
export const createMockFetch = (response: any, ok = true) => {
  return vi.fn().mockResolvedValue({
    ok,
    json: vi.fn().mockResolvedValue(response),
    text: vi.fn().mockResolvedValue(JSON.stringify(response))
  });
};

// React Router mocks - centralized for reuse across tests
export const createMockNavigate = () => vi.fn();

export const createMockSearchParams = (initialParams?: string | URLSearchParams) => {
  const params = new URLSearchParams(initialParams);
  const mockGet = vi.fn((key: string) => params.get(key));
  const mockSet = vi.fn((key: string, value: string) => params.set(key, value));
  const mockDelete = vi.fn((key: string) => params.delete(key));
  const mockToString = vi.fn(() => params.toString());
  
  return {
    get: mockGet,
    set: mockSet,
    delete: mockDelete,
    toString: mockToString,
    // Add common URLSearchParams methods for better compatibility
    has: vi.fn((key: string) => params.has(key)),
    append: vi.fn((key: string, value: string) => params.append(key, value)),
    entries: vi.fn(() => params.entries()),
    keys: vi.fn(() => params.keys()),
    values: vi.fn(() => params.values()),
  };
};

// React Router DOM mock factory
export const createReactRouterMock = (overrides: Record<string, any> = {}) => ({
  useNavigate: () => createMockNavigate(),
  useSearchParams: () => [createMockSearchParams(), vi.fn()],
  Outlet: () => '<div>Outlet</div>',
  Navigate: ({ to }: { to: string }) => `<div>Navigate to ${to}</div>`,
  ...overrides,
});

// Common App Hooks mock
export const createAppHooksMock = (authState = { accessToken: null, user: null }) => ({
  useAppSelector: vi.fn().mockReturnValue(authState),
  useAppDispatch: vi.fn().mockReturnValue(vi.fn()),
});
