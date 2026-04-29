"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTask, updateTask } from "@/lib/actions";
import type { SerializableProject, SerializableTask } from "@/lib/types";
import { cn } from "@/lib/utils";
import KanbanInlineAdd from "./kanban-inline-add";
import TaskDetailDialog from "./kanban-task-dialog";

interface KanbanViewProps {
  tasks: SerializableTask[];
  projects: SerializableProject[];
}

const columns = [
  {
    id: "backlog",
    label: "Backlog",
    color: "bg-status-backlog",
    tint: "bg-status-backlog/8",
  },
  {
    id: "todo",
    label: "To Do",
    color: "bg-status-todo",
    tint: "bg-status-todo/8",
  },
  {
    id: "in_progress",
    label: "In Progress",
    color: "bg-status-in-progress",
    tint: "bg-status-in-progress/8",
  },
  {
    id: "done",
    label: "Done",
    color: "bg-status-done",
    tint: "bg-status-done/8",
  },
  {
    id: "cancelled",
    label: "Cancelled",
    color: "bg-status-cancelled",
    tint: "bg-status-cancelled/8",
  },
];

const priorityMeta: Record<
  string,
  { label: string; text: string; bg: string }
> = {
  urgent: {
    label: "Urgent",
    text: "text-priority-urgent",
    bg: "bg-priority-urgent",
  },
  high: { label: "High", text: "text-priority-high", bg: "bg-priority-high" },
  medium: {
    label: "Medium",
    text: "text-priority-medium",
    bg: "bg-priority-medium",
  },
  low: { label: "Low", text: "text-priority-low", bg: "bg-priority-low" },
};

