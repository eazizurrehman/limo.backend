import { createHmac, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { signinPayloadModel, signupPayloadModel } from "@/app/auth/schemas";
import type { UserTokenPayload } from "@/app/auth/utils";
import { createUserToken } from "@/app/auth/utils";
import { db } from "@/db";
import { usersTable } from "@/db/users";
import { ApiError } from "@/lib/api-error";
import { ApiResponse } from "@/lib/api-response";

class AuthenticationController {
  public async handleSignup(req: Request, res: Response) {
    const validationResult = await signupPayloadModel.safeParseAsync(req.body);

    if (validationResult.error)
      throw ApiError.badRequest("body validation failed");

    const { firstName, lastName, email, password } = validationResult.data;

    const userEmailResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (userEmailResult.length > 0)
      throw ApiError.conflict(`user with email ${email} already exists`);

    const salt = randomBytes(32).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const [result] = await db
      .insert(usersTable)
      .values({
        firstName,
        lastName,
        email,
        password: hash,
        salt,
      })
      .returning({ id: usersTable.id });

    return ApiResponse.created(res, "user has been created successfully", {
      result,
    });
  }

  public async handleSignin(req: Request, res: Response) {
    const validationResult = await signinPayloadModel.safeParseAsync(req.body);

    if (validationResult.error)
      throw ApiError.badRequest("body validation failed");

    const { email, password } = validationResult.data;

    const [userSelect] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!userSelect)
      throw ApiError.badRequest(`email or password is incorrect`);

    const salt = userSelect.salt;

    if (!salt) throw ApiError.badRequest(`email or password is incorrect`);

    const hash = createHmac("sha256", salt).update(password).digest("hex");

    if (userSelect.password !== hash)
      throw ApiError.badRequest(`email or password is incorrect`);

    const token = createUserToken({ id: userSelect.id });

    return ApiResponse.ok(res, "Signin Success", { token });
  }

  public async handleMe(
    req: Request & { user?: UserTokenPayload },
    res: Response,
  ) {
    const { id } = req?.user as UserTokenPayload;

    const [userResult] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return ApiResponse.ok(res, "User info retrieved successfully", {
      firstName: userResult?.firstName,
      lastName: userResult?.lastName,
      email: userResult?.email,
    });
  }
}

export default AuthenticationController;
