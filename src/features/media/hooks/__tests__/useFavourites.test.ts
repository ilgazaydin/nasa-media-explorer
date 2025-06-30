import { renderHook, act } from "@testing-library/react";
import { useFavourites } from "../useFavourites";
import { MediaItem } from "../../model/media";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { vi } from "vitest";
import { mockMediaItem } from "@/test/mocks";

// Mock the useLocalStorage hook
vi.mock("@/hooks/useLocalStorage");

const mockUseLocalStorage = vi.mocked(useLocalStorage);

describe("useFavourites", () => {
  const mockMediaItem1: MediaItem = {
    ...mockMediaItem,
    id: "1",
    title: "Test Media 1",
    description: "Test description 1",
    dateCreated: "2020-01-01",
  };

  const mockMediaItem2: MediaItem = {
    ...mockMediaItem,
    id: "2",
    title: "Test Media 2",
    description: "Test description 2",
    dateCreated: "2021-01-01",
    mediaType: "video",
  };

  beforeEach(() => {
    // Clear all mocks and reset localStorage mock
    vi.clearAllMocks();
    mockUseLocalStorage.mockReturnValue([
      [], // Initial state
      vi.fn(), // Setter function
    ]);
  });

  it("should initialize with empty favourites", () => {
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual([]);
  });

  it("should add an item to favourites", () => {
    const setFavourites = vi.fn();
    mockUseLocalStorage.mockReturnValue([[], setFavourites]);

    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite(mockMediaItem1);
    });

    expect(setFavourites).toHaveBeenCalledTimes(1);

    const callback = setFavourites.mock.calls[0][0];
    expect(typeof callback).toBe("function");

    const resultState = callback([]);
    expect(resultState).toEqual([mockMediaItem1]);
  });

  it("should remove an item from favourites if already exists", () => {
    const setFavourites = vi.fn();
    mockUseLocalStorage.mockReturnValue([[mockMediaItem1], setFavourites]);

    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite(mockMediaItem1);
    });

    expect(setFavourites).toHaveBeenCalledTimes(1);

    const callback = setFavourites.mock.calls[0][0];
    expect(typeof callback).toBe("function");

    const resultState = callback([mockMediaItem1]);
    expect(resultState).toEqual([]);
  });

  it("should correctly identify favourited items", () => {
    mockUseLocalStorage.mockReturnValue([[mockMediaItem1], vi.fn()]);

    const { result } = renderHook(() => useFavourites());

    expect(result.current.isFavourited("1")).toBe(true);
    expect(result.current.isFavourited("2")).toBe(false);
  });

  it("should handle multiple favourites", () => {
    const setFavourites = vi.fn();
    mockUseLocalStorage.mockReturnValue([[mockMediaItem1], setFavourites]);

    const { result } = renderHook(() => useFavourites());

    act(() => {
      result.current.toggleFavourite(mockMediaItem2);
    });

    expect(setFavourites).toHaveBeenCalledTimes(1);

    const callback = setFavourites.mock.calls[0][0];
    expect(typeof callback).toBe("function");

    const resultState = callback([mockMediaItem1]);
    expect(resultState).toEqual([mockMediaItem1, mockMediaItem2]);
  });

  it("should persist favourites between sessions", () => {
    // Initial state with one favourite
    mockUseLocalStorage.mockReturnValue([[mockMediaItem1], vi.fn()]);

    const { result } = renderHook(() => useFavourites());

    // First render should show the initial favourite
    expect(result.current.favourites).toEqual([mockMediaItem1]);
    expect(result.current.isFavourited("1")).toBe(true);
  });

  it("should use the correct localStorage key", () => {
    renderHook(() => useFavourites());
    expect(mockUseLocalStorage).toHaveBeenCalledWith("favouriteMedia", []);
  });
});
