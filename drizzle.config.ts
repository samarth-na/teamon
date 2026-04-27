import { defineConfig } from "drizzle-kit";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
}

export default defineConfig({
  dialect: "turso",
  schema: "./src/lib/schema.ts",
  dbCredentials: {
    url,
    authToken,
  },
});
