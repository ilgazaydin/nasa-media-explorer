/**
 * @file SkeletonContent.tsx
 * @description A placeholder skeleton component for the Media Detail page content.
 *
 * @component
 * @returns {JSX.Element} A MUI `Paper` containing skeleton elements to simulate a large preview,
 * heading, metadata, and description while content is being fetched.
 *
 * @usage
 * Shown while the Media Detail page is loading data such as metadata and asset previews.
 *
 * @example
 * {isLoading && <SkeletonContent />}
 */

import { Box, Paper, Skeleton } from "@mui/material";

const SkeletonContent = () => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Box>
      <Skeleton
        data-testid="skeleton-line"
        variant="rectangular"
        height={400}
        sx={{ mb: 3 }}
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={40}
        width="70%"
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={24}
        width="40%"
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={20}
        width="90%"
        sx={{ mt: 2 }}
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={20}
        width="90%"
      />
      <Skeleton
        data-testid="skeleton-line"
        variant="text"
        height={20}
        width="70%"
      />
    </Box>
  </Paper>
);

export default SkeletonContent;
