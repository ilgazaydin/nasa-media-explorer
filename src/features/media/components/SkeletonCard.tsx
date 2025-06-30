/**
 * @file SkeletonCard.tsx
 * @description A placeholder skeleton component used to simulate loading states for media cards.
 * 
 * @component
 * @returns {JSX.Element} A MUI-styled `Paper` containing multiple `Skeleton` elements representing
 * the layout of a media item during loading.
 * 
 * @usage
 * Typically used during loading of media items in a grid/list view.
 *
 * @example
 * <Grid item xs={12} sm={6} md={4}>
 *   <SkeletonCard />
 * </Grid>
 */

import { Box, Paper, Skeleton } from "@mui/material";

const SkeletonCard = () => (
  <Paper
    sx={{
      height: "240px",
      borderRadius: 1,
      overflow: "hidden",
      position: "relative",
    }}
    data-testid="skeleton-card"
  >
    {/* <Skeleton variant="rectangular" height={200} /> */}
    <Box sx={{ p: 2 }}>
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={32}
        width="80%"
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={20}
        width="100%"
        sx={{ mt: 2 }}
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={20}
        width="100%"
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={20}
        width="100%"
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={20}
        width="40%"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
      />
    </Box>
  </Paper>
);

export default SkeletonCard;
