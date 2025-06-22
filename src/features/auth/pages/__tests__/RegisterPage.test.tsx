import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../RegisterPage";
import { Provider } from "react-redux";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import * as hooks from "@/app/hooks";
import { vi } from "vitest";
import { register } from "@/features/auth/store/authSlice";

// --- Mocks ---
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

vi.mock("@/app/hooks", () => ({
  useAppDispatch: vi.fn(() => vi.fn()),
}));

const mockedNavigate = vi.mocked(useNavigate);
const mockedUseAppDispatch = vi.mocked(hooks.useAppDispatch);

// --- Test Wrapper ---
const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { auth: authReducer },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

// --- Tests ---
describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAppDispatch.mockImplementation(() => vi.fn());
    mockedNavigate.mockImplementation(() => vi.fn());
  });

  it("renders all form fields", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    renderWithProviders(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("dispatches register and shows success message + redirects", async () => {
    const formData = {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "SecurePass123!",
    };

    const mockDispatch = vi.fn();
    mockDispatch.mockResolvedValue({
      type: register.fulfilled.type,
      payload: {
        accessToken: "mock-token",
        refreshToken: "refresh-token",
      },
    });
    mockedUseAppDispatch.mockReturnValue(mockDispatch);

    const mockNavigate = vi.fn();
    mockedNavigate.mockReturnValue(mockNavigate);

    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: formData.firstName },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: formData.lastName },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: formData.email },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: formData.password },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(
      () => {
        expect(
          screen.getByText(/registration successful/i)
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 2000 }
    );
  });

  it("shows error alert when registration fails", async () => {
    const errorMessage = "Email already registered";
    const formData = {
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const mockDispatch = vi.fn();
    mockDispatch.mockResolvedValue({
      type: register.rejected.type,
      payload: errorMessage,
    });
    mockedUseAppDispatch.mockReturnValue(mockDispatch);

    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: formData.firstName },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: formData.lastName },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: formData.email },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: formData.password },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(
      () => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
