import { cn } from "@/lib/cn";

/**
 * BYouAI lettermark "B". Colors are baked in so the mark reads the same in
 * light and dark. See src/assets/logo/ for the standalone asset set.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="BYouAI"
      className={cn("h-8 w-8", className)}
    >
      <rect width="96" height="96" rx="21" fill="#0A0B0D" />
      <g transform="translate(4 0)">
        <circle cx="45" cy="36.5" r="14.5" fill="#00C48C" />
        <circle cx="45" cy="59.5" r="15.5" fill="#00C48C" />
        <rect x="28" y="21" width="13" height="54" rx="3.5" fill="#00C48C" />
        <circle cx="47.5" cy="36.5" r="6.2" fill="#0A0B0D" />
        <circle cx="47.5" cy="59.5" r="7" fill="#0A0B0D" />
        <rect x="40" y="44" width="23" height="4.6" rx="2.3" fill="#0A0B0D" />
      </g>
    </svg>
  );
}
