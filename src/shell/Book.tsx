import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent } from 'react'
import { usePortfolio } from '@shared/contexts/PortfolioContext'
import { useScrollContext } from '@shared/contexts/ScrollContext'
import { BookPage } from '@sections/journey/BookPage'
import { BOOK_DRAG_SCROLL_EVENT, TOTAL_BOOK_STOPS } from '@shared/tokens/design-tokens'
import { Flourish } from '@sections/journey/EncyclopediaIllustrations'

const TOTAL_STOPS = TOTAL_BOOK_STOPS

interface BookSpread {
  key: string
  left: ReactNode
  right: ReactNode
}

/**
 * Open-book with 3D page-turn animation driven by scroll.
 *
 * Model:  N spreads → N-1 "leaves" that fold from right to left.
 * Each leaf has:
 *   • front face  = right-page content of spread i
 *   • back face   = left-page content of spread i+1
 *
 * Static base underneath:
 *   • left  = left page of spread 0  (always visible on far left)
 *   • right = right page of last spread (always visible on far right)
 */
export function Book() {
  const { data } = usePortfolio()
  const { stateRef } = useScrollContext()

  /* continuousPage: e.g. 2.35 = 35% through the turn from spread 2 → 3 */
  const [continuousPage, setContinuousPage] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches)
  const dragRef = useRef({ pointerId: -1, startX: 0, startY: 0, startScroll: 0, axis: 'pending' as 'pending' | 'horizontal' | 'vertical' })

  useEffect(() => {
    let raf: number
    const tick = () => {
      const p = stateRef.current.progress
      setContinuousPage(p * TOTAL_STOPS)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stateRef])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const updateLayout = () => setIsMobile(media.matches)
    media.addEventListener('change', updateLayout)
    return () => media.removeEventListener('change', updateLayout)
  }, [])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as Element).closest('a, button')) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: window.scrollY,
      axis: 'pending',
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    if (event.pointerType === 'mouse') event.preventDefault()
    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    const dragDistance = dragRef.current.startX - event.clientX
    const verticalDistance = dragRef.current.startY - event.clientY
    if (Math.abs(dragDistance) < 3 && Math.abs(verticalDistance) < 3) return
    if (dragRef.current.axis === 'pending') {
      dragRef.current.axis = Math.abs(dragDistance) > Math.abs(verticalDistance) ? 'horizontal' : 'vertical'
    }
    if (dragRef.current.axis === 'vertical') return

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const pageWidth = event.currentTarget.getBoundingClientRect().width / (isMobile ? 1 : 2)
    const scrollPerPage = maxScroll / TOTAL_STOPS
    const target = Math.min(
      maxScroll,
      Math.max(0, dragRef.current.startScroll + (dragDistance / pageWidth) * scrollPerPage),
    )

    event.preventDefault()
    window.dispatchEvent(new CustomEvent(BOOK_DRAG_SCROLL_EVENT, { detail: { target } }))
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current.pointerId = -1
    setIsDragging(false)
  }

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const page = (event.target as Element).closest<HTMLElement>('[data-book-scroll]')
    if (!page || event.deltaY === 0) return

    const maxScroll = page.scrollHeight - page.clientHeight
    const canScroll = event.deltaY > 0
      ? page.scrollTop < maxScroll - 1
      : page.scrollTop > 1

    if (maxScroll > 1 && canScroll) event.stopPropagation()
  }

  if (!data) return null

  /* ── Build spread content ── */
  const spreads: BookSpread[] = []

  /* Spread 0 — Cover (closed book) */
  spreads.push({
    key: 'cover',
    left: null,
    right: <FrontCover name={data.personal.name} tagline={data.personal.tagline} />,
  })

  spreads.push({
    key: 'chapter-autobiography',
    left: null,
    right: <ChapterPage number="1" title="Autobiography" description="A short account of the places, choices, and curiosity that shaped the chapters that follow." />,
  })

  spreads.push({
    key: 'autobiography',
    left: <AutobiographyPage title="Across borders" text={data.personal.autobiography[0]} side="left" />,
    right: <AutobiographyPage title="A constant curiosity" text={data.personal.autobiography[1]} side="right" />,
  })

  const workSteps = data.journey
    .filter((step) => step.type === 'work')
    .sort((a, b) => getStartYear(b.year) - getStartYear(a.year))
  const academicSteps = data.journey
    .filter((step) => step.type === 'education')
    .sort((a, b) => getStartYear(b.year) - getStartYear(a.year))
  let journeyIndex = 0

  spreads.push({
    key: 'chapter-work',
    left: null,
    right: <ChapterPage number="2" title="Professional Journey" description="Professional practice, engineering craft, architecture, and leadership — newest first." />,
  })

  workSteps.forEach((step) => {
    spreads.push({
      key: step.id,
      left: <BookPage step={step} index={journeyIndex} side="left" />,
      right: <BookPage step={step} index={journeyIndex} side="right" />,
    })
    journeyIndex += 1
  })

  spreads.push({
    key: 'chapter-academic',
    left: null,
    right: <ChapterPage number="3" title="Education" description="Degrees, research, exchange, and the foundations behind the work." />,
  })

  academicSteps.forEach((step) => {
    spreads.push({
      key: step.id,
      left: <BookPage step={step} index={journeyIndex} side="left" />,
      right: <BookPage step={step} index={journeyIndex} side="right" />,
    })
    journeyIndex += 1
  })

  spreads.push({
    key: 'chapter-misc',
    left: null,
    right: <ChapterPage number="4" title="Beyond Work" description="Movement, places, ideas, languages, and books worth sharing." />,
  })

  spreads.push({
    key: 'misc',
    left: <MiscPage side="left" />,
    right: <MiscPage side="right" />,
  })

  spreads.push({
    key: 'contact',
    left: null,
    right: <ContactPage contact={data.contact} />,
  })

  const numLeaves = spreads.length - 1 // N-1 leaves for N spreads

  /* Cover opening progress: 0 = closed, 1 = fully open */
  const coverProgress = Math.min(1, Math.max(0, continuousPage))
  const coverSlideProgress = coverProgress * coverProgress * (3 - 2 * coverProgress)

  if (isMobile) {
    return (
      <MobileBook
        spreads={spreads}
        continuousPage={continuousPage}
        isDragging={isDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerEnd={handlePointerEnd}
        onWheel={handleWheel}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ perspective: '2400px' }}
    >
      {/* Book container */}
      <div
        className="relative"
        role="region"
        aria-label="Interactive book. Drag left or right to turn pages."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
        onWheel={handleWheel}
        style={{
          width: 'min(92vw, 1100px)',
          height: 'min(80vh, 720px)',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
          userSelect: isDragging ? 'none' : undefined,
          transform: `translateX(${-25 * (1 - coverSlideProgress)}%)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── Book shadow on "table" ── */}
        <div
          className="absolute -bottom-4 right-4 h-8 rounded-[50%]"
          style={{
            left: `calc(${50 * (1 - coverSlideProgress)}% + 4px)`,
            background: 'radial-gradient(ellipse, rgba(42,37,32,0.15) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />

        {/* ── Static base: left page of first spread (back cover) ── */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: 0,
            width: '50%',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            borderRight: 'none',
            borderRadius: '3px 0 0 3px',
            zIndex: 0,
            opacity: 0,
            overflow: 'hidden',
          }}
        >
          <div className="h-full overflow-y-auto" data-book-scroll data-spread-index={0} data-page-side="left">
            {spreads[0].left}
          </div>
          <div
            className="absolute top-0 right-0 bottom-0 w-6 pointer-events-none"
            style={{ background: 'linear-gradient(to left, rgba(42,37,32,0.05), transparent)' }}
          />
        </div>

        {/* ── Static base: right page of last spread ── */}
        <PageSurface side="right" spreadIndex={spreads.length - 1}>
          {spreads[spreads.length - 1].right}
        </PageSurface>

        {/* ── Page-edge stacks ── */}
        <PageEdgeStack
          side="left"
          count={Math.min(5, Math.floor(continuousPage))}
        />
        <PageEdgeStack
          side="right"
          count={Math.min(5, numLeaves - Math.floor(continuousPage))}
        />

        {/* ── Turning leaves ── */}
        {Array.from({ length: numLeaves }).map((_, i) => {
          const leafProgress = getLeafProgress(i, continuousPage)
          const angle = -180 * leafProgress // 0° → -180°

          /* Z-ordering:
             - Unturned leaves (progress ≈ 0): first to turn on top → z = numLeaves - i
             - Turned leaves (progress ≈ 1): most recent on top  → z = i
             - Currently turning: highest z */
          const isTurning = leafProgress > 0 && leafProgress < 1
          let zIndex: number
          if (isTurning) {
            zIndex = numLeaves + 1
          } else if (leafProgress >= 1) {
            zIndex = i + 1
          } else {
            zIndex = numLeaves - i
          }

          return (
            <div
              key={`leaf-${i}`}
              className="absolute top-0 bottom-0"
              style={{
                right: 0,
                width: '50%',
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${angle}deg)`,
                zIndex,
                transition: isTurning ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              {/* Front face — right page of spread i */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  backgroundColor: 'var(--card-bg)',
                  borderRadius: '0 3px 3px 0',
                  border: '1px solid var(--card-border)',
                  borderLeft: 'none',
                }}
              >
                <div className="h-full overflow-y-auto" data-book-scroll data-spread-index={i} data-page-side="right">
                  {spreads[i].right}
                </div>
                {/* Gutter shadow */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-8 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to right, rgba(42,37,32,0.05), transparent)',
                  }}
                />
                {/* Fold shadow — darkens as page lifts */}
                {isTurning && leafProgress < 0.5 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to left, rgba(42,37,32,${0.12 * leafProgress * 2}) 0%, transparent 60%)`,
                    }}
                  />
                )}
              </div>

              {/* Back face — left page of spread i+1 */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: 'var(--card-bg)',
                  borderRadius: '3px 0 0 3px',
                  border: '1px solid var(--card-border)',
                  borderRight: 'none',
                }}
              >
                <div className="h-full overflow-y-auto" data-book-scroll data-spread-index={i + 1} data-page-side="left">
                  {spreads[i + 1].left}
                </div>
                {/* Gutter shadow */}
                <div
                  className="absolute top-0 right-0 bottom-0 w-8 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to left, rgba(42,37,32,0.05), transparent)',
                  }}
                />
                {/* Fold shadow — darkens as page lands */}
                {isTurning && leafProgress > 0.5 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, rgba(42,37,32,${0.12 * (1 - leafProgress) * 2}) 0%, transparent 60%)`,
                    }}
                  />
                )}
              </div>

              {/* Cast shadow on the page underneath while turning */}
              {isTurning && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: 0,
                    bottom: 0,
                    /* Shadow falls on the side the page is moving away from */
                    ...(leafProgress < 0.5
                      ? { left: '100%', width: '30px' }
                      : { right: '100%', width: '30px' }),
                    background: leafProgress < 0.5
                      ? `linear-gradient(to right, rgba(42,37,32,${0.08 * (1 - leafProgress * 2)}), transparent)`
                      : `linear-gradient(to left, rgba(42,37,32,${0.08 * ((leafProgress - 0.5) * 2)}), transparent)`,
                    transformStyle: 'flat',
                    transform: leafProgress < 0.5 ? 'none' : 'rotateY(180deg)',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface MobileBookProps {
  spreads: BookSpread[]
  continuousPage: number
  isDragging: boolean
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerEnd: (event: ReactPointerEvent<HTMLDivElement>) => void
  onWheel: (event: ReactWheelEvent<HTMLDivElement>) => void
}

function MobileBook({ spreads, continuousPage, isDragging, onPointerDown, onPointerMove, onPointerEnd, onWheel }: MobileBookProps) {
  const numLeaves = spreads.length - 1
  const lastIndex = spreads.length - 1

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ perspective: '1800px', paddingTop: '20px' }}>
      <div
        className="relative"
        role="region"
        aria-label="Interactive book. Drag left or right to turn pages."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onLostPointerCapture={onPointerEnd}
        onWheel={onWheel}
        style={{
          width: 'min(90vw, 460px)',
          height: 'min(72dvh, 620px)',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
          userSelect: isDragging ? 'none' : undefined,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute -bottom-3 left-3 right-3 h-7 rounded-[50%]"
          style={{ background: 'radial-gradient(ellipse, rgba(42,37,32,0.18) 0%, transparent 70%)', filter: 'blur(7px)' }}
        />

        <div
          className="absolute inset-0 overflow-hidden rounded-[4px]"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', zIndex: 0 }}
        >
          <div className="h-full overflow-y-auto" data-book-scroll data-spread-index={lastIndex} data-page-side="mobile">
            {spreads[lastIndex].left}
            {spreads[lastIndex].right}
          </div>
        </div>

        {Array.from({ length: numLeaves }).map((_, index) => {
          const leafProgress = getLeafProgress(index, continuousPage)
          const isTurning = leafProgress > 0 && leafProgress < 1
          const zIndex = isTurning
            ? numLeaves + 1
            : leafProgress >= 1
              ? index + 1
              : numLeaves - index

          return (
            <div
              key={`mobile-leaf-${index}`}
              className="absolute inset-0"
              style={{
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${-180 * leafProgress}deg)`,
                pointerEvents: leafProgress >= 1 ? 'none' : 'auto',
                zIndex,
                transition: isTurning ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <div
                className="absolute inset-0 overflow-hidden rounded-[4px]"
                style={{
                  backfaceVisibility: 'hidden',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: isTurning ? '10px 4px 24px rgba(42,37,32,0.12)' : 'var(--card-shadow)',
                }}
              >
                <div className="h-full overflow-y-auto" data-book-scroll data-spread-index={index} data-page-side="mobile">
                  {spreads[index].left}
                  {spreads[index].right}
                </div>
                <div
                  className="absolute inset-y-0 left-0 w-6 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, rgba(42,37,32,0.06), transparent)' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Derive how far a leaf has turned (0 = unturned, 1 = fully turned).
 * The turn occupies the scroll span of one "stop".
 */
function getLeafProgress(leafIndex: number, continuousPage: number): number {
  /* Leaf i turns as continuousPage goes from i to i+1 */
  if (continuousPage <= leafIndex) return 0
  if (continuousPage >= leafIndex + 1) return 1
  return continuousPage - leafIndex
}

/* ════════════════════════════════════════════
   PAGE SURFACE — static base page
   ════════════════════════════════════════════ */

function PageSurface({ side, spreadIndex, children }: { side: 'left' | 'right'; spreadIndex: number; children: ReactNode }) {
  return (
    <div
      className="absolute top-0 bottom-0"
      style={{
        ...(side === 'left'
          ? { left: 0, width: '50%', borderRadius: '3px 0 0 3px' }
          : { right: 0, width: '50%', borderRadius: '0 3px 3px 0' }),
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        ...(side === 'left' ? { borderRight: 'none' } : { borderLeft: 'none' }),
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <div className="h-full overflow-y-auto" data-book-scroll data-spread-index={spreadIndex} data-page-side={side}>
        {children}
      </div>
      {/* Gutter shadow near spine */}
      <div
        className="absolute top-0 bottom-0 w-6 pointer-events-none"
        style={{
          ...(side === 'left' ? { right: 0 } : { left: 0 }),
          background: side === 'left'
            ? 'linear-gradient(to left, rgba(42,37,32,0.05), transparent)'
            : 'linear-gradient(to right, rgba(42,37,32,0.05), transparent)',
        }}
      />
    </div>
  )
}

/* ════════════════════════════════════════════
   PAGE EDGE STACK — visible paper thickness
   ════════════════════════════════════════════ */

function PageEdgeStack({ side, count }: { side: 'left' | 'right'; count: number }) {
  const edges = Math.min(count, 5)
  if (edges <= 0) return null

  return (
    <>
      {Array.from({ length: edges }).map((_, i) => {
        const offset = (i + 1) * 1.2
        return (
          <div
            key={`edge-${side}-${i}`}
            className="absolute pointer-events-none"
            style={{
              top: offset,
              bottom: offset,
              ...(side === 'left'
                ? { left: 0, width: '50%', borderRadius: '3px 0 0 3px' }
                : { right: 0, width: '50%', borderRadius: '0 3px 3px 0' }),
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              opacity: 0.35 + (i / edges) * 0.35,
              zIndex: -1 - i,
            }}
          />
        )
      })}
    </>
  )
}

function AutobiographyPage({ title, text, side }: { title: string; text: string; side: 'left' | 'right' }) {
  return (
    <article className="h-full relative">
      <div className="h-full flex items-center justify-center p-10 overflow-y-auto" data-book-scroll>
      <div className="w-full max-w-[360px]">
        <p
          className="text-[9px] uppercase tracking-[0.18em] mb-5"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
        >
          Chapter 1 · Autobiography
        </p>
        <h2
          className="text-3xl md:text-4xl leading-[1.06]"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.045em' }}
        >
          {title}
        </h2>
        <p
          className="text-[13px] leading-[1.8] mt-7"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {text}
        </p>
      </div>
      </div>
      <PageNumber side={side} number={side === 'left' ? 'auto · i' : 'auto · ii'} />
    </article>
  )
}

function ChapterPage({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="h-full flex items-center justify-center p-10">
      <div className="w-full max-w-[360px]">
        <h1
          className="text-4xl md:text-5xl leading-[1.04]"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            letterSpacing: '-0.05em',
          }}
        >
          Chapter {number}:<br />{title}
        </h1>
        <p
          className="text-[13px] leading-[1.75] mt-7 max-w-[300px]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

function MiscPage({ side }: { side: 'left' | 'right' }) {
  const entries = side === 'left'
    ? [
        ['Sport & movement', 'Practice, endurance, and the value of staying in motion.'],
        ['Travel & places', 'Observations gathered across cities, cultures, and changing perspectives.'],
        ['Mindset', 'Principles for learning, building, collaborating, and handling uncertainty.'],
      ]
    : [
        ['Bookshelf', 'Books, essays, and references that are worth recommending.'],
        ['Languages', 'Language learning as a tool for connection and cultural understanding.'],
        ['Curiosities', 'Experiments, interests, and ideas that do not belong in a résumé.'],
      ]

  return (
    <div className="h-full relative">
      <div className="h-full flex flex-col p-9 overflow-y-auto" data-book-scroll>
      <div className="text-center">
        <p
          className="text-[8px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
        >
          Chapter 4 · Field notes
        </p>
        <div className="mt-2">
          <Flourish width={190} className="mx-auto" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {entries.map(([title, description], index) => (
          <div
            key={title}
            className="py-5"
            style={{ borderTop: '1px dotted var(--border-pattern)' }}
          >
            <div className="flex items-baseline gap-3">
              <span
                className="text-[9px]"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
              >
                {String(index + 1 + (side === 'right' ? 3 : 0)).padStart(2, '0')}
              </span>
              <h2
                className="text-[18px]"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.03em' }}
              >
                {title}
              </h2>
            </div>
            <p
              className="text-[11px] leading-[1.65] mt-2 pl-8"
              style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}
            >
              {description}
            </p>
          </div>
        ))}
        <div style={{ borderTop: '1px dotted var(--border-pattern)' }} />
      </div>
      </div>
      <PageNumber side={side} number={side === 'left' ? 'misc · i' : 'misc · ii'} />
    </div>
  )
}

function getStartYear(year: string): number {
  return Number(year.match(/\d{4}/)?.[0] ?? 0)
}

/* ════════════════════════════════════════
   CONTACT PAGE
   ════════════════════════════════════════ */

function ContactPage({ contact }: { contact: { email: string; github: string; linkedin: string } }) {
  return (
    <div className="h-full relative">
      <div className="h-full flex flex-col items-center justify-center p-10 text-center overflow-y-auto" data-book-scroll>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[0.5px]" style={{ backgroundColor: 'var(--line-primary)' }} />
        <svg width="8" height="8" viewBox="0 0 8 8" style={{ color: 'var(--accent)', opacity: 0.4 }}>
          <path d="M4 0L5 3H8L5.5 5L6.5 8L4 6L1.5 8L2.5 5L0 3H3L4 0Z" fill="currentColor" />
        </svg>
        <div className="w-8 h-[0.5px]" style={{ backgroundColor: 'var(--line-primary)' }} />
      </div>

      <h2 className="text-2xl md:text-3xl" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic' }}>
        Let&apos;s connect
      </h2>
      <p className="text-[12px] mt-3 max-w-xs leading-relaxed" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
        Always open to new projects, creative ideas, or a good conversation.
      </p>

      <div className="flex gap-3 mt-6">
        {contact.github && (
          <a href={contact.github} target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }} aria-label="GitHub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
            </svg>
          </a>
        )}
        {contact.linkedin && (
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }} aria-label="LinkedIn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }} aria-label="Email">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
        )}
      </div>

      <p className="text-[9px] mt-12" style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-sans)', letterSpacing: '0.02em' }}>
        Built with React & GSAP
      </p>
      </div>
      <PageNumber side="right" number="fin" />
    </div>
  )
}

/* ════════════════════════════════════════
   PAGE NUMBER
   ════════════════════════════════════════ */

function PageNumber({ side, number }: { side: 'left' | 'right'; number: string | number }) {
  return (
    <span
      className={`absolute bottom-4 z-10 pointer-events-none ${side === 'left' ? 'left-6' : 'right-6'} text-[9px]`}
      style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
    >
      {number}
    </span>
  )
}

/* ════════════════════════════════════════
   FRONT COVER — external book cover
   ════════════════════════════════════════ */

function FrontCover({ name, tagline }: { name: string; tagline: string }) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #5c5940 0%, #4a4735 40%, #3d3b2c 100%)',
        borderRadius: '0 4px 4px 0',
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(0,0,0,0.08) 0%, transparent 50%)`,
        }}
      />
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Outer border frame ── */}
      <div
        className="absolute inset-[10px]"
        style={{ border: '2px solid rgba(212,200,170,0.25)', borderRadius: '2px' }}
      />
      <div
        className="absolute inset-[14px]"
        style={{ border: '1px solid rgba(212,200,170,0.12)', borderRadius: '1px' }}
      />

      {/* ── Corner ornaments ── */}
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
        <div
          key={corner}
          className="absolute"
          style={{
            ...(corner.includes('top') ? { top: 18 } : { bottom: 18 }),
            ...(corner.includes('left') ? { left: 18 } : { right: 18 }),
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(212,200,170,0.3)" strokeWidth="1" strokeLinecap="round">
            <path d={
              corner === 'top-left' ? 'M0 12 C4 12, 8 8, 8 4 M0 8 C4 8, 4 4, 4 0 M12 0 C12 4, 8 8, 4 8' :
              corner === 'top-right' ? 'M24 12 C20 12, 16 8, 16 4 M24 8 C20 8, 20 4, 20 0 M12 0 C12 4, 16 8, 20 8' :
              corner === 'bottom-left' ? 'M0 12 C4 12, 8 16, 8 20 M0 16 C4 16, 4 20, 4 24 M12 24 C12 20, 8 16, 4 16' :
              'M24 12 C20 12, 16 16, 16 20 M24 16 C20 16, 20 20, 20 24 M12 24 C12 20, 16 16, 20 16'
            } />
          </svg>
        </div>
      ))}

      {/* ── Center content ── */}
      <div className="relative z-10 flex flex-col items-center px-8 max-w-[380px]">
        {/* Top rule */}
        <svg width="120" height="3" viewBox="0 0 120 3" className="mb-6">
          <line x1="0" y1="1.5" x2="120" y2="1.5" stroke="rgba(212,200,170,0.3)" strokeWidth="0.5" />
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={i * 4 + 2} cy="1.5" r="0.4" fill="rgba(212,200,170,0.25)" />
          ))}
        </svg>

        {/* Name in blackletter */}
        <h1
          className="text-3xl md:text-4xl leading-[1.1] text-center"
          style={{
            color: 'rgba(232,225,200,0.9)',
            fontFamily: 'var(--font-blackletter)',
            fontWeight: 500,
            letterSpacing: '-0.045em',
            textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          {name}
        </h1>

        {/* Flourish */}
        <svg width="180" height="16" viewBox="0 0 180 16" className="my-4" fill="none" stroke="rgba(212,200,170,0.3)" strokeWidth="0.6" strokeLinecap="round">
          <path d="M90 8 C86 3, 78 1, 74 5 C70 9, 74 13, 80 11 C84 10, 86 8, 90 8" />
          <path d="M90 8 C94 3, 102 1, 106 5 C110 9, 106 13, 100 11 C96 10, 94 8, 90 8" />
          <path d="M74 6 C64 3, 50 2, 36 4 C26 6, 18 10, 10 8" />
          <path d="M106 6 C116 3, 130 2, 144 4 C154 6, 162 10, 170 8" />
          <circle cx="90" cy="8" r="1" fill="rgba(212,200,170,0.3)" />
        </svg>

        {/* Subtitle */}
        <p
          className="text-[9px] uppercase tracking-[0.22em] mb-4"
          style={{
            color: 'rgba(212,200,170,0.5)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
          }}
        >
          A Personal Encyclopedia
        </p>

        {/* Tagline */}
        <p
          className="text-[11px] leading-[1.8] text-center"
          style={{
            color: 'rgba(212,200,170,0.45)',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
          }}
        >
          {tagline}
        </p>

        {/* Bottom rule */}
        <svg width="120" height="3" viewBox="0 0 120 3" className="mt-6">
          <line x1="0" y1="1.5" x2="120" y2="1.5" stroke="rgba(212,200,170,0.3)" strokeWidth="0.5" />
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={i * 4 + 2} cy="1.5" r="0.4" fill="rgba(212,200,170,0.25)" />
          ))}
        </svg>
        <p
          className="text-[8px] uppercase tracking-[0.16em] mt-4"
          style={{ color: 'rgba(232,225,200,0.58)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}
        >
          Drag or scroll to open
        </p>
        <svg
          width="16"
          height="26"
          viewBox="0 0 16 26"
          fill="none"
          className="cover-scroll-indicator mt-3"
          style={{ color: 'rgba(232,225,200,0.5)' }}
          aria-hidden="true"
        >
          <rect x="0.75" y="0.75" width="14.5" height="24.5" rx="7.25" stroke="currentColor" strokeWidth="1" />
          <circle className="cover-scroll-dot" cx="8" cy="7" r="1.25" fill="currentColor" />
        </svg>
      </div>

    </div>
  )
}
