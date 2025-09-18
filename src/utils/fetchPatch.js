// Idempotent fetch patch with ActivityLog + AppAlert logging and client API shims
import { ActivityLog, AppAlert, AppSettings, AuditLog, User } from "@/components/utils/entities";
import { createPageUrl } from "@/utils";

function redact(obj) {
  const redactKeys = /token|api_key|secret|dsn/i;
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(redact);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (redactKeys.test(k)) out[k] = "***";
    else if (v && typeof v === "object") out[k] = redact(v);
    else out[k] = v;
  }
  return out;
}

async function handleSecretsAPI(originalFetch, url, init = {}) {
  const u = new URL(url, window.location.origin);
  const path = u.pathname;
  const prevDisable = window.__disableActivityLog;
  window.__disableActivityLog = true;

  const safeStatus = (s) => (typeof s === "number" && s >= 200 && s <= 599) ? s : 502;

  try {
    const me = await User.me().catch(() => null);
    if (!me) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    let list = await AppSettings.filter({ owner_user_id: me.id });
    let rec = (list && list[0]) ? list[0] : await AppSettings.create({
      owner_user_id: me.id,
      branding: {},
      secrets: {},
      github: { owner: "", repo: "", branch: "main" }
    });

    if (path === "/api/secrets/save") {
      const bodyText = (init && init.body) ? String(init.body) : "";
      let payload = {};
      try { payload = JSON.parse(bodyText || "{}"); }
      catch (parseError) {
        console.debug('Failed to parse secrets payload', parseError);
      }
      const provider = String(payload.provider || "").trim();
      const key = String(payload.key || "").trim();
      const value = String(payload.value || "");
      if (!provider || !key || !value) {
        return new Response(JSON.stringify({ error: "provider, key, and value are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const before = rec.secrets || {};
      const next = { ...(rec.secrets || {}) };
      const providerMap = { ...(next[provider] || {}) };
      providerMap[key] = value;
      next[provider] = providerMap;

      rec = await AppSettings.update(rec.id, { secrets: next });

      await AuditLog.create({
        action: "secrets.update",
        entity_name: "AppSettings",
        entity_id: String(rec.id),
        before: { provider, keys: Object.keys(before?.[provider] || {}) },
        after: { provider, keys: Object.keys(rec.secrets?.[provider] || {}) },
        note: "Write-only secret saved (value redacted)",
        success: true,
        context: { provider, key }
      });

      return new Response(JSON.stringify({ saved: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (path === "/api/secrets/status") {
      const provider = u.searchParams.get("provider") || "";
      const all = rec.secrets || {};
      const exists = {};
      if (provider) {
        const p = all[provider] || {};
        exists[provider] = Object.keys(p).reduce((acc, k) => { acc[k] = true; return acc; }, {});
      } else {
        for (const p of Object.keys(all)) {
          exists[p] = Object.keys(all[p] || {}).reduce((acc, k) => { acc[k] = true; return acc; }, {});
        }
      }
      return new Response(JSON.stringify({ exists }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (path === "/api/github/ping") {
      const token = (rec.secrets?.github && rec.secrets.github.token) || rec.secrets?.github_token || "";
      const owner = rec.github?.owner || "";
      const repo = rec.github?.repo || "";
      const branch = rec.github?.branch || "main";
      if (!token) {
        return new Response(JSON.stringify({ ok: false, error: "Missing GitHub token" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      if (!owner || !repo) {
        return new Response(JSON.stringify({ ok: false, error: "Missing repository config (owner/repo)" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }

      const userRes = await originalFetch("https://api.github.com/user", {
        method: "GET",
        headers: {
          "Authorization": `token ${token}`,
          "Accept": "application/vnd.github+json"
        }
      });
      if (!userRes.ok) {
        const msg = await userRes.text().catch(() => "");
        const reason = userRes.status === 401 ? "Unauthorized token" : (userRes.status === 403 ? "Insufficient scopes" : "GitHub API error");
        return new Response(JSON.stringify({ ok: false, error: reason, details: msg.slice(0, 300) }), { status: safeStatus(userRes.status), headers: { "Content-Type": "application/json" } });
      }
      const scopesHeader = userRes.headers.get("x-oauth-scopes") || "";
      const scopes = scopesHeader.split(",").map(s => s.trim()).filter(Boolean);

      const repoRes = await originalFetch(`https://api.github.com/repos/${owner}/${repo}`, {
        method: "GET",
        headers: {
          "Authorization": `token ${token}`,
          "Accept": "application/vnd.github+json"
        }
      });
      if (!repoRes.ok) {
        const msg = await repoRes.text().catch(() => "");
        return new Response(JSON.stringify({ ok: false, error: repoRes.status === 404 ? "Repository not found" : "Failed to read repository", details: msg.slice(0, 300) }), { status: safeStatus(repoRes.status), headers: { "Content-Type": "application/json" } });
      }
      const repoJson = await repoRes.json().catch(() => ({}));
      return new Response(JSON.stringify({ ok: true, scopes, repo: { owner, name: repo, default_branch: repoJson.default_branch || branch } }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  } finally {
    window.__disableActivityLog = prevDisable;
  }
}

export function setupFetchPatch() {
  if (typeof window === "undefined" || window.__fetchPatched) return;
  window.__fetchPatched = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : (input && input.url) ? input.url : "";

    if (typeof url === "string" && (url.startsWith("/api/secrets/") || url.startsWith("/api/github/"))) {
      return handleSecretsAPI(originalFetch, url, init);
    }

    const startedAt = new Date().toISOString();
    const method = (init && init.method) || (typeof input !== "string" && input && input.method) || "GET";

    if (window.__disableActivityLog || (url && (String(url).includes("/entities/ActivityLog") || String(url).includes("/entities/AppAlert")))) {
      return originalFetch(input, init);
    }

    let reqBody = null;
    try {
      const body = init && init.body;
      if (typeof body === "string") {
        const ct = (init.headers && (init.headers["Content-Type"] || init.headers["content-type"] || "")).toString();
        if (ct.includes("application/json") || body.trim().startsWith("{") || body.trim().startsWith("[")) {
          try { reqBody = JSON.parse(body); } catch { reqBody = { _raw: (body || "").slice(0, 1024) }; }
        } else {
          reqBody = { _raw: (body || "").slice(0, 1024) };
        }
      }
    } catch (parseError) {
      console.debug('Failed to parse request body for logging', parseError);
    }

    const t0 = performance.now();
    let res, error;
    try {
      res = await originalFetch(input, init);
      return res;
    } catch (e) {
      error = e;
      throw e;
    } finally {
      const completedAt = new Date().toISOString();
      const duration = Math.round(performance.now() - t0);
      const status = res ? (res.status || 0) : 0;
      const responseSummary = res ? { ok: res.ok, status: res.status, statusText: res.statusText } : { error: error ? String(error) : null };

      try {
        window.__disableActivityLog = true;
        const orgId = (window.__currentOrgId || localStorage.getItem("current_org_id") || "");
        const log = await ActivityLog.create({
          type: "request",
          status,
          label: `${method} ${url}`,
          url,
          method,
          duration_ms: duration,
          started_at: startedAt,
          completed_at: completedAt,
          request_body: redact(reqBody || {}),
          response_body: responseSummary,
          meta: { org_id: orgId }
        });

        const isError = !(res && res.ok);
        if (isError) {
          const actionUrl = `${window.location.origin}${createPageUrl('ActivityMonitor')}#${encodeURIComponent(`?selected=${log.id}`)}`;
          await AppAlert.create({
            type: "error",
            title: `Request failed: ${status || "error"}`,
            body: `${method} ${url}`,
            action_url: actionUrl
          });
        }
      } catch (logError) {
        console.debug('ActivityLog creation failed', logError);
      } finally {
        window.__disableActivityLog = false;
      }
    }
  };
}

// Auto-setup if imported directly
if (typeof window !== "undefined") {
  try {
    setupFetchPatch();
  } catch (patchError) {
    console.debug('setupFetchPatch failed', patchError);
  }
}
