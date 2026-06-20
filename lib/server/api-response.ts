import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "CONFIG_ERROR"
  | "UPSTREAM_ERROR"
  | "UPSTREAM_UNAVAILABLE"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "METHOD_NOT_ALLOWED"
  | "INTERNAL_ERROR";

export type ApiErrorBody = {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status }
  );
}

export function apiSuccess<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function methodNotAllowed(): NextResponse<ApiErrorBody> {
  return apiError(
    "METHOD_NOT_ALLOWED",
    "This endpoint only supports the documented HTTP methods.",
    405
  );
}