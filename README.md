# PowerChess — Chess with power-ups

Capture pieces to earn points. Spend them on power-up cards that change the game. Pure chess rules at the core; cards layered on top.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Vercel Analytics
**Deploy target:** Vercel

---

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment to Vercel (mobile workflow)

This project deploys directly from GitHub to Vercel — no local build needed.

1. Push this repo to GitHub under `codygreen2210/powerchess`.
2. In Vercel: **Add New Project → Import** the repo.
3. Vercel auto-detects Next.js. No config changes needed.
4. Set environment variable in Vercel project settings:
   - `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://powerchess.app` or `https://powerchess.vercel.app`)
5. Deploy. First deploy takes ~90 seconds.

### Custom domain

In Vercel: Project → Settings → Domains. Suggested: `powerchess.app`, `powerchess.gg`, or `playpowerchess.com` — verify availability on Namecheap/Vercel before buying.

### Mobile editing tip

GitHub's mobile app corrupts JS files on upload — use the **GitHub web editor** (paste into the in-browser editor) for any file changes from your phone.

---

## Architecture

```
app/
├── layout.tsx              # Root layout, SEO metadata, analytics
├── page.tsx                # Landing page (marketing)
├── globals.css             # Fonts, animations, base styles
├── sitemap.ts              # Dynamic sitemap
├── opengraph-image.tsx     # Auto-generated OG image
├── play/
│   └── page.tsx            # Game route (wraps client component)
├── how-to-play/
│   └── page.tsx            # Rules + complete card reference
├── privacy/
│   └── page.tsx            # Privacy policy
└── components/
    └── Game.tsx            # ⭐ The full chess engine + card system

public/
├── manifest.webmanifest    # PWA install
├── favicon.svg             # Queen glyph favicon
└── robots.txt              # SEO
```

The game is fully client-side and stateless on the server. All game state lives in a single client component.

---

## Game design

- **Standard chess rules:** castling, promotion (auto-queen), check, checkmate, stalemate. En passant intentionally omitted to keep rules approachable.
- **Piece values:** pawn 1, knight 2, bishop 2, rook 3, queen 5.
- **Three power-up tiers, 5 cards each:**
  - Common (2 pts) — pawn-themed utility
  - Arcane (4 pts) — versatile control
  - Royal (7 pts) — game-changers
- **Per turn:** 1 buy + 1 card play + 1 move. Hand limit: 3.

The card design philosophy: every card is fair (counterable, not a "win button") but strong enough to feel decisive when timed well.

---

## Go-to-market plan

The strategy fits a no-outreach, no-influencer distribution model. The game is the marketing.

### Why "PowerChess" works for SEO

The name does double duty: it's literal (chess + power-ups) and matches existing search intent. People searching "chess with power-ups", "chess powerups", or "chess game with abilities" will find us. The brand and the keyword are the same word.

### Launch sequence

| Week | Channel | Action |
|---|---|---|
| 1 | r/chessvariants | Show post: "I made PowerChess — chess where capturing pieces earns power-up cards" |
| 1 | r/webgames | Same post, gameplay GIF first |
| 1 | Hacker News (Show HN) | Tuesday morning Pacific. Title: "Show HN: PowerChess — chess with power-up cards" |
| 2 | Itch.io | Free page. Itch traffic for browser games is real and sticky. |
| 2 | r/boardgames | Position as a digital chess hybrid |
| 3 | ProductHunt | Launch Sunday or Monday for less competition |
| 3 | Twitter/X | Short gameplay clips, the OG image, replies in chess threads |
| 4 | Lichess forum (Off Topic) | Carefully — they're sensitive to self-promo. Frame as "what do you think" not "play my game" |

### Content moats for organic SEO

The `/how-to-play` page is the SEO play. It contains all 15 card descriptions — long-tail searches for any specific card name or chess variant terminology should rank. Already configured with proper meta tags and structured content.

Add later: a `/blog` route with strategy guides ("How to win with Royal cards", "PowerChess opening theory"), card balance discussions, dev diary. Each post is another door into the brand from search.

### Monetization ladder

