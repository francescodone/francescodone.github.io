import { createContext, useContext, useRef, type ReactNode } from 'react'

interface ScrollState {
  progress: number
  velocity: number
}

interface ScrollContextValue {
  stateRef: React.RefObject<ScrollState>
  setProgress: (progress: number, velocity: number) => void
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const stateRef = useRef<ScrollState>({
    progress: 0,
    velocity: 0,
  })

  const setProgress = (progress: number, velocity: number) => {
    stateRef.current.progress = progress
    stateRef.current.velocity = velocity
  }

  return (
    <ScrollContext value={{ stateRef, setProgress }}>
      {children}
    </ScrollContext>
  )
}

export function useScrollContext() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScrollContext must be used within ScrollProvider')
  return ctx
}
