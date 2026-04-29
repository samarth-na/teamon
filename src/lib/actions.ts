"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { task } from "@/lib/schema";
import { getSession } from "@/lib/session";

export async function createTask(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  if (!title?.trim()) throw new Error("Title is required");

  const description = (formData.get("description") as string) || null;
  const status = (formData.get("status") as string) || "backlog";
  const priority = (formData.get("priority") as string) || "medium";
  const projectId = (formData.get("projectId") as string) || null;
  const dueDateStr = (formData.get("dueDate") as string) || null;

  const now = new Date();

  await db.insert(task).values({
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description?.trim() || null,
    status: status as typeof task.$inferSelect.status,
    priority: priority as typeof task.$inferSelect.priority,
    dueDate: dueDateStr ? new Date(dueDateStr) : null,
    orderIndex: Date.now(),
    userId: session.user.id,
    projectId,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/");
}

export async function toggleTaskStatus(taskId: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)))
    .get();

  if (!existing) throw new Error("Task not found");

  const isDone = existing.status === "done";
  await db
    .update(task)
    .set({
      status: isDone ? "todo" : "done",
      completedAt: isDone ? null : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(task.id, taskId));

  revalidatePath("/");
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)))
    .get();

  if (!existing) throw new Error("Task not found");

  await db
    .update(task)
    .set({
      status: newStatus as typeof task.$inferSelect.status,
      completedAt: newStatus === "done" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(task.id, taskId));

  revalidatePath("/");
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    dueDate?: string | null;
    projectId?: string | null;
    orderIndex?: number;
  },
) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)))
    .get();

  if (!existing) throw new Error("Task not found");

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description?.trim() || null;
  if (data.status !== undefined) {
    updateData.status = data.status as typeof task.$inferSelect.status;
    if (data.status === "done") {
      updateData.completedAt = new Date();
    } else if (existing.status === "done") {
      updateData.completedAt = null;
    }
  }
  if (data.priority !== undefined) updateData.priority = data.priority as typeof task.$inferSelect.priority;
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  if (data.projectId !== undefined) updateData.projectId = data.projectId || null;
  if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex;

  await db.update(task).set(updateData).where(eq(task.id, taskId));

  revalidatePath("/");
}

export async function deleteTask(taskId: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)))
    .get();

  if (!existing) throw new Error("Task not found");

  await db.delete(task).where(eq(task.id, taskId));

  revalidatePath("/");
}
