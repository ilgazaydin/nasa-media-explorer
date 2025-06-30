import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { createTestStore } from './store';
import theme from '../theme';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Record<string, unknown>;
  store?: ReturnType<typeof createTestStore>;
  queryClient?: QueryClient;
  initialEntries?: string[];
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
      },
    }),
    initialEntries = ['/'],
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // Use MemoryRouter for tests to avoid browser navigation
  const Router = initialEntries.length > 1 || route !== '/' ? MemoryRouter : BrowserRouter;
  const routerProps = Router === MemoryRouter ? { initialEntries: [route] } : {};

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router {...routerProps}>
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  }

  return { 
    store, 
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }) 
  };
}

// Simplified render for components that only need Redux
export function renderWithRedux(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: Omit<ExtendedRenderOptions, 'queryClient'> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Simplified render for components that only need React Query
export function renderWithReactQuery(
  ui: ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
      },
    }),
    ...renderOptions
  }: Pick<ExtendedRenderOptions, 'queryClient'> & RenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Utility for creating a fresh QueryClient for each test
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});
