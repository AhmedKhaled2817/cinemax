# CineMax

CineMax is a modern Angular movie discovery app powered by [TMDB](https://www.themoviedb.org/) APIs.
It provides a Netflix-style browsing experience with movie and TV exploration, media details, trailers, search, and a personal watchlist.

## Features

- Browse trending, popular, top-rated, and upcoming content.
- View detailed pages for movies and TV shows (cast, genres, trailers, similar titles).
- Search across TMDB media entities.
- Browse by genre for both movies and TV.
- Maintain a personal watchlist and recently viewed items using local storage.
- Lightweight mock authentication flow (register/login/logout) for protected UX flows.
- Responsive UI optimized for desktop, tablet, and mobile.

## Tech Stack

- Angular 21 (standalone components + signals)
- TypeScript
- SCSS
- RxJS
- Angular Material / CDK
- NgRx (store/effects/devtools)
- TMDB REST API

## Project Structure

```text
src/
  app/
    core/            # services, guards, interceptors, models
    features/        # route-level pages (home, browse, details, auth, etc.)
    shared/          # reusable components, pipes, directives
  environment/       # environment configs
```

## Custom Directives

This project includes reusable UI directives in `src/app/shared/directives`:

- `SmartImageDirective` (`appSmartImage`)
  - Adds `loading="lazy"` and `decoding="async"` to images.
  - Replaces broken images with a safe SVG placeholder fallback.
  - Used across hero images, movie cards, posters, and cast images.

- `PreventDoubleClickDirective` (`appPreventDoubleClick`)
  - Blocks repeated click submissions for a short cooldown window.
  - Helps prevent duplicate requests/actions (e.g., auth submit, watchlist toggles).

## Getting Started

### 1) Prerequisites

- Node.js 20+
- npm 10+
- Angular CLI (optional globally)

### 2) Install Dependencies

```bash
npm install
```

### 3) Run Development Server

```bash
npm start
```

Open `http://localhost:4200/`.

### 4) Build for Production

```bash
npm run build
```

For Vercel pipeline usage:

```bash
npm run vercel-build
```

## Environment Configuration

TMDB configuration is read from:

- `src/environment/environment.ts`
- `src/environment/environment.prod.ts`

Fields used by the app:

- `tmdb.apiKey`
- `tmdb.baseUrl`
- `tmdb.imageUrl`

## Available Scripts

- `npm start` - run local dev server
- `npm run watch` - build in watch mode (development config)
- `npm run build` - production build
- `npm run vercel-build` - Vercel-friendly production build command
- `npm test` - run unit tests

## Deployment (Vercel)

1. Push changes to `main`.
2. Import the repository in Vercel.
3. Keep build command as `npm run vercel-build`.
4. Keep output directory as Angular default (`dist/cinemax`).

## Notes

- TMDB data usage must comply with TMDB terms and attribution requirements.
- Authentication in this project is mock/local-storage based and intended for demonstration.

## License

This project is for educational and portfolio use.