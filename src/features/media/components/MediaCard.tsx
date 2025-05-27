/**
 * @file MediaCard.tsx
 * @description Displays a clickable media preview card with title, description, and favourite toggle.
 * Supports image, video, and audio previews with media-type indicators and entry animations.
 *
 * @component
 * @param {MediaItem} item - The media item to render in the card (title, description, thumbnail, etc.).
 * @param {(item: MediaItem) => void} toggleFavourite - Callback to toggle the item's favourited state.
 * @param {boolean} isFavourited - Whether the media item is currently marked as a favourite.
 *
 * @behavior
 * - Clicking the card navigates to the detail page with state preloaded.
 * - A play or mic icon is shown for video and audio respectively.
 * - The card fades in on mount and scales slightly on hover.
 * - The favourite button appears on hover and is clickable independently.
 *
 * @example
 * <MediaCard
 *   item={media}
 *   toggleFavourite={handleToggle}
 *   isFavourited={true}
 * />
 */

import { memo, useCallback, useState } from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";
import { MediaItem } from "../model/media";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import MicIcon from "@mui/icons-material/Mic";
import SkeletonCard from "./SkeletonCard";

interface Props {
  item: MediaItem;
  toggleFavourite: (item: MediaItem) => void;
  isFavourited: boolean;
}

const MediaCard = memo(
  ({ item, toggleFavourite, isFavourited }: Props) => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleClick = useCallback(() => {
      navigate(`/detail/${item.id}`, { state: { item } });
    }, [navigate, item]);

    const handleFavouriteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavourite(item);
      },
      [toggleFavourite, item]
    );

    return (
      <Card
        onClick={handleClick}
        sx={{
          height: "100%",
          position: "relative",
          cursor: "pointer",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "scale(1.025)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          },
          "&:hover .card-overlay": {
            opacity: 1,
            pointerEvents: "auto",
          },
          "&:hover .fav-button": {
            opacity: 1,
          },
          "&:hover .media-icon": {
            opacity: 1,
          },
        }}
      >
        {!imageLoaded && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <SkeletonCard />
          </Box>
        )}
        <CardMedia
          component="img"
          image={item.thumbnailUrl}
          alt={item.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          sx={{
            height: 240,
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.4s ease",
            transitionDelay: imageLoaded ? "0.2s" : "0s",
          }}
        />

        <Box
          className="card-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.7))",
            color: "white",
            opacity: 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 2,
            pointerEvents: "none",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            sx={{
              WebkitLineClamp: 2,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              width: "calc(100% - 28px)",
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              mb: 1,
              WebkitLineClamp: 4,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.description}
          </Typography>
          <Box mt="auto" textAlign="right">
            <Typography variant="caption">
              Published on{" "}
              {new Date(item.dateCreated).toLocaleDateString("en-GB")}
            </Typography>
          </Box>
        </Box>

        {["video", "audio"].includes(item.mediaType) && (
          <Box
            className="media-icon"
            sx={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              bgcolor: "rgba(0, 0, 0, 0.4)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              zIndex: 1,
              transition: "opacity 0.2s ease",
              opacity: 0.5,
            }}
          >
            {item.mediaType === "video" ? (
              <PlayCircleOutlineIcon sx={{ fontSize: 32, color: "white" }} />
            ) : (
              <MicIcon sx={{ fontSize: 24, color: "white" }} />
            )}
          </Box>
        )}

        <IconButton
          onClick={handleFavouriteClick}
          color="error"
          size="medium"
          className="fav-button"
          sx={{
            ml: "auto",
            position: "absolute",
            top: 10,
            right: 10,
            transition: "opacity 0.2s ease",
            opacity: isFavourited ? 0.8 : 0,
          }}
        >
          {isFavourited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Card>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.id === nextProps.item.id &&
    prevProps.isFavourited === nextProps.isFavourited
);

export default MediaCard;
