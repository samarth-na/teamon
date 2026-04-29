import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { task, project } from "./schema";

export type Task = InferSelectModel<typeof task>;
export type NewTask = InferInsertModel<typeof task>;
export type Project = InferSelectModel<typeof project>;

export type SerializableTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  startDate: string | null;
  durationMinutes: number | null;
  orderIndex: number;
  userId: string;
  projectId: string | null;
  projectName: string | null;
  projectColor: string | null;
};

export type SerializableProject = {
  id: string;
  name: string;
  color: string;
  userId: string;
};
