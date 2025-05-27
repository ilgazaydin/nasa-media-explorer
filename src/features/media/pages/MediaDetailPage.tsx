/**
 * @file MediaDetailPage.tsx
 * @description Displays a detailed view of a single NASA media item, including image/video/audio preview,
 * metadata, keywords, and download functionality. Also allows users to favourite/unfavourite the item.
 * Supports responsive design and dynamically adjusts content visibility (e.g., Read More button) based on screen size.
 */

import { useNavigate, useParams } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  CardMedia,
  Skeleton,
  Button,
} from "@mui/material";

import { useState } from "react";
import { useMediaMetadata } from "../queries/useMediaMetadata";
import { useMediaAssets } from "../queries/useMediaAssets";
import { useFavourites } from "@/features/media/hooks/useFavourites";
import { useMediaItemById } from "@/features/media/queries/useMediaItem";
import { formatWithLinks } from "@/utils";
import SkeletonContent from "../components/SkeletonContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DownloadIcon from "@mui/icons-material/Download";

const MediaDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: metadata, isLoading, isError } = useMediaMetadata(id || "");
  const { data: assets, isLoading: isAssetsLoading } = useMediaAssets(id || "");
  const { data: mediaItem } = useMediaItemById(id || "");
  const { toggleFavourite, isFavourited } = useFavourites();
  const [showMore, setShowMore] = useState(false);
  // check breakpoints to set char limit
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Decide character limit
  let charLimit = 500;
  if (isXs) {
    charLimit = 200;
  } else if (isSm) {
    charLimit = 350;
  } else if (isMdUp) {
    charLimit = 500;
  }

  const imageAsset =
    assets?.find((a) => a.type === "image" && a.quality === "orig") ||
    assets?.find((a) => a.type === "image");

  const videoAsset = assets?.find((a) => a.type === "video");
  const audioAsset = assets?.find((a) => a.extension === "mp3");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  console.log("audioAsset :>> ", assets);

  if (!id) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6">No media ID found in URL.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {isLoading || isAssetsLoading ? (
        <SkeletonContent />
      ) : isError || !metadata ? (
        <Typography color="error">Failed to load media metadata.</Typography>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box position="relative" mb={3}>
            {videoAsset ? (
              <video
                controls
                style={{ width: "100%", borderRadius: 12 }}
                src={videoAsset.url}
                autoPlay
              />
            ) : audioAsset ? (
              <audio controls autoPlay style={{ width: "100%", marginTop: 80 }}>
                <source src={audioAsset.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : imageAsset ? (
              <>
                {!isImageLoaded && (
                  <Skeleton
                    variant="rectangular"
                    height={400}
                    sx={{ borderRadius: 2, mb: 2 }}
                  />
                )}
                <CardMedia
                  component="img"
                  image={imageAsset.url}
                  alt={metadata.title || "NASA media"}
                  onLoad={() => setIsImageLoaded(true)}
                  sx={{
                    display: isImageLoaded ? "block" : "none",
                    borderRadius: 2,
                    maxHeight: 500,
                    objectFit: "contain",
                  }}
                />
              </>
            ) : null}

            <IconButton
              onClick={() => mediaItem && toggleFavourite(mediaItem)}
              color="error"
              size="medium"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              }}
            >
              {isFavourited(id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>

            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {metadata.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {metadata.dateCreated
              ? "Published on " +
                new Date(metadata.dateCreated).toLocaleDateString("en-GB")
              : "Date Unknown"}
          </Typography>

          {metadata.description && (
            <Box mt={2} position="relative">
              <Box
                sx={{
                  maxHeight: showMore ? "none" : 240,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Typography variant="body1">
                  {formatWithLinks(metadata.description)}
                </Typography>
              </Box>
              {!showMore && metadata.description.length > charLimit && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 36,
                    left: 0,
                    right: 0,
                    height: 200,
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0), #1a1a1a)",
                  }}
                />
              )}
              {metadata.description.length > charLimit && (
                <Button
                  size="small"
                  onClick={() => setShowMore((prev) => !prev)}
                  sx={{ mt: 1 }}
                >
                  {showMore ? "Read Less" : "Read More"}
                </Button>
              )}
            </Box>
          )}
          {/* Keywords */}
          {metadata.keywords?.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle2" mb={1}>
                Keywords
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {metadata.keywords.map((kw) => (
                  <Box
                    key={kw}
                    onClick={() =>
                      kw && navigate(`/?q=${encodeURIComponent(kw)}`)
                    }
                    px={1}
                    py={0.25}
                    border="1px solid"
                    borderRadius="6px"
                    fontSize="0.85rem"
                    color="grey.300"
                    sx={{
                      cursor: kw ? "pointer" : "default",
                    }}
                  >
                    {kw || "Unknown"}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Metadata Info */}
          <Box mt={4}>
            {metadata.center && (
              <Typography variant="body2" color="text.secondary">
                NASA Center: {metadata.center}
              </Typography>
            )}
            {metadata.creator && (
              <Typography variant="body2" color="text.secondary">
                Creator: {metadata.creator}
              </Typography>
            )}
            {metadata.mediaType && (
              <Typography variant="body2" color="text.secondary">
                Media Type: {metadata.mediaType}
              </Typography>
            )}
            {metadata.imageSize && (
              <Typography variant="body2" color="text.secondary">
                Dimensions: {metadata.imageSize}
              </Typography>
            )}
            {metadata.fileSize && (
              <Typography variant="body2" color="text.secondary">
                File size: {metadata.fileSize}
              </Typography>
            )}
            {metadata.copyright && (
              <Typography variant="body2" color="text.secondary">
                Copyrighted: {metadata.copyright}
              </Typography>
            )}
            {metadata.sourceUrl && (
              <Typography variant="body2" color="text.secondary">
                Source:{" "}
                <a
                  href={metadata.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1976d2", textDecoration: "underline" }}
                >
                  {metadata.sourceUrl}
                </a>
              </Typography>
            )}
            {(imageAsset || videoAsset || audioAsset) && (
              <Button
                variant="outlined"
                size="small"
                href={
                  (metadata.mediaType === "video"
                    ? videoAsset?.url
                    : metadata.mediaType === "audio"
                    ? audioAsset?.url
                    : imageAsset?.url) || ""
                }
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<DownloadIcon />}
                sx={{ mt: 2 }}
              >
                Download
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default MediaDetailPage;
