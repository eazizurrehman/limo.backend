import type { Response } from "express";

export class ApiResponse {
  static ok<T>(
    res: Response,
    message: string = "Request successful",
    data: T | null = null,
  ): Response {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(
    res: Response,
    message: string = "Created successfully",
    data: T | null = null,
  ): Response {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static notFound(res: Response, message: string = "Not found"): Response {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  static noData(res: Response, message: string = "No data"): Response {
    return res.status(200).json({
      success: true,
      message,
    });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static error(
    res: Response,
    status: number = 500,
    message: string = "An error occurred",
  ): Response {
    return res.status(status).json({
      success: false,
      message,
    });
  }
}
