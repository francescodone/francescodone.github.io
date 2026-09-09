import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LOADING_COMPLETE_EVENT } from '@shared/tokens/design-tokens'

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setVisible(false), 500)
          return 100
        }
        return prev + Math.random() * 10 + 3
      })
    }, 120)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence onExitComplete={() => {
      document.documentElement.dataset.loadingComplete = 'true'
      window.dispatchEvent(new Event(LOADING_COMPLETE_EVENT))
    }}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--bg)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative select-none"
          >
            {/* Unfilled text (background layer) */}
            <span
              className="text-[28px] tracking-[0.04em]"
              style={{
                color: 'var(--card-border)',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontStyle: 'italic',
              }}
              aria-hidden="true"
            >
              Francesco Done&apos;
            </span>
            {/* Filled text (clipped to progress) */}
            <span
              className="absolute inset-0 text-[28px] tracking-[0.04em]"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontStyle: 'italic',
                clipPath: `inset(0 ${100 - Math.min(progress, 100)}% 0 0)`,
                transition: 'clip-path 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
              aria-label="Loading"
            >
              Francesco Done&apos;
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
