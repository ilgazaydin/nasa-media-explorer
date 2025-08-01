import { screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { useNavigate } from "react-router-dom";
import * as hooks from "@/app/hooks";
import { vi } from "vitest";
import { login } from "@/features/auth/store/authSlice";
import { renderWithProviders } from "@/test/utils";
import { mockUnauthenticatedState } from "@/test/store";
import { createMockNavigate } from "@/test/mocks";

// --- Mocks ---
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => createMockNavigate()),
  };
});

vi.mock("@/app/hooks", () => ({
  useAppDispatch: vi.fn(() => vi.fn()),
}));

const mockedNavigate = vi.mocked(useNavigate);
const mockedUseAppDispatch = vi.mocked(hooks.useAppDispatch);
// --- Tests ---
describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAppDispatch.mockImplementation(() => vi.fn());
    mockedNavigate.mockImplementation(() => vi.fn());
  });

  it("renders form fields", () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: mockUnauthenticatedState
    });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: mockUnauthenticatedState
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("logs in and navigates on success", async () => {
    const mockNavigate = vi.fn();
    mockedNavigate.mockReturnValue(mockNavigate);

    const mockDispatch = vi.fn();
    mockDispatch.mockResolvedValue({
      type: login.fulfilled.type,
      payload: {
        accessToken: "mock-token",
        refreshToken: "refresh-token",
      },
    });
    mockedUseAppDispatch.mockReturnValue(mockDispatch);

    renderWithProviders(<LoginPage />, {
      preloadedState: mockUnauthenticatedState
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "SecurePass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      },
      { timeout: 1000 }
    );
  });

  it("shows server error on login failure", async () => {
    const errorMessage = "Invalid credentials";

    const mockDispatch = vi.fn();
    mockDispatch.mockResolvedValue({
      type: login.rejected.type,
      payload: errorMessage,
    });
    mockedUseAppDispatch.mockReturnValue(mockDispatch);

    renderWithProviders(<LoginPage />, {
      preloadedState: mockUnauthenticatedState
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fail@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(
      () => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
