import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName, params = '') {
  const base = `/${pageName.toLowerCase()}`;
  return params ? `${base}${params.startsWith('?') ? params : `?${params}`}` : base;
}

export function formatDate(dateString) {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

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

export function getPriorityColor(priority) {
  const defaultColor = 'bg-gray-100 text-gray-800'
  if (typeof priority !== 'string') return defaultColor

  const normalized = priority.trim().toLowerCase()
  const priorityMap = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }

  return priorityMap[normalized] || defaultColor
}

export function formatDistance(date) {
  if (!date) return 'Unknown'

  const targetDate = new Date(date)
  if (Number.isNaN(targetDate.getTime())) return 'Unknown'

  const now = new Date()
  let diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60))

  if (diffInMinutes < 0) diffInMinutes = 0
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays}d ago`

  return targetDate.toLocaleDateString()
}

export function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
