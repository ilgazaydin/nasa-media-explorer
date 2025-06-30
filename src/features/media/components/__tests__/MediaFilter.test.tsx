import { render, screen, fireEvent, act } from "@testing-library/react";
import MediaFilter from "../MediaFilter";
import { vi } from "vitest";
import { MEDIA_TYPES } from "@/constants/media";

vi.useFakeTimers();

describe("MediaFilter", () => {
  const defaultYears: [number, number] = [2000, 2020];
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const openPopover = () => {
    fireEvent.click(screen.getByTestId("filter-button")); // Updated this line
  };

  it("renders all media type chips inside popover", () => {
    render(
      <MediaFilter
        selectedTypes={["image"]}
        selectedYears={defaultYears}
        onChange={onChange}
      />
    );

    openPopover();

    MEDIA_TYPES.forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  it("calls onChange with added type when chip is clicked", () => {
    render(
      <MediaFilter
        selectedTypes={["image"]}
        selectedYears={defaultYears}
        onChange={onChange}
      />
    );

    openPopover();
    fireEvent.click(screen.getByText("video"));

    expect(onChange).toHaveBeenCalledWith({
      types: ["image", "video"],
      years: defaultYears,
    });
  });

  it("calls onChange with removed type when deselecting (non-final) chip", () => {
    render(
      <MediaFilter
        selectedTypes={["image", "video"]}
        selectedYears={defaultYears}
        onChange={onChange}
      />
    );

    openPopover();
    fireEvent.click(screen.getByText("video")); // remove video

    expect(onChange).toHaveBeenCalledWith({
      types: ["image"],
      years: defaultYears,
    });
  });

  it("prevents removing the last selected type", () => {
    render(
      <MediaFilter
        selectedTypes={["image"]}
        selectedYears={defaultYears}
        onChange={onChange}
      />
    );

    openPopover();

    const imageChip = screen.getByText("image").closest(".MuiChip-root");
    if (!imageChip) {
      throw new Error("Chip element not found");
    }

    expect(imageChip).toHaveStyle("opacity: 0.5");
    expect(imageChip).toHaveStyle("pointer-events: none");

    fireEvent.click(imageChip);

    const calls = onChange.mock.calls;
    const lastCall = calls[calls.length - 1];

    if (lastCall) {
      const [filters] = lastCall;
      expect(filters.types).toEqual(["image"]);
    } else {
      expect(onChange).not.toHaveBeenCalled();
    }
  });

  it("renders year range slider with correct values", () => {
    render(
      <MediaFilter
        selectedTypes={["image"]}
        selectedYears={[1990, 2010]}
        onChange={onChange}
      />
    );

    openPopover();

    // Get all sliders (MUI renders multiple elements for range slider)
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "1990");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "2010");
  });

  it("debounces year change and calls onChange after delay", () => {
    render(
      <MediaFilter
        selectedTypes={["image"]}
        selectedYears={[1990, 2010]}
        onChange={onChange}
      />
    );

    openPopover();

    const sliders = screen.getAllByRole("slider");

    act(() => {
      fireEvent.change(sliders[0], { target: { value: 2000 } });
      vi.advanceTimersByTime(500);
    });

    expect(onChange).toHaveBeenCalledWith({
      types: ["image"],
      years: [2000, 2010], // Now properly handles range
    });
  });
});
