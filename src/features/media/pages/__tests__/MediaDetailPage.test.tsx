import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import MediaDetailPage from "../MediaDetailPage";
import {
  mockMediaMetadata,
  mockMediaItem,
  mockUseMediaMetadataReturn,
  mockUseMediaAssetsReturn,
  mockUseMediaMetadataErrorReturn,
  createMockUseQueryReturn,
  createMockNavigate,
} from "@/test/mocks";
import { renderWithProviders } from "@/test/utils";

// Mock hooks
vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useParams: () => ({ id: "TEST_ID" }),
    useNavigate: () => createMockNavigate(),
  };
});

vi.mock("@mui/material", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@mui/material")>();
  return {
    ...mod,
    useTheme: () => ({
      breakpoints: { down: () => "", between: () => "", up: () => "" },
    }),
    useMediaQuery: () => false,
  };
});

vi.mock("@/features/media/queries/useMediaItem", () => ({
  useMediaItemById: () => ({
    data: mockMediaItem,
  }),
}));

vi.mock("../../queries/useMediaMetadata", () => ({
  useMediaMetadata: vi.fn(),
}));

vi.mock("../../queries/useMediaAssets", () => ({
  useMediaAssets: vi.fn(),
}));

vi.mock("@/features/media/hooks/useFavourites", () => ({
  useFavourites: () => ({
    toggleFavourite: vi.fn(),
    isFavourited: () => false,
  }),
}));

describe("MediaDetailPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Import and set up mocks for the specific hooks that need dynamic behavior
    const { useMediaMetadata } = await import("../../queries/useMediaMetadata");
    const { useMediaAssets } = await import("../../queries/useMediaAssets");

    vi.mocked(useMediaMetadata).mockReturnValue(mockUseMediaMetadataReturn as any);
    vi.mocked(useMediaAssets).mockReturnValue(mockUseMediaAssetsReturn as any);
  });

  it("renders metadata title and description", async () => {
    renderWithProviders(<MediaDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(mockMediaMetadata.title!)).toBeInTheDocument();
      expect(screen.getByText(/Published on/)).toBeInTheDocument();
      expect(
        screen.getByText(mockMediaMetadata.description!)
      ).toBeInTheDocument();
    });
  });

  it("shows keywords if present", async () => {
    renderWithProviders(<MediaDetailPage />);

    await waitFor(() => {
      if (mockMediaMetadata.keywords) {
        mockMediaMetadata.keywords.forEach((keyword) => {
          expect(screen.getByText(keyword)).toBeInTheDocument();
        });
      }
    });
  });

  it("shows error message on error", async () => {
    const { useMediaMetadata } = await import("../../queries/useMediaMetadata");
    vi.mocked(useMediaMetadata).mockReturnValue(mockUseMediaMetadataErrorReturn as any);

    renderWithProviders(<MediaDetailPage />);

    expect(
      screen.getByText(/Failed to load media metadata/)
    ).toBeInTheDocument();
  });

  it("shows Read More button if description is long", async () => {
    const longDescription = "A".repeat(600); // Long description
    const { useMediaMetadata } = await import("../../queries/useMediaMetadata");
    vi.mocked(useMediaMetadata).mockReturnValue(
      createMockUseQueryReturn({ ...mockMediaMetadata, description: longDescription }) as any
    );

    renderWithProviders(<MediaDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Read More")).toBeInTheDocument();
    });

    // Click Read More and verify it expands
    fireEvent.click(screen.getByText("Read More"));
    expect(screen.getByText("Read Less")).toBeInTheDocument();
  });
});
