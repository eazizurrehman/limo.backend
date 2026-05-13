import { createHmac, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { user } from "@/app/auth/schema";
import type { UserTokenPayload } from "@/app/auth/utils";
import { createUserToken } from "@/app/auth/utils";
import type { AuthSchemas } from "@/app/auth/zod";
import { db } from "@/db";
import { ApiError } from "@/lib/api-error";
import { ApiResponse } from "@/lib/api-response";

export class AuthController {
  public async signupUser(req: Request, res: Response) {
    const data = req.validated.body as AuthSchemas.TSignupUserBody;

    const { firstName, lastName, email, password } = data;

    const userEmailResult = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (userEmailResult.length > 0)
      throw ApiError.conflict(
        `A user with the email "${email}" already exists.`,
      );

    const salt = randomBytes(32).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const [result] = await db
      .insert(user)
      .values({
        firstName,
        lastName,
        email,
        password: hash,
        salt,
      })
      .returning({ id: user.id });

    return ApiResponse.created(res, "user has been created successfully", {
      user: result,
    });
  }

  public async signinUser(req: Request, res: Response) {
    const data = req.validated.body as AuthSchemas.TSigninUserBody;

    const { email, password } = data;

    const [userSelect] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!userSelect)
      throw ApiError.badRequest(`The email or password is incorrect.`);

    const salt = userSelect.salt;

    if (!salt) throw ApiError.badRequest(`The email or password is incorrect`);

    const hash = createHmac("sha256", salt).update(password).digest("hex");

    if (userSelect.password !== hash)
      throw ApiError.badRequest(`The email or password is incorrect.`);

    const token = createUserToken({ id: userSelect.id });

    return ApiResponse.ok(res, "User signed in successfully", { token });
  }

  public async handleMe(
    req: Request & { user?: UserTokenPayload },
    res: Response,
  ) {
    const { id } = req?.user as UserTokenPayload;

    const [userResult] = await db.select().from(user).where(eq(user.id, id));

    return ApiResponse.ok(res, "User info retrieved successfully", {
      firstName: userResult?.firstName,
      lastName: userResult?.lastName,
      email: userResult?.email,
    });
  }
}
