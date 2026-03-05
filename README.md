# The Evolution of AI

An interactive single-page application tracing the history of artificial intelligence from 1950 to today — with a twist: **its color palette and aesthetic are updated daily by GitHub Copilot**, automatically, based on current design trends.

[![Built with React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://github.com/PseudoCoding/experiment)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](https://github.com/PseudoCoding/experiment)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://github.com/PseudoCoding/experiment)
[![Deployed on Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deployed-f38020?style=flat-square&logo=cloudflare)](https://github.com/PseudoCoding/experiment)

---

## How the autonomous theming works

```
Every day at 08:00 UTC
        │
        ▼
GitHub Actions runs daily-theme-update.yml
        │
        ▼
scripts/update-theme.js calls GitHub Models API (gpt-4o-mini)
  ├── Prompt: "What design trends are popular in <month> <year>?"
  ├── Response: a validated JSON theme object
  └── Writes → src/theme.json
        │
        ▼
If theme.json changed, github-actions[bot] commits it
        │
        ▼
Cloudflare Pages detects the push and rebuilds
        │
        ▼
Your site looks different — chosen by AI
```

`src/theme.json` is the single source of truth. Every CSS value — colors, border radius, blur, animation speed, gradients — flows from that one file through CSS custom properties. Changing the JSON changes the entire visual appearance of the site.

---

## Project structure

```
experiment/
├── .github/
│   └── workflows/
│       └── daily-theme-update.yml   # Daily cron job
├── public/
│   └── favicon.svg
├── scripts/
│   └── update-theme.js              # AI theme generation script
├── src/
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── NeuralBackground.tsx     # Animated canvas
│   │   ├── ThemeBadge.tsx           # Floating AI theme info panel
│   │   ├── Timeline.tsx
│   │   └── TimelineItem.tsx
│   ├── data/
│   │   └── timeline.ts              # 20 AI milestones (1950 → 2026)
│   ├── styles/
│   │   └── index.css                # All styles via CSS custom properties
│   ├── types/
│   │   └── theme.ts                 # Theme TypeScript interfaces
│   ├── App.tsx                      # Applies theme.json to CSS variables
│   ├── main.tsx
│   └── theme.json                   # ← Updated daily by Copilot
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A GitHub repository with **GitHub Copilot** enabled (required for the daily workflow — it uses `GITHUB_TOKEN` which automatically has `models:read` permission)

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

### Run the theme update manually

```bash
GITHUB_TOKEN=your_token node scripts/update-theme.js
```

---

## Deploying to Cloudflare Pages

1. Push this repository to GitHub.
2. In the [Cloudflare Pages dashboard](https://pages.cloudflare.com), create a new project and connect your GitHub repo.
3. Set the build configuration:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `20`
4. Deploy. Cloudflare will automatically redeploy on every push — including the daily commit from GitHub Actions.

---

## Setting up the daily GitHub Action

The workflow at [.github/workflows/daily-theme-update.yml](.github/workflows/daily-theme-update.yml) runs automatically if:

- Your repository has **GitHub Copilot** access (individual or organization subscription)
- The `GITHUB_TOKEN` is available (it is, by default — no secrets to configure)

The `GITHUB_TOKEN` used in Actions automatically carries `models:read` permission when Copilot is enabled on the repo, giving the script free access to the GitHub Models API (`gpt-4o-mini`).

You can also trigger it manually from the **Actions** tab → **Daily AI Theme Update** → **Run workflow**.

---

## The theme format

`src/theme.json` follows this structure:

```jsonc
{
  "lastUpdated": "2026-03-05",
  "palette": {
    "background":  "#050508",   // Must be very dark
    "surface":     "#0f0f1a",
    "primary":     "#6366f1",   // Must be vivid
    "text":        "#f1f5f9",   // Must be high contrast
    // ...
  },
  "typography": {
    "fontFamily":  "Inter",     // Must be a Google Font
    "headingWeight": "800"
  },
  "aesthetic": {
    "style":       "glassmorphism",
    "borderRadius": "16px",
    "cardBlur":    "24px"
  },
  "gradient": {
    "hero":     "linear-gradient(...)",
    "timeline": "linear-gradient(...)",
    "text":     "linear-gradient(...)"
  },
  "trendNote": "Human-readable explanation of why these choices were made."
}
```

The script validates the response before writing: it checks that the background isn't too light, that the font is in a safe list of Google Fonts, and that all required keys are present. If validation fails, the existing `theme.json` is left untouched.

---

## License

MIT
