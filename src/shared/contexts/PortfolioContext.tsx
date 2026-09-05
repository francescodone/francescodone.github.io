import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { PortfolioData } from '@shared/types/portfolio'

interface PortfolioContextValue {
  data: PortfolioData | null
  loading: boolean
  error: string | null
}

const PortfolioContext = createContext<PortfolioContextValue>({
  data: null,
  loading: true,
  error: null,
})

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load portfolio data: ${res.status}`)
        return res.json()
      })
      .then((json: PortfolioData) => {
        setData(json)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <PortfolioContext value={{ data, loading, error }}>
      {children}
    </PortfolioContext>
  )
}

export function usePortfolio() {
  return useContext(PortfolioContext)
}
