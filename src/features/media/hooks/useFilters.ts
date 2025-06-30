/**
 * @file useFilters.ts
 * @description Custom hook for managing media filter state (media types and year range)
 * and keeping it synchronized with the URL search parameters.
 */

import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { MEDIA_TYPES, CURRENT_YEAR, MIN_YEAR } from "@/constants/media";

/**
 * useFilters
 *
 * A custom React hook that manages filter state (media types and year range) and keeps it
 * in sync with the URL using `react-router-dom`'s `useSearchParams`. This enables
 * shareable URLs, deep linking, and consistent navigation behavior.
 *
 * Debounces year changes to avoid excessive URL updates while sliding the range.
 *
 * @returns {{
 *   filters: {
 *     types: string[];
 *     years: [number, number];
 *   };
 *   setTypes: (types: string[]) => void;
 *   setYears: (range: [number, number]) => void;
 * }} An object containing the current filters and setter functions.
 *
 * @example
 * const { filters, setTypes, setYears } = useFilters();
 * // filters.types => ["image", "video"]
 * // filters.years => [1990, 2020]
 */
export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Load initial state from URL
  const initialTypes = (() => {
    const typeParam = searchParams.get("type");
    if (!typeParam) return MEDIA_TYPES;

    const typesFromUrl = typeParam.split(",");
    const validTypes = typesFromUrl.filter((type) =>
      MEDIA_TYPES.includes(type as any)
    );

    return validTypes.length > 0 ? validTypes : MEDIA_TYPES;
  })();

  const initialYearStart = Number(searchParams.get("start")) || MIN_YEAR;
  const initialYearEnd = Number(searchParams.get("end")) || CURRENT_YEAR;

  const [types, setTypes] = useState<string[]>(initialTypes);
  const [years, setYears] = useState<[number, number]>([
    initialYearStart,
    initialYearEnd,
  ]);

  const debouncedYears = useDebounce(years, 400);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (
      types.length &&
      types.sort().join(",") !== MEDIA_TYPES.sort().join(",")
    ) {
      params.set("type", types.join(","));
    } else {
      params.delete("type");
    }

    if (debouncedYears[0] !== MIN_YEAR) {
      params.set("start", String(debouncedYears[0]));
    } else {
      params.delete("start");
    }

    if (debouncedYears[1] !== CURRENT_YEAR) {
      params.set("end", String(debouncedYears[1]));
    } else {
      params.delete("end");
    }

    setSearchParams(params, { replace: true });
  }, [types, debouncedYears, searchParams, setSearchParams]);

  return {
    filters: {
      types,
      years,
    },
    setTypes,
    setYears,
  };
};
