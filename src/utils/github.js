// Minimal GitHub helper calling a backend shim if available

export async function ping() {
  const res = await fetch("/api/github/ping").catch(() => null);
  if (!res) return { ok: false, error: "Backend not available" };
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, ...(data || {}) };
  return data;
}

