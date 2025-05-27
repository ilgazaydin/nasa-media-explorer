/**
 * @file store.ts
 * @description Configures the Redux store for the application.
 *
 * Sets up the root reducer with feature slices (currently includes `auth`).
 * Also exports typed `RootState` and `AppDispatch` for use with custom hooks.
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// For typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
