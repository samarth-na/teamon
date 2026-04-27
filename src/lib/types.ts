import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { task } from "./schema";

export type Task = InferSelectModel<typeof task>;
export type NewTask = InferInsertModel<typeof task>;