function SortableTaskCard({
  task,
  project,
  onClick,
}: {
  task: SerializableTask;
  project: SerializableProject | null;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityMeta[task.priority] ?? priorityMeta.medium;
  const isDone = task.status === "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "group flex cursor-grab flex-col gap-2 rounded-md border bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
        isDragging && "opacity-30",
        isDone && "opacity-60",
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-50" />
        <span
          className={cn(
            "text-sm flex-1",
            isDone && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </span>
      </div>
      <div className="flex items-center gap-2 pl-5">
        {project && (
          <span
            className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
            style={{ backgroundColor: project.color }}
          >
            {project.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className={cn("h-2 w-2 rounded-full", priority.bg)} />
          <span className="hidden group-hover:inline text-[10px] font-medium text-muted-foreground capitalize">
            {priority.label}
          </span>
        </span>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-muted-foreground text-[10px] ml-auto">
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

function TaskCardPreview({
  task,
  project,
}: {
  task: SerializableTask;
  project: SerializableProject | null;
}) {
  const priority = priorityMeta[task.priority] ?? priorityMeta.medium;
  const isDone = task.status === "done";

  return (
    <div className="flex cursor-grabbing flex-col gap-2 rounded-md border bg-card p-3 shadow-lg rotate-2 opacity-95 w-64">
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span
          className={cn(
            "text-sm flex-1",
            isDone && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </span>
      </div>
      <div className="flex items-center gap-2 pl-5">
        {project && (
          <span
            className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
            style={{ backgroundColor: project.color }}
          >
            {project.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className={cn("h-2 w-2 rounded-full", priority.bg)} />
          <span className="text-[10px] font-medium text-muted-foreground capitalize">
            {priority.label}
          </span>
        </span>
      </div>
    </div>
  );
}

export default function KanbanView({
  tasks: initialTasks,
  projects,
}: KanbanViewProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detailTask, setDetailTask] = useState<SerializableTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const projectMap = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const getTasksByColumn = (status: string) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => b.orderIndex - a.orderIndex);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;

    // Check if dropped over a column
    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn) {
      if (activeTask.status !== overColumn.id) {
        const newOrder = Date.now();
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeTask.id
              ? { ...t, status: overColumn.id, orderIndex: newOrder }
              : t,
          ),
        );
        await updateTask(activeTask.id, {
          status: overColumn.id,
          orderIndex: newOrder,
        });
      }
      return;
    }

    // Dropped over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask || overTask.id === activeTask.id) return;

    if (activeTask.status === overTask.status) {
      // Same column: swap orderIndex
      const newOrder = overTask.orderIndex;
      const overNewOrder = activeTask.orderIndex;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === activeTask.id) return { ...t, orderIndex: newOrder };
          if (t.id === overTask.id) return { ...t, orderIndex: overNewOrder };
          return t;
        }),
      );
      await updateTask(activeTask.id, { orderIndex: newOrder });
      await updateTask(overTask.id, { orderIndex: overNewOrder });
    } else {
      // Different column: move to overTask's column with new order
      const newOrder = Date.now();
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeTask.id
            ? { ...t, status: overTask.status, orderIndex: newOrder }
            : t,
        ),
      );
      await updateTask(activeTask.id, {
        status: overTask.status,
        orderIndex: newOrder,
      });
    }
  };

  const handleAddTask = async (
    columnId: string,
    title: string,
    priority: string,
  ) => {
    const optimisticTask: SerializableTask = {
      id: crypto.randomUUID(),
      title,
      description: null,
      status: columnId,
      priority,
      dueDate: null,
      startDate: null,
      durationMinutes: null,
      orderIndex: Date.now(),
      userId: "", // will be set server-side
      projectId: null,
      projectName: null,
      projectColor: null,
    };

    setTasks((prev) => [...prev, optimisticTask]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("status", columnId);
    formData.append("priority", priority);

    try {
      await createTask(formData);
      // Server will revalidate, but we keep optimistic state
    } catch (e) {
      // Rollback on error
      setTasks((prev) => prev.filter((t) => t.id !== optimisticTask.id));
      console.error("Failed to create task:", e);
    }
  };

  const handleTaskClick = (task: SerializableTask) => {
    setDetailTask(task);
    setDetailOpen(true);
  };

  const handleTaskUpdate = (updated: SerializableTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleTaskDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;
  const activeProject = activeTask?.projectId
    ? projectMap[activeTask.projectId]
    : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4 overflow-x-auto p-5">
          {columns.map((col) => {
            const colTasks = getTasksByColumn(col.id);
            return (
              <KanbanColumn
                key={col.id}
                col={col}
                tasks={colTasks}
                projectMap={projectMap}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            );
          })}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCardPreview task={activeTask} project={activeProject} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {detailTask && (
        <TaskDetailDialog
          task={detailTask}
          projects={projects}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </>
  );
}

function KanbanColumn({
  col,
  tasks,
  projectMap,
  onTaskClick,
  onAddTask,
}: {
  col: (typeof columns)[number];
  tasks: SerializableTask[];
  projectMap: Record<string, SerializableProject>;
  onTaskClick: (task: SerializableTask) => void;
  onAddTask: (columnId: string, title: string, priority: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
    data: { type: "column" },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col gap-2 rounded-lg border bg-card/50 p-3 transition-colors max-h-fit",
        isOver && "ring-1 ring-primary/30 bg-primary/5",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between rounded-md px-2 py-1.5 -mx-2 -mt-1.5",
          col.tint,
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", col.color)} />
          <h3 className="font-medium text-sm">{col.label}</h3>
          <span className="text-muted-foreground text-xs">{tasks.length}</span>
        </div>
        <Button variant="ghost" size="icon-xs">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 min-h-[40px]">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              project={task.projectId ? projectMap[task.projectId] : null}
              onClick={() => onTaskClick(task)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-xs text-muted-foreground rounded-md border border-dashed border-border/50">
              <span>No tasks</span>
            </div>
          )}
        </div>
      </SortableContext>

      <KanbanInlineAdd
        onAdd={(title, priority) => onAddTask(col.id, title, priority)}
      />
    </div>
  );
}
