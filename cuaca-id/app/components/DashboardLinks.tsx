"use client";

import { cn } from "@/lib/utils";
import {
  CalendarDaysIcon,
  HomeIcon,
  LucideProps,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface navProps {
  id: number;
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const dashboardLinks: navProps[] = [
  {
    id: 0,
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDaysIcon,
  },
  {
    id: 2,
    name: "Settings",
    href: "/dashboard/settings",
    icon: SettingsIcon,
  },
];

export function DashboardLinks() {
  const pathname = usePathname();

  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          className={cn(
            pathname === link.href
              ? "text-primary bg-primary/10 rounded-md"
              : "text-muted-foreground hover:text-foreground",
            "flex items-center gap-3 rounded-lg p-3 transition-all hover:text-primary"
          )}
          key={link.id}
          href={link.href}
        >
          <link.icon className="size-4" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
