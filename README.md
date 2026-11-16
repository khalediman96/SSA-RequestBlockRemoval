# Remove Block — React prototype

Vite + React + TypeScript app for the SSA **Remove Block** workflow (Section Head → Director → Assessor).

## Run

```bash
npm install
npm run dev
```

## Deploy (Vercel)

1. Import the GitHub repo with **Root Directory** left empty (repository root — not `Application Approval` or `Application Details`).
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist` (also set in [`vercel.json`](vercel.json)).
3. **Production URL** — open the project’s main `*.vercel.app` domain or your custom domain. Preview URLs like `…-khalediman96s-projects.vercel.app` may show a **Vercel login** if [Deployment Protection](https://vercel.com/docs/security/deployment-protection) is on; disable it for demos or sign in to view the preview.
4. If the page is blank, open the browser devtools **Console** and the Vercel **Build** log. A common mistake is deploying source `index.html` (script `/src/main.tsx`) instead of the built `dist/index.html` (script `/assets/…js`) — fix the build/output settings above and redeploy.

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