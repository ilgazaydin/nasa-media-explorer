/**
 * @file StoreProvider.tsx
 * @description Wraps the application with the Redux Provider and supplies the configured store.
 *
 * Enables access to the Redux store throughout the component tree via context.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components that require access to the Redux store.
 * @returns {JSX.Element} The Redux Provider wrapping the passed children.
 */

import { Provider } from "react-redux";
import { store } from "./store";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
