import { renderHook, act } from "@testing-library/react";
import { useFilters } from "../useFilters";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { MEDIA_TYPES, CURRENT_YEAR, MIN_YEAR } from "@/constants/media";
import { vi } from "vitest";

// Mock dependencies
vi.mock("react-router-dom");
vi.mock("@/hooks/useDebounce");

describe("useFilters", () => {
  let setSearchParamsMock: ReturnType<typeof vi.fn>;
  let searchParams: URLSearchParams;

  beforeEach(() => {
    vi.clearAllMocks();

    // Initialize fresh params for each test
    searchParams = new URLSearchParams();

    setSearchParamsMock = vi.fn((updater) => {
      if (typeof updater === "function") {
        searchParams = updater(searchParams);
      } else {
        searchParams = updater;
      }
      return searchParams;
    });

    // Mock useSearchParams to return our controlled params
    (useSearchParams as ReturnType<typeof vi.fn>).mockImplementation(() => [
      searchParams,
      setSearchParamsMock,
    ]);

    // Default debounce mock (no debouncing)
    (useDebounce as ReturnType<typeof vi.fn>).mockImplementation((value: any) => value);
  });

  it("should update URL when types change", () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setTypes(["image"]);
    });

    expect(searchParams.get("type")).toBe("image");
    expect(result.current.filters.types).toEqual(["image"]);
  });

  it("should remove type param when all types selected", () => {
    // Start with some types selected
    searchParams.set("type", "image");

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setTypes(MEDIA_TYPES);
    });

    expect(searchParams.get("type")).toBeNull();
    expect(result.current.filters.types).toEqual(MEDIA_TYPES);
  });

  it("should debounce year updates", () => {
    // Mock debounce to modify the years
    (useDebounce as ReturnType<typeof vi.fn>).mockImplementation((value: any) =>
      value[0] === 1990 ? [2000, value[1]] : value
    );

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setYears([1990, CURRENT_YEAR]);
    });

    expect(searchParams.get("start")).toBe("2000");
    expect(result.current.filters.years).toEqual([1990, CURRENT_YEAR]);
  });

  it("should update URL when years change", () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setYears([1990, 2020]);
    });

    expect(searchParams.get("start")).toBe("1990");
    expect(searchParams.get("end")).toBe("2020");
    expect(result.current.filters.years).toEqual([1990, 2020]);
  });

  it("should remove year params when using default values", () => {
    // Start with some years set
    searchParams.set("start", "1990");
    searchParams.set("end", "2020");

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setYears([MIN_YEAR, CURRENT_YEAR]);
    });

    expect(searchParams.get("start")).toBeNull();
    expect(searchParams.get("end")).toBeNull();
    expect(result.current.filters.years).toEqual([MIN_YEAR, CURRENT_YEAR]);
  });

  it("should handle malformed URL params gracefully", () => {
    // Set invalid params
    searchParams.set("type", "invalid-type");
    searchParams.set("start", "not-a-number");
    searchParams.set("end", "also-not-a-number");

    const { result } = renderHook(() => useFilters());

    // Verify the hook state
    expect(result.current.filters.types).toEqual(MEDIA_TYPES);
    expect(result.current.filters.years).toEqual([MIN_YEAR, CURRENT_YEAR]);

    // Verify URL params were cleaned up
    expect(searchParams.get("type")).toBeNull();
    expect(searchParams.get("start")).toBeNull();
    expect(searchParams.get("end")).toBeNull();
  });
});
