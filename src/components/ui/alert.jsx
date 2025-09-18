import { cn } from '../utils'

export function Alert({ className, variant = 'default', ...props }) {
  const style = variant === 'destructive'
    ? 'border-red-300 bg-red-50 text-red-900'
    : 'border-gray-200 bg-gray-50 text-gray-800'
  return <div className={cn('rounded-md border p-4', style, className)} {...props} />
}
export function AlertTitle({ className, ...props }) {
  return <div className={cn('font-semibold mb-1', className)} {...props} />
}
export function AlertDescription({ className, ...props }) {
  return <div className={cn('text-sm', className)} {...props} />
}

