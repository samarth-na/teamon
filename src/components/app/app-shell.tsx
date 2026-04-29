"use client";

import { useCallback, useEffect, useState } from "react";
import CommandPalette from "@/components/app/command-palette";
import NewTaskDialog from "@/components/app/new-task-dialog";
import Sidebar, { type ViewId } from "@/components/app/sidebar";
import TopBar from "@/components/app/top-bar";
import { ThemeProvider } from "@/components/theme-provider";
import CalendarView from "@/components/views/calendar-view";
import KanbanView from "@/components/views/kanban-view";
import ListView from "@/components/views/list-view";
import TimelineView from "@/components/views/timeline-view";
import type { SerializableProject, SerializableTask } from "@/lib/types";

interface AppShellProps {
  tasks: SerializableTask[];
  projects: SerializableProject[];
}

interface ViewProps {
  tasks: SerializableTask[];
  projects: SerializableProject[];
}

const views: Record<ViewId, React.ComponentType<ViewProps>> = {
  list: ListView,
  kanban: KanbanView,
  calendar: CalendarView,
  timeline: TimelineView,
};

function App({ tasks, projects }: AppShellProps) {
  const [currentView, setCurrentView] = useState<ViewId>("list");
  const [commandOpen, setCommandOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const handleViewChange = useCallback((view: ViewId) => {
    setCurrentView(view);
  }, []);

  const handleNewTask = useCallback(() => {
    setNewTaskOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (
        e.key === "c" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        handleNewTask();
      }
      if (["1", "2", "3", "4"].includes(e.key) && !e.metaKey && !e.ctrlKey) {
        const viewMap: Record<string, ViewId> = {
          "1": "list",
          "2": "kanban",
          "3": "calendar",
          "4": "timeline",
        };
        const view = viewMap[e.key];
        if (view) {
          setCurrentView(view);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNewTask]);

  const ViewComponent = views[currentView];

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        onSearchOpen={() => setCommandOpen(true)}
        onNewTask={handleNewTask}
        projects={projects}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar currentView={currentView} />
        <main className="flex-1 overflow-auto">
          <ViewComponent tasks={tasks} projects={projects} />
        </main>
      </div>
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onViewChange={handleViewChange}
        onNewTask={handleNewTask}
      />
      <NewTaskDialog
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        projects={projects}
      />
    </div>
  );
}

export default function AppShell({ tasks, projects }: AppShellProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App tasks={tasks} projects={projects} />
    </ThemeProvider>
  );
}
