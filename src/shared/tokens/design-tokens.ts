export const timing = {
  transitionFast: 150,
  transitionBase: 250,
  transitionSlow: 400,
  scrollScrubLag: 1,
} as const

export const TOTAL_SCROLL_HEIGHT = 1190
export const JOURNEY_STEP_COUNT = 6
export const BOOK_CHAPTER_COUNT = 4
export const TOTAL_BOOK_STOPS = JOURNEY_STEP_COUNT + BOOK_CHAPTER_COUNT + 4
export const BOOK_DRAG_SCROLL_EVENT = 'book-drag-scroll'
