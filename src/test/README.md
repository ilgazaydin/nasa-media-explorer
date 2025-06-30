# Testing Structure Guide

This project now uses an improved testing structure with centralized utilities, mocks, and store configurations.

## Test Structure

```
src/test/
├── setup.ts      # Global test setup and mocks
├── mocks.ts      # Common mock data and factory functions
├── store.ts      # Redux store configurations for testing
└── utils.tsx     # Render utilities with providers
```

## Files Overview

### `setup.ts`
Global test setup that runs before all tests. Includes:
- `@testing-library/jest-dom` matchers
- Global mocks for `fetch`, `localStorage`, `IntersectionObserver`, `ResizeObserver`
- Browser API mocks (`scrollTo`, `matchMedia`, `URL.createObjectURL`)

### `mocks.ts`
Centralized mock data for consistent testing:
- `mockMediaItem`, `mockVideoMediaItem`, `mockAudioMediaItem` - Sample media items
- `mockMediaAssets`, `mockVideoAssets`, `mockAudioAssets` - Asset collections
- `mockMediaMetadata` - Metadata objects
- `mockMediaList`, `mockEmptyMediaList` - Media list responses
- `mockNasaApiResponse`, `mockNasaEmptyResponse` - Raw API responses
- React Query hook mock returns (`mockUseMediaSearchReturn`, etc.)
- Utility functions (`createMockFetch`, `createMockSearchParams`)
- React Router mocks (`createReactRouterMock`, `createMockNavigate`)

### `store.ts`
Redux store utilities for testing:
- `createTestStore(preloadedState)` - Creates a test store with optional state
- `mockAuthenticatedState` - User logged in state
- `mockUnauthenticatedState` - User logged out state
- `mockAuthLoadingState` - Loading state

### `utils.tsx`
Render utilities with different provider combinations:

#### `renderWithProviders()`
Full provider setup with Redux, React Query, Router, and Theme:
```tsx
import { renderWithProviders } from '@/test/utils';
import { mockAuthenticatedState } from '@/test/store';

const { store, queryClient } = renderWithProviders(<MyComponent />, {
  preloadedState: mockAuthenticatedState,
  route: '/dashboard'
});
```

#### `renderWithRedux()`
Redux + Theme only:
```tsx
import { renderWithRedux } from '@/test/utils';

const { store } = renderWithRedux(<MyComponent />, {
  preloadedState: mockAuthenticatedState
});
```

#### `renderWithReactQuery()`
React Query + Theme only:
```tsx
import { renderWithReactQuery } from '@/test/utils';

const { queryClient } = renderWithReactQuery(<MyComponent />);
```

## Usage Examples

### Testing React Query Hooks
Use direct mocking for React Query hooks to avoid provider complexity:

```tsx
import { vi } from 'vitest';
import { useMediaSearch } from '../useMediaSearch';
import { mockUseMediaSearchReturn } from '@/test/mocks';

vi.mock('../useMediaSearch', () => ({
  useMediaSearch: vi.fn(),
}));

const mockUseMediaSearch = vi.mocked(useMediaSearch);

describe('useMediaSearch', () => {
  it('should return search results', () => {
    mockUseMediaSearch.mockReturnValue(mockUseMediaSearchReturn);
    
    const result = useMediaSearch({ query: 'mars' });
    expect(result.data.pages[0].items).toHaveLength(2);
  });
});
```

### Testing Components with Redux
```tsx
import { renderWithProviders } from '@/test/utils';
import { mockAuthenticatedState } from '@/test/store';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('shows user info when authenticated', () => {
    renderWithProviders(<MyComponent />, {
      preloadedState: mockAuthenticatedState
    });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Testing API Calls
```tsx
import { createMockFetch } from '@/test/mocks';
import { mockNasaApiResponse } from '@/test/mocks';

describe('fetchMediaSearch', () => {
  it('fetches media data', async () => {
    global.fetch = createMockFetch(mockNasaApiResponse);
    
    const result = await fetchMediaSearch({ q: 'mars' });
    
    expect(result.collection.items).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('search?q=mars')
    );
  });
});
```

### Testing with Mock Data
```tsx
import { mockMediaItem, mockMediaAssets } from '@/test/mocks';

