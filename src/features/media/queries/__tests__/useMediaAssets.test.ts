// useMediaAssets.test.tsx
import { renderHook } from "@testing-library/react";
import { useMediaAssets } from "../useMediaAssets";
import { useQuery } from "@tanstack/react-query";
import { vi } from "vitest";
import { mockMediaAssets, mockUseMediaAssetsReturn } from "@/test/mocks";

// Mock the dependencies
vi.mock("@tanstack/react-query");
vi.mock("../../api/asset");
vi.mock("../../mappers/transformMediaAssets");

// Import the actual functions for typing
import { fetchMediaAssets } from "../../api/asset";
import { transformMediaAssets } from "../../mappers/transformMediaAssets";

// Type the mocks
const mockedUseQuery = vi.mocked(useQuery);
const mockedFetchMediaAssets = vi.mocked(fetchMediaAssets);
const mockedTransformMediaAssets = vi.mocked(transformMediaAssets);

// Test data
const mockNasaId = "nasa-id-123";
const mockRawResponse = {
  collection: {
    items: [
      {
        href: "https://example.com/asset1.jpg",
        data: [{ media_type: "image", title: "Asset 1" }],
      },
    ],
  },
};

const mockTransformedAssets = mockMediaAssets;

describe("useMediaAssets", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockedFetchMediaAssets.mockResolvedValue(mockRawResponse);
    mockedTransformMediaAssets.mockReturnValue(mockTransformedAssets);

    // Mock useQuery to return success state with data
    mockedUseQuery.mockReturnValue(mockUseMediaAssetsReturn as any);
  });

  it("should fetch and transform assets when enabled", async () => {
    // Render the hook
    const { result } = renderHook(() => useMediaAssets(mockNasaId));

    // Verify the hook returns the transformed data
    expect(result.current.data).toEqual(mockTransformedAssets);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });
});
