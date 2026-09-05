import { createContext, useContext, useRef, type ReactNode } from 'react'
import { TOTAL_BOOK_STOPS } from '@shared/tokens/design-tokens'

interface ScrollState {
  progress: number
  velocity: number
  /** 0 = intro, 1..N = journey steps, N+1 = outro */
  activeStep: number
}

interface ScrollContextValue {
  stateRef: React.RefObject<ScrollState>
  setProgress: (progress: number, velocity: number) => void
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

/** Total "stops": cover + intro + journey steps + outro */
const TOTAL_STOPS = TOTAL_BOOK_STOPS

export function ScrollProvider({ children }: { children: ReactNode }) {
  const stateRef = useRef<ScrollState>({
    progress: 0,
    velocity: 0,
    activeStep: 0,
  })

  const setProgress = (progress: number, velocity: number) => {
    stateRef.current.progress = progress
    stateRef.current.velocity = velocity
    stateRef.current.activeStep = Math.min(
      TOTAL_STOPS - 1,
      Math.floor(progress * TOTAL_STOPS),
    )
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
