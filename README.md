# Journey to Advent

A daily Advent devotional at **journeytoadvent.com**: one hymn a day from the First Sunday of Advent (Sun Nov 29, 2026) to Christmas Eve, with Scripture, a reflection, a word from the tradition, a question to carry, and the week's collect.

Next.js 16 (App Router, Cache Components) · Sanity (embedded Studio at `/studio`) · Tailwind 4 · Resend + React Email · Vercel Cron · PostHog.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional locally
npm run dev                  # http://localhost:3000
```

With no Sanity project ID, the site runs on built-in sample content (the season lineup plus the written weeks in `content/seed/`), so you can work on the design before the CMS exists.

**Time travel:** set `RELEASE_DATE_OVERRIDE=2026-12-17` to see the site as it will look on that date. It is ignored in production.

| Command | |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint`, `npm run typecheck` | Checks |
| `npm run seed -- --dry-run` | Preview what the seed script would write |
| `npm run seed` | Seed Sanity (season, weeks, 28 hymns, 26 entries, plus Markdown content) |
| `npm run seed -- --bonus` | Also create Day 27, Christmas Day, and extend the season to Dec 25 |

## How release works

- Every date check goes through `lib/date.ts` (`todayInChicago()`, `releaseDate()`, `isReleased()`).
- Pages are prerendered and cached. "Today" comes from `getToday()` in `lib/content.ts`, a cached value tagged `release-clock` that refreshes every 5 minutes on its own.
- At **06:05 UTC (00:05 Central)** Vercel Cron calls `/api/cron/daily?task=revalidate`, which expires `release-clock` so the new day appears on `/`, `/2026`, and its day page without a redeploy.
- Unreleased days return a real **404**, including their OG image and metadata. In Draft Mode (Studio preview) every day is visible.
- Content edits: the Sanity webhook hits `/api/revalidate`, which expires the matching cache tags.

## Setup checklist

### 1. Sanity
1. Create a project at sanity.io/manage (free tier). Note the project ID; dataset `production`.
2. Add `http://localhost:3000` and `https://journeytoadvent.com` under **API → CORS origins** (allow credentials).
3. Create two tokens under **API → Tokens**: a *Viewer* token (`SANITY_API_READ_TOKEN`) and an *Editor* token (`SANITY_API_WRITE_TOKEN`).
4. Open `/studio` → **Load content** and press the button (or run `npm run seed` with a write token). Then Structure → Seasons → 2026 → Weeks / All entries, plus Hymns.
5. Create a **GROQ webhook** (API → Webhooks):
   - URL: `https://journeytoadvent.com/api/revalidate`
   - Dataset: `production`; Trigger on create, update, delete
   - Filter: `_type in ["season", "week", "hymn", "entry"]`
   - Projection: `{_type, _id, "slug": slug.current, "year": coalesce(year, season->year), dayNumber}`
   - Secret: same as `SANITY_REVALIDATE_SECRET`

The Presentation tool in the Studio opens the real site in Draft Mode, so unreleased days and unpublished drafts are visible while editing.

### 2. Resend
1. Verify the `journeytoadvent.com` domain.
2. Create a Segment (formerly Audience) named "Journey to Advent 2026" → `RESEND_SEGMENT_ID`.
3. Set `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TEST_TO`, `SUBSCRIBE_SECRET`.

Sign-up is double opt-in: `/api/subscribe` emails a signed link (valid 7 days); the reader presses a button on `/subscribe/confirm` (a POST, so link scanners can't confirm for them); only then is the contact created and the welcome email sent. Honeypot field plus per-IP rate limiting.

**Daily send** (11:00 UTC = 5:00 AM Central): `/api/cron/daily?task=email` renders `emails/DailyEmail.tsx` and creates a Resend Broadcast to the segment. Before sending it takes a lock document `emailLog-YYYY-MM-DD` in Sanity, so a retry never double-sends (a failed send can be retried; a stale "sending" lock expires after 30 minutes).

Test without sending to subscribers:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://journeytoadvent.com/api/cron/daily?task=email&dryRun=1"
```

### 3. Vercel
1. Import the repo, add the environment variables, attach `journeytoadvent.com`.
2. `vercel.json` defines both crons. Set `CRON_SECRET`; Vercel sends it automatically.
3. Set `RELEASE_DATE_OVERRIDE` only on Preview deployments, never Production (it's ignored there anyway).

### 4. PostHog (analytics)
Set `NEXT_PUBLIC_POSTHOG_KEY` (and `NEXT_PUBLIC_POSTHOG_HOST` if your project is in the EU: `https://eu.i.posthog.com`), then redeploy. Open **Web analytics** in PostHog for a Google Analytics-style dashboard: visitors, page views, sessions, time on page, bounce rate, top pages, referrers, UTM campaigns, devices, and countries.

What's captured:
- Page views and page leaves (time on page, bounce rate, scroll depth)
- Clicks on links and buttons (nothing typed into forms)
- `entry_viewed`, `entry_finished` (reader reached the prayer), `recording_played`, `share_clicked`, `next_day_clicked`, `subscribe_submitted`, `subscribe_confirmed`

Events go through `/ingest` on this domain (a rewrite in `next.config.ts`) so ad blockers don't drop them. Do Not Track is respected; session recording is off. PostHog ignores automated browsers, so test with a real one: open the site, then check **Activity** in PostHog for a `$pageview`.

## Checking the setup

Visit **`/api/status`** on any deployment. It shows yes/no for each service (Sanity, PostHog, Resend, cron), how many seasons, entries, and hymns Sanity has, and which date the site thinks it is. It never shows secret values. Environment variable changes in Vercel need a redeploy before they show up.

## Content

- **Lineup and metadata:** `content/lineup.ts` (hymns, tunes, weeks, BCP 1979 collects, O Antiphons). Verify every hymn's text and attribution against Hymnary.org.
- **Seeding from Markdown:** each written week is a Markdown string in `content/seed/week-N.ts`, listed in `content/seed/index.ts` (`week-1.ts` holds Days 1–7). The Studio's **Load content** tool only fills empty fields; `npm run seed` overwrites them. Format: `## Day N · Weekday, Month D`, `### Hymn Title`, a blockquote of stanzas (blank `>` line between stanzas, `**1**` numbers, `— attribution`), then `**Read:**`, `**Reflect**`, `**From the tradition**`, `**Carry this:**`, `**Pray:**`. Re-running is safe.
- **Stanzas:** one line of verse per line; wrap a line in `*asterisks*` to set it in italic; mark a stanza as a refrain to italicize it.
- **Recordings:** YouTube video ID on the hymn (or per-day override). Nothing loads from YouTube until the reader presses play.
- **Copyright:** public-domain texts only (US: before 1929). *People, Look East* is US-only: one stanza at most. Scripture on the page is KJV; the link goes to the NRSV at Oremus.

## Where things live

```
app/(site)/            pages: home, [year], [year]/day/[n], hymns, about, subscribe
app/api/               subscribe, revalidate, cron/daily, draft-mode
app/studio/            embedded Sanity Studio
components/            DayEntry (the day page), CandleProgress, ListenBar, …
emails/                React Email templates
lib/content.ts         the only module that talks to the CMS
lib/date.ts            Chicago date logic
sanity/                schemas, queries, Studio structure
scripts/seed.ts        seed script
```

## Open questions

1. Include the Christmas Day bonus (Day 27)? Run `npm run seed -- --bonus` if so.
2. Byline wording and parish name: `lib/site.ts`.
3. Printable PDF booklet (`/2026/print`)? Not built.

Fonts: EB Garamond (SIL Open Font License), in `assets/fonts` for share images.
