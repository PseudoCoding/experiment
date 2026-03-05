import { useState } from 'react'
import type { Theme } from '../types/theme'

interface Props {
  theme: Theme
}

export function ThemeBadge({ theme }: Props) {
  const [open, setOpen] = useState(false)

  const date = new Date(theme.lastUpdated)
  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className={`theme-badge ${open ? 'theme-badge--open' : ''}`}>
      <button
        className="theme-badge__trigger"
        onClick={() => setOpen(o => !o)}
        title="View AI-generated theme info"
      >
        <span className="theme-badge__pulse" />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span className="theme-badge__label">AI Theme</span>
      </button>

      {open && (
        <div className="theme-badge__panel">
          <div className="theme-badge__panel-header">
            <div className="theme-badge__panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
              </svg>
              Autonomous Aesthetics
            </div>
            <button className="theme-badge__close" onClick={() => setOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="theme-badge__row">
            <span className="theme-badge__meta-label">Last updated</span>
            <span className="theme-badge__meta-value">{formatted}</span>
          </div>

          <div className="theme-badge__row">
            <span className="theme-badge__meta-label">Style</span>
            <span className="theme-badge__meta-value" style={{ textTransform: 'capitalize' }}>
              {theme.aesthetic.style}
            </span>
          </div>

          <div className="theme-badge__palette">
            {Object.entries(theme.palette)
              .filter(([, v]) => v.startsWith('#'))
              .slice(0, 6)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="theme-badge__swatch"
                  style={{ background: value }}
                  title={`${key}: ${value}`}
                />
              ))}
          </div>

          <p className="theme-badge__trend">{theme.trendNote}</p>

          <div className="theme-badge__footer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Updated daily by GitHub Copilot via Actions
          </div>
        </div>
      )}
    </div>
  )
}
