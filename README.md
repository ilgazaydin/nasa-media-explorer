# 🚀 NASA Media Explorer

A modern, fully responsive React application for searching and exploring media from NASA's public image API.

---

## Features

### Search Page
- Search NASA's media by keywords
- Infinite scrolling results grid
- Media filtering by **type** (image, video, audio) and **year range**
- Natural language filter summary (e.g. *"Images and videos between 2001 and 2022"*)
- Search parameters and filters persist via URL synchronization

### Media Detail Page
- Large media preview (image, video or audio)
- Metadata display from NASA's EXIF/AVAIL APIs
- Download button
- "Read more" toggle for long descriptions

### Favourites Page
- Favourite/unfavourite media items
- Persistent across sessions via **localStorage**

---

## Tech Stack

| Tool              | Purpose                 |
| ----------------- | ----------------------- |
| React             | UI library              |
| TypeScript        | Type-safe coding        |
| MUI (Material UI) | UI components           |
| React Query       | Data fetching & caching |
| React Router      | Routing                 |
| Axios             | HTTP client             |
| Vite              | Build tool              |
| localStorage      | Favourites persistence  |
| Vitest & RTL      | Unit testing            |
| Storybook         | Component documentation |
---

## Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/ilgazaydin/nasa-media-explorer.git
cd nasa-media-explorer

# 2. Install dependencies
npm install

# 3. Run the app (environment already configured!)
npm run dev
```

> 💡 Make sure you have Node.js v18+ installed.

### Environment Configuration

The app comes with development-friendly defaults in `.env`. You can customize these by creating a `.env.local` file:

```bash
# Enable mock authentication (bypass login for development)  
VITE_MOCK_AUTH=true

# API base URL for authentication
VITE_API_BASE_URL=http://localhost:4000/api

### Mock Authentication

For development and testing, you can bypass the authentication system:

1. **Default Enabled**: Mock auth is enabled by default in development
2. **UI Toggle**: Use the floating dev tools button (bottom-right corner)
3. **Environment Override**: Set `VITE_MOCK_AUTH=false` in `.env.local` to disable

When enabled, you'll be automatically logged in as a mock user without needing to hit any authentication APIs.

---

## Running Tests

This project uses **Vitest** and **React Testing Library** for unit tests.

To run all tests:

```bash
npm run test
```

This will start Vitest in watch mode and show coverage per file and individual test results in the terminal.

---

## Development Notes

- **Clean and scalable project structure**  
  Carefully organized the codebase using a **feature-first folder structure**, separating concerns across `api`, `models`, `mappers`, `queries`, and `components`. This makes it easier to scale and maintain in a real-world project.

- **LocalStorage abstraction**  
  Created a reusable abstraction layer for handling favourites using localStorage, ensuring **state persistence** across sessions while keeping it encapsulated and testable.

- **API response mapping to frontend-friendly models**  
  Instead of using raw API data directly, I implemented **dedicated mappers and types** to transform NASA’s deeply nested responses into cleaner and more manageable frontend models.

- **Debounced search + URL syncing**  
   Search queries and filters are debounced for performance, and fully synchronized with the URL — making search results **shareable, bookmarkable**, and persistent.  
  It also ensures **state is preserved when navigating between list and detail pages**, so users return to exactly where they left off.

- **Smooth skeleton loaders and transitions**  
  Carefully styled skeleton loaders to enhance perceived performance. Media cards smoothly fade in once the data is loaded.

- **Custom MUI Theme inspired by shadcn/ui**  
  Designed a custom dark theme using MUI’s theming API, inspired by the clean and modern aesthetic of shadcn/ui.

- **Media filtering with natural language feedback**  
  Users get contextual feedback like “Images and videos between 2001 and 2022”, enhancing clarity and usability of filter selections.

- **Favouriting with inline interactivity**  
  Media items can be favourited/unfavourited directly within cards and persistent storage.


---

## Folder Structure

```
src/
├── features/
│   └── media/
│       ├── api/           # API calls (search, asset, metadata)
│       ├── mappers/       # API → UI data transformations
│       ├── models/
│       │   ├── api.ts     # Raw API response types
│       │   └── media.ts   # Clean frontend models
│       ├── queries/       # React Query hooks
│       ├── components/    # MediaCard, Filters, Results, etc.
│       └── pages/         # MediaSearchPage, MediaDetailPage
│
├── hooks/                 # Shared hooks (useDebounce, useLocalStorage)
├── lib/                   # Axios instance
├── constants/             # Shared constants (e.g. DEFAULT_TYPES)
├── theme.ts               # MUI Theme config
└── App.tsx, main.tsx      # App bootstrap
```

---

## Future Improvements

- Add end-to-end tests with Playwright

---

## NASA API Reference

- [NASA Image and Video Library API Docs (PDF)](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)

---

## Author

Ilgaz Aydin - [GitHub](https://github.com/ilgazaydin)