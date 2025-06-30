import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import MediaSearchPage from "../MediaSearchPage";
import { useSearchMedia } from "../../queries/useMediaSearch";
import { useSearch } from "@/features/media/hooks/useSearch";
import { useFilters } from "@/features/media/hooks/useFilters";
import { useInView } from "react-intersection-observer";
import { MEDIA_TYPES } from "@/constants/media";
import { renderWithProviders } from "@/test/utils";
import { 
  mockMediaItem, 
  mockVideoMediaItem, 
  mockUseMediaSearchReturn
} from "@/test/mocks";

// Mock hooks
vi.mock("../../queries/useMediaSearch");
vi.mock("@/features/media/hooks/useSearch");
vi.mock("@/features/media/hooks/useFilters");
vi.mock("react-intersection-observer");

// Type-safe mock setup
const mockUseSearchMedia = vi.mocked(useSearchMedia);
const mockUseSearch = vi.mocked(useSearch);
const mockUseFilters = vi.mocked(useFilters);
const mockUseInView = vi.mocked(useInView);

describe("MediaSearchPage", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    mockUseSearch.mockReturnValue({
      searchInput: "",
      setSearchInput: vi.fn(),
      debouncedQuery: "",
    });

    mockUseFilters.mockReturnValue({
      filters: {
        types: MEDIA_TYPES, // Use all media types by default
        years: [2000, 2023] as [number, number],
      },
      setTypes: vi.fn(),
      setYears: vi.fn(),
    });

    mockUseInView.mockReturnValue({
      ref: vi.fn(),
      entry: undefined,
    } as any);

    mockUseSearchMedia.mockReturnValue(mockUseMediaSearchReturn as any);
  });

  it("renders the search page with title and description", () => {
    renderWithProviders(<MediaSearchPage />);

    expect(screen.getByText("NASA Media Explorer")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Search through NASA's vast collection of images, videos and audio recordings/
      )
    ).toBeInTheDocument();
  });

  it("displays search input and filter controls", () => {
    renderWithProviders(<MediaSearchPage />);

    expect(
      screen.getByPlaceholderText("Search NASA media")
    ).toBeInTheDocument();
    expect(screen.getByTestId("filter-button")).toBeInTheDocument();
  });

  it("shows loading skeletons when loading", () => {
    mockUseSearchMedia.mockReturnValue({
      ...mockUseMediaSearchReturn,
      isLoading: true,
      data: undefined,
    } as any);

    renderWithProviders(<MediaSearchPage />);

    // Verify skeleton cards are rendered (PAGE_SIZE = 12)
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(12);
  });

  it("displays media results when loaded", async () => {
    renderWithProviders(<MediaSearchPage />);

    await waitFor(() => {
      expect(screen.getByText(mockMediaItem.title)).toBeInTheDocument();
      expect(screen.getByText(mockVideoMediaItem.title)).toBeInTheDocument();
    });
  });

  it("shows result count and filter summary", async () => {
    renderWithProviders(<MediaSearchPage />);

    await waitFor(() => {
      // Look for the specific content rather than ambiguous numbers
      expect(screen.getByText(/Showing/)).toBeInTheDocument();
      expect(screen.getByText(/results for/)).toBeInTheDocument();
      expect(screen.getByText(/all media/)).toBeInTheDocument();
      expect(screen.getByText(/published between/)).toBeInTheDocument();
    });
  });

  it("handles search input changes", async () => {
    const mockSetSearchInput = vi.fn();
    mockUseSearch.mockReturnValue({
      searchInput: "",
      setSearchInput: mockSetSearchInput,
      debouncedQuery: "",
    });

    renderWithProviders(<MediaSearchPage />);

    const searchInput = screen.getByPlaceholderText("Search NASA media");
    fireEvent.change(searchInput, { target: { value: "mars" } });

    expect(mockSetSearchInput).toHaveBeenCalledWith("mars");
  });

  it("displays error message when search fails", () => {
    const errorMessage = "Failed to fetch media";
    mockUseSearchMedia.mockReturnValue({
      ...mockUseMediaSearchReturn,
      isError: true,
      error: new Error(errorMessage),
      data: undefined,
    } as any);

    renderWithProviders(<MediaSearchPage />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("shows empty state when no results found", () => {
    mockUseSearchMedia.mockReturnValue({
      ...mockUseMediaSearchReturn,
      data: {
        pages: [{ items: [], totalHits: 0 }],
        pageParams: []
      },
    } as any);

    renderWithProviders(<MediaSearchPage />);

    expect(screen.getByText(/No results found/)).toBeInTheDocument();
  });

  it("triggers infinite scroll when reaching bottom", async () => {
    const mockFetchNextPage = vi.fn();
    const mockRef = vi.fn();
    
    mockUseSearchMedia.mockReturnValue({
      ...mockUseMediaSearchReturn,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isLoading: false,
      isFetchingNextPage: false,
    } as any);

    // Mock useInView to return that the element is intersecting
    mockUseInView.mockReturnValue({
      ref: mockRef,
      entry: { isIntersecting: true } as IntersectionObserverEntry,
    } as any);

    renderWithProviders(<MediaSearchPage />);

    // Wait for the effect to trigger
    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it("applies filters when they change", () => {
    const mockFilters = {
      types: [MEDIA_TYPES[0]], // Only first media type
      years: [2020, 2023] as [number, number],
    };

    mockUseFilters.mockReturnValue({
      filters: mockFilters,
      setTypes: vi.fn(),
      setYears: vi.fn(),
    });

    renderWithProviders(<MediaSearchPage />);

    // Verify the component uses the current filter state with correct parameter structure
    expect(mockUseSearchMedia).toHaveBeenCalledWith({
      query: "", // debouncedQuery
      mediaTypes: mockFilters.types,
      yearStart: mockFilters.years[0],
      yearEnd: mockFilters.years[1],
    });
  });
});
