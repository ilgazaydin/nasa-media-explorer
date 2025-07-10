import type { Meta, StoryObj } from "@storybook/react-vite";
import MediaCard from "../MediaCard";
import {
  mockMediaItem,
  mockVideoMediaItem,
  mockAudioMediaItem,
} from "../../../../../.storybook/mocks";

const meta = {
  title: "Media/MediaCard",
  component: MediaCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A card component that displays media item information with thumbnail, title, date, and favorite toggle.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    toggleFavourite: { action: "favourite toggled" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "320px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default image media story
export const ImageMedia: Story = {
  args: {
    item: mockMediaItem,
    isFavourited: false,
    toggleFavourite: () => {},
  },
};

// Video media story
export const VideoMedia: Story = {
  args: {
    item: mockVideoMediaItem,
    isFavourited: false,
    toggleFavourite: () => {},
  },
};

// Audio media story
export const AudioMedia: Story = {
  args: {
    item: mockAudioMediaItem,
    isFavourited: false,
    toggleFavourite: () => {},
  },
};

// Favourite state
export const FavouriteItem: Story = {
  args: {
    item: mockMediaItem,
    isFavourited: true,
    toggleFavourite: () => {},
  },
};

// Long title example
export const LongTitle: Story = {
  args: {
    item: {
      ...mockMediaItem,
      title:
        "This is a very long title that should wrap nicely in the card component and demonstrate how the layout handles longer text content",
    },
    isFavourited: false,
    toggleFavourite: () => {},
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    item: {
      ...mockMediaItem,
      title: "Loading Media Item",
      description:
        "This card shows the loading skeleton while the image loads.",
      thumbnailUrl: "https://invalid-url-that-will-fail-to-load.com/image.jpg",
    },
    isFavourited: false,
    toggleFavourite: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the skeleton loading state that appears before the image loads. The skeleton provides visual feedback while content is being fetched.",
      },
    },
  },
};
