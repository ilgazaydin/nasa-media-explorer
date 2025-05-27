/**
 * @file FavouritesPage.tsx
 * @description Displays the list of media items the user has favourited.
 * Uses localStorage-backed state via `useFavourites` and renders them in a grid.
 * Shows a fallback message if there are no favourites saved.
 */

import { Container, Typography } from "@mui/material";
import { useFavourites } from "@/features/media/hooks/useFavourites";
import MediaResultList from "@/features/media/components/MediaResultList";
import { PAGE_SIZE } from "@/constants/media";

const FavouritesPage = () => {
  const { favourites } = useFavourites();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Your Favourites
      </Typography>

      {favourites.length > 0 ? (
        <MediaResultList items={favourites} pageSize={PAGE_SIZE} />
      ) : (
        <Typography>
          No favourites yet. Go find something you love 🚀
        </Typography>
      )}
    </Container>
  );
};

export default FavouritesPage;
