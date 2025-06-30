/**
 * @file MediaResultList.tsx
 * @description A component that displays a list of media items in a grid format.
 *
 * @component
 * @example
 * <MediaResultList
 *   items={mediaItems}
 *   pageSize={12}
 * />
 *
 * @remarks
 * - Uses Material-UI's Grid component for layout.
 * - Each media item is rendered as a MediaCard component.
 * - Supports infinite scrolling by observing the last item in the list.
 * - Integrates with a custom hook for managing favourites.
 * - Uses callbacks to handle favourite toggling and check if an item is favourited.
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
