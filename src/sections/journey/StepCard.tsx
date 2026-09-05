import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { JourneyStep, StepLink, StepAward } from '@shared/types/portfolio'

interface StepCardProps {
  step: JourneyStep
  index: number
}

/* ── Inline SVG icons ── */

function IconLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function IconGithub() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  )
}

function IconPdf() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function IconVideo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function IconSlide() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function IconAward() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  )
}

function IconChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.4s cubic-bezier(.4,0,.2,1)',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const LINK_ICONS: Record<string, () => React.ReactNode> = {
  github: IconGithub,
  link: IconLink,
  pdf: IconPdf,
  video: IconVideo,
  slide: IconSlide,
}

function LinkIcon({ icon }: { icon?: string }) {
  const Comp = icon && LINK_ICONS[icon] ? LINK_ICONS[icon] : IconLink
  return <Comp />
}

/* ── Detail sub-components ── */

function DetailSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <div className="flex items-center gap-2 mb-2.5" style={{ color: 'var(--text-tertiary)' }}>
        {icon}
        <span
          className="text-[11px] uppercase tracking-[0.08em]"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function HighlightsList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-[13.5px] leading-[1.65]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          <span
            className="mt-[9px] w-[4px] h-[4px] rounded-full shrink-0"
            style={{ backgroundColor: 'var(--bullet)' }}
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

function LinksList({ items }: { items: StepLink[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[13.5px] transition-opacity duration-200 hover:opacity-60"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-body)' }}
        >
          <LinkIcon icon={link.icon} />
          {link.label}
        </a>
      ))}
    </div>
  )
}

function AwardsList({ items }: { items: StepAward[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((award, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <span className="mt-0.5 shrink-0" style={{ color: 'var(--award-color)' }}><IconAward /></span>
          <div>
            <span
              className="text-[13.5px]"
              style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-display)' }}
            >
              {award.title}
            </span>
            {(award.issuer || award.year) && (
              <span
                className="text-[12px] ml-2"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}
              >
                {[award.issuer, award.year].filter(Boolean).join(' · ')}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function CoursesList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((course) => (
        <span
          key={course}
          className="text-[11px] px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: 'var(--pill-bg)',
            color: 'var(--pill-text)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            border: '1px solid var(--pill-border)',
          }}
        >
          {course}
        </span>
      ))}
    </div>
  )
}

/* ── StepCard ── */

export function StepCard({ step, index }: StepCardProps) {
  const isEven = index % 2 === 0
  const [expanded, setExpanded] = useState(false)
  const hasDetails = step.details && (
    step.details.highlights?.length ||
    step.details.links?.length ||
    step.details.papers?.length ||
    step.details.awards?.length ||
    step.details.courses?.length ||
    step.details.responsibilities?.length
  )

  return (
    <motion.div
      className="max-w-[480px] w-full"
      style={{
        ...(isEven ? { marginRight: 'auto' } : { marginLeft: 'auto' }),
      }}
      initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* ── Card content ── */}
        <div className="relative px-8 pt-7 pb-6">
          {/* Step number + type + year */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[28px] leading-none"
              style={{
                color: 'var(--line-accent)',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontStyle: 'italic',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] uppercase tracking-[0.1em] px-2.5 py-[3px] font-medium"
                style={{
                  fontFamily: 'var(--font-sans)',
                  backgroundColor: step.type === 'education'
                    ? 'var(--badge-education-bg)'
                    : 'var(--badge-work-bg)',
                  color: step.type === 'education'
                    ? 'var(--badge-education-text)'
                    : 'var(--badge-work-text)',
                  border: '1px solid currentColor',
                  borderColor: step.type === 'education'
                    ? 'var(--badge-education-text)'
                    : 'var(--badge-work-text)',
                  opacity: 0.7,
                }}
              >
                {step.type}
              </span>
              <span
                className="text-[11px]"
                style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}
              >
                {step.year}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-[22px] leading-[1.2] mb-1.5"
            style={{
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            {step.title}
          </h3>

          {/* Institution */}
          <p
            className="text-[14px] leading-snug"
            style={{
              color: 'var(--accent)',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontStyle: 'italic',
            }}
          >
            {step.institution}
          </p>

          {/* Location */}
          <p
            className="text-[12px] mt-0.5"
            style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-sans)' }}
          >
            {step.city}, {step.country}
          </p>

          {/* Ornamental rule */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-[0.5px]" style={{ backgroundColor: 'var(--card-separator)' }} />
            <svg width="8" height="8" viewBox="0 0 8 8" style={{ color: 'var(--line-accent)' }}>
              <path d="M4 0L5 3H8L5.5 5L6.5 8L4 6L1.5 8L2.5 5L0 3H3L4 0Z" fill="currentColor" />
            </svg>
            <div className="flex-1 h-[0.5px]" style={{ backgroundColor: 'var(--card-separator)' }} />
          </div>

          {/* Description */}
          <p
            className="text-[14px] leading-[1.75]"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            {step.description}
          </p>

          {/* Skill pills */}
          <div className="flex flex-wrap gap-1.5 mt-5">
            {step.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] px-2.5 py-[3px]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  backgroundColor: 'var(--pill-bg)',
                  color: 'var(--pill-text)',
                  border: '1px solid var(--pill-border)',
                  letterSpacing: '0.01em',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* ── Expand toggle ── */}
        {hasDetails && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="relative w-full flex items-center justify-center gap-1.5 py-3 cursor-pointer transition-all duration-300"
            style={{
              borderTop: '1px solid var(--card-separator)',
              color: 'var(--text-quaternary)',
              backgroundColor: 'transparent',
            }}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            <span
              className="text-[10px] uppercase tracking-[0.1em]"
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
            >
              {expanded ? 'Less' : 'Details'}
            </span>
            <IconChevron expanded={expanded} />
          </button>
        )}

        {/* ── Expanded details ── */}
        <AnimatePresence initial={false}>
          {expanded && step.details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div
                className="px-8 pt-5 pb-7 space-y-5"
                style={{ borderTop: '1px solid var(--card-separator)' }}
              >
                {step.details.highlights && step.details.highlights.length > 0 && (
                  <DetailSection title="Highlights" icon={<span style={{ opacity: 0.3, fontSize: 10 }}>&#9679;</span>}>
                    <HighlightsList items={step.details.highlights} />
                  </DetailSection>
                )}
                {step.details.responsibilities && step.details.responsibilities.length > 0 && (
                  <DetailSection title="Responsibilities" icon={<span style={{ opacity: 0.3, fontSize: 10 }}>&#9679;</span>}>
                    <HighlightsList items={step.details.responsibilities} />
                  </DetailSection>
                )}
                {step.details.awards && step.details.awards.length > 0 && (
                  <DetailSection title="Awards" icon={<IconAward />}>
                    <AwardsList items={step.details.awards} />
                  </DetailSection>
                )}
                {step.details.courses && step.details.courses.length > 0 && (
                  <DetailSection title="Courses" icon={<span style={{ opacity: 0.3, fontSize: 10 }}>&#9670;</span>}>
                    <CoursesList items={step.details.courses} />
                  </DetailSection>
                )}
                {step.details.papers && step.details.papers.length > 0 && (
                  <DetailSection title="Papers" icon={<IconPdf />}>
                    <LinksList items={step.details.papers} />
                  </DetailSection>
                )}
                {step.details.links && step.details.links.length > 0 && (
                  <DetailSection title="Links" icon={<IconLink />}>
                    <LinksList items={step.details.links} />
                  </DetailSection>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
