import { render, screen, fireEvent } from "@testing-library/react";
import MediaFilter from "./MediaFilter";
import { vi } from "vitest";

describe("MediaFilter", () => {
  const onChange = vi.fn();

  it("renders all media type chips", () => {
    render(
      <MediaFilter
        selectedTypes={["image"]}
        selectedYears={[2000, 2020]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("image")).toBeInTheDocument();
    expect(screen.getByText("video")).toBeInTheDocument();
    expect(screen.getByText("audio")).toBeInTheDocument();
  });

  it("calls onChange when chip is clicked", () => {
    render(
      <MediaFilter
        selectedTypes={["image"]}
        selectedYears={[2000, 2020]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("video"));
    expect(onChange).toHaveBeenCalled();
  });

  it("renders the year range slider", () => {
    render(
      <MediaFilter
        selectedTypes={[]}
        selectedYears={[1920, 2020]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getAllByText("1920")).toHaveLength(2);
    expect(screen.getAllByText("2020")).toHaveLength(2);
  });
});
