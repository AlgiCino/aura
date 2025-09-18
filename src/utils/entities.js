// Project Management Entities based on the snapshot

export const createProject = (data) => ({
  id: crypto.randomUUID(),
  name: data.name || '',
  description: data.description || '',
  vision: data.vision || '',
  goal: data.goal || '',
  status: data.status || 'planning',
  priority: data.priority || 'medium',
  start_date: data.start_date || null,
  end_date: data.end_date || null,
  tech_stack: data.tech_stack || [],
  budget: data.budget || null,
  created_at: new Date().toISOString(),
  created_by: 'user@example.com'
});

export const createPhase = (data) => ({
  id: crypto.randomUUID(),
  project_id: data.project_id || '',
  name: data.name || '',
  description: data.description || '',
  phase_number: data.phase_number || 1,
  duration_weeks: data.duration_weeks || 1,
  status: data.status || 'not_started',
  start_date: data.start_date || null,
  end_date: data.end_date || null,
  deliverables: data.deliverables || [],
  created_at: new Date().toISOString(),
  created_by: 'user@example.com'
});

export const createTask = (data) => ({
  id: crypto.randomUUID(),
  phase_id: data.phase_id || '',
  title: data.title || '',
  description: data.description || '',
  category: data.category || 'backend',
  status: data.status || 'todo',
  priority: data.priority || 'medium',
  estimated_hours: data.estimated_hours || null,
  actual_hours: data.actual_hours || null,
  due_date: data.due_date || null,
  tags: data.tags || [],
  notes: data.notes || '',
  created_at: new Date().toISOString(),
  created_by: 'user@example.com'
});

// Status mappings
export const PROJECT_STATUSES = {
  planning: { label: 'Planning', color: 'blue' },
  in_progress: { label: 'In Progress', color: 'yellow' },
  completed: { label: 'Completed', color: 'green' },
  on_hold: { label: 'On Hold', color: 'gray' }
};

export const PHASE_STATUSES = {
  not_started: { label: 'Not Started', color: 'gray' },
  in_progress: { label: 'In Progress', color: 'blue' },
  completed: { label: 'Completed', color: 'green' },
  blocked: { label: 'Blocked', color: 'red' }
};

export const TASK_STATUSES = {
  todo: { label: 'To Do', color: 'gray' },
  in_progress: { label: 'In Progress', color: 'blue' },
  completed: { label: 'Completed', color: 'green' },
  blocked: { label: 'Blocked', color: 'red' }
};

export const PRIORITIES = {
  low: { label: 'Low', color: 'green' },
  medium: { label: 'Medium', color: 'yellow' },
  high: { label: 'High', color: 'orange' },
  critical: { label: 'Critical', color: 'red' }
};