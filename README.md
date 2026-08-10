# Zuhayr Huseni - personal portfolio

A responsive portfolio for software engineer Zuhayr Huseni. The site is built as a calibrated strip recorder: a continuous signal trace connects work in distributed compliance systems, internal developer tooling, agent infrastructure, and 5G performance research.

## Design direction

The visual system uses a cool paper ground (`#F4F1E8`), deep ink (`#111A22`), an accessible signal blue (`#0F7089`), and one alert coral (`#DC5A45`). Instrument Sans carries display type, Public Sans handles reading, and IBM Plex Mono labels figures and measured data.

The signature element is the live trace in the hero. It responds to pointer proximity, then returns to its baseline. The same visual language is reused in the architecture, workflow, topology, 5G, and stack figures so the instrumentation is part of the story rather than decoration.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by the development server.

## Validate

```bash
npm run build
npm test
npm run lint
npm run screenshots
```

The screenshot script captures the full page at 1440 px, 768 px, and 390 px into `screenshots/`. It expects the development server at `http://localhost:3000`; set `SITE_URL` to override it.

## Edit content

All portfolio copy, role history, education, links, metrics, and skill groups live in [`app/content.ts`](app/content.ts). The London role is intentionally marked as incomplete until the title, dates, personal contributions, stack, and outcome are supplied.

Company marks are stored locally under `public/brands/` and company names link to their verified official destinations. Propel Flow's listed domain did not resolve during research, so its live company profile is used instead of an invented logo.

## Resume

The downloadable PDF is generated from `scripts/build_resume.py`:

```bash
python3 scripts/build_resume.py
```

The reviewed source artifact is written to `output/pdf/Zuhayr-Huseni-Resume.pdf`; the public copy lives at `public/Zuhayr-Huseni-Resume.pdf`.

## Deployment

The project uses the bundled vinext and Sites configuration:

```bash
npm run build
```

The resulting Cloudflare-compatible worker can be published through Sites. No database, object storage, authentication, or environment variables are required.

## Accessibility and motion

- Native tab semantics with arrow-key, Home, and End navigation
- Visible focus states and a skip link
- Custom pointer interactions only on fine-pointer devices
- Fully static behavior when `prefers-reduced-motion: reduce` is active
- Responsive layouts designed for 390 px, 768 px, and wide desktop screens

## Known content gap

Host Family Stay is verified as the London company, but the role details were not provided. The site visibly requests those facts and makes no personal claims based on company marketing copy.
