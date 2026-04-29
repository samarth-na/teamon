"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SerializableProject, SerializableTask } from "@/lib/types";

interface CalendarViewProps {
  tasks: SerializableTask[];
  projects: SerializableProject[];
}

export default function CalendarView({ tasks, projects }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  const projectMap = Object.fromEntries(
    projects.map((p) => [p.id, p]),
  );

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  const cells: React.ReactNode[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(
      <div
        key={`empty-${i}`}
        className="min-h-[100px] border-b border-r bg-muted/20"
      />,
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = getTasksForDay(day);
    cells.push(
      <div
        key={day}
        className={cn(
          "group relative min-h-[100px] border-b border-r p-2 transition-colors hover:bg-accent/30",
          isToday(day) && "bg-primary/5",
        )}
      >
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
            isToday(day)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {day}
        </span>
        <div className="mt-1 flex flex-col gap-1">
          {dayTasks.map((task) => {
            const project = task.projectId ? projectMap[task.projectId] : null;
            const color = project?.color ?? "#888";
            return (
              <div
                key={task.id}
                className={cn(
                  "truncate rounded px-1.5 py-0.5 text-[11px] font-medium",
                  task.status === "done" && "opacity-50 line-through",
                )}
                style={{
                  backgroundColor: `${color}18`,
                  color,
                }}
              >
                {task.title}
              </div>
            );
          })}
        </div>
      </div>,
    );
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {dayLabels.map((d) => (
            <div
              key={d}
              className="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{cells}</div>
      </div>
    </div>
  );
}
