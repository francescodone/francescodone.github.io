import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@shared/utils/gsap-setup'
import { useScrollContext } from '@shared/contexts/ScrollContext'
import { BOOK_DRAG_SCROLL_EVENT, TOTAL_SCROLL_HEIGHT } from '@shared/tokens/design-tokens'

export function ScrollEngine({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { setProgress } = useScrollContext()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const handleBookDragScroll = (event: Event) => {
      const { target, immediate = true, duration } = (event as CustomEvent<{ target: number; immediate?: boolean; duration?: number }>).detail
      lenis.scrollTo(target, { immediate, duration, force: true })
    }
    window.addEventListener(BOOK_DRAG_SCROLL_EVENT, handleBookDragScroll)

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
      window.removeEventListener(BOOK_DRAG_SCROLL_EVENT, handleBookDragScroll)
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
