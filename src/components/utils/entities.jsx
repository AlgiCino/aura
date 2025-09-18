// Lightweight client stubs to allow the app to run/build without a backend SDK.

const mkEntity = () => ({
  list: async () => [],
  filter: async () => [],
  create: async (data) => ({ ...data, id: String(Date.now()) }),
  update: async (id, data) => ({ id, ...data }),
  delete: async () => ({ ok: true }),
});

export const User = {
  async me() {
    return { id: 'u_demo', email: 'demo@aura.local', full_name: 'Demo User', plan: 'free' };
  },
  async updateMyUserData(patch) {
    return { id: 'u_demo', ...patch };
  }
};

export const Project = mkEntity();
export const Phase = mkEntity();
export const Task = mkEntity();
export const Sprint = mkEntity();
export const Deliverable = mkEntity();
export const Template = mkEntity();
export const Integration = mkEntity();
export const App = mkEntity();
export const AppSettings = mkEntity();
export const Publish = mkEntity();
export const ActivityLog = mkEntity();
export const Organization = mkEntity();
export const Membership = mkEntity();
export const Invite = mkEntity();
export const RolePermission = mkEntity();
export const AuditLog = mkEntity();
export const Snapshot = mkEntity();
export const AppAlert = mkEntity();
export const AppEvent = mkEntity();
export const UsageMetric = mkEntity();
export const Article = mkEntity();
