/**
 * @file MediaFilter.tsx
 * @description UI component for filtering NASA media by type (image, video, audio) and published year range.
 * Uses a debounced slider to reduce API calls and provides contextual feedback summary.
 *
 * @component
 * @example
 * <MediaFilter
 *   selectedTypes={["image", "video"]}
 *   selectedYears={[2000, 2023]}
 *   onChange={(filters) => { ... }}
 * />
 *
 * @remarks
 * - Designed for the search page to interactively narrow down results.
 * - Ensures at least one media type is always selected.
 * - Debounced slider ensures smoother UX and fewer re-renders.
 */

import { useCallback } from "react";
import { Grid } from "@mui/material";
import { MediaItem } from "../model/media";
import MediaCard from "@/features/media/components/MediaCard";
import { useFavourites } from "@/features/media/hooks/useFavourites";

interface Props {
  items: MediaItem[];
  pageSize: number;
  observeRef?: (node: HTMLElement | null) => void;
}

const MediaResultList = ({ items, pageSize, observeRef }: Props) => {
  const { toggleFavourite, isFavourited } = useFavourites();
  const pageStartIndex = Math.floor(items.length / pageSize - 1) * pageSize;

  const toggle = useCallback(
    (item: MediaItem) => toggleFavourite(item),
    [toggleFavourite]
  );
  const isFav = useCallback((id: string) => isFavourited(id), [isFavourited]);

  return (
    <Grid container spacing={3}>
      {items.map((item: MediaItem, index: number) => {
        const isObserved = index === pageStartIndex;

        return (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={item.id}
            ref={isObserved ? observeRef : undefined}
          >
            <MediaCard
              item={item}
              toggleFavourite={toggle}
              isFavourited={isFav(item.id)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MediaResultList;
