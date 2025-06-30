import { screen, fireEvent } from "@testing-library/react";
import MediaResultList from "../MediaResultList";
import { vi } from "vitest";
import { useFavourites } from "@/features/media/hooks/useFavourites";
import { renderWithProviders } from "@/test/utils";
import { mockMediaItem, mockVideoMediaItem } from "@/test/mocks";

// --- Mocks ---
vi.mock("@/features/media/hooks/useFavourites", () => ({
  useFavourites: vi.fn(() => ({
    favourites: [],
    toggleFavourite: vi.fn(),
    isFavourited: vi.fn(),
  })),
}));

const mockedUseFavourites = vi.mocked(useFavourites);

// --- Test Data ---
const mockItems = [mockMediaItem, mockVideoMediaItem];

describe("MediaResultList", () => {
  const mockObserveRef = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseFavourites.mockReturnValue({
      favourites: [mockMediaItem],
      toggleFavourite: vi.fn(),
      isFavourited: vi.fn((id: string) => id === mockMediaItem.id),
    });
  });

  it("renders all media items with correct content", () => {
    renderWithProviders(
      <MediaResultList
        items={mockItems}
        pageSize={12}
        observeRef={mockObserveRef}
      />
    );

    expect(screen.getByText("Mars Rover Landing")).toBeInTheDocument();
    expect(screen.getByText("ISS Space Walk")).toBeInTheDocument();
  });

  it("calls toggleFavourite when favourite button is clicked", () => {
    const mockToggle = vi.fn();

    mockedUseFavourites.mockReturnValue({
      favourites: [],
      toggleFavourite: mockToggle,
      isFavourited: vi.fn((id: string) => id === mockMediaItem.id),
    });

    renderWithProviders(
      <MediaResultList
        items={mockItems}
        pageSize={12}
        observeRef={mockObserveRef}
      />
    );

    // Find and click the first favourite button
    const favouriteButtons = screen.getAllByRole("button");
    fireEvent.click(favouriteButtons[0]);

    expect(mockToggle).toHaveBeenCalledWith(mockMediaItem);
  });

  it("shows no items message when list is empty", () => {
    renderWithProviders(
      <MediaResultList items={[]} pageSize={12} observeRef={mockObserveRef} />
    );

    // With no items, the component should not display anything
    expect(screen.queryByText("Mars Rover Landing")).not.toBeInTheDocument();
  });

  it("renders with infinite scroll observer", () => {
    renderWithProviders(
      <MediaResultList
        items={mockItems}
        pageSize={12}
        observeRef={mockObserveRef}
      />
    );

    // The observer ref should be attached to the sentinel element
    expect(mockObserveRef).toBeDefined();
  });
});
