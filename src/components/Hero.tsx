import { NeuralBackground } from './NeuralBackground'

export function Hero() {
  return (
    <section className="hero">
      <NeuralBackground />

      <div className="hero__grid-overlay" aria-hidden="true" />

      <div className="hero__content">
        <div className="hero__eyebrow">
          <span className="hero__dot" />
          <span>Interactive Timeline</span>
        </div>

        <h1 className="hero__title">
          The Evolution
          <br />
          <span className="hero__title-gradient">of Artificial Intelligence</span>
        </h1>

        <p className="hero__subtitle">
          From Turing's thought experiment in 1950 to reasoning models that
          solve PhD-level problems today — trace the milestones that built
          the intelligence shaping our world.
        </p>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-number">76</span>
            <span className="hero__stat-label">Years of AI</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-number">20</span>
            <span className="hero__stat-label">Milestones</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-number">∞</span>
            <span className="hero__stat-label">What's Next</span>
          </div>
        </div>

        <a href="#timeline" className="hero__scroll-cta">
          <span>Explore the Timeline</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </a>
      </div>

      <div className="hero__fade-bottom" aria-hidden="true" />
    </section>
  )
}
