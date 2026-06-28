# SkyCards

SkyCards turns a public Bluesky profile into a collectible social stats card. It uses only public Bluesky data, generates entertainment scores, and does not require login, a database, or secrets.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS v4
- shadcn/ui primitives restyled with SkyCards tokens
- next-intl for `en`, `pt-BR`, and `es`
- Zod for input/API validation
- Lucide React icons
- Sonner toasts
- html-to-image for PNG export

## Setup

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

The app does not require secrets. Copy `.env.example` only when you want to set the production canonical URL:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Routes

- `/` English landing page
- `/c/handle` English card route
- `/pt-BR` Portuguese landing page
- `/pt-BR/c/handle` Portuguese card route
- `/es` Spanish landing page
- `/es/c/handle` Spanish card route
- `/api/avatar?url=...` safe Bluesky avatar proxy for PNG export
- `/api/card-image?actor=...&locale=...&kind=card|share` generated PNG download image

The default locale is English and does not need a visible prefix.

## Bluesky Integration

SkyCards fetches server-side from `https://public.api.bsky.app`:

- `/xrpc/app.bsky.actor.getProfile`
- `/xrpc/app.bsky.feed.getAuthorFeed`

It accepts handles, `@handles`, `https://bsky.app/profile/...` URLs, and DIDs. Feed requests use `filter=posts_with_replies`, `limit=100`, a maximum of three pages, and a maximum of 300 feed items. Requests use a timeout and one-hour technical revalidation where applicable.

## Scoring Summary

The card analyzes public posts, replies, and reposts from the last 90 days. If fewer than 30 activities are found, the analysis window expands up to 365 days using available public items.

- `ACT` measures recent weighted activity.
- `CON` measures active weeks and regularity.
- `ENG` measures received interactions on authored activity.
- `IMP` measures original posts that stand out against the account baseline.
- `RPL` measures external conversation participation.
- `NET` measures public network presence without claiming real reach.
- `OVR` blends the six attributes and maps them to 60–99.

Small samples are pulled closer to 50 to reduce accidental extremes. Tier comes from OVR; border comes from account age. They are independent.

## PNG Export And Sharing

The app exposes generated same-origin PNG links, separate from the responsive card on screen:

- Card PNG: `1000 × 1400`
- Social PNG: `1080 × 1350`

The share flow uses the Web Share API with file support when available, and falls back to copying the link/message or downloading the generated PNG.

## Privacy

SkyCards does not use a database, authentication, OAuth, analytics storage, Redis, Prisma, PostgreSQL, or internal accounts. It respects public Bluesky opt-out labels for unauthenticated display and does not generate fake stats when no public activity is available.

## Version 1 Limitations

- No login or authenticated Bluesky data
- No history, gallery, ranking, admin panel, payments, or notifications
- No unit or E2E test suite in this version
- Scores are entertainment summaries, not personal rankings or professional evaluations

Uses public Bluesky data. Scores are generated for entertainment. Not affiliated with Bluesky.
