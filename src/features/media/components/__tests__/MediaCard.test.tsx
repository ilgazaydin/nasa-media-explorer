import { screen, fireEvent } from "@testing-library/react";
import MediaCard from "../MediaCard";
import { vi } from "vitest";
import { renderWithProviders } from "@/test/utils";
import { mockMediaItem, mockVideoMediaItem, mockAudioMediaItem } from "@/test/mocks";

describe("MediaCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders media title and description", () => {
    renderWithProviders(
      <MediaCard
        item={mockMediaItem}
        toggleFavourite={() => {}}
        isFavourited={false}
      />
    );

    expect(screen.getByText("Mars Rover Landing")).toBeInTheDocument();
    expect(screen.getByText("Published on 15/01/2023")).toBeInTheDocument();
  });

  it("calls toggleFavourite when fav icon is clicked", async () => {
    const toggleMock = vi.fn();

    const { container } = renderWithProviders(
      <MediaCard
        item={mockMediaItem}
        toggleFavourite={toggleMock}
        isFavourited={false}
      />
    );

    // Hover over the card to make button visible
    fireEvent.mouseEnter(container.firstChild!);
    const button = await screen.findByRole("button");
    fireEvent.click(button);

    expect(toggleMock).toHaveBeenCalledWith(mockMediaItem);
  });

  it("shows correct icon for video and audio", async () => {
    renderWithProviders(
      <MediaCard
        item={mockAudioMediaItem}
        toggleFavourite={() => {}}
        isFavourited={false}
      />
    );

    expect(await screen.findByTestId("MicIcon")).toBeInTheDocument();

    renderWithProviders(
      <MediaCard
        item={mockVideoMediaItem}
        toggleFavourite={() => {}}
        isFavourited={false}
      />
    );

    expect(
      await screen.findByTestId("PlayCircleOutlineIcon")
    ).toBeInTheDocument();
  });

  it("shows skeleton while loading", () => {
    renderWithProviders(
      <MediaCard
        item={mockMediaItem}
        toggleFavourite={() => {}}
        isFavourited={false}
      />
    );

    // The skeleton is rendered with a specific class
    expect(document.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("shows filled heart when favorited", async () => {
    const { container } = renderWithProviders(
      <MediaCard
        item={mockMediaItem}
        toggleFavourite={() => {}}
        isFavourited={true}
      />
    );

    // Hover to make button visible
    fireEvent.mouseEnter(container.firstChild!);

    // Check for filled heart icon
    const favoriteIcon = await screen.findByTestId("FavoriteIcon");
    expect(favoriteIcon).toBeInTheDocument();
  });
});
