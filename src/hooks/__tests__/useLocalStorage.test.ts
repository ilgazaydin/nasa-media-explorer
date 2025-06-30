// Test stub for useLocalStorage
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  it('should set and get value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'));
    const [storedValue, setValue] = result.current;
    expect(storedValue).toBe('value');
    act(() => setValue('newValue'));
    expect(result.current[0]).toBe('newValue');
  });
});
