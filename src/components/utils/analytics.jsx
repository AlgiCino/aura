import { AppEvent, User } from "@/components/utils/entities";

let user = null;
let sessionId = null;

const init = async () => {
  if (user) return;
  user = await User.me().catch(() => null);
  sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
init();

export const trackPageView = async (props = {}) => {
  if (!user) await init();
  try {
    await AppEvent.create({
      name: "page_view",
      page: props.page,
      props: props || {},
      userId: user?.email,
      orgId: window.__currentOrgId || localStorage.getItem("current_org_id") || "",
      session_id: sessionId,
      source: "web",
      ts: new Date().toISOString()
    });
  } catch {}
};

export const trackEvent = async (name, props = {}) => {
  if (!user) await init();
  try {
    await AppEvent.create({
      name,
      props: props || {},
      userId: user?.email,
      orgId: window.__currentOrgId || localStorage.getItem("current_org_id") || "",
      session_id: sessionId,
      source: "web",
      ts: new Date().toISOString()
    });
  } catch {}
};

export const trackTemplateUsed = async (props = {}) => {
  if (!user) await init();
  try {
    await AppEvent.create({
      name: "template_used",
      props: props || {},
      userId: user?.email,
      orgId: window.__currentOrgId || localStorage.getItem("current_org_id") || "",
      session_id: sessionId,
      source: "web",
      ts: new Date().toISOString()
    });
  } catch {}
};
