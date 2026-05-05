import type { Express } from "express";
import express from "express";
import { ApiResponse } from "@/lib/api-response";

export function createApplication(): Express {
  const app = express();

  // Middlewares

  // Routes
  app.get("/health", (_req, res) => {
    return ApiResponse.ok(res, "App is healthy!");
  });

  return app;
}
