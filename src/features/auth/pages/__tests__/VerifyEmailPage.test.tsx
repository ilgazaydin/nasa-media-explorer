import { screen, waitFor } from "@testing-library/react";
import * as hooks from "@/app/hooks";
import VerifyEmailPage from "../VerifyEmailPage";
import { vi } from "vitest";
import { renderWithProviders } from "@/test/utils";
import { mockUnauthenticatedState } from "@/test/store";

// --- Mocks ---
vi.mock("@/app/hooks", () => ({
  useAppDispatch: vi.fn(() => vi.fn()),
}));

const mockedUseAppDispatch = vi.mocked(hooks.useAppDispatch);

// --- Tests ---
describe("VerifyEmailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAppDispatch.mockImplementation(() => vi.fn());
  });

  it("shows error when token is missing", async () => {
    renderWithProviders(<VerifyEmailPage />, {
      route: "/verify-email",
      preloadedState: mockUnauthenticatedState
    });

    await waitFor(() => {
      expect(
        screen.getByText(/invalid or expired verification link/i)
      ).toBeInTheDocument();
    });
  });

  it("dispatches verifyEmail and shows success message", async () => {
    const mockDispatch = vi.fn();
    mockDispatch.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(undefined),
    });
    mockedUseAppDispatch.mockReturnValue(mockDispatch);

    renderWithProviders(<VerifyEmailPage />, {
      route: "/verify-email?token=valid-token",
      preloadedState: mockUnauthenticatedState
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(
        screen.getByText(/your email has been verified successfully/i)
      ).toBeInTheDocument();
    });
  });

  it("dispatches verifyEmail and shows error message on failure", async () => {
    const mockDispatch = vi.fn();
    mockDispatch.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("Invalid token")),
    });
    mockedUseAppDispatch.mockReturnValue(mockDispatch);

    renderWithProviders(<VerifyEmailPage />, {
      route: "/verify-email?token=invalid-token",
      preloadedState: mockUnauthenticatedState
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(
        screen.getByText(/invalid or expired verification link/i)
      ).toBeInTheDocument();
    });
  });

  it("shows loading spinner initially", () => {
    const mockDispatch = vi.fn();
    mockDispatch.mockReturnValue({
      unwrap: vi.fn(() => new Promise(() => {})),
    });
    mockedUseAppDispatch.mockReturnValue(mockDispatch);

    renderWithProviders(<VerifyEmailPage />, {
      route: "/verify-email?token=loading-token",
      preloadedState: mockUnauthenticatedState
    });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
