// Cloudflare Pages / DNS integration stubs
// These functions are placeholders meant to be implemented against your backend.
// They currently return informative errors if no backend is configured.

async function callBackend(path, init = {}) {
  const url = `/api/cloudflare${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, init).catch(() => null);
  if (!res) throw new Error("Cloudflare API not available (no server)");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Cloudflare API error: ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

export async function createDomain({ zoneId, name, type = "CNAME", content }) {
  if (!zoneId || !name || !content) {
    throw new Error("createDomain requires zoneId, name and content");
  }
  return callBackend("/domains/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ zoneId, name, type, content })
  });
}

export async function deleteDomain({ zoneId, name }) {
  if (!zoneId || !name) {
    throw new Error("deleteDomain requires zoneId and name");
  }
  return callBackend("/domains/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ zoneId, name })
  });
}

export async function listDomains({ zoneId }) {
  if (!zoneId) throw new Error("listDomains requires zoneId");
  return callBackend(`/zones/${encodeURIComponent(zoneId)}/domains`, { method: "GET" });
}

