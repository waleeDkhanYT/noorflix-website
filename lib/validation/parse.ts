import type { z } from "zod";
import { actionError, actionSuccess, type ActionResult } from "@/types/actions";
import { formatZodIssues } from "@/lib/server/validation/schemas";

export function parseInput<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown
): ActionResult<z.infer<TSchema>> {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issues = formatZodIssues(result.error);
    const message = issues[0]?.message ?? "Invalid input.";
    return actionError(message);
  }

  return actionSuccess(result.data);
}