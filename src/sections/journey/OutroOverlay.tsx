import { motion } from 'framer-motion'
import { usePortfolio } from '@shared/contexts/PortfolioContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function OutroOverlay() {
  const { data } = usePortfolio()
  if (!data) return null

  const { contact, projects } = data

  return (
    <motion.div
      className="flex flex-col items-center text-center px-6 max-w-2xl w-full"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.15 }}
    >
      {/* Projects header */}
      <motion.p
        variants={fadeUp}
        className="text-[10px] uppercase tracking-[0.14em] mb-6"
        style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-sans)' }}
      >
        Selected work
      </motion.p>

      {/* Projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-16">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.id}
            variants={scaleIn}
            custom={i}
            className="p-5 text-left transition-all duration-300"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <h4
              className="text-[15px] leading-snug"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              {proj.title}
            </h4>
            <p
              className="text-[12px] mt-1.5 leading-[1.65]"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              {proj.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {proj.tech.map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-2 py-0.5"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--pill-bg)',
                    color: 'var(--pill-text)',
                    border: '1px solid var(--pill-border)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            {(proj.github || proj.url) && (
              <div className="flex gap-3 mt-3">
                {proj.github && (
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] transition-opacity duration-200 hover:opacity-60"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)' }}
                  >
                    GitHub
                  </a>
                )}
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] transition-opacity duration-200 hover:opacity-60"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)' }}
                  >
                    Live
                  </a>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Ornamental separator */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
        <div className="w-8 h-[0.5px]" style={{ backgroundColor: 'var(--line-primary)' }} />
        <svg width="8" height="8" viewBox="0 0 8 8" style={{ color: 'var(--accent)', opacity: 0.4 }}>
          <path d="M4 0L5 3H8L5.5 5L6.5 8L4 6L1.5 8L2.5 5L0 3H3L4 0Z" fill="currentColor" />
        </svg>
        <div className="w-8 h-[0.5px]" style={{ backgroundColor: 'var(--line-primary)' }} />
      </motion.div>

      {/* Contact heading */}
      <motion.h2
        variants={fadeUp}
        className="text-2xl md:text-3xl"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '-0.01em',
        }}
      >
        Let&apos;s connect
      </motion.h2>
      <motion.p
        variants={fadeUp}
        className="text-[13px] mt-3 max-w-xs leading-relaxed"
        style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}
      >
        Always open to new projects, creative ideas, or a good conversation.
      </motion.p>

      {/* Social icons */}
      <motion.div variants={fadeUp} className="flex gap-2.5 mt-7">
        {contact.github && (
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--card-shadow)',
            }}
            aria-label="GitHub"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
            </svg>
          </a>
        )}
        {contact.linkedin && (
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--card-shadow)',
            }}
            aria-label="LinkedIn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--card-shadow)',
            }}
            aria-label="Email"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
        )}
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="text-[10px] mt-16"
        style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-sans)', letterSpacing: '0.02em' }}
      >
        Built with React & GSAP
      </motion.p>
    </motion.div>
  )
}
