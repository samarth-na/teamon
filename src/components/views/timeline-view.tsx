"use client";

import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  startDate: string;
  dueDate: string;
  projectId: string;
  status: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review Q3 roadmap",
    startDate: "2026-04-25",
    dueDate: "2026-04-28",
    projectId: "2",
    status: "in_progress",
  },
  {
    id: "2",
    title: "Update design tokens",
    startDate: "2026-04-27",
    dueDate: "2026-04-29",
    projectId: "1",
    status: "todo",
  },
  {
    id: "3",
    title: "Fix navigation bug",
    startDate: "2026-04-26",
    dueDate: "2026-04-27",
    projectId: "2",
    status: "todo",
  },
  {
    id: "4",
    title: "Write documentation",
    startDate: "2026-04-20",
    dueDate: "2026-05-05",
    projectId: "3",
    status: "backlog",
  },
  {
    id: "5",
    title: "Team standup notes",
    startDate: "2026-04-26",
    dueDate: "2026-04-26",
    projectId: "2",
    status: "done",
  },
  {
    id: "6",
    title: "Refactor auth logic",
    startDate: "2026-04-24",
    dueDate: "2026-04-30",
    projectId: "1",
    status: "in_progress",
  },
];

const projects: Record<string, { name: string; color: string }> = {
  "1": { name: "Personal", color: "#4f46e5" },
  "2": { name: "Work", color: "#059669" },
  "3": { name: "Side Project", color: "#d97706" },
};

export default function TimelineView() {
  // Timeline: April 20 - May 5, 2026
  const start = new Date("2026-04-20");
  const end = new Date("2026-05-06");
  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dayLabels: Date[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dayLabels.push(d);
  }

  const getOffsetPercent = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return (days / totalDays) * 100;
  };

  const getWidthPercent = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const days = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24) + 1;
    return (days / totalDays) * 100;
  };

  // Group tasks by project
  const tasksByProject = Object.entries(projects).map(([pid, p]) => ({
    project: p,
    tasks: mockTasks.filter((t) => t.projectId === pid),
  }));

  return (
    <div className="flex flex-col gap-4 p-5 overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Day header */}
        <div className="flex border-b">
          <div className="w-40 shrink-0 py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Project
          </div>
          <div className="flex flex-1">
            {dayLabels.map((d) => (
              <div
                key={d.toISOString()}
                className={cn(
                  "flex-1 border-l py-2 text-center text-[10px] text-muted-foreground",
                  d.getDay() === 0 || d.getDay() === 6 ? "bg-muted/30" : "",
                )}
              >
                {d.getDate()}
              </div>
            ))}
          </div>
        </div>

        {/* Project rows */}
        {tasksByProject.map(({ project, tasks }) => (
          <div key={project.name} className="flex border-b">
            <div className="flex w-40 shrink-0 items-center gap-2 px-3 py-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-sm font-medium">{project.name}</span>
            </div>
            <div className="relative flex flex-1">
              {/* Background grid */}
              <div className="absolute inset-0 flex">
                {dayLabels.map((d) => (
                  <div
                    key={d.toISOString()}
                    className={cn(
                      "flex-1 border-l",
                      d.getDay() === 0 || d.getDay() === 6 ? "bg-muted/20" : "",
                    )}
                  />
                ))}
              </div>
              {/* Task bars */}
              <div className="relative flex flex-col gap-1.5 py-2 px-1">
                {tasks.map((task) => {
                  const left = getOffsetPercent(task.startDate);
                  const width = getWidthPercent(task.startDate, task.dueDate);
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "relative h-6 rounded-full px-2 text-[11px] font-medium text-white flex items-center truncate shadow-sm",
                        task.status === "done" && "opacity-50 line-through",
                      )}
                      style={{
                        marginLeft: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: project.color,
                        minWidth: "40px",
                      }}
                      title={`${task.title} (${task.startDate} → ${task.dueDate})`}
                    >
                      {width > 8 ? task.title : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
