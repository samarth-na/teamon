"use client";

import { GripVertical, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: "low" | "medium" | "high" | "urgent";
  projectId: string;
}

const columns = [
  { id: "backlog", label: "Backlog", color: "bg-slate-500" },
  { id: "todo", label: "To Do", color: "bg-blue-500" },
  { id: "in_progress", label: "In Progress", color: "bg-amber-500" },
  { id: "done", label: "Done", color: "bg-emerald-500" },
  { id: "cancelled", label: "Cancelled", color: "bg-red-400" },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review Q3 roadmap",
    status: "in_progress",
    priority: "high",
    projectId: "2",
  },
  {
    id: "2",
    title: "Update design tokens",
    status: "todo",
    priority: "medium",
    projectId: "1",
  },
  {
    id: "3",
    title: "Fix navigation bug",
    status: "todo",
    priority: "urgent",
    projectId: "2",
  },
  {
    id: "4",
    title: "Write documentation",
    status: "backlog",
    priority: "low",
    projectId: "3",
  },
  {
    id: "5",
    title: "Team standup notes",
    status: "done",
    priority: "medium",
    projectId: "2",
  },
  {
    id: "6",
    title: "Refactor auth logic",
    status: "in_progress",
    priority: "high",
    projectId: "1",
  },
  {
    id: "7",
    title: "Explore KokonutUI",
    status: "done",
    priority: "low",
    projectId: "3",
  },
];

const projects: Record<string, { name: string; color: string }> = {
  "1": { name: "Personal", color: "#4f46e5" },
  "2": { name: "Work", color: "#059669" },
  "3": { name: "Side Project", color: "#d97706" },
};

export default function KanbanView() {
  const [tasks] = useState<Task[]>(initialTasks);

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-5">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div
            key={col.id}
            className="flex w-72 shrink-0 flex-col gap-2 rounded-lg border bg-card/50 p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", col.color)} />
                <h3 className="font-medium text-sm">{col.label}</h3>
                <span className="text-muted-foreground text-xs">
                  {colTasks.length}
                </span>
              </div>
              <Button variant="ghost" size="icon-xs">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {colTasks.map((task) => {
                const project = projects[task.projectId];
                return (
                  <div
                    key={task.id}
                    className="group flex cursor-grab flex-col gap-2 rounded-md border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-50" />
                      <span className="text-sm">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                        style={{ backgroundColor: project.color }}
                      >
                        {project.name}
                      </span>
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          task.priority === "urgent" && "bg-red-500",
                          task.priority === "high" && "bg-amber-500",
                          task.priority === "medium" && "bg-blue-500",
                          task.priority === "low" && "bg-slate-400",
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
