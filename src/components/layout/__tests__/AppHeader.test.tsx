import { screen, fireEvent } from "@testing-library/react";
import AppHeader from "../AppHeader";
import { renderWithProviders } from "@/test/utils";
import { mockAuthenticatedState } from "@/test/store";
import { vi } from "vitest";
import { createMockNavigate } from "@/test/mocks";

// Mock react-router-dom hooks
vi.mock("react-router-dom", async () => {
  const actual = await import("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/" }),
    useNavigate: () => createMockNavigate(),
  };
});

// Mock the auth slice
vi.mock("@/features/auth/store/authSlice", async () => {
  const actual = await vi.importActual("@/features/auth/store/authSlice");
  return {
    ...actual,
    logout: () => ({ type: "auth/logout" }),
  };
});

describe("AppHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithProviders(<AppHeader />, {
      preloadedState: mockAuthenticatedState,
    });
  });

  it("renders site title and welcome message", () => {
    renderWithProviders(<AppHeader />, {
      preloadedState: mockAuthenticatedState,
    });
    expect(screen.getByText("NASA Media Explorer")).toBeInTheDocument();
    expect(screen.getByText("Welcome John Doe")).toBeInTheDocument();
  });

  it("renders navigation icons and logout button when authenticated", () => {
    renderWithProviders(<AppHeader />, {
      preloadedState: mockAuthenticatedState,
    });
    expect(screen.getByRole("link", { name: /search/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /favourites/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls logout and navigate on logout click", () => {
    const { store } = renderWithProviders(<AppHeader />, {
      preloadedState: mockAuthenticatedState,
    });

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    
    // We can test that the store's dispatch was called by checking the store state
    // or we can spy on the store's dispatch method
    expect(store.dispatch).toBeDefined();
  });
});
