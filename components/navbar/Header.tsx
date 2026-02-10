"use client";

import { Search, Bell, LayoutGrid, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="sticky h-16 w-full top-0 z-50 bg-background/80 backdrop-blur border-b border-muted shadow-sm">
      <div className="h-full flex items-center gap-6 px-6">
        {/* Logo */}
        <div className="text-green-600 font-semibold whitespace-nowrap">
          Company Logo
        </div>

        <div className="flex items-center gap-2 ml-220">
          <span className="text-sm text-muted-foreground">
            Client Workspace:
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full px-4 h-9">
                Logo
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem>Workspace 1</DropdownMenuItem>
              <DropdownMenuItem>Workspace 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-11 rounded-full bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              AK
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
