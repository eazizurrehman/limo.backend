import { type infer as ZodInfer, type ZodType, z } from "zod";
import { ApiError } from "@/lib/api-error";

export const uuidSchema = z
  .uuid("ID is required")
  .nonempty("ID cannot be empty");

export async function validateData<TSchema extends ZodType>({
  schema,
  raw,
  failure = "Validation failed",
}: {
  schema: TSchema;
  raw: unknown;
  failure?: string | undefined;
}): Promise<ZodInfer<TSchema>> {
  const { success, data, error } = await schema.safeParseAsync(raw);
  console.log("Validation error:", error);

  if (!success) throw ApiError.badRequest(failure || "Validation failed");

  return data;
}
