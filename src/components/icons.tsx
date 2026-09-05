import { cn } from "@/lib/cn";

const PATHS: Record<string, string> = {
  check: "M20 6 9 17l-5-5",
  arrowRight: "M5 12h14M13 5l7 7-7 7",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-6z",
  layers: "m12 2 9 5-9 5-9-5 9-5Z M3 12l9 5 9-5 M3 17l9 5 9-5",
  shield: "M12 3 5 6v6c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V6l-7-3Z M9 12l2 2 4-4",
  plug: "M9 2v6 M15 2v6 M7 8h10v3a5 5 0 0 1-10 0V8Z M12 16v6",
  activity: "M3 12h4l3 8 4-16 3 8h4",
  lock: "M6 10V8a6 6 0 0 1 12 0v2 M5 10h14v11H5z",
  database:
    "M12 3c4.97 0 9 1.34 9 3s-4.03 3-9 3-9-1.34-9-3 4.03-3 9-3Z M3 6v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6 M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3",
  sun: "M12 4V2 M12 22v-2 M4 12H2 M22 12h-2 M5.6 5.6 4.2 4.2 M19.8 19.8l-1.4-1.4 M18.4 5.6l1.4-1.4 M4.2 19.8l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z",
  monitor: "M3 4h18v12H3z M8 20h8 M12 16v4",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  close: "M6 6l12 12 M18 6 6 18",
};

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  className,
  ...rest
}: { name: IconName } & React.SVGProps<SVGSVGElement>) {
  const extra = name === "sun" ? <circle cx="12" cy="12" r="4" /> : null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      {...rest}
    >
      <path d={PATHS[name]} />
      {extra}
    </svg>
  );
}
