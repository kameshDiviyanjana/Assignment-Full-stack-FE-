import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "../componentes/ProtectedRoute";
import { isTokenValid } from "../api/tokenUtils";

// Mock react-router-dom Navigate component
vi.mock("react-router-dom", () => ({
  Navigate: vi.fn(({ to, replace }) => (
    <div data-testid="navigate" data-to={to} data-replace={replace ? "true" : "false"} />
  )),
}));

// Mock tokenUtils
vi.mock("../api/tokenUtils", () => ({
  isTokenValid: vi.fn(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading spinner when isLoading is true", () => {
    render(
      <ProtectedRoute isAuthenticated={true} isLoading={true}>
        <div data-testid="child">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("should render children when authenticated and token is valid", () => {
    vi.mocked(isTokenValid).mockReturnValue(true);

    render(
      <ProtectedRoute isAuthenticated={true} isLoading={false}>
        <div data-testid="child">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("should redirect when isAuthenticated is false", () => {
    vi.mocked(isTokenValid).mockReturnValue(true);

    render(
      <ProtectedRoute isAuthenticated={false} isLoading={false}>
        <div data-testid="child">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
    const navigateEl = screen.getByTestId("navigate");
    expect(navigateEl).toBeInTheDocument();
    expect(navigateEl.getAttribute("data-to")).toBe("/");
    expect(navigateEl.getAttribute("data-replace")).toBe("true");
  });

  it("should redirect when token is invalid", () => {
    vi.mocked(isTokenValid).mockReturnValue(false);

    render(
      <ProtectedRoute isAuthenticated={true} isLoading={false}>
        <div data-testid="child">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
    const navigateEl = screen.getByTestId("navigate");
    expect(navigateEl).toBeInTheDocument();
    expect(navigateEl.getAttribute("data-to")).toBe("/");
    expect(navigateEl.getAttribute("data-replace")).toBe("true");
  });
});
