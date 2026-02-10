"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Dummy1", href: "/dummy1", icon: FileText },
  { title: "Dummy2", href: "/dummy2", icon: FileText },
  { title: "Dummy3", href: "/dummy3", icon: FileText },
  { title: "Dummy4", href: "/dummy4", icon: FileText },
  { title: "Appeal Letter", href: "/appeal-letter", icon: FileText },
  { title: "Calendar", href: "/calendar", icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("sidebar") === "true";
  }
  return false;
});

useEffect(() => {
  localStorage.setItem("sidebar", String(collapsed));
}, [collapsed]);


  return (
    <aside
      className={cn(
        "relative border-r bg-background flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-10 h-6 w-6 rounded-full border bg-background shadow flex items-center justify-center hover:bg-muted"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </button>


      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className=" p-2 space-y-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-2",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && "Setting"}
        </Button>

        <Button
          className={cn(
            "w-full gap-2 bg-emerald-500 hover:bg-emerald-600",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
}
