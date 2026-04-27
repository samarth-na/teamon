"use client";

import {
  CalendarDays,
  Kanban,
  LayoutList,
  Plus,
  Search,
  Timer,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ViewId } from "./sidebar";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewChange: (view: ViewId) => void;
  onNewTask: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette({
  open,
  onOpenChange,
  onViewChange,
  onNewTask,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const items: CommandItem[] = [
    {
      id: "new-task",
      label: "New task",
      icon: <Plus className="h-4 w-4" />,
      shortcut: "C",
      action: () => {
        onOpenChange(false);
        onNewTask();
      },
    },
    {
      id: "view-list",
      label: "Go to List",
      icon: <LayoutList className="h-4 w-4" />,
      shortcut: "1",
      action: () => {
        onOpenChange(false);
        onViewChange("list");
      },
    },
    {
      id: "view-kanban",
      label: "Go to Kanban",
      icon: <Kanban className="h-4 w-4" />,
      shortcut: "2",
      action: () => {
        onOpenChange(false);
        onViewChange("kanban");
      },
    },
    {
      id: "view-calendar",
      label: "Go to Calendar",
      icon: <CalendarDays className="h-4 w-4" />,
      shortcut: "3",
      action: () => {
        onOpenChange(false);
        onViewChange("calendar");
      },
    },
    {
      id: "view-timeline",
      label: "Go to Timeline",
      icon: <Timer className="h-4 w-4" />,
      shortcut: "4",
      action: () => {
        onOpenChange(false);
        onViewChange("timeline");
      },
    },
  ];

  const filtered = query.trim()
    ? items.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase().trim()),
      )
    : items;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[activeIndex]?.action();
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    },
    [filtered, activeIndex, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden p-0 gap-0 max-w-lg border shadow-lg"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Type a command or search..."
            className="h-8 border-0 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
            ESC
          </kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-muted-foreground text-sm">
              No commands found.
            </div>
          ) : (
            filtered.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                  index === activeIndex
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">{item.icon}</span>
                  {item.label}
                </div>
                {item.shortcut && (
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t px-3 py-1.5 text-muted-foreground text-[10px]">
          <span>
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">
              ↑↓
            </kbd>{" "}
            to navigate
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">
              ↵
            </kbd>{" "}
            to select
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
