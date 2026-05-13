import { type infer as ZodInfer, type ZodType, z } from "zod";
import { ApiError } from "@/lib/api-error";

export const uuidSchema = z
  .uuid("ID is required")
  .nonempty("ID cannot be empty");

export type ValidationSource = "body" | "query" | "params";

function getMissingObjectMessage(source?: ValidationSource) {
  switch (source) {
    case "body":
      return "Request body is required";
    case "query":
      return "Query params are required";
    case "params":
      return "Route params are required";
    default:
      return "Request data is required";
  }
}

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

  if (!success) {
    console.error("Validation error:", error);

    const issue = error?.issues?.[0];
    const isMissingObject =
      issue?.code === "invalid_type" &&
      issue?.expected === "object" &&
      raw === undefined &&
      (issue?.path?.length ?? 0) === 0;

    const source = schema.meta()?.source as ValidationSource | undefined;

    if (isMissingObject)
      throw ApiError.badRequest(getMissingObjectMessage(source));

    const zodMessage = issue?.message;

    throw ApiError.badRequest(zodMessage || failure || "Validation failed");
  }

  return data;
}
