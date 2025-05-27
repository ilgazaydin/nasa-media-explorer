import MediaResultList from "./MediaResultList";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MediaItem } from "../model/media";

const mockItems: MediaItem[] = [
  {
    id: "1",
    title: "Mock Title 1",
    description: "Mock description 1",
    dateCreated: "2020-01-01",
    thumbnailUrl: "http://example.com/image1.jpg",
    mediaType: "image",
    keywords: [],
  },
  {
    id: "2",
    title: "Mock Title 2",
    description: "Mock description 2",
    dateCreated: "2021-01-01",
    thumbnailUrl: "http://example.com/image2.jpg",
    mediaType: "video",
    keywords: [],
  },
];

describe("MediaResultList", () => {
  it("renders list of MediaCards", () => {
    render(
      <MemoryRouter>
        <MediaResultList items={mockItems} pageSize={2} />
      </MemoryRouter>
    );
    expect(screen.getByText("Mock Title 1")).toBeInTheDocument();
    expect(screen.getByText("Mock Title 2")).toBeInTheDocument();
  });
});
