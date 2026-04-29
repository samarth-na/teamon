"use client";

import type { ViewId } from "./sidebar";

interface TopBarProps {
  currentView: ViewId;
}

const viewTitles: Record<ViewId, string> = {
  list: "List",
  kanban: "Kanban",
  calendar: "Calendar",
  timeline: "Timeline",
};

export default function TopBar({ currentView }: TopBarProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b px-5">
      <h1 className="font-semibold text-lg tracking-tight">
        {viewTitles[currentView]}
      </h1>
    </header>
  );
}
