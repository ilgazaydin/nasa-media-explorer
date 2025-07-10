import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AppHeader from "../AppHeader";
import authSlice from "../../../features/auth/store/authSlice";

// Mock store for different auth states
const createMockStore = (authState: any) =>
  configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: authState,
    },
  });

const meta = {
  title: "Layout/AppHeader",
  component: AppHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Top-level application header with responsive navigation icons, user authentication status, and logout functionality.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    authState: { table: { disable: true } },
  },
  decorators: [
    (Story, { args }) => (
      <Provider
        store={createMockStore(
          (args as any).authState || { accessToken: null, user: null }
        )}
      >
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Unauthenticated state
export const Unauthenticated: Story = {
  args: {
    authState: {
      accessToken: null,
      user: null,
    },
  },
  parameters: {
    router: {
      initialEntries: ["/"],
    },
  },
};

export const Authenticated: Story = {
  args: {
    authState: {
      accessToken: "mock-token",
      user: {
        id: "1",
        username: "johndoe",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    },
  },
  parameters: {
    router: {
      initialEntries: ["/"],
    },
    docs: {
      description: {
        story:
          "Shows the header when user is logged in and on the search page (search icon highlighted).",
      },
    },
  },
};

// Long username
export const LongUsername: Story = {
  args: {
    authState: {
      accessToken: "mock-token",
      user: {
        id: "1",
        username: "verylongusernamethatmightoverflow",
        email: "longuser@example.com",
        firstName: "VeryLongFirstName",
        lastName: "VeryLongLastNameThatMightOverflow",
      },
    },
  },
  parameters: {
    router: {
      initialEntries: ["/"],
    },
    docs: {
      description: {
        story: "Tests how the header handles very long usernames.",
      },
    },
  },
};
