import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Play",
  description:
    "Learn PowerChess — chess with power-up cards. Standard chess rules, plus a card economy where captured pieces become currency.",
};

const CARDS_BY_TIER = {
  COMMON: [
    { name: "Quickstep", glyph: "⇈", desc: "For this turn, every one of your pawns may move two squares forward, regardless of starting position." },
    { name: "Whisper", glyph: "☾", desc: "Force one enemy pawn to advance one square. This replaces your normal move." },
    { name: "Stalwart", glyph: "◇", desc: "Choose one of your pawns. It cannot be captured until your next turn." },
    { name: "Misdirection", glyph: "✦", desc: "Choose an enemy pawn. It cannot move on their next turn." },
    { name: "Conscript", glyph: "✶", desc: "Place one of your captured pawns on an empty square of your second rank." },
  ],
  ARCANE: [
    { name: "Knight's Leap", glyph: "♞", desc: "Choose one of your pieces. It moves like a knight on your next move this turn." },
    { name: "Aegis", glyph: "◈", desc: "Choose one of your pieces. It cannot be captured until your next turn." },
    { name: "Frost Bind", glyph: "❄", desc: "Choose an enemy piece (not the king). It cannot move on their next turn." },
    { name: "Bombard", glyph: "✷", desc: "Remove any single pawn from the board, yours or theirs." },
    { name: "Translocate", glyph: "⟡", desc: "Swap the positions of two of your own pieces (neither can be the king)." },
  ],
  ROYAL: [
    { name: "Double Strike", glyph: "⚔", desc: "Make two full moves this turn instead of one." },
    { name: "Reincarnate", glyph: "✧", desc: "Return a captured pawn, knight, or bishop to an empty square on your back rank." },
    { name: "Bishop's Blessing", glyph: "✟", desc: "For this turn only, your bishops move like queens." },
    { name: "Siege", glyph: "⛨", desc: "On your opponent's next turn, only their pawns and king may move." },
    { name: "Coronation", glyph: "♕", desc: "Crown one of your pawns queen, wherever it stands on the board." },
  ],
};

const TIER_META: Record<string, { color: string; cost: number }> = {
  COMMON: { color: "#a8a29e", cost: 2 },
  ARCANE: { color: "#cd853f", cost: 4 },
  ROYAL: { color: "#d4a24f", cost: 7 },
};

