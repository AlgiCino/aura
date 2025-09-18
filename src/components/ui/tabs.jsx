import React, { useState, useContext } from 'react'
import { cn } from '../utils'

const TabsCtx = React.createContext(null)

export function Tabs({ defaultValue, className, children }) {
  const [value, setValue] = useState(defaultValue)
  return <TabsCtx.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsCtx.Provider>
}

export function TabsList({ className, ...props }) {
  return <div className={cn('flex gap-2 border-b', className)} {...props} />
}
export function TabsTrigger({ value, className, children }) {
  const ctx = useContext(TabsCtx)
  const active = ctx?.value === value
  return (
    <button onClick={() => ctx?.setValue(value)} className={cn('px-3 py-1.5 text-sm', active ? 'border-b-2 border-indigo-600' : 'text-gray-500', className)}>
      {children}
    </button>
  )
}
export function TabsContent({ value, className, children }) {
  const ctx = useContext(TabsCtx)
  if (ctx?.value !== value) return null
  return <div className={className}>{children}</div>
}

