import { useState, useEffect } from 'react'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <a href="#" className="header__logo" aria-label="Home">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="30" r="8" fill="var(--primary-light)" />
            <circle cx="25" cy="72" r="8" fill="var(--secondary)" />
            <circle cx="75" cy="72" r="8" fill="var(--accent)" />
            <line x1="50" y1="30" x2="25" y2="72" stroke="var(--primary-light)" strokeWidth="2.5" opacity="0.6" />
            <line x1="50" y1="30" x2="75" y2="72" stroke="var(--primary-light)" strokeWidth="2.5" opacity="0.6" />
            <line x1="25" y1="72" x2="75" y2="72" stroke="var(--primary-light)" strokeWidth="2.5" opacity="0.6" />
          </svg>
          <span className="header__logo-text">AI Evolution</span>
        </a>

        <nav className="header__nav">
          <a href="#timeline" className="header__nav-link">Timeline</a>
          <a
            href="https://github.com/PseudoCoding/experiment"
            target="_blank"
            rel="noopener noreferrer"
            className="header__cta"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View Source
          </a>
        </nav>
      </div>
    </header>
  )
}
