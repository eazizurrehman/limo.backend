import type { Router } from "express";
import express from "express";
import AuthenticationController from "@/app/auth/controller";
import { restrictToAuthenticatedUser } from "@/app/auth/middleware";

const authenticationController = new AuthenticationController();

export const authRouter: Router = express.Router();

authRouter.post(
  "/sign-up",
  authenticationController.handleSignup.bind(authenticationController),
);
authRouter.post(
  "/sign-in",
  authenticationController.handleSignin.bind(authenticationController),
);
authRouter.get(
  "/me",
  restrictToAuthenticatedUser(),
  authenticationController.handleMe.bind(authenticationController),
);
