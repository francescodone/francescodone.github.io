import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollContext } from '@shared/contexts/ScrollContext'
import { usePortfolio } from '@shared/contexts/PortfolioContext'
import { useTheme, type ThemeMode } from '@shared/contexts/ThemeContext'
import { BOOK_DRAG_SCROLL_EVENT, TOTAL_BOOK_STOPS } from '@shared/tokens/design-tokens'
import type { JourneyStep } from '@shared/types/portfolio'

const TOTAL_STOPS = TOTAL_BOOK_STOPS

const THEME_CYCLE: ThemeMode[] = ['light', 'dark', 'system']
const FONT_SCALE_STEPS = [0.875, 1, 1.125, 1.25]
const FONT_SCALE_STORAGE_KEY = 'portfolio-font-scale'
const SEARCH_QUERY_STORAGE_KEY = 'portfolio-search-query'

function getInitialFontScale(): number {
  if (typeof window === 'undefined') return 1
  const stored = Number(localStorage.getItem(FONT_SCALE_STORAGE_KEY))
  return FONT_SCALE_STEPS.some((step) => step === stored) ? stored : 1
}

function getInitialSearchQuery(): string {
  if (typeof window === 'undefined') return ''
  return (localStorage.getItem(SEARCH_QUERY_STORAGE_KEY) ?? '').slice(0, 80)
}

function getStartYear(year: string): number {
  return Number(year.match(/\d{4}/)?.[0] ?? 0)
}

function getJourneySearchContent(step: JourneyStep): string {
  const details = step.details
  return [
    step.type,
    step.year,
    step.city,
    step.country,
    step.title,
    step.institution,
    step.description,
    step.quote,
    ...step.skills,
    ...(details?.highlights ?? []),
    ...(details?.responsibilities ?? []),
    ...(details?.awards?.flatMap((award) => [award.title, award.issuer, award.year]) ?? []),
    ...(details?.courses ?? []),
    ...(details?.papers?.map((link) => link.label) ?? []),
    ...(details?.links?.map((link) => link.label) ?? []),
    details?.highlights?.length || details?.responsibilities?.length ? 'Highlights' : '',
    details?.awards?.length ? 'Recognition' : '',
    details?.courses?.length ? 'Selected study' : '',
    details?.papers?.length || details?.links?.length ? 'References' : '',
  ].filter(Boolean).join(' ')
}

interface SearchEntry {
  id: string
  title: string
  subtitle: string
  content: string
  step: number
}

interface HighlightInstance {
  add: (range: Range) => void
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function clearSearchHighlights() {
  const registry = (CSS as unknown as { highlights?: { delete: (name: string) => void } }).highlights
  registry?.delete('portfolio-search')
}

function highlightSearchTerms(query: string, spreadIndex: number) {
  const registry = (CSS as unknown as { highlights?: { set: (name: string, value: HighlightInstance) => void } }).highlights
  const HighlightClass = (window as unknown as { Highlight?: new () => HighlightInstance }).Highlight
  const pages = [...document.querySelectorAll<HTMLElement>(`[data-book-scroll][data-spread-index="${spreadIndex}"]`)]
    .sort((page) => page.dataset.pageSide === 'left' ? -1 : 1)
  if (!registry || !HighlightClass || pages.length === 0) return

  if (!document.getElementById('portfolio-search-highlight-style')) {
    const style = document.createElement('style')
    style.id = 'portfolio-search-highlight-style'
    style.textContent = '::highlight(portfolio-search) { background: var(--search-highlight); color: var(--text-primary); }'
    document.head.appendChild(style)
  }

  clearSearchHighlights()
  const terms = [...new Set(query.trim().split(/\s+/).filter(Boolean))]
  if (terms.length === 0) return

  const pattern = new RegExp(terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi')
  const highlight = new HighlightClass()
  let firstMatch: { range: Range; page: HTMLElement } | null = null
  let matchCount = 0

  for (const page of pages) {
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()

    while (node && matchCount < 500) {
      const text = node.textContent ?? ''
      const parent = node.parentElement
      if (!parent?.closest('[aria-hidden="true"], script, style')) {
        for (const match of text.matchAll(pattern)) {
          if (match.index === undefined) continue
          const range = document.createRange()
          range.setStart(node, match.index)
          range.setEnd(node, match.index + match[0].length)
          highlight.add(range)
          firstMatch ??= { range, page }
          matchCount += 1
          if (matchCount >= 500) break
        }
      }
      node = walker.nextNode()
    }
  }

  registry.set('portfolio-search', highlight)

  if (firstMatch) {
    const { range, page } = firstMatch
    const scroller = range.startContainer.parentElement?.closest<HTMLElement>('[data-book-scroll]') ?? page
    const pageRect = scroller.getBoundingClientRect()
    const matchRect = range.getBoundingClientRect()
    const target = scroller.scrollTop + matchRect.top - pageRect.top - scroller.clientHeight * 0.22
    scroller.scrollTo({ top: Math.max(0, Math.min(target, scroller.scrollHeight - scroller.clientHeight)), behavior: 'smooth' })
  }
}

function scoreSearchEntry(entry: SearchEntry, terms: string[]): number {
  const title = entry.title.toLocaleLowerCase()
  const subtitle = entry.subtitle.toLocaleLowerCase()
  return terms.reduce((score, term) => {
    if (title === term) return score + 100
    if (title.startsWith(term)) return score + 60
    if (title.includes(term)) return score + 40
    if (subtitle.includes(term)) return score + 20
    return score + 5
  }, 0)
}

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === 'light') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    )
  }
  if (mode === 'dark') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

