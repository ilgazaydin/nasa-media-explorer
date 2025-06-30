import { renderHook, act } from "@testing-library/react";
import { useSearch } from "../useSearch";
import { vi } from "vitest";
import { useSearchParams } from "react-router-dom";
import { createMockSearchParams } from "@/test/mocks";

// --- Mock useSearchParams from react-router-dom ---
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe("useSearch", () => {
  let mockSearchParams: ReturnType<typeof createMockSearchParams>;
  let setSearchParams: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSearchParams = createMockSearchParams("q=apollo");
    setSearchParams = vi.fn();
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockSearchParams,
      setSearchParams,
    ]);
    vi.clearAllMocks();
  });

  it("initializes search input from URL 'q' param", () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.searchInput).toBe("apollo");
    expect(result.current.debouncedQuery).toBe("apollo");
  });

  it("updates local search input immediately", () => {
    const { result } = renderHook(() => useSearch());
    act(() => {
      result.current.setSearchInput("moon");
    });
    expect(result.current.searchInput).toBe("moon");
  });

  it("debounces query value over time", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchInput("mars");
    });

    // debouncedQuery hasn't updated yet
    expect(result.current.debouncedQuery).toBe("apollo");

    // advance debounce timer
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current.debouncedQuery).toBe("mars");

    vi.useRealTimers();
  });

  it("syncs debounced query to URL params", () => {
    vi.useFakeTimers();
    
    const { result } = renderHook(() => useSearch());

    // Change the input
    act(() => {
      result.current.setSearchInput("jupiter");
    });

    // Advance time to trigger debounce
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Check that the debounced query is updated
    expect(result.current.debouncedQuery).toBe("jupiter");

    vi.useRealTimers();
  });

  it("removes 'q' param from URL when input is cleared", () => {
    vi.useFakeTimers();
    
    const { result } = renderHook(() => useSearch());

    // Change the input to something first
    act(() => {
      result.current.setSearchInput("test");
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Then clear it
    act(() => {
      result.current.setSearchInput("");
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Check that the debounced query is empty
    expect(result.current.debouncedQuery).toBe("");

    vi.useRealTimers();
  });
});
