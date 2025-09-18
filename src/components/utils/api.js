// Thin API helper using Vite dev proxy for Base44.
// Never hardcode API keys in client code. The proxy injects the api_key header.

const APP_ID = import.meta.env.VITE_BASE44_APP_ID || '68c465da9bae2a95cbf5f852';

export async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const url = `/api/apps/${APP_ID}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Projects
export function fetchProjectEntities() {
  return apiFetch('/entities/Project');
}

export function updateProjectEntity(entityId, updateData) {
  return apiFetch(`/entities/Project/${encodeURIComponent(entityId)}`, {
    method: 'PUT',
    body: updateData,
  });
}

