'use client'

import { useState, useCallback } from "react"
import { catchAsync } from "./catchAsync"

export function useApi<T, Args extends any[]>(
  fetcher: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: Args) => {
      setLoading(true)
      setError(null)
      const { data: result, error: fetchError } = await catchAsync(
        fetcher
      )(...args)
      setData(result)
      if (fetchError) {
        setError(fetchError)
      }
      setLoading(false)
      return result
    },
    [fetcher]
  )

  return { data, loading, error, execute }
}