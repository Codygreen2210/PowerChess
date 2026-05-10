import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      className="min-h-screen text-stone-100"
      style={{
        background:
          "radial-gradient(ellipse at top, #1a1614 0%, #0c0a09 50%, #050403 100%)",
      }}
    >
      {/* NAV */}
      <nav className="px-5 py-5 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-display text-2xl">♛</span>
          <span className="font-display text-lg tracking-widest">POWERCHESS</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/how-to-play"
            className="hidden sm:block font-display text-[11px] tracking-widest text-stone-400 hover:text-stone-100 transition"
          >
            HOW TO PLAY
          </Link>
          <Link
            href="/play"
            className="font-display text-[11px] sm:text-xs tracking-widest border border-amber-600/60 text-amber-200 hover:bg-amber-900/20 px-3 sm:px-4 py-1.5 sm:py-2 transition"
          >
            PLAY FREE
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-5 sm:px-10 pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 select-none">
          <div className="absolute top-10 left-10 text-9xl drift-slow text-amber-700">♚</div>
          <div className="absolute top-40 right-20 text-7xl drift-slow text-amber-700">♛</div>
          <div className="absolute bottom-20 left-1/3 text-8xl drift-slow text-amber-700">♞</div>
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-amber-500/70 text-[10px] sm:text-xs font-display tracking-[0.4em] mb-4 fade-in">
            CHESS · POWERED UP
          </div>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] mb-6 fade-in">
            Chess.
            <br />
            <span className="text-amber-300">With power-ups.</span>
          </h1>
          <p className="font-serif-classic text-xl sm:text-2xl text-stone-300 italic mb-10 max-w-2xl mx-auto fade-in">
            Every captured piece earns points. Spend them on power-up cards
            that freeze enemies, double your moves, or resurrect the fallen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 fade-in">
            <Link
              href="/play"
              className="w-full sm:w-auto font-display text-sm tracking-widest border-2 border-amber-500 bg-amber-900/30 text-amber-100 hover:bg-amber-900/50 px-8 py-4 transition"
              style={{ boxShadow: "0 0 30px rgba(212,162,79,0.3)" }}
            >
              PLAY FREE — NO SIGNUP
            </Link>
            <Link
              href="/how-to-play"
              className="w-full sm:w-auto font-display text-sm tracking-widest border border-stone-600 text-stone-300 hover:text-stone-100 hover:border-stone-400 px-8 py-4 transition"
            >
              HOW IT WORKS
            </Link>
          </div>
          <div className="mt-8 font-serif-italic text-sm text-stone-500 fade-in">
            Two players. Same device. Free forever.
          </div>
        </div>
      </section>

      {/* MECHANIC SHOWCASE */}
      <section className="px-5 sm:px-10 py-16 sm:py-24 border-t border-stone-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="text-amber-500/70 text-[10px] font-display tracking-[0.3em] mb-2">
              THE LOOP
            </div>
            <h2 className="font-display text-3xl sm:text-5xl mb-4">
              Capture. Power up. Conquer.
            </h2>
            <p className="font-serif-classic text-lg text-stone-400 italic max-w-xl mx-auto">
              Three steps. One devastating cycle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                num: "I",
                title: "Capture",
                body:
                  "Take pieces the way you always have. Each one is worth points: pawn 1, knight or bishop 2, rook 3, queen 5.",
                icon: "⚔",
              },
              {
                num: "II",
                title: "Power Up",
                body:
                  "Spend your points at the card market. Three tiers — Common (2), Arcane (4), Royal (7). Random draw within tier. Hand limit: three.",
                icon: "✶",
              },
              {
                num: "III",
                title: "Conquer",
                body:
                  "Play one card per turn. Freeze a queen. Double your moves. Resurrect a fallen knight. Every game is different.",
                icon: "♛",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative p-6 sm:p-8 border border-stone-800 rounded-sm grain"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(20,16,12,0.6) 0%, rgba(10,8,6,0.4) 100%)",
                }}
              >
                <div className="font-display text-amber-700/50 text-5xl mb-3">
                  {step.num}
                </div>
                <div className="text-3xl mb-3 text-amber-400/80">
                  {step.icon}
                </div>
                <h3 className="font-display text-xl mb-3 tracking-wider">
                  {step.title.toUpperCase()}
                </h3>
                <p className="font-serif-classic text-stone-300 text-base leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARD TIER PREVIEW */}
      <section className="px-5 sm:px-10 py-16 sm:py-24 border-t border-stone-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-amber-500/70 text-[10px] font-display tracking-[0.3em] mb-2">
              THE DECK
            </div>
            <h2 className="font-display text-3xl sm:text-5xl mb-4">
              Fifteen power-ups. Three tiers.
            </h2>
            <p className="font-serif-classic text-lg text-stone-400 italic">
              From peasant tricks to royal decrees.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            <TierCard
              name="COMMON"
              cost="2"
              color="#a8a29e"
              cards={[
                "Quickstep — pawns double-step",
                "Whisper — push enemy pawn",
                "Stalwart — shield a pawn",
                "Misdirection — freeze a pawn",
                "Conscript — return a pawn",
              ]}
            />
            <TierCard
              name="ARCANE"
              cost="4"
              color="#cd853f"
              cards={[
                "Knight's Leap — borrowed grace",
                "Aegis — shield any piece",
                "Frost Bind — freeze a piece",
                "Bombard — destroy a pawn",
                "Translocate — swap pieces",
              ]}
              highlighted
            />
            <TierCard
              name="ROYAL"
              cost="7"
              color="#d4a24f"
              cards={[
                "Double Strike — two moves",
                "Reincarnate — raise a minor",
                "Bishop's Blessing — queens",
                "Siege — lock the enemy",
                "Coronation — crown a pawn",
              ]}
            />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="px-5 sm:px-10 py-16 sm:py-24 border-t border-stone-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-amber-500/70 text-[10px] font-display tracking-[0.3em] mb-2">
            WHY POWERCHESS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl mb-8">
            Chess players, this is for you.
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 text-left">
            <Pillar title="Pure chess at the core">
              Castling, promotion, check, checkmate, stalemate — the rules you
              know. Power-ups are layered on top, not bolted in.
            </Pillar>
            <Pillar title="Tactics, deepened">
              Now a sacrifice doesn&apos;t just clear a square — it funds your next
              power-up. Every trade carries a second weight.
            </Pillar>
            <Pillar title="Pass-and-play, no friction">
              Open the link. Play. No accounts. No ads in the way. Hide-hand
              button for hot-seat fairness.
            </Pillar>
            <Pillar title="Mobile first">
              Built phone-up. The board fits your thumb, the cards fit your
              palm. Save it to your home screen.
            </Pillar>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 sm:px-10 py-20 sm:py-32 border-t border-stone-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-6xl mb-6">
            Ready to level up?
          </h2>
          <p className="font-serif-classic text-xl text-stone-400 italic mb-10">
            One game. About fifteen minutes. You&apos;ll play it twice.
          </p>
          <Link
            href="/play"
            className="inline-block font-display text-base tracking-widest border-2 border-amber-500 bg-amber-900/30 text-amber-100 hover:bg-amber-900/50 px-10 py-5 transition"
            style={{ boxShadow: "0 0 40px rgba(212,162,79,0.4)" }}
          >
            PLAY NOW
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 sm:px-10 py-8 border-t border-stone-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-400/60 font-display">♛</span>
            <span className="font-display text-[11px] tracking-widest text-stone-500">
              POWERCHESS · CHESS WITH POWER-UPS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/how-to-play"
              className="font-display text-[10px] tracking-widest text-stone-500 hover:text-stone-300"
            >
              HOW TO PLAY
            </Link>
            <Link
              href="/privacy"
              className="font-display text-[10px] tracking-widest text-stone-500 hover:text-stone-300"
            >
              PRIVACY
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function TierCard({
  name,
  cost,
  color,
  cards,
  highlighted,
}: {
  name: string;
  cost: string;
  color: string;
  cards: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className="relative p-6 rounded-sm grain"
      style={{
        background: highlighted
          ? "linear-gradient(180deg, rgba(46,35,26,0.8) 0%, rgba(28,20,11,0.6) 100%)"
          : "linear-gradient(180deg, rgba(26,22,18,0.6) 0%, rgba(14,10,7,0.4) 100%)",
        border: `1px solid ${color}40`,
        boxShadow: highlighted
          ? `0 0 30px ${color}30, inset 0 0 0 1px ${color}20`
          : "none",
      }}
    >
      <div
        className="font-display text-xs tracking-[0.3em] mb-1"
        style={{ color }}
      >
        TIER {name === "COMMON" ? "I" : name === "ARCANE" ? "II" : "III"}
      </div>
      <div className="flex items-baseline gap-3 mb-5">
        <h3 className="font-display text-2xl tracking-wider">{name}</h3>
        <div className="flex items-center gap-1">
          <span className="text-amber-400/60 text-xs">⚔</span>
          <span className="font-display text-lg" style={{ color }}>
            {cost}
          </span>
        </div>
      </div>
      <ul className="space-y-2">
        {cards.map((c) => (
          <li
            key={c}
            className="font-serif-classic text-sm text-stone-300 leading-snug"
          >
            <span className="text-amber-700/70 mr-2">·</span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pillar({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-base tracking-wider mb-2 text-amber-200">
        {title.toUpperCase()}
      </h3>
      <p className="font-serif-classic text-stone-400 text-base leading-relaxed">
        {children}
      </p>
    </div>
  );
}
