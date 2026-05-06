import type { Express } from "express";
import express from "express";
import { authRouter } from "@/app/auth/routes";
import { vehiclesRouter } from "@/app/vehicles/routes";
import { ApiResponse } from "@/lib/api-response";

export function createApplication(): Express {
  const app = express();

  // Middlewares

  // Routes
  app.get("/health", (_req, res) => {
    return ApiResponse.ok(res, "App is healthy!");
  });

  app.use("/auth", authRouter);
  app.use("/vehicles", vehiclesRouter);

  return app;
}
