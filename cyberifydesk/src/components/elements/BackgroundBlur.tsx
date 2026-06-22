import * as React from "react"

export function BackgroundBlur() {
  return (
    <div className="pointer-events-none absolute top-0 left-1/2 h-150 w-full max-w-7xl -translate-x-1/2 overflow-hidden">
      <div className="absolute -top-50 left-1/4 h-150 w-150 rounded-full bg-red-600/10 blur-[150px] dark:bg-red-600/15" />
      <div className="absolute -top-25 right-1/4 h-125 w-125 rounded-full bg-rose-500/10 blur-[130px] dark:bg-rose-500/15" />
    </div>
  )
}
