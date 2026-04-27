"use client";

import { Calendar, GripVertical } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  projectId: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review Q3 roadmap",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-04-28",
    projectId: "2",
  },
  {
    id: "2",
    title: "Update design tokens",
    status: "todo",
    priority: "medium",
    dueDate: "2026-04-29",
    projectId: "1",
  },
  {
    id: "3",
    title: "Fix navigation bug",
    status: "todo",
    priority: "urgent",
    dueDate: "2026-04-27",
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
    dueDate: "2026-04-26",
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

const priorityConfig = {
  low: { label: "Low", color: "bg-slate-400" },
  medium: { label: "Medium", color: "bg-blue-500" },
  high: { label: "High", color: "bg-amber-500" },
  urgent: { label: "Urgent", color: "bg-red-500" },
};

export default function ListView() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "todo" : "done" }
          : t,
      ),
    );
  };

  const activeTasks = tasks.filter((t) => t.status !== "done");
  const doneTasks = tasks.filter((t) => t.status === "done");

  const TaskRow = ({ task }: { task: Task }) => {
    const isDone = task.status === "done";
    const project = projects[task.projectId];
    const priority = priorityConfig[task.priority];

    return (
      <div
        className={cn(
          "group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors hover:bg-accent/50",
          isDone && "opacity-50",
        )}
      >
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-50 cursor-grab" />
        <Checkbox
          checked={isDone}
          onCheckedChange={() => toggleTask(task.id)}
          className="shrink-0"
        />
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <span
            className={cn(
              "truncate text-sm",
              isDone && "line-through text-muted-foreground",
            )}
          >
            {task.title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
            style={{ backgroundColor: project.color }}
          >
            {project.name}
          </span>
          <span
            className={cn("h-2 w-2 rounded-full", priority.color)}
            title={priority.label}
          />
          {task.dueDate && (
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-sm text-muted-foreground">
          Active ({activeTasks.length})
        </h2>
      </div>
      <div className="flex flex-col gap-1.5">
        {activeTasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>

      {doneTasks.length > 0 && (
        <>
          <div className="flex items-center justify-between pt-2">
            <h2 className="font-medium text-sm text-muted-foreground">
              Done ({doneTasks.length})
            </h2>
          </div>
          <div className="flex flex-col gap-1.5">
            {doneTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
