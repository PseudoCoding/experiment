import { useEffect } from 'react'
import themeData from './theme.json'
import type { Theme } from './types/theme'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Timeline } from './components/Timeline'
import { ThemeBadge } from './components/ThemeBadge'
import { Footer } from './components/Footer'

const theme = themeData as Theme

function applyTheme(t: Theme) {
  const root = document.documentElement
  const { palette, aesthetic, typography } = t

  root.style.setProperty('--bg', palette.background)
  root.style.setProperty('--surface', palette.surface)
  root.style.setProperty('--surface-alt', palette.surfaceAlt)
  root.style.setProperty('--primary', palette.primary)
  root.style.setProperty('--primary-light', palette.primaryLight)
  root.style.setProperty('--secondary', palette.secondary)
  root.style.setProperty('--accent', palette.accent)
  root.style.setProperty('--accent-warm', palette.accentWarm)
  root.style.setProperty('--text', palette.text)
  root.style.setProperty('--text-muted', palette.textMuted)
  root.style.setProperty('--text-subtle', palette.textSubtle)
  root.style.setProperty('--border', palette.border)
  root.style.setProperty('--glow', palette.glow)
  root.style.setProperty('--gradient-hero', t.gradient.hero)
  root.style.setProperty('--gradient-timeline', t.gradient.timeline)
  root.style.setProperty('--gradient-text', t.gradient.text)
  root.style.setProperty('--radius', aesthetic.borderRadius)
  root.style.setProperty('--card-blur', aesthetic.cardBlur)
  root.style.setProperty('--anim-speed', aesthetic.animationSpeed)
  root.style.setProperty('--glow-radius', aesthetic.glowRadius)
  root.style.setProperty('--font', typography.fontFamily)
  root.style.setProperty('--font-code', typography.codeFontFamily)
  root.style.setProperty('--heading-weight', typography.headingWeight)
}

export default function App() {
  useEffect(() => {
    applyTheme(theme)
  }, [])

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Timeline />
      </main>
      <ThemeBadge theme={theme} />
      <Footer />
    </div>
  )
}
