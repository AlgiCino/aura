
export async function saveSecret({ provider, key, value }) {
  const prev = window.__disableActivityLog || false;
  window.__disableActivityLog = true;
  try {
    // Add better error handling and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const res = await fetch("/api/secrets/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, key, value }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle specific status codes
    if (res.status === 400) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Bad request - check your input values");
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error("لا يمكن عرض القيمة – محفوظة بشكل آمن");
    }
    if (res.status === 404) {
      throw new Error("Secrets API endpoint not found - please check backend configuration");
    }
    if (!res.ok) {
      throw new Error("خادم الأسرار غير مفعّل (Backend). فعّل وظائف السيرفر ثم أعد المحاولة.");
    }

    const data = await res.json().catch(() => ({}));
    return data || {};
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error("Request timed out - please try again");
    }
    throw error;
  } finally {
    window.__disableActivityLog = prev;
  }
}

export async function getSecretStatus(params = {}) {
  const q = new URLSearchParams(params);
  const url = `/api/secrets/status${q.toString() ? `?${q.toString()}` : ""}`;
  const prev = window.__disableActivityLog || false;
  window.__disableActivityLog = true;
  try {
    // Add timeout for status checks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, { 
      method: "GET",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.status === 400) {
      const errorData = await res.json().catch(() => ({}));
      return { error: errorData.error || "Invalid request parameters", exists: {} };
    }
    if (res.status === 401 || res.status === 403) {
      return { error: "لا يمكن عرض القيمة – محفوظة بشكل آمن", exists: {} };
    }
    if (res.status === 404) {
      return { error: "Secrets API not available", exists: {} };
    }
    if (!res.ok) {
      throw new Error("خادم الأسرار غير مفعّل (Backend). فعّل وظائف السيرفر ثم أعد المحاولة.");
    }

    const data = await res.json().catch(() => ({}));
    return data || { exists: {} };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { error: "Request timed out", exists: {} };
    }
    throw error;
  } finally {
    window.__disableActivityLog = prev;
  }
}