describe('MediaCard', () => {
  it('displays media information', () => {
    render(<MediaCard item={mockMediaItem} />);
    
    expect(screen.getByText('Mars Rover Landing')).toBeInTheDocument();
    expect(screen.getByText('2023-01-15')).toBeInTheDocument();
  });
});
```

## Complete UseQueryResult Mocks

For React Query hooks that return `UseQueryResult`, use these complete centralized mocks:

```tsx
import { 
  mockUseMediaMetadataReturn,
  mockUseMediaAssetsReturn,
  mockUseMediaItemReturn,
  mockUseMediaMetadataErrorReturn,
  createMockUseQueryReturn 
} from '@/test/mocks';

// Success states
vi.mocked(useMediaMetadata).mockReturnValue(mockUseMediaMetadataReturn as any);
vi.mocked(useMediaAssets).mockReturnValue(mockUseMediaAssetsReturn as any);
vi.mocked(useMediaItem).mockReturnValue(mockUseMediaItemReturn as any);

// Error state
vi.mocked(useMediaMetadata).mockReturnValue(mockUseMediaMetadataErrorReturn as any);

// Custom data with utility function
const customMetadata = { ...mockMediaMetadata, title: 'Custom Title' };
vi.mocked(useMediaMetadata).mockReturnValue(
  createMockUseQueryReturn(customMetadata) as any
);

// Custom overrides
vi.mocked(useMediaMetadata).mockReturnValue(
  createMockUseQueryReturn(mockMetadata, { isLoading: true }) as any
);
```

### Benefits
- **No duplication**: Complete UseQueryResult properties defined once
- **Type safety**: All required properties included
- **Flexibility**: Easy to create custom variants
- **Consistency**: Same mock structure across all tests
- **Maintainability**: Updates in one place affect all tests

## Migration from Old Tests

### Before (scattered setup):
```tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

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
```

### After (centralized):
```tsx
import { renderWithProviders } from '@/test/utils';
import { mockUnauthenticatedState } from '@/test/store';

// Clean, reusable, consistent
renderWithProviders(<LoginPage />, {
  preloadedState: mockUnauthenticatedState
});
```

## Testing Utilities and Best Practices

This directory contains centralized testing utilities, mocks, and patterns for the NASA Media Explorer project.

## 📁 File Structure

- `mocks.ts` - Centralized mock data and factory functions
- `store.ts` - Redux store configuration for tests  
- `utils.tsx` - Test utilities like `renderWithProviders`
- `setup.ts` - Global test setup and configuration

## 🎯 Core Testing Patterns

### 1. Use `renderWithProviders` for All Component Tests
```tsx
import { renderWithProviders } from '@/test/utils';
import { mockMediaItem } from '@/test/mocks';

// ✅ Good - uses providers
renderWithProviders(<MediaCard item={mockMediaItem} />);

// ❌ Bad - direct render without providers  
render(<MediaCard item={mockMediaItem} />);
```

### 2. Use Centralized Mocks
```tsx
import { mockMediaItem, mockMediaAssets, mockUseMediaItemReturn } from '@/test/mocks';

// ✅ Good - centralized mock
const item = mockMediaItem;

// ❌ Bad - inline mock
const item = { id: 'test', title: 'Test' };
```

### 3. React Query Hook Mocking
```tsx
import { mockUseMediaItemReturn, createMockUseQueryReturn } from '@/test/mocks';

// ✅ Standard success case
mockUseMediaItem.mockReturnValue(mockUseMediaItemReturn);

// ✅ Custom case with error
mockUseMediaItem.mockReturnValue(createMockUseQueryReturn(null, {
  isError: true,
  error: new Error('Failed to fetch')
}));
```

### 4. Centralized React Router Mocks
```tsx
import { createMockNavigate } from '@/test/mocks';

// ✅ For navigation hooks - use centralized mock function
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => createMockNavigate(),
  };
});

// ✅ For layout tests - inline JSX works best due to Vitest hoisting
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div>Outlet</div>,
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
  };
});

// ✅ Or get a mock function directly
const mockNavigate = createMockNavigate();
vi.mocked(useNavigate).mockReturnValue(mockNavigate);
```

### 5. App Hooks Mocking
```tsx
import { createAppHooksMock } from '@/test/mocks';

