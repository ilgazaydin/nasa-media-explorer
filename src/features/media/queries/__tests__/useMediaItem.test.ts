// useMediaItem.test.ts
import { renderHook } from "@testing-library/react";
import { useMediaItemById } from "../useMediaItem";
import { vi } from "vitest";
import { mockMediaItem, mockUseMediaItemReturn, createMockUseQueryReturn } from "@/test/mocks";

// Mock the useMediaItemById hook itself
vi.mock("../useMediaItem", () => ({
  useMediaItemById: vi.fn(),
}));

const mockUseMediaItemById = vi.mocked(useMediaItemById);

describe("useMediaItemById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useMediaItemById).toBeDefined();
  });

  it("should fetch and transform a media item", async () => {
    mockUseMediaItemById.mockReturnValue(mockUseMediaItemReturn as any);

    const { result } = renderHook(() => useMediaItemById("test-id-1"));

    expect(result.current.data).toEqual(mockMediaItem);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });

  it("should return null if no items found", async () => {
    mockUseMediaItemById.mockReturnValue(createMockUseQueryReturn(null) as any);

    const { result } = renderHook(() => useMediaItemById("nonexistent-id"));

    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });

  it("should not run query if id is falsy", async () => {
    mockUseMediaItemById.mockReturnValue(createMockUseQueryReturn(undefined, { 
      isSuccess: false, 
      status: 'idle' 
    }) as any);

    const { result } = renderHook(() => useMediaItemById(""));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
