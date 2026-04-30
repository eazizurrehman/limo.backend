import express from "express";
import type { Express } from "express";

export function createApplication(): Express {
  const app = express();

  // Middlewares

  // Routes
  app.get("/health", (req, res) => {
    return res.json({ message: "App is healthy!" });
  });

  return app;
}
