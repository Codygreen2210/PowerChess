// PowerChess engine — card definitions, tiers, deck draws.

export interface TierDef {
  name: string;
  cost: number;
  color: string;
  glow: string;
  bg: string;
}

export const TIERS: Record<1 | 2 | 3, TierDef> = {
  1: { name: "COMMON", cost: 2, color: "#a8a29e", glow: "rgba(168,162,158,0.35)",
       bg: "linear-gradient(180deg, #2a2622 0%, #1a1714 100%)" },
  2: { name: "ARCANE", cost: 4, color: "#cd853f", glow: "rgba(205,133,63,0.45)",
       bg: "linear-gradient(180deg, #2e231a 0%, #1c140b 100%)" },
  3: { name: "ROYAL",  cost: 7, color: "#d4a24f", glow: "rgba(212,162,79,0.6)",
       bg: "linear-gradient(180deg, #322411 0%, #1f1607 100%)" },
};

export interface CardDef {
  tier: 1 | 2 | 3;
  name: string;
  glyph: string;
  short: string;
  description: string;
  flavor: string;
}

export const CARDS = {
  // ===== TIER 1 — COMMON =====
  quickstep: {
    tier: 1, name: "Quickstep", glyph: "⇈",
    short: "Pawns may double-step.",
    description: "For this turn, every one of your pawns may move two squares forward (regardless of starting position).",
    flavor: "The line breaks first.",
  },
  whisper: {
    tier: 1, name: "Whisper", glyph: "☾",
    short: "Force enemy pawn forward.",
    description: "Force one enemy pawn to advance one square. This replaces your normal move.",
    flavor: "A traitor's word, a kingdom's fall.",
  },
  stalwart: {
    tier: 1, name: "Stalwart", glyph: "◇",
    short: "Shield a pawn.",
    description: "Choose one of your pawns. It cannot be captured until your next turn.",
    flavor: "Held the line.",
  },
  misdirection: {
    tier: 1, name: "Misdirection", glyph: "✦",
    short: "Freeze enemy pawn.",
    description: "Choose an enemy pawn. It cannot move on their next turn.",
    flavor: "Look there. No, there.",
  },
  conscript: {
    tier: 1, name: "Conscript", glyph: "✶",
    short: "Return a captured pawn.",
    description: "Place one of your captured pawns on an empty square of your second rank.",
    flavor: "Press them back into service.",
  },

  // ===== TIER 2 — ARCANE =====
  knights_leap: {
    tier: 2, name: "Knight's Leap", glyph: "♞",
    short: "A piece moves like a knight.",
    description: "Choose one of your pieces. It moves like a knight on your next move this turn.",
    flavor: "Borrowed grace, lethal angle.",
  },
  aegis: {
    tier: 2, name: "Aegis", glyph: "◈",
    short: "Shield any piece.",
    description: "Choose one of your pieces. It cannot be captured until your next turn.",
    flavor: "What ancients gave, gods cannot take.",
  },
  frost_bind: {
    tier: 2, name: "Frost Bind", glyph: "❄",
    short: "Freeze any enemy piece.",
    description: "Choose an enemy piece (not the king). It cannot move on their next turn.",
    flavor: "Cold seeps into iron and bone.",
  },
  bombard: {
    tier: 2, name: "Bombard", glyph: "✷",
    short: "Destroy any pawn.",
    description: "Remove any single pawn from the board, yours or theirs.",
    flavor: "One shot. One pawn.",
  },
  translocate: {
    tier: 2, name: "Translocate", glyph: "⟡",
    short: "Swap two of your pieces.",
    description: "Swap the positions of two of your own pieces (neither can be the king).",
    flavor: "Geometry bends for the desperate.",
  },

  // ===== TIER 3 — ROYAL =====
  double_strike: {
    tier: 3, name: "Double Strike", glyph: "⚔",
    short: "Two moves this turn.",
    description: "Make two full moves this turn instead of one.",
    flavor: "Two blades. One breath.",
  },
  reincarnate: {
    tier: 3, name: "Reincarnate", glyph: "✧",
    short: "Return any minor piece.",
    description: "Return a captured pawn, knight, or bishop to an empty square on your back rank.",
    flavor: "They return wearing iron faces.",
  },
  bishops_blessing: {
    tier: 3, name: "Bishop's Blessing", glyph: "✟",
    short: "Bishops move like queens.",
    description: "For this turn only, your bishops move like queens.",
    flavor: "Faith, briefly unbound.",
  },
  siege: {
    tier: 3, name: "Siege", glyph: "⛨",
    short: "Lock down opponent.",
    description: "On your opponent's next turn, only their pawns and king may move.",
    flavor: "The walls close in.",
  },
  coronation: {
    tier: 3, name: "Coronation", glyph: "♕",
    short: "Promote a pawn instantly.",
    description: "Crown one of your pawns queen, wherever it stands on the board.",
    flavor: "Crown them now. Mourn them later.",
  },
} as const satisfies Record<string, CardDef>;

export type CardKey = keyof typeof CARDS;
export const CARD_KEYS = Object.keys(CARDS) as CardKey[];

export const HAND_LIMIT = 3;

export interface Card {
  id: string;
  key: CardKey;
}

export function drawFromTier(tier: 1 | 2 | 3): Card {
  const keys = CARD_KEYS.filter((k) => CARDS[k].tier === tier);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return { id: `c${Math.random().toString(36).slice(2, 9)}`, key };
}
