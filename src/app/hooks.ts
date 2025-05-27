/**
 * @file hooks.ts
 * @description Typed versions of Redux hooks for use across the app.
 *
 * Provides:
 * - `useAppDispatch`: Typed wrapper around `useDispatch` for dispatching actions.
 * - `useAppSelector`: Typed wrapper around `useSelector` for selecting state with type safety.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
