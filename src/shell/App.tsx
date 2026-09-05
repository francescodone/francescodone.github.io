import { PortfolioProvider } from '@shared/contexts/PortfolioContext'
import { ScrollProvider } from '@shared/contexts/ScrollContext'
import { ThemeProvider } from '@shared/contexts/ThemeContext'
import { ScrollEngine } from './ScrollEngine'
import { HUD } from './HUD'
import { LoadingScreen } from './LoadingScreen'
import { Book } from './Book'

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <ScrollProvider>
          <LoadingScreen />
          <HUD />
          <ScrollEngine>
            {/* ScrollEngine provides the tall scrollable container;
                Book is fixed on screen and reads scroll progress
                to drive page turns. */}
            <div aria-hidden="true" />
          </ScrollEngine>
          <Book />
        </ScrollProvider>
      </PortfolioProvider>
    </ThemeProvider>
  )
}
