import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Catalog from "../pages/Catalog";

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    products: {
      list: {
        useQuery: vi.fn(() => ({
          data: [
            {
              id: 1,
              name: "Test Product",
              description: "Test description",
              price: 1000,
              image: "/test.png",
            },
          ],
          isLoading: false,
        })),
      },
    },
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>
      ),
  };
}

describe("Catalog", () => {
  it("renders products", () => {
    renderWithClient(<Catalog />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    vi.mocked(trpc.products.list.useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    renderWithClient(<Catalog />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});