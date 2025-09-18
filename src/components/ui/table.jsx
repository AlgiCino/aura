import { cn } from '../utils'

export function Table({ className, ...props }) {
  return <table className={cn('w-full text-sm', className)} {...props} />
}
export function TableHeader(props) { return <thead {...props} /> }
export function TableBody(props) { return <tbody {...props} /> }
export function TableRow(props) { return <tr {...props} /> }
export function TableHead({ className, ...props }) {
  return <th className={cn('text-left p-3 font-medium text-gray-500', className)} {...props} />
}
export function TableCell({ className, ...props }) {
  return <td className={cn('p-3 align-middle', className)} {...props} />
}

