import { useEffect, useRef, useState } from 'react'
import type { TimelineEvent } from '../data/timeline'

interface Props {
  event: TimelineEvent
  index: number
  side: 'left' | 'right'
}

export function TimelineItem({ event, index, side }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`timeline-item timeline-item--${side} ${visible ? 'timeline-item--visible' : ''} ${event.isActive ? 'timeline-item--active' : ''}`}
      style={{ '--delay': `${index * 0.06}s` } as React.CSSProperties}
    >
      {/* Connector dot */}
      <div className="timeline-item__connector">
        <div
          className="timeline-item__dot"
          style={{ background: event.categoryColor, boxShadow: `0 0 20px ${event.categoryColor}60` }}
        />
        {event.isActive && <div className="timeline-item__dot-pulse" style={{ borderColor: event.categoryColor }} />}
      </div>

      {/* Card */}
      <article
        className={`timeline-card ${expanded ? 'timeline-card--expanded' : ''}`}
        onClick={() => setExpanded(e => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setExpanded(x => !x)}
        aria-expanded={expanded}
      >
        <div className="timeline-card__header">
          <span
            className="timeline-card__category"
            style={{ color: event.categoryColor, borderColor: `${event.categoryColor}40`, background: `${event.categoryColor}12` }}
          >
            {event.category}
          </span>
          <span className="timeline-card__year">{event.year}</span>
        </div>

        <h3 className="timeline-card__title">{event.title}</h3>
        <p className="timeline-card__description">{event.description}</p>

        <div className={`timeline-card__detail ${expanded ? 'timeline-card__detail--open' : ''}`}>
          <p>{event.detail}</p>
        </div>

        <button className="timeline-card__toggle" aria-hidden="true" tabIndex={-1}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span>{expanded ? 'Show less' : 'Read more'}</span>
        </button>
      </article>
    </div>
  )
}
