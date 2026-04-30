import type { Express } from "express";
import express from "express";

export function createApplication(): Express {
  const app = express();

  // Middlewares

  // Routes
  app.get("/health", (_req, res) => {
    return res.json({ message: "App is healthy!" });
  });

  return app;
}
