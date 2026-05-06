import type { infer as ZodInfer, ZodType } from "zod";
import { ApiError } from "@/lib/api-error";

export async function validate<TSchema extends ZodType>({
  schema,
  raw,
  message = "Validation failed",
}: {
  schema: TSchema;
  raw: unknown;
  message?: string;
}): Promise<ZodInfer<TSchema>> {
  const { success, data, error } = await schema.safeParseAsync(raw);
  console.log("Validation error:", error);

  if (!success) throw ApiError.badRequest(message);

  return data;
}
