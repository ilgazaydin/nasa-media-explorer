import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MediaCard from "./MediaCard";
import { MediaItem } from "../model/media";
import { vi } from "vitest";

const mockItem: MediaItem = {
  id: "123",
  title: "Hubble Galaxy",
  description: "An image from space",
  dateCreated: "2022-01-01",
  thumbnailUrl: "https://example.com/image.jpg",
  mediaType: "image",
  keywords: ["galaxy", "hubble"],
};

describe("MediaCard", () => {
  it("renders media title and description", () => {
    render(
      <MemoryRouter>
        <MediaCard
          item={mockItem}
          toggleFavourite={() => {}}
          isFavourited={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Hubble Galaxy")).toBeInTheDocument();
    expect(screen.getByText("An image from space")).toBeInTheDocument();
  });

  it("calls toggleFavourite when fav icon is clicked", () => {
    const toggleMock = vi.fn();

    render(
      <MemoryRouter>
        <MediaCard
          item={mockItem}
          toggleFavourite={toggleMock}
          isFavourited={false}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));

    expect(toggleMock).toHaveBeenCalledWith(mockItem);
  });
});
