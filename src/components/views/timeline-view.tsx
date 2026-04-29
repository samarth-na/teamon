"use client";

import { cn } from "@/lib/utils";
import type { SerializableProject, SerializableTask } from "@/lib/types";

interface TimelineViewProps {
  tasks: SerializableTask[];
  projects: SerializableProject[];
}

export default function TimelineView({ tasks, projects }: TimelineViewProps) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() - 14);
  const end = new Date(start);
  end.setDate(end.getDate() + 30);
  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dayLabels: Date[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dayLabels.push(d);
  }

  const getOffsetPercent = (dateStr: string | null) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr + "T00:00:00");
    const days = (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, (days / totalDays) * 100);
  };

  const getWidthPercent = (startStr: string | null, endStr: string | null) => {
    if (!startStr || !endStr) return 0;
    const s = new Date(startStr + "T00:00:00");
    const e = new Date(endStr + "T00:00:00");
    const days = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24) + 1;
    return Math.max(0, (days / totalDays) * 100);
  };

  const projectMap = Object.fromEntries(
    projects.map((p) => [p.id, p]),
  );

  const tasksWithProject = tasks.filter((t) => t.projectId && t.startDate && t.dueDate);
  const tasksByProject = projects
    .map((p) => ({
      project: p,
      tasks: tasksWithProject.filter((t) => t.projectId === p.id),
    }))
    .filter((group) => group.tasks.length > 0);

  const unassignedTasks = tasks.filter((t) => !t.projectId && t.startDate && t.dueDate);

  return (
    <div className="flex flex-col gap-4 p-5 overflow-x-auto">
      <div className="min-w-[800px]">
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

        {tasksByProject.map(({ project, tasks: ptasks }) => (
          <div key={project.id} className="flex border-b">
            <div className="flex w-40 shrink-0 items-center gap-2 px-3 py-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-sm font-medium">{project.name}</span>
            </div>
            <div className="relative flex flex-1">
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
              <div className="relative flex flex-col gap-1.5 py-2 px-1">
                {ptasks.map((task) => {
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

        {unassignedTasks.length > 0 && (
          <div className="flex border-b">
            <div className="flex w-40 shrink-0 items-center gap-2 px-3 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Unassigned</span>
            </div>
            <div className="relative flex flex-1">
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
              <div className="relative flex flex-col gap-1.5 py-2 px-1">
                {unassignedTasks.map((task) => {
                  const left = getOffsetPercent(task.startDate);
                  const width = getWidthPercent(task.startDate, task.dueDate);
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "relative h-6 rounded-full px-2 text-[11px] font-medium text-white flex items-center truncate shadow-sm bg-muted-foreground",
                        task.status === "done" && "opacity-50 line-through",
                      )}
                      style={{
                        marginLeft: `${left}%`,
                        width: `${width}%`,
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
        )}
      </div>
    </div>
  );
}
