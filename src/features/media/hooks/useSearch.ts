/**
 * @file useSearch.ts
 * @description Custom hook for managing the search input state and syncing it with the URL.
 * Includes debounce handling to reduce unnecessary updates and API calls.
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * useSearch
 *
 * This hook manages a debounced search input and keeps it in sync with the URL
 * query parameter `q`. Useful for building search UIs with persistent state across
 * navigation and reloads.
 *
 * @returns {{
 *   searchInput: string;
 *   setSearchInput: (value: string) => void;
 *   debouncedQuery: string;
 * }} An object containing the current input, a setter function, and the debounced query.
 *
 * @example
 * const { searchInput, setSearchInput, debouncedQuery } = useSearch();
 */
export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const DEFAULT_QUERY = "supernova";
  const initialSearch = searchParams.get("q") || DEFAULT_QUERY;
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedQuery = useDebounce(searchInput.trim(), 600);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }

    setSearchParams(params, { replace: true });
  }, [debouncedQuery, searchParams, setSearchParams]);

  return {
    searchInput,
    setSearchInput,
    debouncedQuery,
  };
};
