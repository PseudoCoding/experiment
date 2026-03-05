import { timelineData } from '../data/timeline'
import { TimelineItem } from './TimelineItem'

export function Timeline() {
  return (
    <section className="timeline" id="timeline">
      <div className="timeline__header">
        <p className="timeline__eyebrow">Scroll to explore</p>
        <h2 className="timeline__title">
          Seven Decades of
          <span className="gradient-text"> Breakthroughs</span>
        </h2>
        <p className="timeline__subtitle">
          Click any card to read the full story behind each milestone.
        </p>
      </div>

      <div className="timeline__track">
        <div className="timeline__line" aria-hidden="true">
          <div className="timeline__line-fill" />
        </div>

        <div className="timeline__events">
          {timelineData.map((event, i) => (
            <TimelineItem
              key={event.year + event.title}
              event={event}
              index={i}
              side={i % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
