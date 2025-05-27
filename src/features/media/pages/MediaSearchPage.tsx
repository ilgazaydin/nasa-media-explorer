/**
 * @file MediaSearchPage.tsx
 * @description Main landing page for searching NASA media content.
 * Includes a debounced search bar, filter controls, infinite scrolling,
 * and a responsive result grid with loading and error states.
 *
 * Features:
 * - Query + filter syncing with URL
 * - Infinite scroll using Intersection Observer
 * - Debounced input handling
 * - Responsive layout with skeleton loaders
 * - Displays total results and handles empty states gracefully
 */

import { useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Skeleton,
  Grid,
  InputAdornment,
} from "@mui/material";
import { MEDIA_TYPES, PAGE_SIZE } from "@/constants/media";
import SearchIcon from "@mui/icons-material/Search";
import MediaResultList from "../components/MediaResultList";
import MediaFilter from "../components/MediaFilter";
import SkeletonCard from "../components/SkeletonCard";
import { useInView } from "react-intersection-observer";
import { useSearch } from "@/features/media/hooks/useSearch";
import { useFilters } from "@/features/media/hooks/useFilters";
import { useSearchMedia } from "../queries/useMediaSearch";

const MediaSearchPage = () => {
  const { searchInput, setSearchInput, debouncedQuery } = useSearch();
  const { filters, setTypes, setYears } = useFilters();

  // Filter change handler
  const handleFilterChange = useCallback(
    (newFilters: { types: string[]; years: [number, number] }) => {
      setTypes(newFilters.types);
      setYears(newFilters.years);
    },
    [setTypes, setYears]
  );

  // Query to fetch media
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useSearchMedia({
    query: debouncedQuery,
    mediaTypes: filters.types,
    yearStart: filters.years[0],
    yearEnd: filters.years[1],
  });

  // Infinite scroll
  const { ref, entry } = useInView({ threshold: 0 });

  // Data
  const totalResults = data?.pages?.[0]?.totalHits;
  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const filterSummary = useMemo(() => {
    const allSelected = filters.types.length === MEDIA_TYPES.length;

    const typeLabel = allSelected
      ? " all media"
      : filters.types
          .map((t) =>
            t === "audio"
              ? " audio files"
              : t === "video"
              ? " videos"
              : " images"
          )
          .join(" and ");

    const yearLabel = `${filters.years[0]} and ${filters.years[1]}`;

    return (
      <>
        <strong>{typeLabel}</strong> published between{" "}
        <strong>{yearLabel}</strong>
      </>
    );
  }, [filters.types, filters.years]);

  useEffect(() => {
    if (
      !isLoading &&
      !isFetchingNextPage &&
      hasNextPage &&
      entry?.isIntersecting
    ) {
      fetchNextPage();
    }
  }, [isLoading, isFetchingNextPage, hasNextPage, entry, fetchNextPage]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          textAlign: "center",
          mb: { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(to right, #60A5FA, #E879F9)",
            backgroundClip: "text",
            mx: "auto",
            WebkitBackgroundClip: "text",
            color: "transparent",
            my: 2,
            letterSpacing: "-0.02em",
          }}
        >
          NASA Media Explorer
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: "auto",
            mb: 6,
            fontSize: "1.125rem",
            lineHeight: 1.5,
          }}
        >
          Search through NASA's vast collection of images, videos and audio
          recordings, and learn about the stories behind them.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search NASA media"
          variant="outlined"
          value={searchInput}
          sx={{ flex: 1, minWidth: "300px" }}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box mt={4}>
        <Box position="relative" mb={4} textAlign="center">
          {isLoading ? (
            <Skeleton
              variant="text"
              height={20}
              sx={{
                mb: 4,
                mx: "auto",
                width: {
                  xs: "100%",
                  sm: "520px",
                },
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Showing <strong> {items.length} </strong> of{" "}
              <strong>{totalResults}</strong> results for
              {filterSummary}.
            </Typography>
          )}

          <Box
            position="absolute"
            top={"50%"}
            right={0}
            sx={{ transform: "translateY(-50%)" }}
          >
            <MediaFilter
              selectedTypes={filters.types}
              selectedYears={filters.years}
              onChange={handleFilterChange}
            />
          </Box>
        </Box>
      </Box>

      {isLoading && (
        <Box mt={3}>
          <Grid container spacing={3}>
            {Array.from({ length: 12 }).map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {isError && (
        <Typography color="error" mt={4}>
          {error?.message || "Something went wrong."}
        </Typography>
      )}

      {items.length > 0 && (
        <MediaResultList items={items} pageSize={PAGE_SIZE} observeRef={ref} />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <Box mt={6} textAlign="center">
          <Typography variant="h6" gutterBottom>
            No results found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search term or filter options.
          </Typography>
        </Box>
      )}

      {isFetchingNextPage && (
        <Box mt={3}>
          <Grid container spacing={3}>
            {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default MediaSearchPage;
