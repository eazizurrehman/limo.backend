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

type TAuthSchemasInstance = InstanceType<typeof AuthSchemas>;

export type TAuthSchemas = {
  [K in keyof TAuthSchemasInstance as TAuthSchemasInstance[K] extends z.ZodTypeAny
    ? K
    : never]: z.infer<TAuthSchemasInstance[K]>;
};
