# UniFlow

React + Vite + Tailwind CSS app: a student workspace for tasks, deadlines, course updates, and sources.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — serve the production build
- `npm run format` — format with oxfmt

The dev and preview servers listen on `0.0.0.0`. The port is `$PORT` when it is set, otherwise `8443`.

## Project structure

- `src/main.tsx` — React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into `#root`
- `src/App.tsx` — application shell, navigation, and client state
- `src/components/` — page views and shared UI
- `src/data/mockData.ts` — local sample data
- `src/index.css` — global CSS entrypoint and Tailwind CSS v4 theme
- `index.html` — Vite HTML shell
- `package.json` — dependencies and scripts
- `vite.config.ts` — Vite configuration with React, Tailwind CSS v4, and the `@` alias for `src`

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This project does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles, such as resets and defaults for `body`, headings, `button`, or `input`, inside `@layer base { ... }` so utility classes on those elements still apply. Tailwind's Preflight already applies `box-sizing: border-box`, removes default margins, and sets `font: inherit` on form controls, so do not repeat those rules.
