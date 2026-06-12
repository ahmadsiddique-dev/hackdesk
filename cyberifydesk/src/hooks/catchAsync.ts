import axios from "axios"

export function catchAsync<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
) {
  return async (
    ...args: Args
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      const data = await fn(...args)
      return { data, error: null }
    } catch (err) {
      let errorMessage = "Unknown error"
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      return {
        data: null,
        error: errorMessage,
      }
    }
  }
}
