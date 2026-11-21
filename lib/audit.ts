import prisma from "@/lib/db";
import { headers } from "next/headers";

export type AuditAction =
  | "NOTE_CREATED"
  | "NOTE_UPDATED"
  | "NOTE_DELETED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_UPDATED"
  | "SETTINGS_UPDATED";

interface LogAuditParams {
  userId: string;
  action: AuditAction;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Helper to record immutable audit trail events
 */
export async function recordAuditLog({
  userId,
  action,
  details,
  ipAddress,
  userAgent,
}: LogAuditParams) {
  try {
    // If not supplied, try resolving from headers (works inside Server Actions/Routes)
    let ip = ipAddress;
    let ua = userAgent;

    try {
      const reqHeaders = headers();
      if (!ip) {
        ip =
          reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          reqHeaders.get("x-real-ip") ||
          "127.0.0.1";
      }
      if (!ua) {
        ua = reqHeaders.get("user-agent") || "unknown";
      }
    } catch {
      // outside request context fallback
      ip = ip || "internal";
      ua = ua || "server";
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress: ip,
        userAgent: ua,
      },
    });
  } catch (error) {
    // Audit logging should not crash user operation, but log to stderr
    console.error("Audit log failed to record:", error);
  }
}