1. **Free forever** (current) — drives traffic, builds reputation, no payment friction.
2. **Premium themes** ($3 one-time) — gold-leaf parchment, blood-and-bone, art deco. Stripe Checkout (matches your TrendPulseAI infrastructure). First proof of willingness to pay.
3. **AI opponent** ($5/mo) — single-player retention. Three difficulty tiers. Recurring revenue is what acquirers value most.
4. **Online multiplayer** ($5/mo) — rated ladder, custom decks. Network effects. Highest infrastructure cost but biggest moat.

Don't build all three at launch. Ship free, prove DAU first, then layer in themes when you have an audience.

---

## Acquisition strategy (build-to-sell)

This is what makes PowerChess sellable later, not just a hobby.

### What acquirers buy

Acquirers don't buy ideas, they buy proof. Two metrics matter:

1. **Daily active users (DAU)** — proof people want this. 1,000 DAU is a meaningful threshold; not just one viral spike but sticky usage.
2. **Monthly recurring revenue (MRR)** — proof people will pay. Even $500–$2,000/mo from premium tiers is real signal.

Once you have both, you have a real conversation with: **Chess.com**, **Lichess** (non-profit but strategic), **Play Magnus Group**, or casual game studios like **Voodoo** or **Playgendary**. They buy products that already work — you'd sell them ~6–18 months of de-risked product development plus an existing user base.

Realistic acquisition price for a small chess-variant property with proven traction: **$50k–$500k**, depending on traffic and revenue. Constellation-style portfolio play: not life-changing alone, but stack three of these and the math gets interesting.

### The OSS engine as a developer-SEO play

Once the game is launched and stable, extract the chess engine logic (no React, no UI, just move generation and rules) into a separate npm package: `powerchess-engine`. Publish MIT-licensed on GitHub and npm.

**Why bother:**
- Other developers building chess tools, tutorials, or AI projects search GitHub and npm for clean, modern chess engines
- Their READMEs, blog posts, and tutorials link back to powerchess.app as "the variant this engine powers"
- GitHub stars, npm downloads, and developer backlinks all boost the main domain's SEO authority
- Adds technical credibility when you go to acquirers ("we have a technical asset, not just a frontend")
- Costs almost nothing — the code is already written

Think of it like Vercel open-sourcing Next.js: the OSS thing drives adoption of the commercial thing.

---

## Roadmap

### MVP (this repo) — ✅ shipped
- Local 2-player hot-seat
- Full chess engine (castling, promotion, check, mate)
- Power-up card economy with 3 tiers, 15 cards
- PWA install, SEO, OG cards

### v0.2 — Quality of life + viral hook
- Move history with notation (PGN-like + card events)
- Undo last move (configurable per game)
- Settings: sound on/off, board theme picker (paid themes here later)
- **Replay sharing via URL hash** — encode game state in URL, share epic games on Twitter/Reddit. This is the strongest viral hook before any monetization.

### v0.3 — Themes (first revenue)
- Stripe Checkout for one-time theme purchases
- 3 themes: Gold Parchment (default, free), Blood & Bone, Art Deco
- $3 each. Low expectations on volume; high expectations on signal.

### v0.4 — AI opponent (first MRR)
- Minimax with alpha-beta pruning over chess+card state space
- Three difficulty tiers
- $5/mo subscription via Stripe. Free tier limited to 3 games per day.

### v0.5 — Online play (the moat)
- Real-time matches via WebSockets (Pusher or Ably; or Vercel native if available)
- Auth via Auth.js with Vercel Postgres (matches Flagged's stack)
- ELO rating system
- $5/mo for ranked + custom decks. Free tier for casual matches only.

### v1.0 — OSS engine extract
- Pull engine into separate `powerchess-engine` package
- Publish MIT-licensed on npm and GitHub
- README links back to powerchess.app

---

## Brand notes

- **Aesthetic:** dark mystical, parchment cards, gold leaf accents. Cinzel + Cormorant Garamond fonts.
- **Voice:** terse, slightly archaic, never cute. "Chess. With power-ups."
- **Tagline options to A/B test:**
  - "Chess. With power-ups." (current)
  - "Chess. Now with cards."
  - "Capture. Power up. Conquer."

---

## License

All rights reserved. Pre-launch, private project.

Once launched and stable, MIT-license the chess engine as a separate package (see acquisition strategy above).
