import { NextRequest } from "next/server";
import { apiError, apiSuccess, methodNotAllowed } from "@/lib/server/api-response";
import { isValidAdminApiSecret } from "@/lib/admin";
import { getPublicEnvStatus, getServerSecretsStatus } from "@/lib/env";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");

  if (!isValidAdminApiSecret(secret)) {
    return apiError("FORBIDDEN", "Unauthorized.", 403);
  }

  return apiSuccess({
    status: "ok",
    environment: process.env.NODE_ENV ?? "development",
    public: getPublicEnvStatus(),
    secrets: getServerSecretsStatus(),
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  return methodNotAllowed();
}