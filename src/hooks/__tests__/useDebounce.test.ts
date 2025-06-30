// Test stub for useDebounce
import { renderHook } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should return debounced value', () => {
    const { result } = renderHook(() => useDebounce('test', 100));
    expect(result.current).toBe('test');
  });
});
