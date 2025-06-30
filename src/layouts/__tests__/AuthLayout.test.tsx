// Test stub for AuthLayout
import { screen } from "@testing-library/react";
import { vi } from "vitest";
import AuthLayout from "../AuthLayout";
import * as hooks from "@/app/hooks";
import { renderWithProviders } from "@/test/utils";

vi.mock("@/app/hooks");
vi.mock("@/components/layout/AppHeader", () => ({ default: () => <div>AppHeader</div> }));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div>Outlet</div>,
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
  };
});

describe("AuthLayout", () => {
  beforeEach(() => {
    (hooks.useAppDispatch as any).mockReturnValue(vi.fn());
  });

  it("redirects to login if no accessToken", () => {
    (hooks.useAppSelector as any).mockImplementation(() => ({
      accessToken: null,
      user: null,
      loading: false,
    }));
    renderWithProviders(<AuthLayout />);
    expect(screen.getByText("Navigate to /login")).toBeInTheDocument();
  });

  it("shows loading spinner if loading", () => {
    (hooks.useAppSelector as any).mockImplementation(() => ({
      accessToken: "token",
      user: null,
      loading: true,
    }));
    renderWithProviders(<AuthLayout />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders AppHeader and Outlet if authenticated", () => {
    (hooks.useAppSelector as any).mockImplementation(() => ({
      accessToken: "token",
      user: { name: "Jane" },
      loading: false,
    }));
    renderWithProviders(<AuthLayout />);
    expect(screen.getByText("AppHeader")).toBeInTheDocument();
    expect(screen.getByText("Outlet")).toBeInTheDocument();
  });
});
