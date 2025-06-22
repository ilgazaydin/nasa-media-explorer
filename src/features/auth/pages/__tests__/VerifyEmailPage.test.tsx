import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import * as hooks from "@/app/hooks";
import VerifyEmailPage from "../VerifyEmailPage";
import { vi } from "vitest";

// --- Mocks ---
vi.mock("@/app/hooks", () => ({
  useAppDispatch: vi.fn(() => vi.fn()),
}));

const mockedUseAppDispatch = vi.mocked(hooks.useAppDispatch);

// --- Helper ---
const renderWithProviders = (route: string) => {
  const store = configureStore({
    reducer: { auth: authReducer },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <VerifyEmailPage />
      </MemoryRouter>
    </Provider>
  );
};

// --- Tests ---
describe("VerifyEmailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAppDispatch.mockImplementation(() => vi.fn());
  });

  it("shows error when token is missing", async () => {
    renderWithProviders("/verify-email");

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

    renderWithProviders("/verify-email?token=valid-token");

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      const dispatchedAction = mockDispatch.mock.calls[0][0];
      expect(dispatchedAction).toBeInstanceOf(Function); // It's a thunk

      const mockThunkApi = {
        rejectWithValue: vi.fn(),
      };
      expect(dispatchedAction(mockThunkApi)).resolves.toBeUndefined();

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

    renderWithProviders("/verify-email?token=invalid-token");

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      const dispatchedAction = mockDispatch.mock.calls[0][0];
      expect(dispatchedAction).toBeInstanceOf(Function);

      const mockThunkApi = {
        rejectWithValue: vi.fn(),
      };
      expect(dispatchedAction(mockThunkApi)).rejects.toThrow("Invalid token");

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

    renderWithProviders("/verify-email?token=loading-token");

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
