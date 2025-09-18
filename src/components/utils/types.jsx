// Type safety utilities and window extensions
// This file handles type-like functionality in JavaScript

// Safe window property initialization
if (typeof window !== 'undefined') {
  window.__disableActivityLog = window.__disableActivityLog || false;
  window.__currentOrgId = window.__currentOrgId || null;
  window.__fetchPatched = window.__fetchPatched || false;
}

// Type checking utilities
export const isValidEntity = (entity) => {
  return entity && typeof entity === 'object' && typeof entity.list === 'function';
};

// Safe property access
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj) return defaultValue;
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) || defaultValue;
  } catch {
    return defaultValue;
  }
};

// Safe API call wrapper
export const safeApiCall = async (apiCall, fallback = null) => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed:', error.message);
    return fallback;
  }
};

export default {
  isValidEntity,
  safeGet,
  safeApiCall
};