// ✅ Mock authenticated state
vi.mock('@/app/hooks', () => createAppHooksMock({
  accessToken: 'token',
  user: { name: 'John Doe' }
}));
```

## 🚀 Available Mock Data

### Media Items
- `mockMediaItem` - Standard image media item
- `mockVideoMediaItem` - Video media item
- `mockAudioMediaItem` - Audio media item
- `mockMediaList` - List with pagination

### Media Assets & Metadata
- `mockMediaAssets` - Array of different quality assets
- `mockMediaMetadata` - Complete metadata object

### React Query Returns
- `mockUseMediaItemReturn` - Success state for media item query
- `mockUseMediaSearchReturn` - Success state for search query
- `mockUseMediaAssetsReturn` - Success state for assets query
- `mockUseMediaMetadataReturn` - Success state for metadata query

### Utility Functions
- `createMockUseQueryReturn<T>(data, overrides)` - Custom query state
- `createMockFetch(response, ok)` - Mock fetch responses
- `createMockSearchParams(initialParams?)` - URL search params mock with optional initial state
- `createMockNavigate()` - Navigation function mock
- `createAppHooksMock(authState)` - App hooks mock

## 📈 Test Statistics

- **Total Test Files**: 27
- **Total Tests**: 112 ✅ All Passing
- **Test Coverage**: Comprehensive (components, hooks, utilities, pages)
- **Mock Strategy**: Centralized with fallback to inline for complex cases

## ⚡ Quick Start

1. Import what you need:
```tsx
import { renderWithProviders } from '@/test/utils';
import { mockMediaItem, mockUseMediaItemReturn } from '@/test/mocks';
```

2. Mock hooks if testing components that use them:
```tsx
vi.mock('../useMediaItem');
const mockUseMediaItem = vi.mocked(useMediaItem);
```

3. Set up your test data:
```tsx
mockUseMediaItem.mockReturnValue(mockUseMediaItemReturn);
```

4. Render and test:
```tsx
renderWithProviders(<YourComponent />);
expect(screen.getByText('Mars Rover Landing')).toBeInTheDocument();
```

## 🎨 Best Practices

- **Always use `renderWithProviders`** for component tests that need Redux/React Query
- **Use centralized mocks** instead of inline data where practical
- **Balance centralization vs inline mocks** - complex test-specific logic can remain inline
- **Prefer factory functions** like `createMockUseQueryReturn` for custom scenarios
- **Clean up mocks** in `beforeEach` with `vi.clearAllMocks()`
- **Test meaningful scenarios** not just happy paths
- **Use descriptive test names** that explain the scenario being tested
- **Vitest hoisting considerations** - some mocks work better inline due to top-level restrictions

## 🔧 Adding New Mocks

When adding new mock data:

1. Add the mock to `mocks.ts` with proper TypeScript typing
2. Export it for use in test files  
3. Update this README if it introduces a new pattern
4. Consider creating factory functions for variants

## 📊 Coverage Goals

- ✅ All components have tests (27 test files)
- ✅ All custom hooks have tests  
- ✅ All utility functions have tests (including formatWithLinks)
- ✅ All API mappers have tests
- ✅ Integration tests (page components test multiple integrated systems)
- 🚀 **Future**: E2E tests, visual regression tests, accessibility tests

## 🔄 Integration Testing

The project includes integration tests through page component tests that verify multiple systems working together:

### **MediaSearchPage.test.tsx** - Search Integration
- Tests search functionality + filters + pagination
- Verifies hook integration (useSearch, useFilters, useSearchMedia)
- Tests infinite scrolling with React Query

### **MediaDetailPage.test.tsx** - Detail View Integration  
- Tests media detail display with metadata
- Integrates useMediaItem, useMediaAssets, useMediaMetadata
- Tests navigation and routing integration

### **LoginPage.test.tsx & RegisterPage.test.tsx** - Auth Integration
- Tests form validation + Redux dispatch + navigation
- Integrates auth state management with UI updates
- Tests success/error flow handling

### **MediaFavouritesPage.test.tsx** - Favorites Integration
- Tests favorites management across different states
- Integrates localStorage with Redux state
- Tests dynamic UI updates based on data changes

These integration tests use `renderWithProviders()` to test components with full Redux, React Query, Router, and Theme provider setup, ensuring real-world functionality works correctly.
