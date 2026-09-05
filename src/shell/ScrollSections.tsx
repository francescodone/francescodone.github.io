import { usePortfolio } from '@shared/contexts/PortfolioContext'
import { IntroOverlay } from '@sections/journey/IntroOverlay'
import { StepCard } from '@sections/journey/StepCard'
import { OutroOverlay } from '@sections/journey/OutroOverlay'
// EncyclopediaIllustrations moved to BookPage

/* ── Decorative vertical timeline connector ── */
function TimelineConnector() {
  return (
    <div
      className="absolute left-1/2 top-0 bottom-0 w-[0.5px] -translate-x-1/2 pointer-events-none"
      style={{ backgroundColor: 'var(--line-secondary)' }}
    />
  )
}

/* ── Ornamental dot on the timeline ── */
function TimelineDot() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{
          backgroundColor: 'var(--dot-color)',
          transition: 'background-color 0.4s ease',
        }}
      />
    </div>
  )
}

export function ScrollSections() {
  const { data } = usePortfolio()
  return (
    <div className="relative">
      {/* Encyclopedia illustrations now in BookPage */}

      {/* Vertical timeline line */}
      <div className="hidden md:block">
        <TimelineConnector />
      </div>

      {/* Intro */}
      <section className="h-[100vh] relative flex items-center justify-center">
        <IntroOverlay />
      </section>

      {/* Journey steps */}
      {data?.journey.map((step, i) => (
        <section
          key={step.id}
          className="h-[100vh] relative flex items-center px-8 md:px-16"
        >
          <div className="hidden md:block">
            <TimelineDot />
          </div>
          <StepCard step={step} index={i} />
        </section>
      ))}

      {/* Outro / Contact */}
      <section className="h-[100vh] relative flex items-center justify-center py-20">
        <OutroOverlay />
      </section>
    </div>
  )
}
