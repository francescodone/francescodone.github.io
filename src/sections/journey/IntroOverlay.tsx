import { useRef } from 'react'
import { motion } from 'framer-motion'
import { usePortfolio } from '@shared/contexts/PortfolioContext'

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function IntroOverlay() {
  const { data } = usePortfolio()
  const hasPlayed = useRef(false)

  if (!data) return null

  const delay = hasPlayed.current ? 0.05 : 1.8
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2, delayChildren: delay },
    },
  }

  return (
    <motion.div
      className="flex flex-col items-center text-center px-6 max-w-3xl"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      onAnimationComplete={() => { hasPlayed.current = true }}
    >
      {/* Name */}
      <motion.h1
        variants={fadeUp}
        className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05]"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          fontStyle: 'italic',
        }}
      >
        {data.personal.name}
      </motion.h1>

      {/* Ornamental separator */}
      <motion.div variants={fadeUp} className="flex items-center gap-4 mt-7 mb-6">
        <div className="w-12 h-[0.5px]" style={{ backgroundColor: 'var(--line-primary)' }} />
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ color: 'var(--accent)', opacity: 0.5 }}>
          <path d="M6 0L7.5 4.5H12L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5H4.5L6 0Z" fill="currentColor" />
        </svg>
        <div className="w-12 h-[0.5px]" style={{ backgroundColor: 'var(--line-primary)' }} />
      </motion.div>

      {/* Tagline */}
      <motion.p
        variants={fadeUp}
        className="text-base md:text-lg leading-relaxed max-w-lg"
        style={{
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          lineHeight: 1.7,
        }}
      >
        {data.personal.tagline}
      </motion.p>
    </motion.div>
  )
}
