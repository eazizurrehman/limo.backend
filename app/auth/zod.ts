import { z } from "zod";

export class AuthSchemas {
  public signupUserBody = z
    .object({
      firstName: z
        .string("First name is required")
        .min(2, "First name must be at least 2 characters"),
      lastName: z.string("Last name must be a string").nullable().optional(),
      email: z.email("Email is required"),
      password: z
        .string("Password is required")
        .min(6, "Password must be at least 6 characters"),
    })
    .meta({ source: "body" });

  public signinUserBody = z
    .object({
      email: z.email("Email is required"),
      password: z.string("Password is required"),
    })
    .meta({ source: "body" });
}

export namespace AuthSchemas {
  export type TSignupUserBody = z.infer<AuthSchemas["signupUserBody"]>;
  export type TSigninUserBody = z.infer<AuthSchemas["signinUserBody"]>;
}
