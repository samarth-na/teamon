"use client";

import { Calendar, GripVertical } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleTaskStatus } from "@/lib/actions";
import type { SerializableProject, SerializableTask } from "@/lib/types";
import { cn } from "@/lib/utils";

const priorityMeta = {
  urgent: {
    label: "Urgent",
    ring: "ring-priority-urgent/30",
    text: "text-priority-urgent",
    bg: "bg-priority-urgent",
  },
  high: {
    label: "High",
    ring: "ring-priority-high/30",
    text: "text-priority-high",
    bg: "bg-priority-high",
  },
  medium: {
    label: "Medium",
    ring: "ring-priority-medium/30",
    text: "text-priority-medium",
    bg: "bg-priority-medium",
  },
  low: {
    label: "Low",
    ring: "ring-priority-low/30",
    text: "text-priority-low",
    bg: "bg-priority-low",
  },
};

interface ListViewProps {
  tasks: SerializableTask[];
  projects: SerializableProject[];
}

export default function ListView({
  tasks: initialTasks,
  projects,
}: ListViewProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggle = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "done" ? "todo" : "done",
            }
          : t,
      ),
    );
    await toggleTaskStatus(id);
  };

  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));

  const activeTasks = tasks.filter((t) => t.status !== "done");
  const doneTasks = tasks.filter((t) => t.status === "done");

  const TaskRow = ({ task }: { task: SerializableTask }) => {
    const isDone = task.status === "done";
    const project = task.projectId ? projectMap[task.projectId] : null;
    const priority =
      priorityMeta[task.priority as keyof typeof priorityMeta] ??
      priorityMeta.medium;

    return (
      <div
        className={cn(
          "group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors hover:bg-accent/50",
          isDone && "opacity-50",
          !isDone && priority.ring,
        )}
      >
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-50 cursor-grab" />
        <Checkbox
          checked={isDone}
          onCheckedChange={() => handleToggle(task.id)}
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
          {project && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.name}
            </span>
          )}
          <span className="flex items-center gap-1.5 shrink-0">
            <span className={cn("h-2.5 w-2.5 rounded-full", priority.bg)} />
            <span
              className={cn(
                "hidden group-hover:inline text-[10px] font-medium",
                priority.text,
              )}
            >
              {priority.label}
            </span>
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                },
              )}
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
