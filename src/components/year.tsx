"use client";

import { useSyncExternalStore } from "react";

const BUILD_YEAR = new Date().getFullYear();

// The footer is statically prerendered, so a plain `new Date()` there would
// freeze at build time until the next deploy. `useSyncExternalStore` lets the
// client read the real current year while the server renders the build-time
// value — no setState-in-effect, no hydration warning.
const subscribe = () => () => {};

/** Current year, resolved on the client. */
export function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => BUILD_YEAR,
  );
  return <>{year}</>;
}
