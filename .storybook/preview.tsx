import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MemoryRouter } from 'react-router-dom';
import theme from '../src/theme';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'space',
          value: '#0a0a0a',
        },
      ],
    },
    // Global router configuration
    router: {
      initialEntries: ['/'],
    },
  },
  decorators: [
    (Story, context) => {
      const routerConfig = context.parameters.router || { initialEntries: ['/'] };
      
      return (
        <MemoryRouter initialEntries={routerConfig.initialEntries}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Story />
          </ThemeProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;