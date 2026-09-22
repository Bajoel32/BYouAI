import Image from "next/image";
import { cn } from "@/lib/cn";
import logoMark from "@/assets/logo/byouai-mark.png";

/**
 * BYouAI lettermark "B". Raster asset (transparent PNG) — see
 * src/assets/logo/ for the source render.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={logoMark}
      alt="BYouAI"
      className={cn("h-8 w-8 object-contain", className)}
    />
  );
}
