// central utils

// Build a route path from a page name
// Example: createPageUrl("Dashboard") -> "/dashboard"
export function createPageUrl(name, params = '') {
  const n = String(name || "").trim().toLowerCase();
  if (!n) return "/";
  const base = n.startsWith("/") ? n : `/${n}`;
  return params ? `${base}${params.startsWith('?') ? params : `?${params}`}` : base;
}

// Format distance from date
export function formatDistance(date) {
  if (!date) return 'Unknown';
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMinutes = Math.floor((now - targetDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    return targetDate.toLocaleDateString();
  } catch {
    return new Date(date).toLocaleDateString();
  }
}

// Get status color styling
export function getStatusColor(status, type = 'project') {
  const statusMaps = {
    project: {
      planning: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-gray-100 text-gray-800'
    },
    phase: {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800'
    },
    task: {
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800'
    }
  }
  
  return statusMaps[type]?.[status] || 'bg-gray-100 text-gray-800'
}

// Slugify text
export function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Basic role-based access control
// owner: full access
// user: only "basic" features
export function canAccess(user, feature) {
  const role = (user && user.role) || "user";
  if (role === "owner") return true;
  if (role === "admin") return true;
  if (role === "user" && feature === "basic") return true;
  return false;
}

// Optional helper to gate navigation items by feature
export function guardFeature(user, feature) {
  return canAccess(user, feature);
}

export async function safeFetch(input, init){
  try{
    const res = await fetch(input, init)
    if(!res || typeof res.status !== 'number' || res.status < 200){
      return new Response(res?.body ?? null, { status: res?.status || 503 })
    }
    return res
  }catch(err){
    return new Response(JSON.stringify({ error: String(err?.message || err) }), { status: 503 })
  }
}

export * as roles from "./roles";