export default function HowToPlayPage() {
  return (
    <main
      className="min-h-screen text-stone-100"
      style={{
        background:
          "radial-gradient(ellipse at top, #1a1614 0%, #0c0a09 50%, #050403 100%)",
      }}
    >
      <nav className="px-5 py-5 sm:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-amber-400 font-display text-2xl">♛</span>
          <span className="font-display text-lg tracking-widest">POWERCHESS</span>
        </Link>
        <Link
          href="/play"
          className="font-display text-[11px] sm:text-xs tracking-widest border border-amber-600/60 text-amber-200 hover:bg-amber-900/20 px-3 sm:px-4 py-1.5 sm:py-2 transition"
        >
          PLAY FREE
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-5 sm:px-10 py-10 sm:py-16">
        <div className="text-amber-500/70 text-[10px] font-display tracking-[0.3em] mb-2">
          THE CODEX
        </div>
        <h1 className="font-display text-4xl sm:text-6xl mb-8">How to Play</h1>

        <Section title="The Setup">
          PowerChess is chess for two players on a single device. Standard 8×8
          board, standard starting position, standard piece movement.
          White moves first. The objective is checkmate.
        </Section>

        <Section title="Standard Chess Rules That Apply">
          Castling, pawn promotion to queen, check, checkmate, and stalemate
          all work as in classical chess. <em>En passant is intentionally
          omitted</em> to keep the rules approachable for casual players.
        </Section>

        <Section title="The Card Economy">
          Every captured piece earns the capturer points. Spend points at the
          card market to draw a random card from one of three tiers.
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              { type: "Pawn", value: 1 },
              { type: "Knight", value: 2 },
              { type: "Bishop", value: 2 },
              { type: "Rook", value: 3 },
              { type: "Queen", value: 5 },
            ].map((p) => (
              <div
                key={p.type}
                className="border border-stone-800 p-3 rounded-sm"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(20,16,12,0.6) 0%, rgba(10,8,6,0.4) 100%)",
                }}
              >
                <div className="font-display text-[10px] tracking-widest text-stone-400">
                  {p.type.toUpperCase()}
                </div>
                <div className="font-display text-2xl text-amber-300 mt-1">
                  {p.value}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Each Turn You May">
          <ul className="space-y-2 mt-2 font-serif-classic">
            <li>
              <span className="text-amber-300 mr-2">·</span> Buy <em>one</em> card from any tier you can afford.
            </li>
            <li>
              <span className="text-amber-300 mr-2">·</span> Play <em>one</em> card from your hand.
            </li>
            <li>
              <span className="text-amber-300 mr-2">·</span> Make <em>one</em> move (with exceptions: <em>Double Strike</em> grants two moves; <em>Whisper</em> replaces your move).
            </li>
          </ul>
          <p className="mt-3">
            Hand limit is three cards. If your hand is full, play a card
            before buying another.
          </p>
        </Section>

        {Object.entries(CARDS_BY_TIER).map(([tierName, cards]) => {
          const meta = TIER_META[tierName];
          return (
            <div key={tierName} className="mt-12">
              <div className="flex items-baseline gap-3 mb-4">
                <h2
                  className="font-display text-2xl sm:text-3xl tracking-wider"
                  style={{ color: meta.color }}
                >
                  {tierName}
                </h2>
                <div className="flex items-center gap-1">
                  <span className="text-amber-400/70 text-xs">⚔</span>
                  <span
                    className="font-display text-base"
                    style={{ color: meta.color }}
                  >
                    {meta.cost}
                  </span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {cards.map((c) => (
                  <div
                    key={c.name}
                    className="p-4 border border-stone-800 rounded-sm"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(20,16,12,0.6) 0%, rgba(10,8,6,0.4) 100%)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-2xl"
                        style={{ color: meta.color }}
                      >
                        {c.glyph}
                      </span>
                      <span className="font-display text-sm tracking-widest">
                        {c.name.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-serif-classic text-stone-400 text-sm leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <Section title="Strategy" className="mt-12">
          <p className="mb-3">
            Sacrifices have new meaning. Trading a knight for a knight nets
            you the points to draw an Arcane card &mdash; potentially
            game-changing.
          </p>
          <p className="mb-3">
            Don&apos;t hoard. Cards in hand are dead weight if your opponent is
            buying Royals.
          </p>
          <p>
            Royal cards are decisive but slow to afford. Plan around the
            queen captures.
          </p>
        </Section>

        <div className="mt-16 text-center">
          <Link
            href="/play"
            className="inline-block font-display text-base tracking-widest border-2 border-amber-500 bg-amber-900/30 text-amber-100 hover:bg-amber-900/50 px-10 py-5 transition"
            style={{ boxShadow: "0 0 40px rgba(212,162,79,0.4)" }}
          >
            START A GAME
          </Link>
        </div>
      </article>

      <footer className="px-5 sm:px-10 py-8 border-t border-stone-900 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-amber-400/60 font-display">♛</span>
            <span className="font-display text-[11px] tracking-widest text-stone-500">
              POWERCHESS
            </span>
          </Link>
          <Link
            href="/privacy"
            className="font-display text-[10px] tracking-widest text-stone-500 hover:text-stone-300"
          >
            PRIVACY
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mt-8 ${className}`}>
      <h2 className="font-display text-xl sm:text-2xl tracking-wider mb-3 text-amber-200">
        {title.toUpperCase()}
      </h2>
      <div className="font-serif-classic text-stone-300 text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}
