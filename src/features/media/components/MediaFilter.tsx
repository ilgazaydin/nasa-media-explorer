/**
 * @file MediaFilter.tsx
 * @description Interactive filter UI for narrowing down NASA media results by media type and year range.
 * Includes debounced updates to reduce query frequency and auto-generates a filter summary label.
 *
 * @component
 * @param {string[]} selectedTypes - Currently selected media types (e.g. ["image", "video"]).
 * @param {[number, number]} selectedYears - Selected year range as a tuple (e.g. [2000, 2022]).
 * @param {(filters: { types: string[]; years: [number, number] }) => void} onChange - Callback triggered when filters change.
 *
 * @example
 * <MediaFilter
 *   selectedTypes={["image", "audio"]}
 *   selectedYears={[1995, 2023]}
 *   onChange={handleFilterChange}
 * />
 *
 * @notes
 * - At least one media type must remain selected (UI prevents deselecting the final one).
 * - The year range slider is debounced using `useDebounce` to avoid triggering requests on every drag.
 * - The filter summary (e.g. "Images and videos between 1995 and 2023") appears under the "Filters" label.
 */

import {
  Box,
  Chip,
  Slider,
  Typography,
  Stack,
  Popover,
  IconButton,
} from "@mui/material";
import { useState, useEffect, memo, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { MEDIA_TYPES, CURRENT_YEAR, MIN_YEAR } from "@/constants/media";
import CheckIcon from "@mui/icons-material/Check";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

interface Props {
  selectedTypes: string[];
  selectedYears: [number, number];
  onChange: (filters: { types: string[]; years: [number, number] }) => void;
}

const MediaFilter = memo(
  ({ selectedTypes, selectedYears, onChange }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(e.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const [localYears, setLocalYears] =
      useState<[number, number]>(selectedYears);
    const debouncedYears = useDebounce(localYears, 500);

    useEffect(() => {
      onChange({ types: selectedTypes, years: debouncedYears });
    }, [debouncedYears, selectedTypes, onChange]);

    const handleToggle = useCallback(
      (type: string) => {
        const exists = selectedTypes.includes(type);
        const isOnlyOne = selectedTypes.length === 1 && exists;
        if (isOnlyOne) return;
        const newTypes = exists
          ? selectedTypes.filter((t) => t !== type)
          : [...selectedTypes, type];
        onChange({ types: newTypes, years: selectedYears });
      },
      [selectedTypes, selectedYears, onChange]
    );

    const handleYearChange = useCallback(
      (_: Event, newValue: number | number[]) => {
        setLocalYears(newValue as [number, number]);
      },
      []
    );

    return (
      <>
        <IconButton onClick={handleOpen} data-testid="filter-button">
          <FilterAltIcon />
        </IconButton>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: { py: 2, px: 3 } }}
        >
          <Stack spacing={4}>
            {/* Media Types */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Media Type
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                {MEDIA_TYPES.map((type) => {
                  const isSelected = selectedTypes.includes(type);
                  const isOnlyOne = selectedTypes.length === 1 && isSelected;

                  return (
                    <Box key={type}>
                      <Chip
                        label={type}
                        clickable
                        icon={
                          isSelected ? (
                            <CheckIcon fontSize="small" />
                          ) : undefined
                        }
                        variant={isSelected ? "filled" : "outlined"}
                        color={isSelected ? "primary" : "default"}
                        onClick={() => !isOnlyOne && handleToggle(type)}
                        sx={{
                          p: 2,
                          opacity: isOnlyOne ? 0.5 : 1,
                          pointerEvents: isOnlyOne ? "none" : "auto",
                          textTransform: "capitalize",
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Year Range */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Year Published
              </Typography>
              <Box maxWidth={500}>
                <Slider
                  value={localYears}
                  onChange={handleYearChange}
                  valueLabelDisplay="auto"
                  min={MIN_YEAR}
                  max={CURRENT_YEAR}
                />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption">{localYears[0]}</Typography>
                  <Typography variant="caption">{localYears[1]}</Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Popover>
      </>
    );
  }
);

MediaFilter.displayName = "MediaFilter";

export default MediaFilter;
