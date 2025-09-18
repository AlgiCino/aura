// Global type safety utilities and window extensions
// This file handles type-like functionality in JavaScript

// Extend window object safely
if (typeof window !== 'undefined') {
  // Initialize custom window properties if they don't exist
  if (typeof window.__disableActivityLog === 'undefined') {
    window.__disableActivityLog = false;
  }
  if (typeof window.__currentOrgId === 'undefined') {
    window.__currentOrgId = null;
  }
  if (typeof window.__fetchPatched === 'undefined') {
    window.__fetchPatched = false;
  }
}

// Type checking utilities for entities
export const isValidEntity = (entity) => {
  return entity && typeof entity === 'object' && typeof entity.list === 'function';
};

export const isValidProject = (project) => {
  return project && typeof project === 'object' && 
    typeof project.name === 'string' &&
    ['planning', 'in_progress', 'completed', 'on_hold'].includes(project.status);
};

export const isValidPhase = (phase) => {
  return phase && typeof phase === 'object' && 
    typeof phase.project_id === 'string' &&
    typeof phase.name === 'string';
};

export const isValidTask = (task) => {
  return task && typeof task === 'object' && 
    typeof task.phase_id === 'string' &&
    typeof task.title === 'string';
};

export const isValidMessage = (message) => {
  return message && typeof message === 'object' &&
    typeof message.content === 'string' &&
    ['user', 'assistant', 'system'].includes(message.role);
};

// Safe property access
export const safeGet = (obj, path, defaultValue = null) => {
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

// Entity status constants
export const PROJECT_STATUSES = ['planning', 'in_progress', 'completed', 'on_hold'];
export const TASK_STATUSES = ['todo', 'in_progress', 'completed', 'blocked'];
export const PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const TASK_CATEGORIES = ['backend', 'frontend', 'database', 'deployment', 'design', 'testing', 'documentation'];

// Helper functions for data validation
export const validateProject = (project) => {
  const errors = [];
  if (!project.name) errors.push('Project name is required');
  if (!PROJECT_STATUSES.includes(project.status)) errors.push('Invalid project status');
  if (!PRIORITIES.includes(project.priority)) errors.push('Invalid project priority');
  return errors;
};

export const validateTask = (task) => {
  const errors = [];
  if (!task.title) errors.push('Task title is required');
  if (!task.phase_id) errors.push('Phase ID is required');
  if (!TASK_STATUSES.includes(task.status)) errors.push('Invalid task status');
  if (!PRIORITIES.includes(task.priority)) errors.push('Invalid task priority');
  if (!TASK_CATEGORIES.includes(task.category)) errors.push('Invalid task category');
  return errors;
};

export default {
  isValidEntity,
  isValidProject,
  isValidPhase,
  isValidTask,
  isValidMessage,
  safeGet,
  safeApiCall,
  validateProject,
  validateTask,
  PROJECT_STATUSES,
  TASK_STATUSES,
  PRIORITIES,
  TASK_CATEGORIES
};