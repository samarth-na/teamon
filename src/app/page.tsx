import { desc, eq } from "drizzle-orm";
import AppShell from "@/components/app/app-shell";
import { db } from "@/lib/db";
import { project, task } from "@/lib/schema";
import { requireAuth } from "@/lib/session";

function serializeDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return date.toISOString().split("T")[0];
}

export default async function Home() {
  const session = await requireAuth();
  const userId = session.user.id;

  const tasks = await db
    .select({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      startDate: task.startDate,
      durationMinutes: task.durationMinutes,
      orderIndex: task.orderIndex,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt,
      userId: task.userId,
      projectId: task.projectId,
      projectName: project.name,
      projectColor: project.color,
    })
    .from(task)
    .leftJoin(project, eq(task.projectId, project.id))
    .where(eq(task.userId, userId))
    .orderBy(desc(task.orderIndex), desc(task.createdAt));

  const projects = await db
    .select()
    .from(project)
    .where(eq(project.userId, userId))
    .orderBy(desc(project.createdAt));

  return (
    <AppShell
      tasks={tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: serializeDate(t.dueDate),
        startDate: serializeDate(t.startDate),
        durationMinutes: t.durationMinutes,
        orderIndex: t.orderIndex,
        userId: t.userId,
        projectId: t.projectId,
        projectName: t.projectName,
        projectColor: t.projectColor,
      }))}
      projects={projects.map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        userId: p.userId,
      }))}
    />
  );
}
