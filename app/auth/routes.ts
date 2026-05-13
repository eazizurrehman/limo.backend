import type { Router } from "express";
import express from "express";
import { AuthController } from "@/app/auth/controller";
import { AuthSchemas } from "@/app/auth/zod";
import { restrictToAuthenticatedUser } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";

const controller = new AuthController();
const schemas = new AuthSchemas();

export const authRouter: Router = express.Router();

authRouter.post(
  "/signup",
  validate(schemas.signupUserBody),
  controller.signupUser.bind(controller),
);
authRouter.post(
  "/signin",
  validate(schemas.signinUserBody),
  controller.signinUser.bind(controller),
);
authRouter.get(
  "/me",
  restrictToAuthenticatedUser(),
  controller.handleMe.bind(controller),
);
