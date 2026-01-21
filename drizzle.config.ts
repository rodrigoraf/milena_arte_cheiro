import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL || "file:./dev.db";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: connectionString.startsWith("file:") ? "turso" : "mysql",
  dbCredentials: { url: connectionString },
});