export function HUD() {
  const { stateRef } = useScrollContext()
  const { data } = usePortfolio()
  const { mode, setMode } = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgressState] = useState(0)
  const [fontScale, setFontScale] = useState(getInitialFontScale)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`
    localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(fontScale))
  }, [fontScale])

  useEffect(() => {
    localStorage.setItem(SEARCH_QUERY_STORAGE_KEY, searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(!searchOpen)
        if (searchOpen) {
          requestAnimationFrame(() => searchButtonRef.current?.focus())
        }
      } else if (event.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        requestAnimationFrame(() => searchButtonRef.current?.focus())
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return
    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
      searchInputRef.current?.select()
    })
  }, [searchOpen])

  useEffect(() => {
    let raf: number
    const tick = () => {
      const current = stateRef.current
      setActiveStep(current.activeStep)
      setProgressState(current.progress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stateRef])

  const scrollToStep = (index: number) => {
    clearSearchHighlights()
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const targetScroll = ((index + 0.02) / TOTAL_STOPS) * totalHeight
    const distance = Math.abs(index - activeStep)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = Math.min(2.2, 0.65 + distance * 0.16)
    window.dispatchEvent(new CustomEvent(BOOK_DRAG_SCROLL_EVENT, {
      detail: { target: targetScroll, immediate: prefersReducedMotion, duration },
    }))
  }

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(mode)
    setMode(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length])
  }

  const fontScaleIndex = FONT_SCALE_STEPS.indexOf(fontScale)
  const adjustFontScale = (direction: -1 | 1) => {
    const nextIndex = Math.min(FONT_SCALE_STEPS.length - 1, Math.max(0, fontScaleIndex + direction))
    setFontScale(FONT_SCALE_STEPS[nextIndex])
  }

  const workSteps = (data?.journey ?? [])
    .filter((step) => step.type === 'work')
    .sort((a, b) => getStartYear(b.year) - getStartYear(a.year))
  const academicSteps = (data?.journey ?? [])
    .filter((step) => step.type === 'education')
    .sort((a, b) => getStartYear(b.year) - getStartYear(a.year))
  const autobiographyChapter = 1
  const autobiographyStep = 2
  const professionalChapter = 3
  const workStart = 4
  const educationChapter = workStart + workSteps.length
  const academicStart = educationChapter + 1
  const beyondWorkChapter = academicStart + academicSteps.length
  const miscStep = beyondWorkChapter + 1
  const contactStep = miscStep + 1
  const stepLabels = [
    'Cover',
    'Chapter 1: Autobiography',
    'My Story',
    'Chapter 2: Professional Journey',
    ...workSteps.map((step) => step.institution),
    'Chapter 3: Education',
    ...academicSteps.map((step) => step.institution),
    'Chapter 4: Beyond Work',
    'Field Notes',
    'Contact',
  ]
  const searchEntries: SearchEntry[] = data ? [
    {
      id: 'cover',
      title: data.personal.name,
      subtitle: 'A Personal Encyclopedia',
      content: `${data.personal.name} A Personal Encyclopedia ${data.personal.tagline} Drag or scroll to open`,
      step: 0,
    },
    {
      id: 'chapter-autobiography',
      title: 'Chapter 1: Autobiography',
      subtitle: 'Places, choices, and curiosity',
      content: 'Chapter 1 Autobiography places choices curiosity chapters',
      step: autobiographyChapter,
    },
    {
      id: 'autobiography',
      title: 'My Story',
      subtitle: 'Across borders · A constant curiosity',
      content: `Chapter 1 Autobiography Across borders A constant curiosity ${data.personal.bio} ${data.personal.autobiography.join(' ')}`,
      step: autobiographyStep,
    },
    {
      id: 'chapter-work',
      title: 'Chapter 2: Professional Journey',
      subtitle: 'Professional practice, engineering craft, architecture, and leadership — newest first.',
      content: 'Chapter 2 Professional Journey professional practice engineering craft architecture leadership newest first',
      step: professionalChapter,
    },
    ...workSteps.map((step, index) => ({
      id: step.id,
      title: step.institution,
      subtitle: `${step.title} · ${step.year}`,
      content: getJourneySearchContent(step),
      step: workStart + index,
    })),
    {
      id: 'chapter-academic',
      title: 'Chapter 3: Education',
      subtitle: 'Degrees, research, exchange, and the foundations behind the work.',
      content: 'Chapter 3 Education Degrees research exchange foundations behind the work',
      step: educationChapter,
    },
    ...academicSteps.map((step, index) => ({
      id: step.id,
      title: step.institution,
      subtitle: `${step.title} · ${step.year}`,
      content: getJourneySearchContent(step),
      step: academicStart + index,
    })),
    {
      id: 'chapter-misc',
      title: 'Chapter 4: Beyond Work',
      subtitle: 'Movement, places, ideas, languages, and books worth sharing.',
      content: 'Chapter 4 Beyond Work Movement places ideas languages books worth sharing',
      step: beyondWorkChapter,
    },
    {
      id: 'misc',
      title: 'Field Notes',
      subtitle: 'Chapter 4 · Field notes',
      content: 'Sport & movement Practice endurance and the value of staying in motion Travel & places Observations gathered across cities cultures and changing perspectives Mindset Principles for learning building collaborating and handling uncertainty Bookshelf Books essays and references that are worth recommending Languages Language learning as a tool for connection and cultural understanding Curiosities Experiments interests and ideas that do not belong in a résumé',
      step: miscStep,
    },
    {
      id: 'contact',
      title: 'Contact Francesco',
      subtitle: 'GitHub, LinkedIn, and email',
      content: `Let's connect Always open to new projects creative ideas or a good conversation GitHub LinkedIn Email ${data.contact.email} ${data.contact.github} ${data.contact.linkedin}`,
      step: contactStep,
    },
  ] : []
  const searchTerms = searchQuery.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  const searchResults = searchTerms.length === 0 ? [] : searchEntries
    .filter((entry) => {
      const searchable = `${entry.title} ${entry.subtitle} ${entry.content}`.toLocaleLowerCase()
      return searchTerms.every((term) => searchable.includes(term))
    })
    .sort((a, b) => scoreSearchEntry(b, searchTerms) - scoreSearchEntry(a, searchTerms) || a.step - b.step)
    .slice(0, 8)

  const selectSearchResult = (entry: SearchEntry) => {
    const query = searchQuery
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const target = ((entry.step + 0.02) / TOTAL_STOPS) * totalHeight
    setSearchOpen(false)
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(BOOK_DRAG_SCROLL_EVENT, { detail: { target, immediate: true } }))
      window.setTimeout(() => highlightSearchTerms(query, entry.step), 150)
    }, 250)
  }

  const controlStyle = {
    color: 'var(--text-quaternary)',
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    boxShadow: 'var(--card-shadow)',
  }
  const fontScalePercent = fontScale * 100

  return (
    <div className="fixed z-50 pointer-events-none inset-0">
      {/* Display controls */}
      <div className="pointer-events-auto absolute top-[20px] right-[20px] flex items-center gap-[6px]">
        <button
          ref={searchButtonRef}
          onClick={() => setSearchOpen(true)}
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
          style={controlStyle}
          aria-label="Search the book"
          title="Search the book (⌘K)"
          aria-expanded={searchOpen}
          aria-controls="book-search-dialog"
        >
          <SearchIcon />
        </button>
        <button
          onClick={() => adjustFontScale(-1)}
          disabled={fontScaleIndex === 0}
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
          style={controlStyle}
          aria-label={`Decrease font size. Current size ${fontScalePercent}%.`}
          title={`Decrease font size (${fontScalePercent}%)`}
        >
          <span aria-hidden="true" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, lineHeight: 1 }}>a</span>
        </button>
        <button
          onClick={() => adjustFontScale(1)}
          disabled={fontScaleIndex === FONT_SCALE_STEPS.length - 1}
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
          style={controlStyle}
          aria-label={`Increase font size. Current size ${fontScalePercent}%.`}
          title={`Increase font size (${fontScalePercent}%)`}
        >
          <span aria-hidden="true" style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 500, lineHeight: 1 }}>A</span>
        </button>
        <button
          onClick={cycleTheme}
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
          style={controlStyle}
          aria-label={`Theme: ${mode}. Click to switch.`}
          title={`Theme: ${mode}`}
        >
          <ThemeIcon mode={mode} />
        </button>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]"
            style={{ backgroundColor: 'rgba(20, 19, 15, 0.28)', backdropFilter: 'blur(8px)' }}
            onMouseDown={() => {
              setSearchOpen(false)
              requestAnimationFrame(() => searchButtonRef.current?.focus())
            }}
            onWheel={(event) => event.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-[min(92vw,620px)] overflow-hidden rounded-[18px]"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                boxShadow: '0 24px 80px rgba(20, 19, 15, 0.28)',
              }}
              id="book-search-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Search the book"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex h-[58px] items-center gap-3 px-[18px]" style={{ borderBottom: '1px solid var(--card-separator)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}><SearchIcon /></span>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && searchResults[0]) selectSearchResult(searchResults[0])
                  }}
                  className="min-w-0 flex-1 bg-transparent outline-none"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '16px' }}
                  type="text"
                  maxLength={80}
                  placeholder="Search the book"
                  aria-label="Search terms"
                  aria-controls="book-search-results"
                  autoComplete="off"
                />
                <AnimatePresence initial={false}>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.14 }}
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        requestAnimationFrame(() => searchInputRef.current?.focus())
                      }}
                      className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                      style={{ color: 'var(--text-tertiary)', border: '1px solid var(--card-border)' }}
                      aria-label="Clear search"
                      title="Clear search"
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M2.5 2.5 9.5 9.5" />
                        <path d="m9.5 2.5-7 7" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
                <kbd
                  className="rounded-[5px] px-[7px] py-[3px]"
                  style={{ color: 'var(--text-quaternary)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-sans)', fontSize: '10px' }}
                >
                  esc
                </kbd>
              </div>

              <div id="book-search-results" className="max-h-[52vh] overflow-y-auto p-[8px]" role="listbox">
                {searchTerms.length === 0 && (
                  <p
                    className="px-[12px] py-[18px]"
                    style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontSize: '14px' }}
                  >
                    Search roles, skills, universities, or places.
                  </p>
                )}
                {searchTerms.length > 0 && searchResults.length === 0 && (
                  <p
                    className="px-[12px] py-[18px]"
                    style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontSize: '14px' }}
                  >
                    No matching pages.
                  </p>
                )}
                {searchResults.map((entry, index) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => selectSearchResult(entry)}
                    className="flex w-full items-center gap-[14px] rounded-[10px] px-[12px] py-[11px] text-left transition-colors hover:bg-[var(--accent-soft)] focus-visible:bg-[var(--accent-soft)] focus-visible:outline-none"
                    role="option"
                    aria-selected={index === 0}
                  >
                    <span
                      className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full"
                      style={{ color: 'var(--text-quaternary)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-mono)', fontSize: '9px' }}
                    >
                      {String(entry.step + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500 }}
                      >
                        {entry.title}
                      </span>
                      <span
                        className="mt-[2px] block truncate"
                        style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontSize: '12px' }}
                      >
                        {entry.subtitle}
                      </span>
                    </span>
                    <span aria-hidden="true" style={{ color: 'var(--text-quaternary)', fontSize: '16px' }}>↵</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation dots */}
      <nav
        className="absolute right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2.5 pointer-events-auto"
        aria-label="Journey navigation"
      >
        {stepLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => scrollToStep(i)}
            className="group relative flex items-center justify-end cursor-pointer"
            aria-label={`Navigate to ${label}`}
            aria-current={activeStep === i ? 'true' : undefined}
          >
            <span
              className="mr-3 text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 whitespace-nowrap pointer-events-none"
              style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)', letterSpacing: '0.02em' }}
            >
              {label}
            </span>
            <span
              className="block rounded-full transition-all duration-500 ease-out"
              style={{
                width: activeStep === i ? 7 : 4,
                height: activeStep === i ? 7 : 4,
                backgroundColor: activeStep === i ? 'var(--hud-dot-active)' : 'var(--hud-dot)',
              }}
            />
          </button>
        ))}
      </nav>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[0.5px]"
        style={{ backgroundColor: 'var(--hud-progress-track)' }}
      >
        <motion.div
          className="h-full origin-left"
          style={{ scaleX: progress, backgroundColor: 'var(--hud-progress-bar)' }}
        />
      </div>

      {/* Step label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute bottom-5 left-6 pointer-events-none"
        >
          <span
            className="text-[10px] tracking-[0.12em]"
            style={{ color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}
          >
            {String(activeStep + 1).padStart(2, '0')}/{String(TOTAL_STOPS).padStart(2, '0')}
          </span>
          <p
            className="text-[12px] mt-0.5"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontWeight: 500, fontStyle: 'italic' }}
          >
            {stepLabels[activeStep]}
          </p>
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
