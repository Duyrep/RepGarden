"use client";

import { Fence, Home, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ripple } from "react-ripple-click";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui";
import { Routers } from "@/constants";

const Items = [
  {
    Icon: Home,
    label: "Chính",
    href: Routers.HOME,
  },
  {
    Icon: Fence,
    label: "Vườn",
    href: Routers.GARDEN,
  },
  {
    Icon: Settings,
    label: "Cài đặt",
    href: Routers.SETTINGS,
  },
] as const;

export default function BotNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 z-40">
      <nav className="flex rounded-lg text-on-primary m-1 bg-surface-a0 shadow w-min">
        {Items.map(({ Icon, label, href }) => (
          <Link
            key={`bnb-${href}`}
            href={href}
            className={twMerge(
              "relative text-primary overflow-hidden isolate flex justify-center p-1 duration-200 first:rounded-tl-md last:rounded-tr-md",
              pathname === href ? "flex-1/8" : "flex-1",
            )}
          >
            <Ripple />
            <b
              className={twMerge(
                "py-1 px-6 w-full h-full rounded-md flex flex-col items-center text-xs duration-200 whitespace-nowrap",
                pathname === href
                  ? "text-primary"
                  : "text-surface-a50 hover:bg-surface-a10",
              )}
            >
              <Icon size={18} />
              {label}
            </b>
          </Link>
        ))}
      </nav>
    </div>
  );
}
