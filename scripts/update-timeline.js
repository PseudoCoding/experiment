#!/usr/bin/env node
/**
 * update-timeline.js
 *
 * Called by the daily GitHub Actions workflow alongside update-theme.js.
 * Uses the GitHub Models API to check whether any significant AI milestones
 * have occurred since the last entry in timeline.json and appends new events.
 *
 * Required environment variable: GITHUB_TOKEN
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TIMELINE_PATH = join(__dirname, '..', 'src', 'data', 'timeline.json')
const GITHUB_MODELS_ENDPOINT = 'https://models.inference.ai.azure.com'
const MODEL = 'gpt-4o'

const today = new Date().toISOString().split('T')[0]
const month = new Date().toLocaleString('en-US', { month: 'long' })
const year = new Date().getFullYear()

// ─── Read Current Timeline ────────────────────────────────────────────────────

let events
try {
  events = JSON.parse(readFileSync(TIMELINE_PATH, 'utf-8'))
  console.log(`Loaded ${events.length} existing timeline events.`)
} catch (err) {
  console.error('Failed to read timeline.json:', err.message)
  process.exit(1)
}

// Find the most recent non-active (non-"You Are Here") event year
const datableEvents = events.filter(e => !e.isActive && /^\d{4}$/.test(e.year))
const latestYear = datableEvents.reduce((max, e) => Math.max(max, parseInt(e.year)), 0)
console.log(`Latest datable event: ${latestYear}`)

// ─── Call GitHub Models API ───────────────────────────────────────────────────

const token = process.env.GITHUB_TOKEN
if (!token) {
  console.error('GITHUB_TOKEN environment variable is not set.')
  process.exit(1)
}

const existingSummary = datableEvents
  .slice(-8) // send only the most recent 8 so we don't exceed context
  .map(e => `${e.year}: ${e.title}`)
  .join('\n')

const systemPrompt = `You are an expert AI historian and technology journalist with deep knowledge of artificial intelligence research, products, and cultural milestones.
You maintain a factual, authoritative record of AI history and only include events that actually occurred.
You always return valid JSON with no markdown fences or extra text.`

const userPrompt = `Today is ${today} (${month} ${year}).

You are reviewing an AI history timeline. The most recent entries are:
${existingSummary}

Your task: identify any significant AI milestones that occurred AFTER ${latestYear} and are not yet listed, up to and including ${today}.

Criteria for inclusion — the event must be:
1. A genuine, widely-recognized milestone (not incremental product updates)
2. Represent a meaningful shift in AI capabilities, adoption, culture, or policy
3. Something a well-informed technology journalist would consider historically notable
4. Have actually occurred — do NOT fabricate or speculate about future events

Return ONLY a valid JSON array of new events to append (empty array [] if nothing new qualifies).
Each event must match this exact structure:

[
  {
    "year": "YYYY",
    "title": "Short punchy title (max 50 chars)",
    "description": "One sentence summary (max 120 chars)",
    "detail": "2-4 sentences of rich narrative context explaining why this matters historically.",
    "category": "one of: Foundation|NLP|Expert Systems|Neural Networks|Deep Learning|Generative AI|Milestone|Multimodal|LLMs|Agents|Reasoning|Transformers|AI Assistants|Policy|Present|Other",
    "categoryColor": "<a vivid hex color that suits the category>"
  }
]

Rules:
- year must be a 4-digit string like "2026"
- Only include events AFTER year ${latestYear}
- Do NOT include or modify the special "You Are Here" / "isActive" entry — that is managed separately
- Do NOT duplicate any events already listed above
- If nothing new qualifies, return exactly: []
- The detail field should be substantive and well-written, not generic`

console.log('Calling GitHub Models API to check for new AI milestones...')

let rawResponse
try {
  const response = await fetch(`${GITHUB_MODELS_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // lower temperature = more factual, less hallucination
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  rawResponse = data.choices?.[0]?.message?.content
  console.log('Raw API response received.')
} catch (err) {
  console.error('GitHub Models API call failed:', err.message)
  console.error('Keeping existing timeline.json unchanged.')
  process.exit(0)
}

// ─── Parse & Validate ─────────────────────────────────────────────────────────

let newEvents
try {
  const cleaned = rawResponse
    .replace(/^```json?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  // The response_format: json_object means the model may wrap the array in an object
  const parsed = JSON.parse(cleaned)
  // Handle both a bare array and { events: [...] } or similar wrapper
  newEvents = Array.isArray(parsed) ? parsed : (parsed.events ?? parsed.milestones ?? parsed.data ?? [])
} catch (err) {
  console.error('Failed to parse AI response as JSON:', err.message)
  console.error('Raw response was:', rawResponse)
  console.error('Keeping existing timeline.json unchanged.')
  process.exit(0)
}

if (!Array.isArray(newEvents) || newEvents.length === 0) {
  console.log('No new milestone events identified. Timeline is up to date.')
  process.exit(0)
}

console.log(`Model proposed ${newEvents.length} new event(s).`)

// ─── Validate Each New Event ──────────────────────────────────────────────────

const requiredKeys = ['year', 'title', 'description', 'detail', 'category', 'categoryColor']
const existingYearTitles = new Set(events.map(e => `${e.year}::${e.title.toLowerCase()}`))

const validatedEvents = []
for (const event of newEvents) {
  // Check required fields
  const missing = requiredKeys.filter(k => !(k in event) || !event[k])
  if (missing.length > 0) {
    console.warn(`Skipping event "${event.title ?? '?'}": missing fields: ${missing.join(', ')}`)
    continue
  }

  // Must be a valid 4-digit year
  if (!/^\d{4}$/.test(event.year)) {
    console.warn(`Skipping event "${event.title}": invalid year "${event.year}"`)
    continue
  }

  const eventYear = parseInt(event.year)

  // Must be after the latest existing event
  if (eventYear <= latestYear) {
    console.warn(`Skipping event "${event.title}" (${event.year}): not newer than latest event (${latestYear})`)
    continue
  }

  // Must not be in the future beyond today
  if (eventYear > year + 1) {
    console.warn(`Skipping event "${event.title}" (${event.year}): looks like a future speculation`)
    continue
  }

  // Deduplicate by year+title
  const key = `${event.year}::${event.title.toLowerCase()}`
  if (existingYearTitles.has(key)) {
    console.warn(`Skipping event "${event.title}": already exists`)
    continue
  }

  // Must have a valid hex categoryColor
  if (!/^#[0-9a-fA-F]{6}$/.test(event.categoryColor)) {
    console.warn(`Fixing invalid categoryColor for "${event.title}", defaulting to #6366f1`)
    event.categoryColor = '#6366f1'
  }

  // Strip any unexpected isActive flag (only the "You Are Here" entry has it)
  delete event.isActive

  // Clamp field lengths for safety
  event.title = event.title.slice(0, 80)
  event.description = event.description.slice(0, 200)

  validatedEvents.push(event)
  existingYearTitles.add(key)
  console.log(`  ✅ Accepted: ${event.year} — ${event.title}`)
}

if (validatedEvents.length === 0) {
  console.log('No events passed validation. Timeline unchanged.')
  process.exit(0)
}

// ─── Merge & Write ────────────────────────────────────────────────────────────

// Insert new events before the "You Are Here" (isActive) entry, sorted by year
const activeEntry = events.find(e => e.isActive)
const historicalEvents = events.filter(e => !e.isActive)

const merged = [...historicalEvents, ...validatedEvents]
  .sort((a, b) => parseInt(a.year) - parseInt(b.year))

if (activeEntry) merged.push(activeEntry)

try {
  writeFileSync(TIMELINE_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf-8')
  console.log(`✅ timeline.json updated: added ${validatedEvents.length} new event(s), total now ${merged.length}`)
} catch (err) {
  console.error('Failed to write timeline.json:', err.message)
  process.exit(1)
}
