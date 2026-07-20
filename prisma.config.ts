import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads `.env` and the connection URL no longer lives
// in schema.prisma — it lives here (used by the CLI: generate / db push /
// migrate). Runtime queries go through the driver adapter in src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
