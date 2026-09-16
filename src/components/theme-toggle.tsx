"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/icons";
import type { Dictionary } from "@/dictionaries/id";

type Mode = "system" | "light" | "dark";

const KEY = "byouai-theme";
const ORDER: Mode[] = ["system", "light", "dark"];
const ICON: Record<Mode, IconName> = {
  system: "monitor",
  light: "sun",
  dark: "moon",
};

// Same-document changes don't fire the native `storage` event, so keep our own
// listener set and notify it from apply().
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): Mode {
  try {
    const t = localStorage.getItem(KEY);
    if (t === "light" || t === "dark") return t;
  } catch {
    /* storage blocked */
  }
  return "system";
}

const getServerSnapshot = (): Mode => "system";

function apply(next: Mode) {
  try {
    if (next === "system") {
      localStorage.removeItem(KEY);
      delete document.documentElement.dataset.theme;
    } else {
      localStorage.setItem(KEY, next);
      document.documentElement.dataset.theme = next;
    }
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function ThemeToggle({
  tone = "auto",
  dict,
}: {
  tone?: "auto" | "onDark";
  dict: Dictionary["themeToggle"];
}) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200",
        tone === "onDark"
          ? "border-white/20 text-white/80 hover:border-white/40 hover:text-white"
          : "border-line text-muted hover:border-ink/25 hover:text-ink",
      )}
      aria-label={`${dict.current}: ${dict.modes[mode]}. ${dict.switchTo} ${dict.modes[next]}.`}
      title={`${dict.label}: ${dict.modes[mode]}`}
    >
      <Icon name={ICON[mode]} className="h-4 w-4" />
    </button>
  );
}
