// Simple RBAC helper
// Extend here when adding more features/roles
export function canAccess(user, feature) {
  const role = (user && user.role) || "user";
  if (role === "owner") return true;
  if (role === "admin") return true;
  if (role === "user" && feature === "basic") return true;
  return false;
}

