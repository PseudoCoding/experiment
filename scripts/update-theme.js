#!/usr/bin/env node
/**
 * update-theme.js
 *
 * Called by the daily GitHub Actions workflow.
 * Uses the GitHub Models API (free with GitHub Copilot) to research current
 * design trends and generate an updated theme.json for the AI Evolution site.
 *
 * Required environment variable: GITHUB_TOKEN
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const THEME_PATH = join(__dirname, '..', 'src', 'theme.json')
const GITHUB_MODELS_ENDPOINT = 'https://models.inference.ai.azure.com'
const MODEL = 'gpt-4o-mini'

const today = new Date().toISOString().split('T')[0]
const month = new Date().toLocaleString('en-US', { month: 'long' })
const year = new Date().getFullYear()

// ─── Read Current Theme ───────────────────────────────────────────────────────

let currentTheme
try {
  currentTheme = JSON.parse(readFileSync(THEME_PATH, 'utf-8'))
  console.log(`Current theme last updated: ${currentTheme.lastUpdated}`)
} catch (err) {
  console.error('Failed to read current theme.json:', err.message)
  process.exit(1)
}

// ─── Call GitHub Models API ───────────────────────────────────────────────────

const token = process.env.GITHUB_TOKEN
if (!token) {
  console.error('GITHUB_TOKEN environment variable is not set.')
  process.exit(1)
}

const systemPrompt = `You are an expert UI/UX design trend analyst and color theorist.
You research current design trends across Dribbble, Behance, Awwwards, and tech company design systems.
You always return valid JSON with no markdown fences or extra text.`

const userPrompt = `Today's date is ${today} (${month} ${year}).

Analyze current UI/UX design trends for technology and AI-themed websites.
Consider:
- What color palettes are trending in ${year} for dark-mode tech interfaces?
- What aesthetic styles are popular (glassmorphism, neumorphism, brutalism, etc.)?
- What typography and animation trends feel fresh but professional?
- Seasonal influences (it is currently ${month})

Return ONLY a valid JSON object matching this exact structure (no markdown, no extra fields):

{
  "lastUpdated": "${today}",
  "palette": {
    "background": "<hex>",
    "surface": "<hex>",
    "surfaceAlt": "<hex>",
    "primary": "<hex>",
    "primaryLight": "<hex>",
    "secondary": "<hex>",
    "accent": "<hex>",
    "accentWarm": "<hex>",
    "text": "<hex>",
    "textMuted": "<hex>",
    "textSubtle": "<hex>",
    "border": "<hex>",
    "glow": "<rgba string>"
  },
  "typography": {
    "fontFamily": "<font name from Google Fonts>",
    "codeFontFamily": "Fira Code",
    "headingWeight": "<400-900>",
    "bodyWeight": "400"
  },
  "aesthetic": {
    "style": "<one of: glassmorphism|neumorphism|brutalism|minimal|organic>",
    "borderRadius": "<e.g. 12px>",
    "cardBlur": "<e.g. 20px>",
    "shadowIntensity": "<low|medium|high>",
    "animationSpeed": "<e.g. 0.4s>",
    "glowRadius": "<e.g. 50px>"
  },
  "gradient": {
    "hero": "linear-gradient(135deg, <color1> 0%, <color2> 50%, <color3> 100%)",
    "timeline": "linear-gradient(180deg, <color1> 0%, <color2> 50%, <color3> 100%)",
    "text": "linear-gradient(90deg, <color1> 0%, <color2> 50%, <color3> 100%)"
  },
  "trendNote": "<2-3 sentences describing the current design trends that influenced these choices>"
}

Rules:
- Background must be very dark (#020204 to #0d0d1a range) for readability
- Text must have high contrast against the background (near white: #e8eaf0 to #f8f9fc)
- Primary color should be vivid and distinct — no grey or muted tones
- All hex values must be valid 6-character hex codes starting with #
- The trendNote should be insightful and specific to ${month} ${year}
- Make it genuinely beautiful and different from typical dark themes`

console.log('Calling GitHub Models API...')

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
      temperature: 0.8,
      max_tokens: 1200,
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
  console.error('Keeping existing theme.json unchanged.')
  process.exit(0) // Exit 0 so the workflow doesn't fail entirely
}

// ─── Parse & Validate ─────────────────────────────────────────────────────────

let newTheme
try {
  // Strip markdown code fences if the model ignored the instruction
  const cleaned = rawResponse
    .replace(/^```json?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  newTheme = JSON.parse(cleaned)
} catch (err) {
  console.error('Failed to parse AI response as JSON:', err.message)
  console.error('Raw response was:', rawResponse)
  console.error('Keeping existing theme.json unchanged.')
  process.exit(0)
}

// Basic validation — ensure required top-level keys are present
const required = ['lastUpdated', 'palette', 'typography', 'aesthetic', 'gradient', 'trendNote']
for (const key of required) {
  if (!(key in newTheme)) {
    console.error(`Validation failed: missing key "${key}" in AI response.`)
    console.error('Keeping existing theme.json unchanged.')
    process.exit(0)
  }
}

// Ensure dark background (brightness check)
const bgHex = newTheme.palette?.background ?? '#000000'
const bgR = parseInt(bgHex.slice(1, 3), 16)
const bgG = parseInt(bgHex.slice(3, 5), 16)
const bgB = parseInt(bgHex.slice(5, 7), 16)
const bgBrightness = (bgR * 299 + bgG * 587 + bgB * 114) / 1000
if (bgBrightness > 60) {
  console.warn(`Background ${bgHex} is too light (brightness ${bgBrightness.toFixed(0)}). Keeping existing theme.json.`)
  process.exit(0)
}

// Ensure fontFamily is one supported by Google Fonts or Inter fallback
const safeFonts = ['Inter', 'Geist', 'Manrope', 'DM Sans', 'Outfit', 'Plus Jakarta Sans', 'Space Grotesk', 'Onest', 'Syne']
if (!safeFonts.includes(newTheme.typography?.fontFamily)) {
  console.warn(`Font "${newTheme.typography?.fontFamily}" not in allowed list. Defaulting to Inter.`)
  newTheme.typography.fontFamily = 'Inter'
}

// ─── Write Updated Theme ──────────────────────────────────────────────────────

try {
  writeFileSync(THEME_PATH, JSON.stringify(newTheme, null, 2) + '\n', 'utf-8')
  console.log(`✅ theme.json updated successfully for ${today}`)
  console.log(`   Style: ${newTheme.aesthetic.style}`)
  console.log(`   Primary: ${newTheme.palette.primary}`)
  console.log(`   Trend: ${newTheme.trendNote.slice(0, 80)}...`)
} catch (err) {
  console.error('Failed to write theme.json:', err.message)
  process.exit(1)
}
