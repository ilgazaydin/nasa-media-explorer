import { screen } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import MediaFavouritesPage from "../MediaFavouritesPage";
import { renderWithProviders } from "@/test/utils";
import { mockMediaItem, mockVideoMediaItem } from "@/test/mocks";

// Mock the useFavourites hook
vi.mock("@/features/media/hooks/useFavourites", () => ({
  useFavourites: vi.fn(),
}));

// Mock the MediaResultList component
vi.mock("@/features/media/components/MediaResultList", () => ({
  default: vi.fn(({ items }) => (
    <div data-testid="media-result-list">
      {items.map((item: any) => (
        <div key={item.id} data-testid={`media-item-${item.id}`}>
          {item.title}
        </div>
      ))}
    </div>
  )),
}));

import { useFavourites } from "@/features/media/hooks/useFavourites";

describe("MediaFavouritesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title correctly", () => {
    vi.mocked(useFavourites).mockReturnValue({
      favourites: [],
      toggleFavourite: vi.fn(),
      isFavourited: vi.fn(),
    });

    renderWithProviders(<MediaFavouritesPage />);

    expect(screen.getByText("Your Favourites")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("Your Favourites");
  });

  it("shows empty state message when no favourites exist", () => {
    vi.mocked(useFavourites).mockReturnValue({
      favourites: [],
      toggleFavourite: vi.fn(),
      isFavourited: vi.fn(),
    });

    renderWithProviders(<MediaFavouritesPage />);

    expect(screen.getByText("No favourites yet. Go find something you love 🚀")).toBeInTheDocument();
    expect(screen.queryByTestId("media-result-list")).not.toBeInTheDocument();
  });

  it("renders favourite items when they exist", () => {
    const mockFavourites = [mockMediaItem, mockVideoMediaItem];
    
    vi.mocked(useFavourites).mockReturnValue({
      favourites: mockFavourites,
      toggleFavourite: vi.fn(),
      isFavourited: vi.fn(),
    });

    renderWithProviders(<MediaFavouritesPage />);

    // Should show the MediaResultList component
    expect(screen.getByTestId("media-result-list")).toBeInTheDocument();
    
    // Should not show empty state message
    expect(screen.queryByText("No favourites yet. Go find something you love 🚀")).not.toBeInTheDocument();
    
    // Should display the favourite items
    expect(screen.getByTestId("media-item-nasa-id-1")).toBeInTheDocument();
    expect(screen.getByTestId("media-item-nasa-video-1")).toBeInTheDocument();
    expect(screen.getByText("Mars Rover Landing")).toBeInTheDocument();
    expect(screen.getByText("ISS Space Walk")).toBeInTheDocument();
  });

  it("renders single favourite item correctly", () => {
    const singleFavourite = [mockMediaItem];
    
    vi.mocked(useFavourites).mockReturnValue({
      favourites: singleFavourite,
      toggleFavourite: vi.fn(),
      isFavourited: vi.fn(),
    });

    renderWithProviders(<MediaFavouritesPage />);

    expect(screen.getByTestId("media-result-list")).toBeInTheDocument();
    expect(screen.getByTestId("media-item-nasa-id-1")).toBeInTheDocument();
    expect(screen.getByText("Mars Rover Landing")).toBeInTheDocument();
    expect(screen.queryByText("No favourites yet. Go find something you love 🚀")).not.toBeInTheDocument();
  });

  it("updates when favourites change", () => {
    const { rerender } = renderWithProviders(<MediaFavouritesPage />);

    // Initially no favourites
    vi.mocked(useFavourites).mockReturnValue({
      favourites: [],
      toggleFavourite: vi.fn(),
      isFavourited: vi.fn(),
    });

    rerender(<MediaFavouritesPage />);
    expect(screen.getByText("No favourites yet. Go find something you love 🚀")).toBeInTheDocument();

    // After adding a favourite
    vi.mocked(useFavourites).mockReturnValue({
      favourites: [mockMediaItem],
      toggleFavourite: vi.fn(),
      isFavourited: vi.fn(),
    });

    rerender(<MediaFavouritesPage />);
    expect(screen.getByTestId("media-result-list")).toBeInTheDocument();
    expect(screen.getByText("Mars Rover Landing")).toBeInTheDocument();
    expect(screen.queryByText("No favourites yet. Go find something you love 🚀")).not.toBeInTheDocument();
  });

  it("has proper container structure and styling", () => {
    vi.mocked(useFavourites).mockReturnValue({
      favourites: [],
      toggleFavourite: vi.fn(),
      isFavourited: vi.fn(),
    });

    const { container } = renderWithProviders(<MediaFavouritesPage />);
    
    // Should have MUI Container
    const containerElement = container.querySelector('.MuiContainer-root');
    expect(containerElement).toBeInTheDocument();
    
    // Should have proper max width
    expect(containerElement).toHaveClass('MuiContainer-maxWidthLg');
  });
});
