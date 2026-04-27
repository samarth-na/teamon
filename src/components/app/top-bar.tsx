"use client";

import { ListChecks } from "lucide-react";
import ParticleButton from "@/components/kokonutui/particle-button";
import type { ViewId } from "./sidebar";

interface TopBarProps {
  currentView: ViewId;
  onNewTask: () => void;
}

const viewTitles: Record<ViewId, string> = {
  list: "List",
  kanban: "Kanban",
  calendar: "Calendar",
  timeline: "Timeline",
};

export default function TopBar({ currentView, onNewTask }: TopBarProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b px-5">
      <h1 className="font-semibold text-lg tracking-tight">
        {viewTitles[currentView]}
      </h1>
      <div className="flex items-center gap-2">
        <ParticleButton
          size="sm"
          variant="default"
          onClick={onNewTask}
          className="gap-1.5"
        >
          <ListChecks className="h-3.5 w-3.5" />
          New task
        </ParticleButton>
      </div>
    </header>
  );
}
