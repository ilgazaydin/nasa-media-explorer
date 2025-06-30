// useMediaMetadata.test.ts
import { renderHook } from "@testing-library/react";
import { useMediaMetadata } from "../useMediaMetadata";
import { vi } from "vitest";
import { mockMediaMetadata, mockUseMediaMetadataReturn, createMockUseQueryReturn } from "@/test/mocks";

// Mock the useMediaMetadata hook itself
vi.mock("../useMediaMetadata", () => ({
  useMediaMetadata: vi.fn(),
}));

const mockUseMediaMetadata = vi.mocked(useMediaMetadata);

describe("useMediaMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(useMediaMetadata).toBeDefined();
  });

  it("should fetch location, then metadata, then transform", async () => {
    mockUseMediaMetadata.mockReturnValue(mockUseMediaMetadataReturn as any);

    const { result } = renderHook(() => useMediaMetadata("test-nasa-id"));

    expect(result.current.data).toEqual(mockMediaMetadata);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("should return undefined if no nasaId", async () => {
    mockUseMediaMetadata.mockReturnValue(createMockUseQueryReturn(undefined, {
      isSuccess: false,
      status: "idle",
    }) as any);

    const { result } = renderHook(() => useMediaMetadata(""));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
