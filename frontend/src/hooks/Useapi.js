import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({ baseURL: BASE })

// ── Generic fetcher ────────────────────────────────────────────────────────────
export function useFetch(url, params = {}, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const abortRef = useRef(null)

  const fetch = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setLoading(true)
    setError(null)
    try {
      const res = await api.get(url, { params, signal: ctrl.signal })
      setData(res.data)
    } catch (e) {
      if (e.name !== 'CanceledError') setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [url, JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch, ...deps])
  return { data, loading, error, refetch: fetch }
}

// ── Dashboard stats ────────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useFetch('/api/dashboard/stats')
}

// ── Paginated listings ─────────────────────────────────────────────────────────
export function useListings(params) {
  return useFetch('/api/listings/', params)
}