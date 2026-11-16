# Remove Block — React prototype

Vite + React + TypeScript app for the SSA **Remove Block** workflow (Section Head → Director → Assessor).

## Run

```bash
npm install
npm run dev
```

Open the URL from the terminal (usually `http://localhost:5173`).

## Routes

| Route | Role / screen |
| --- | --- |
| `/` | Role picker |
| `/section-head` | Section Head — Figma hub (Awaiting Reapplication) |
| `/director` | Director — Figma hub (Remove Block requests) |
| `/assessor` | Assessor — Figma hub (applications list) |
| `/section-head/request` | Request to Remove Block |
| `/section-head/resubmit` | Resubmit after send-back |
| `/director/review` | Director decision |
| `/assessor/application` | Assessor application tabs |

## Styles

SSA tokens and components live in [`ssa-skill/styles/`](ssa-skill/styles/). Prototype-specific rules: [`src/styles/prototype.css`](src/styles/prototype.css).

## Legacy static prototype

Archived under [`legacy/`](legacy/) (`index.html`, `app.js`, `styles.css`).