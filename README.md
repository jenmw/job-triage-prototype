# Job Triage — Rapid Decision Prototype

A UX prototype for helping job seekers quickly triage whether a job listing is right for them, built around real data from [Breakroom](https://www.breakroom.cc).

## Design Concept

**"Honest Utility"** — frontloads feasibility signals (pay vs living wage, commute, requirements) using traffic-light colour coding, then progressively reveals quality signals (employee reviews, red/green flags, culture stats), and surfaces better alternatives with optional personalisation.

### Information Architecture

1. **3-second scan zone** — Title, pay, location, shifts, employer score
2. **Feasibility check** (open by default) — Can you actually do this job? Non-negotiables as traffic-light signals
3. **Quality check** (collapsed) — What's it really like? Employee stats, red flags, green flags
4. **Worker reviews** (collapsed) — Real quotes with scores
5. **Better alternatives** — Similar jobs nearby, highlighted by what makes them better
6. **Personalisation drawer** — Optional: postcode, current pay, transport, priorities

## Tech Stack

- React 18 + Vite
- Zero dependencies beyond React (no UI library, no Tailwind — pure inline styles)
- Mobile-first, single-file component

## Quick Start

```bash
npm install
npm run dev
```

## Deploy

### GitHub Pages (live)

The app is deployed at **https://breakroom.github.io/job-triage-prototype/**

Deployment is automatic — every push to `main` triggers a GitHub Actions workflow that builds the app and publishes the `dist/` folder to GitHub Pages.

### Vercel
```bash
npx vercel
```

### Netlify
```bash
npm run build
# drag dist/ folder to netlify.com/drop
```

## Project Structure

```
├── .github/workflows/
│   └── deploy.yml      # GitHub Pages deployment
├── index.html          # Entry point
├── src/
│   ├── main.jsx        # React mount
│   └── App.jsx         # Entire prototype (single component)
├── package.json
└── vite.config.js
```

## License

Prototype / demonstration only. Job data sourced from Breakroom.cc.
