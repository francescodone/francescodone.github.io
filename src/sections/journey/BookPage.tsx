import type { JourneyStep, StepAward, StepLink } from '@shared/types/portfolio'

interface BookPageProps {
  step: JourneyStep
  index: number
  side: 'left' | 'right'
}

export function BookPage({ step, index, side }: BookPageProps) {
  return side === 'left'
    ? <PrimaryPage step={step} pageNumber={index * 2 + 1} />
    : <DetailsPage step={step} pageNumber={index * 2 + 2} />
}

function PrimaryPage({ step, pageNumber }: { step: JourneyStep; pageNumber: number }) {
  return (
    <article className="h-full relative">
      <div className="h-full flex flex-col px-10 py-9 overflow-y-auto" data-book-scroll>
      <header className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--card-separator)' }}>
        <span
          className="text-[8px] uppercase tracking-[0.18em]"
          style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
        >
          {step.type}
        </span>
        <span
          className="text-[9px]"
          style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}
        >
          {step.year}
        </span>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-[390px] mx-auto w-full py-8">
        <p
          className="text-[9px] uppercase tracking-[0.16em] mb-4"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
        >
          {step.city}, {step.country}
        </p>
        <h2
          className="text-3xl md:text-4xl leading-[1.06]"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            letterSpacing: '-0.045em',
          }}
        >
          {step.title}
        </h2>
        <p
          className="text-[13px] mt-3"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
        >
          {step.institution}
        </p>
        <p
          className="text-[13px] leading-[1.75] mt-7"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {step.description}
        </p>
        {step.quote && (
          <p
            className="text-[12px] leading-[1.65] mt-5 italic"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}
          >
            “{step.quote}”
          </p>
        )}
        <p
          className="text-[9px] leading-[1.8] mt-7 uppercase tracking-[0.08em]"
          style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-sans)' }}
        >
          {step.skills.join(' · ')}
        </p>
      </div>
      </div>

      <PageNumber side="left" number={pageNumber} />
    </article>
  )
}

function DetailsPage({ step, pageNumber }: { step: JourneyStep; pageNumber: number }) {
  const highlights = [
    ...(step.details?.highlights ?? []),
    ...(step.details?.responsibilities ?? []),
  ]
  const references = [
    ...(step.details?.papers ?? []),
    ...(step.details?.links ?? []),
  ]

  return (
    <article className="h-full relative">
      <div className="h-full flex flex-col px-10 py-9 overflow-y-auto" data-book-scroll>
      <header className="pb-3" style={{ borderBottom: '1px solid var(--card-separator)' }}>
        <p
          className="text-[8px] uppercase tracking-[0.18em]"
          style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
        >
          {step.institution} · Notes
        </p>
      </header>

      <div className="flex-1 max-w-[390px] mx-auto w-full py-8 space-y-7">
        {highlights.length > 0 && <TextList title="Highlights" items={highlights} />}
        {step.details?.awards && step.details.awards.length > 0 && (
          <AwardsList items={step.details.awards} />
        )}
        {step.details?.courses && step.details.courses.length > 0 && (
          <section>
            <SectionTitle>Selected study</SectionTitle>
            <p
              className="text-[12px] leading-[1.75]"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              {step.details.courses.join(' · ')}
            </p>
          </section>
        )}
        {references.length > 0 && <ReferencesList items={references} />}
        {highlights.length === 0 && !step.details?.awards?.length && !step.details?.courses?.length && references.length === 0 && (
          <p
            className="text-[13px] leading-[1.75]"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
          >
            No additional notes for this entry.
          </p>
        )}
      </div>
      </div>

      <PageNumber side="right" number={pageNumber} />
    </article>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h3
      className="text-[10px] uppercase tracking-[0.16em] mb-3"
      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
    >
      {children}
    </h3>
  )
}

function TextList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-[12px] leading-[1.65] pl-4 relative"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            <span className="absolute left-0">—</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

function AwardsList({ items }: { items: StepAward[] }) {
  return (
    <section>
      <SectionTitle>Recognition</SectionTitle>
      <div className="space-y-3">
        {items.map((award) => (
          <p
            key={`${award.title}-${award.year ?? ''}`}
            className="text-[12px] leading-[1.55]"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{award.title}</span>
            {(award.issuer || award.year) && (
              <span style={{ color: 'var(--text-tertiary)' }}>
                {' — '}{[award.issuer, award.year].filter(Boolean).join(', ')}
              </span>
            )}
          </p>
        ))}
      </div>
    </section>
  )
}

function ReferencesList({ items }: { items: StepLink[] }) {
  return (
    <section>
      <SectionTitle>References</SectionTitle>
      <div className="space-y-2">
        {items.map((link) => (
          <a
            key={`${link.label}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[12px] leading-[1.55] transition-opacity hover:opacity-60"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-body)' }}
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}

function PageNumber({ side, number }: { side: 'left' | 'right'; number: number }) {
  return (
    <span
      className={`absolute bottom-4 z-10 pointer-events-none ${side === 'left' ? 'left-6' : 'right-6'} text-[9px]`}
      style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
    >
      {number}
    </span>
  )
}
