/**
 * @file formatWithLinks.ts
 * @description Utility function that parses a string and wraps detected URLs in anchor tags.
 *
 * This is used to display clickable links inside a text block, typically for rendering
 * metadata descriptions or content that might contain URLs.
 *
 * @param {string} text - The input string which may contain one or more URLs.
 * @returns {(string | JSX.Element)[]} - An array of strings and JSX elements, where URLs are wrapped in <a> tags.
 *
 * @example
 * const formatted = formatWithLinks("Check out https://nasa.gov for more info.");
 */

import React from "react";

export const formatWithLinks = (
  text: string
): (string | React.JSX.Element)[] => {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    part.match(/^https?:\/\/[^\s]+$/) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1976d2", textDecoration: "underline" }}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};
