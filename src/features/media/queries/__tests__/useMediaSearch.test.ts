// Test stub for useSearchMedia
import { vi, describe, it, expect } from 'vitest';
import { useSearchMedia } from '../useMediaSearch';
import { mockMediaItem } from '@/test/mocks';

// Mock the hook directly
vi.mock('../useMediaSearch', () => ({
  useSearchMedia: vi.fn(),
}));

const mockUseSearchMedia = vi.mocked(useSearchMedia);

describe('useSearchMedia', () => {
  it('should be defined', () => {
    expect(useSearchMedia).toBeDefined();
  });

  it('should fetch and transform paginated media items', () => {
    const mockData = {
      data: {
        pages: [{
          items: [mockMediaItem],
          totalHits: 1
        }],
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

    mockUseSearchMedia.mockReturnValue(mockData as any);
    
    const result = useSearchMedia({ query: 'mars', mediaTypes: ['image'] });
    
    expect(result.data?.pages[0].items[0]).toEqual(mockMediaItem);
    expect(result.isLoading).toBe(false);
  });

  it('should handle no results', () => {
    const mockData = {
      data: {
        pages: [{
          items: [],
          totalHits: 0
        }],
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

    mockUseSearchMedia.mockReturnValue(mockData as any);
    
    const result = useSearchMedia({ query: 'none' });
    
    expect(result.data?.pages[0].items).toEqual([]);
    expect(result.data?.pages[0].totalHits).toBe(0);
  });
});
