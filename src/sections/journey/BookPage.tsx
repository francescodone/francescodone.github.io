import { memo } from 'react'
import type { JourneyStep, StepAward, StepImage, StepLink } from '@shared/types/portfolio'

interface BookPageProps {
  step: JourneyStep
  side: 'left' | 'right'
}

export const BookPage = memo(function BookPage({ step, side }: BookPageProps) {
  return side === 'left'
    ? <PrimaryPage step={step} />
    : <DetailsPage step={step} />
})

export const MobileJourneyPage = memo(function MobileJourneyPage({ step }: { step: JourneyStep }) {
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

        <div className="max-w-[390px] mx-auto w-full py-8">
          <p
            className="text-[9px] uppercase tracking-[0.16em] mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
          >
            {step.city}, {step.country}
          </p>
          <h2
            className="text-3xl leading-[1.06]"
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

          <div className="mt-9 pt-8 space-y-7" style={{ borderTop: '1px solid var(--card-separator)' }}>
            <DetailsContent step={step} />
          </div>
        </div>
      </div>
    </article>
  )
})

function PrimaryPage({ step }: { step: JourneyStep }) {
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

    </article>
  )
}

function DetailsPage({ step }: { step: JourneyStep }) {
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

      <div className="flex-1 max-w-[390px] mx-auto w-full py-6 space-y-5">
        <DetailsContent step={step} />
      </div>
      </div>

    </article>
  )
}

function DetailsContent({ step }: { step: JourneyStep }) {
  const highlights = [
    ...(step.details?.highlights ?? []),
    ...(step.details?.responsibilities ?? []),
  ]
  const references = [
    ...(step.details?.papers ?? []),
    ...(step.details?.links ?? []),
  ]
  const hasDetails = highlights.length > 0 || Boolean(step.details?.awards?.length) || Boolean(step.details?.courses?.length) || references.length > 0

  return (
    <>
      {highlights.length > 0 && <TextList title="Highlights" items={highlights} />}
      {step.details?.awards && step.details.awards.length > 0 && (
        <AwardsList items={step.details.awards} images={step.details.recognitionImages} />
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
      {references.length > 0 && <ReferencesList items={references} title={step.type === 'education' ? 'Projects' : 'References'} />}
      {!hasDetails && (
        <p
          className="text-[13px] leading-[1.75]"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
        >
          No additional notes for this entry.
        </p>
      )}
    </>
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
      {items.length === 1 ? (
        <p
          className="text-[12px] leading-[1.75]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {items[0]}
        </p>
      ) : (
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
      )}
    </section>
  )
}

function AwardsList({ items, images }: { items: StepAward[]; images?: StepImage[] }) {
  const sortedItems = [...items].sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0))
  const sortedImages = [...(images ?? [])].sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0))

  return (
    <section>
      <SectionTitle>Awards & Certificates</SectionTitle>
      <div className="space-y-3">
        {sortedItems.map((award) => (
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
      {sortedImages.map((image) => (
        <figure key={image.src} className="mt-5">
          <div
            className="recognition-photo relative isolate overflow-hidden"
            style={{ outline: '1px solid var(--image-outline)', boxShadow: 'var(--card-shadow)' }}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
          {image.caption && (
            <figcaption
              className="mt-2 text-[9px] italic"
              style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-body)' }}
            >
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </section>
  )
}

function ReferencesList({ items, title = 'References' }: { items: StepLink[]; title?: string }) {
  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      <div className="space-y-2">
        {items.map((link) => (
          <p
            key={`${link.label}-${link.url}`}
            className="text-[11px] leading-[1.7]"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{link.label}</strong>
            {link.description && <>{': '}{link.description}</>}
            {link.url && link.url !== '#' && (
              <>
                {' '}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-60"
                  style={{ color: 'var(--accent)' }}
                >
                  ↗
                </a>
              </>
            )}
          </p>
        ))}
      </div>
    </section>
  )
}
