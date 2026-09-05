import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-6 md:px-8", className)}>
      {children}
    </div>
  );
}

/** Monospace kicker label used above every section heading. */
export function Kicker({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "onDark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em]",
        tone === "onDark" ? "text-white/70" : "text-muted",
      )}
    >
      <span className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  lead,
  align = "left",
  tone = "default",
}: {
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  tone?: "default" | "onDark";
}) {
  return (
    <div
      className={cn(
        "reveal max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      <Kicker tone={tone}>{kicker}</Kicker>
      <h2
        className={cn(
          "mt-4 text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.12]",
          tone === "onDark" && "text-white",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            tone === "onDark" ? "text-white/60" : "text-muted",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  href: string;
  variant?: "primary" | "outline" | "ghost" | "ghostDark";
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium ease-out-expo transition-[transform,background-color,border-color,color,filter,box-shadow] duration-200 hover:-translate-y-px active:translate-y-0";

const BUTTON_VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-accent-fg shadow-soft hover:brightness-[1.06]",
  outline:
    "border border-line text-ink hover:border-ink/25 hover:bg-surface-2",
  ghost: "text-ink hover:bg-surface-2",
  ghostDark: "border border-white/15 text-white hover:bg-white/10",
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <a
      href={href}
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], className)}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Shared card shell for solutions / features / pricing. */
export function Card({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-6 md:p-7",
        interactive &&
          "ease-out-expo transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}
