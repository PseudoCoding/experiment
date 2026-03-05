import raw from './timeline.json'

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  detail: string;
  category: string;
  categoryColor: string;
  isActive?: boolean;
}

export const timelineData: TimelineEvent[] = raw as TimelineEvent[]

/* -----------------------------------------------------------------------
   timeline.json is the actual data source — updated daily by Copilot
   via scripts/update-timeline.js in GitHub Actions.
   Do not add events here; edit timeline.json directly.
----------------------------------------------------------------------- */
