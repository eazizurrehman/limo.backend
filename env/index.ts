import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    // App
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.string("PORT is required").default("4000"),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    // App
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: process.env.PORT ?? "4000",
  },
});
