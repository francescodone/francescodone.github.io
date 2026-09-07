import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@shared/utils/gsap-setup'
import { useScrollContext } from '@shared/contexts/ScrollContext'
import { BOOK_DRAG_SCROLL_EVENT, TOTAL_MOBILE_BOOK_STOPS, TOTAL_SCROLL_HEIGHT } from '@shared/tokens/design-tokens'

export function ScrollEngine({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { setProgress } = useScrollContext()

  useEffect(() => {
    const wheelScrollSelector = '[data-book-scroll], [data-wheel-scroll]'
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (node) => Boolean(node.closest(wheelScrollSelector)),
      virtualScroll: ({ event }) => !event.ctrlKey && event.target instanceof Element && Boolean(event.target.closest(wheelScrollSelector)),
    })

    lenis.on('scroll', ScrollTrigger.update)

    const handleBookDragScroll = (event: Event) => {
      const { target, immediate = true, duration } = (event as CustomEvent<{ target: number; immediate?: boolean; duration?: number }>).detail
      lenis.scrollTo(target, { immediate, duration, force: true })
    }
    window.addEventListener(BOOK_DRAG_SCROLL_EVENT, handleBookDragScroll)

    let snapTimer: ReturnType<typeof setTimeout> | undefined
    const snapMobileScroll = () => {
      if (!window.matchMedia('(max-width: 767px)').matches) return
      clearTimeout(snapTimer)
      snapTimer = setTimeout(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (maxScroll <= 0) return
        const step = Math.round((window.scrollY / maxScroll) * TOTAL_MOBILE_BOOK_STOPS)
        const target = (step / TOTAL_MOBILE_BOOK_STOPS) * maxScroll
        if (Math.abs(target - window.scrollY) <= 1) return
        lenis.scrollTo(target, { duration: 0.35, force: true })
      }, 180)
    }
    window.addEventListener('scroll', snapMobileScroll, { passive: true })

    const containWheelToPages = (event: WheelEvent) => {
      if (!event.ctrlKey && (!(event.target instanceof Element) || !event.target.closest(wheelScrollSelector))) {
        event.preventDefault()
      }
    }
    window.addEventListener('wheel', containWheelToPages, { passive: false, capture: true })

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0,
      onUpdate: (self) => {
        setProgress(self.progress, self.getVelocity() / 1000)
      },
    })

    return () => {
      clearTimeout(snapTimer)
      window.removeEventListener(BOOK_DRAG_SCROLL_EVENT, handleBookDragScroll)
      window.removeEventListener('scroll', snapMobileScroll)
      window.removeEventListener('wheel', containWheelToPages, { capture: true })
      trigger.kill()
      lenis.destroy()
      gsap.ticker.remove(updateLenis)
    }
  }, [setProgress])

  return (
    <div
      ref={containerRef}
      style={{ height: `${TOTAL_SCROLL_HEIGHT}vh` }}
      className="relative"
    >
      {children}
    </div>
  )
}
