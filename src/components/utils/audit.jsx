import { AuditLog, User } from "@/components/utils/entities";

export async function logAudit({
  action,
  entity_name,
  entity_id,
  before = {},
  after = {},
  note = "",
  success = true,
  context = {}
} = {}) {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  let actorEmail = "";
  try {
    const me = await User.me();
    actorEmail = me?.email || "";
  } catch {}
  try {
    await AuditLog.create({
      action,
      entity_name,
      entity_id: entity_id ? String(entity_id) : "",
      before,
      after,
      actor_email: actorEmail,
      ip: "", // IP not available from frontend
      user_agent: ua,
      note,
      success,
      context
    });
  } catch {
    // swallow to keep UX smooth
  }
}
