import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

export type HeaderVariant = "primary" | "secondary";

export const HeaderColorVariant = {
  primary: "bg-primary",
  secondary: "bg-surface-a0",
};

export default function Header({
  title,
  href,
  variant = "secondary",
  className,
}: {
  title?: string;
  href?: string;
  variant?: HeaderVariant;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "fixed z-10 w-full flex gap-1 items-center text-lg px-1 h-(--header-height)",
        HeaderColorVariant[variant],
        className,
      )}
    >
      {href && (
        <Link href={href} className="p-2">
          <ArrowLeft />
        </Link>
      )}
      <b>{title}</b>
    </header>
  );
}
