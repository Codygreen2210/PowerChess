"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Piece as PieceSVG, DEFAULT_PIECE_STYLE } from "./pieces";

// =====================================================================
// TYPES
// =====================================================================

type Color = "white" | "black";
type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

interface Piece {
  id: string;
  type: PieceType;
  color: Color;
  hasMoved: boolean;
}

type Square = Piece | null;
type Board = Square[][];

interface Move {
  r: number;
  c: number;
  capture?: boolean;
  castle?: "kingside" | "queenside";
}

interface Card {
  id: string;
  key: CardKey;
}

interface Effect {
  id: string;
  kind: "frost_bind" | "aegis" | "siege";
  targetId?: string;
  ownerOfTarget?: Color;
  restrictedColor?: Color;
  expiresAfter: Color;
}

interface ActiveCard {
  card: Card;
  step: string;
  payload: Record<string, unknown>;
}

interface GameOver {
  winner: Color | null;
  reason: string;
}

// =====================================================================
// CONSTANTS
// =====================================================================

const PIECE_GLYPH: Record<Color, Record<PieceType, string>> = {
  white: { king: "♔", queen: "♕", rook: "♖", bishop: "♗", knight: "♘", pawn: "♙" },
  black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" },
};

const PIECE_VALUE: Record<PieceType, number> = {
  pawn: 1, knight: 2, bishop: 2, rook: 3, queen: 5, king: 0,
};

interface TierDef {
  name: string;
  cost: number;
  color: string;
  glow: string;
  bg: string;
}

const TIERS: Record<1 | 2 | 3, TierDef> = {
  1: { name: "COMMON", cost: 2, color: "#a8a29e", glow: "rgba(168,162,158,0.35)",
       bg: "linear-gradient(180deg, #2a2622 0%, #1a1714 100%)" },
  2: { name: "ARCANE", cost: 4, color: "#cd853f", glow: "rgba(205,133,63,0.45)",
       bg: "linear-gradient(180deg, #2e231a 0%, #1c140b 100%)" },
  3: { name: "ROYAL",  cost: 7, color: "#d4a24f", glow: "rgba(212,162,79,0.6)",
       bg: "linear-gradient(180deg, #322411 0%, #1f1607 100%)" },
};

interface CardDef {
  tier: 1 | 2 | 3;
  name: string;
  glyph: string;
  short: string;
  description: string;
  flavor: string;
}

const CARDS = {
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

type CardKey = keyof typeof CARDS;
const CARD_KEYS = Object.keys(CARDS) as CardKey[];

const HAND_LIMIT = 3;

// =====================================================================
// HELPERS
// =====================================================================

let _idCounter = 1;
const cuid = () => `p${_idCounter++}`;
const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function drawFromTier(tier: 1 | 2 | 3): Card {
  const keys = CARD_KEYS.filter((k) => CARDS[k].tier === tier);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return { id: `c${Math.random().toString(36).slice(2, 9)}`, key };
}

function makeInitialBoard(): Board {
  _idCounter = 1;
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back: PieceType[] = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
  for (let c = 0; c < 8; c++) {
    board[0][c] = { id: cuid(), type: back[c], color: "black", hasMoved: false };
    board[1][c] = { id: cuid(), type: "pawn",  color: "black", hasMoved: false };
    board[6][c] = { id: cuid(), type: "pawn",  color: "white", hasMoved: false };
    board[7][c] = { id: cuid(), type: back[c], color: "white", hasMoved: false };
  }
  return board;
}

// =====================================================================
// CHESS ENGINE
// =====================================================================

interface PieceMoveOpts {
  asType?: PieceType | null;
  includeCastle?: boolean;
  quickstepActive?: boolean;
}

function getPieceMoves(board: Board, r: number, c: number, opts: PieceMoveOpts = {}): Move[] {
  const { asType = null, includeCastle = true, quickstepActive = false } = opts;
  const piece = board[r][c];
  if (!piece) return [];
  const type = asType || piece.type;
  const color = piece.color;
  const opp: Color = color === "white" ? "black" : "white";
  const moves: Move[] = [];

  const slide = (dr: number, dc: number) => {
    let nr = r + dr, nc = c + dc;
    while (inBounds(nr, nc)) {
      const t = board[nr][nc];
      if (!t) moves.push({ r: nr, c: nc });
      else { if (t.color === opp) moves.push({ r: nr, c: nc, capture: true }); break; }
      nr += dr; nc += dc;
    }
  };
  const step = (dr: number, dc: number) => {
    const nr = r + dr, nc = c + dc;
    if (!inBounds(nr, nc)) return;
    const t = board[nr][nc];
    if (!t) moves.push({ r: nr, c: nc });
    else if (t.color === opp) moves.push({ r: nr, c: nc, capture: true });
  };

  if (type === "pawn") {
    const dir = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;
    if (inBounds(r + dir, c) && !board[r + dir][c]) {
      moves.push({ r: r + dir, c });
      const canDoubleStep = r === startRow || quickstepActive;
      if (canDoubleStep && inBounds(r + 2 * dir, c) && !board[r + 2 * dir][c]) {
        moves.push({ r: r + 2 * dir, c });
      }
    }
    for (const dc of [-1, 1]) {
      const nr = r + dir, nc = c + dc;
      if (inBounds(nr, nc) && board[nr][nc] && board[nr][nc]!.color === opp) {
        moves.push({ r: nr, c: nc, capture: true });
      }
    }
  } else if (type === "knight") {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => step(dr,dc));
  } else if (type === "bishop") {
    [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => slide(dr,dc));
  } else if (type === "rook") {
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => slide(dr,dc));
  } else if (type === "queen") {
    [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => slide(dr,dc));
  } else if (type === "king") {
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => step(dr,dc));
    if (includeCastle && !piece.hasMoved && !isInCheck(board, color)) {
      const krow = r;
      const kRook = board[krow][7];
      if (kRook && kRook.type === "rook" && kRook.color === color && !kRook.hasMoved
          && !board[krow][5] && !board[krow][6]
          && !squareAttacked(board, krow, 5, opp) && !squareAttacked(board, krow, 6, opp)) {
        moves.push({ r: krow, c: 6, castle: "kingside" });
      }
      const qRook = board[krow][0];
      if (qRook && qRook.type === "rook" && qRook.color === color && !qRook.hasMoved
          && !board[krow][1] && !board[krow][2] && !board[krow][3]
          && !squareAttacked(board, krow, 3, opp) && !squareAttacked(board, krow, 2, opp)) {
        moves.push({ r: krow, c: 2, castle: "queenside" });
      }
    }
  }
  return moves;
}

function squareAttacked(board: Board, r: number, c: number, byColor: Color): boolean {
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const p = board[i][j];
    if (!p || p.color !== byColor) continue;
    if (p.type === "pawn") {
      const dir = p.color === "white" ? -1 : 1;
      if (i + dir === r && (j - 1 === c || j + 1 === c)) return true;
    } else {
      const moves = getPieceMoves(board, i, j, { includeCastle: false });
      if (moves.some((m) => m.r === r && m.c === c)) return true;
    }
  }
  return false;
}

function findKing(board: Board, color: Color): { r: number; c: number } | null {
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const p = board[i][j];
    if (p && p.type === "king" && p.color === color) return { r: i, c: j };
  }
  return null;
}

function isInCheck(board: Board, color: Color): boolean {
  const k = findKing(board, color);
  if (!k) return false;
  const opp: Color = color === "white" ? "black" : "white";
  return squareAttacked(board, k.r, k.c, opp);
}

function applyMove(board: Board, fr: number, fc: number, move: Move): Board {
  const next: Board = board.map((row) => row.map((p) => (p ? { ...p } : null)));
  const piece = next[fr][fc]!;
  next[fr][fc] = null;
  if (move.castle) {
    next[move.r][move.c] = { ...piece, hasMoved: true };
    if (move.castle === "kingside") {
      next[move.r][5] = { ...next[move.r][7]!, hasMoved: true };
      next[move.r][7] = null;
    } else {
      next[move.r][3] = { ...next[move.r][0]!, hasMoved: true };
      next[move.r][0] = null;
    }
  } else {
    next[move.r][move.c] = { ...piece, hasMoved: true };
    if (piece.type === "pawn" && (move.r === 0 || move.r === 7)) {
      next[move.r][move.c] = { ...next[move.r][move.c]!, type: "queen" };
    }
  }
  return next;
}

interface LegalMoveOpts {
  knightLeapPieceId: string | null;
  bishopsBlessingActive: boolean;
  quickstepActive: boolean;
  effects: Effect[];
  turn: Color;
}

function getEffectiveLegalMoves(board: Board, r: number, c: number, options: LegalMoveOpts): Move[] {
  const { knightLeapPieceId, bishopsBlessingActive, quickstepActive, effects, turn } = options;
  const piece = board[r][c];
  if (!piece) return [];
  if (piece.color !== turn) return [];
  if (effects.some((e) => e.kind === "frost_bind" && e.targetId === piece.id)) return [];
  const sieged = effects.some((e) => e.kind === "siege" && e.restrictedColor === piece.color);
  if (sieged && piece.type !== "pawn" && piece.type !== "king") return [];

  let effType: PieceType = piece.type;
  if (knightLeapPieceId === piece.id) effType = "knight";
  else if (bishopsBlessingActive && piece.type === "bishop") effType = "queen";

  let moves = getPieceMoves(board, r, c, { asType: effType, quickstepActive });
  moves = moves.filter((m) => {
    const t = board[m.r][m.c];
    if (t && effects.some((e) => e.kind === "aegis" && e.targetId === t.id)) return false;
    return true;
  });
  moves = moves.filter((m) => {
    const next = applyMove(board, r, c, m);
    return !isInCheck(next, piece.color);
  });
  return moves;
}

function hasAnyLegalMove(board: Board, color: Color, effects: Effect[], quickstepActive = false): boolean {
  const sieged = effects.some((e) => e.kind === "siege" && e.restrictedColor === color);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const piece = board[r][c];
    if (!piece || piece.color !== color) continue;
    if (effects.some((e) => e.kind === "frost_bind" && e.targetId === piece.id)) continue;
    if (sieged && piece.type !== "pawn" && piece.type !== "king") continue;
    const moves = getPieceMoves(board, r, c, { quickstepActive });
    for (const m of moves) {
      const t = board[m.r][m.c];
      if (t && effects.some((e) => e.kind === "aegis" && e.targetId === t.id)) continue;
      const next = applyMove(board, r, c, m);
      if (!isInCheck(next, color)) return true;
    }
  }
  return false;
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================

export default function Game() {
  const [board, setBoard] = useState<Board>(makeInitialBoard);
  const [turn, setTurn] = useState<Color>("white");
  const [hands, setHands] = useState<Record<Color, Card[]>>({ white: [], black: [] });
  const [points, setPoints] = useState<Record<Color, number>>({ white: 0, black: 0 });
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const [cardPlayedThisTurn, setCardPlayedThisTurn] = useState(false);
  const [boughtThisTurn, setBoughtThisTurn] = useState(false);
  const [extraMoves, setExtraMoves] = useState(0);
  const [knightLeapPieceId, setKnightLeapPieceId] = useState<string | null>(null);
  const [bishopsBlessingActive, setBishopsBlessingActive] = useState(false);
  const [quickstepActive, setQuickstepActive] = useState(false);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [captured, setCaptured] = useState<Record<Color, Piece[]>>({ white: [], black: [] });
  const [gameOver, setGameOver] = useState<GameOver | null>(null);
  const [message, setMessage] = useState("White to move. Capture pieces to earn points and buy cards.");
  const [showRules, setShowRules] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<CardKey | null>(null);
  const [hoveredTier, setHoveredTier] = useState<1 | 2 | 3 | null>(null);
  const [lastMove, setLastMove] = useState<{ from: { r: number; c: number }; to: { r: number; c: number } } | null>(null);
  const [hideHand, setHideHand] = useState(false);
  const [drawAnimation, setDrawAnimation] = useState<{ color: Color; cardKey: CardKey } | null>(null);

  const legalMoves = useMemo<Move[]>(() => {
    if (!selected || activeCard || gameOver) return [];
    return getEffectiveLegalMoves(board, selected.r, selected.c, {
      knightLeapPieceId, bishopsBlessingActive, quickstepActive, effects, turn,
    });
  }, [selected, board, knightLeapPieceId, bishopsBlessingActive, quickstepActive, effects, turn, activeCard, gameOver]);

  const inCheckColor = useMemo<Color | null>(() => {
    if (gameOver) return null;
    return isInCheck(board, turn) ? turn : null;
  }, [board, turn, gameOver]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem("powerchess_seen_rules")) {
        setShowRules(true);
      }
    } catch { setShowRules(true); }
  }, []);

  function dismissRules() {
    setShowRules(false);
    try { if (typeof window !== "undefined") localStorage.setItem("powerchess_seen_rules", "1"); } catch {}
  }

  function consumeCard(cardId: string) {
    setHands((h) => ({ ...h, [turn]: h[turn].filter((c) => c.id !== cardId) }));
    setCardPlayedThisTurn(true);
  }

  function clearActive() { setActiveCard(null); }

  function endTurn(newBoard: Board, newEffects?: Effect[]) {
    const justEnded = turn;
    const next: Color = turn === "white" ? "black" : "white";
    const baseEffects = newEffects ?? effects;
    const filtered = baseEffects.filter((e) => e.expiresAfter !== justEnded);
    setEffects(filtered);
    setBishopsBlessingActive(false);
    setKnightLeapPieceId(null);
    setQuickstepActive(false);
    setCardPlayedThisTurn(false);
    setBoughtThisTurn(false);
    setExtraMoves(0);
    setActiveCard(null);
    setSelected(null);
    setTurn(next);
    setHideHand(false);

    const checkNow = isInCheck(newBoard, next);
    const hasMoves = hasAnyLegalMove(newBoard, next, filtered, false);
    if (!hasMoves) {
      if (checkNow) {
        const winner: Color = next === "white" ? "black" : "white";
        setGameOver({ winner, reason: "Checkmate" });
        setMessage(`Checkmate. ${cap(winner)} wins.`);
      } else {
        setGameOver({ winner: null, reason: "Stalemate" });
        setMessage("Stalemate. Drawn game.");
      }
    } else if (checkNow) {
      setMessage(`${cap(next)} is in check.`);
    } else {
      setMessage(`${cap(next)} to move.`);
    }
  }

  function performMove(fr: number, fc: number, move: Move) {
    const piece = board[fr][fc]!;
    const target = board[move.r][move.c];
    const newBoard = applyMove(board, fr, fc, move);

    if (target) {
      const value = PIECE_VALUE[target.type] || 0;
      setPoints((p) => ({ ...p, [turn]: p[turn] + value }));
      setCaptured((c) => ({ ...c, [target.color]: [...c[target.color], target] }));
    }

    setBoard(newBoard);
    setLastMove({ from: { r: fr, c: fc }, to: { r: move.r, c: move.c } });
    setSelected(null);
    if (knightLeapPieceId === piece.id) setKnightLeapPieceId(null);

    if (extraMoves > 0) {
      setExtraMoves(extraMoves - 1);
      const opp: Color = turn === "white" ? "black" : "white";
      if (!hasAnyLegalMove(newBoard, opp, effects, false) && isInCheck(newBoard, opp)) {
        setGameOver({ winner: turn, reason: "Checkmate" });
        setMessage(`Checkmate. ${cap(turn)} wins.`);
        return;
      }
      setMessage(`${cap(turn)}: take your second move.`);
    } else {
      endTurn(newBoard);
    }
  }

  function handleSquareClick(r: number, c: number) {
    if (gameOver) return;
    if (activeCard) { handleCardSquareClick(r, c); return; }

    const piece = board[r][c];
    if (!selected) {
      if (piece && piece.color === turn) setSelected({ r, c });
      return;
    }
    if (selected.r === r && selected.c === c) { setSelected(null); return; }
    if (piece && piece.color === turn) { setSelected({ r, c }); return; }

    const move = legalMoves.find((m) => m.r === r && m.c === c);
    if (!move) { setSelected(null); return; }
    performMove(selected.r, selected.c, move);
  }

  function handleBuy(tier: 1 | 2 | 3) {
    if (gameOver || boughtThisTurn || activeCard || extraMoves > 0) return;
    if (hands[turn].length >= HAND_LIMIT) {
      setMessage(`Your hand is full (${HAND_LIMIT} cards). Play a card first.`);
      return;
    }
    const cost = TIERS[tier].cost;
    if (points[turn] < cost) {
      setMessage(`Not enough points. ${TIERS[tier].name} costs ${cost}.`);
      return;
    }
    const card = drawFromTier(tier);
    setPoints((p) => ({ ...p, [turn]: p[turn] - cost }));
    setHands((h) => ({ ...h, [turn]: [...h[turn], card] }));
    setBoughtThisTurn(true);
    setDrawAnimation({ color: turn, cardKey: card.key });
    setTimeout(() => setDrawAnimation(null), 1400);
    setMessage(`Drew ${CARDS[card.key].name}. ${CARDS[card.key].short}`);
  }

  function handleCardClick(card: Card) {
    if (gameOver || cardPlayedThisTurn || extraMoves > 0) return;
    if (activeCard && activeCard.card.id === card.id) {
      clearActive(); setMessage(`${cap(turn)} to move.`); return;
    }
    setSelected(null);
    const opp: Color = turn === "white" ? "black" : "white";

    switch (card.key) {
      case "double_strike":
        setExtraMoves(1); consumeCard(card.id); clearActive();
        setMessage("Double Strike: you have two moves this turn.");
        break;
      case "bishops_blessing":
        setBishopsBlessingActive(true); consumeCard(card.id); clearActive();
        setMessage("Your bishops move like queens this turn.");
        break;
      case "quickstep":
        setQuickstepActive(true); consumeCard(card.id); clearActive();
        setMessage("All your pawns may double-step this turn.");
        break;
      case "siege":
        setEffects((e) => [...e, { id: cuid(), kind: "siege", restrictedColor: opp, expiresAfter: opp }]);
        consumeCard(card.id); clearActive();
        setMessage(`Siege set. ${cap(opp)} is restricted to pawns and king next turn.`);
        break;
      case "conscript": {
        const dead = captured[turn].filter((p) => p.type === "pawn");
        if (dead.length === 0) { setMessage("No pawns to conscript."); return; }
        setActiveCard({ card, step: "conscript_place", payload: {} });
        setMessage(`Click an empty square on rank ${turn === "white" ? "2" : "7"}.`);
        break;
      }
      case "reincarnate": {
        const eligible = captured[turn].filter((p) => ["pawn", "knight", "bishop"].includes(p.type));
        if (eligible.length === 0) { setMessage("No eligible pieces to reincarnate."); return; }
        const unique: Piece[] = [];
        for (const p of eligible) if (!unique.some((u) => u.type === p.type)) unique.push(p);
        setActiveCard({ card, step: "reincarnate_pick", payload: { unique } });
        setMessage("Choose a fallen piece to bring back.");
        break;
      }
      case "coronation": {
        let hasPawn = false;
        for (let r = 0; r < 8 && !hasPawn; r++)
          for (let c = 0; c < 8 && !hasPawn; c++)
            if (board[r][c] && board[r][c]!.color === turn && board[r][c]!.type === "pawn") hasPawn = true;
        if (!hasPawn) { setMessage("No pawns to crown."); return; }
        setActiveCard({ card, step: "coronate_pawn", payload: {} });
        setMessage("Click one of your pawns to crown it queen.");
        break;
      }
      case "knights_leap":
        setActiveCard({ card, step: "select_own_piece", payload: {} });
        setMessage("Click one of your pieces — it moves like a knight this turn.");
        break;
      case "aegis":
        setActiveCard({ card, step: "select_own_piece", payload: {} });
        setMessage("Click one of your pieces to shield it.");
        break;
      case "stalwart":
        setActiveCard({ card, step: "select_own_pawn_shield", payload: {} });
        setMessage("Click one of your pawns to shield it.");
        break;
      case "frost_bind":
        setActiveCard({ card, step: "select_enemy_piece", payload: {} });
        setMessage("Click an enemy piece (not the king) to freeze it.");
        break;
      case "misdirection":
        setActiveCard({ card, step: "select_enemy_pawn_freeze", payload: {} });
        setMessage("Click an enemy pawn to freeze it.");
        break;
      case "bombard":
        setActiveCard({ card, step: "select_pawn", payload: {} });
        setMessage("Click any pawn to destroy it.");
        break;
      case "translocate":
        setActiveCard({ card, step: "translocate_first", payload: {} });
        setMessage("Click your first piece to swap (not your king).");
        break;
      case "whisper":
        setActiveCard({ card, step: "whisper_pawn", payload: {} });
        setMessage("Click an enemy pawn to push it forward. This is your move.");
        break;
    }
  }

  function handleCardSquareClick(r: number, c: number) {
    if (!activeCard) return;
    const piece = board[r][c];
    const card = activeCard.card;
    const opp: Color = turn === "white" ? "black" : "white";

    switch (activeCard.step) {
      case "select_own_piece": {
        if (!piece || piece.color !== turn) return;
        if (card.key === "aegis") {
          setEffects((e) => [...e, { id: cuid(), kind: "aegis", targetId: piece.id, ownerOfTarget: turn, expiresAfter: opp }]);
          setMessage(`Your ${piece.type} is shielded.`);
        } else if (card.key === "knights_leap") {
          setKnightLeapPieceId(piece.id);
          setMessage(`Your ${piece.type} moves like a knight. Make your move.`);
        }
        consumeCard(card.id); clearActive(); break;
      }
      case "select_own_pawn_shield": {
        if (!piece || piece.color !== turn || piece.type !== "pawn") return;
        setEffects((e) => [...e, { id: cuid(), kind: "aegis", targetId: piece.id, ownerOfTarget: turn, expiresAfter: opp }]);
        setMessage("Your pawn is shielded.");
        consumeCard(card.id); clearActive(); break;
      }
      case "select_enemy_piece": {
        if (!piece || piece.color !== opp) return;
        if (piece.type === "king") { setMessage("Can't freeze the king."); return; }
        setEffects((e) => [...e, { id: cuid(), kind: "frost_bind", targetId: piece.id, expiresAfter: opp }]);
        setMessage(`Enemy ${piece.type} is frozen.`);
        consumeCard(card.id); clearActive(); break;
      }
      case "select_enemy_pawn_freeze": {
        if (!piece || piece.color !== opp || piece.type !== "pawn") return;
        setEffects((e) => [...e, { id: cuid(), kind: "frost_bind", targetId: piece.id, expiresAfter: opp }]);
        setMessage("Enemy pawn is frozen.");
        consumeCard(card.id); clearActive(); break;
      }
      case "select_pawn": {
        if (!piece || piece.type !== "pawn") return;
        const nb: Board = board.map((row) => row.map((p) => (p ? { ...p } : null)));
        nb[r][c] = null;
        setBoard(nb);
        setCaptured((c0) => ({ ...c0, [piece.color]: [...c0[piece.color], piece] }));
        setMessage(`${cap(piece.color)} pawn destroyed.`);
        consumeCard(card.id); clearActive(); break;
      }
      case "conscript_place": {
        const rank = turn === "white" ? 6 : 1;
        if (r !== rank || piece) return;
        const nb: Board = board.map((row) => row.map((p) => (p ? { ...p } : null)));
        nb[r][c] = { id: cuid(), type: "pawn", color: turn, hasMoved: true };
        setCaptured((c0) => {
          const arr = [...c0[turn]];
          const idx = arr.findIndex((p) => p.type === "pawn");
          if (idx !== -1) arr.splice(idx, 1);
          return { ...c0, [turn]: arr };
        });
        setBoard(nb);
        setMessage("Pawn conscripted to the field.");
        consumeCard(card.id); clearActive(); break;
      }
      case "reincarnate_place": {
        const rank = turn === "white" ? 7 : 0;
        if (r !== rank || piece) return;
        const pickedType = activeCard.payload.pickedType as PieceType;
        const nb: Board = board.map((row) => row.map((p) => (p ? { ...p } : null)));
        nb[r][c] = { id: cuid(), type: pickedType, color: turn, hasMoved: true };
        setCaptured((c0) => {
          const arr = [...c0[turn]];
          const idx = arr.findIndex((p) => p.type === pickedType);
          if (idx !== -1) arr.splice(idx, 1);
          return { ...c0, [turn]: arr };
        });
        setBoard(nb);
        setMessage(`${cap(pickedType)} reincarnated.`);
        consumeCard(card.id); clearActive(); break;
      }
      case "coronate_pawn": {
        if (!piece || piece.color !== turn || piece.type !== "pawn") return;
        const nb: Board = board.map((row) => row.map((p) => (p ? { ...p } : null)));
        nb[r][c] = { ...nb[r][c]!, type: "queen" };
        setBoard(nb);
        setMessage("Pawn crowned queen.");
        consumeCard(card.id); clearActive(); break;
      }
      case "translocate_first": {
        if (!piece || piece.color !== turn || piece.type === "king") return;
        setActiveCard({ card, step: "translocate_second", payload: { first: { r, c } } });
        setMessage("Now click another of your pieces to swap with.");
        break;
      }
      case "translocate_second": {
        if (!piece || piece.color !== turn || piece.type === "king") return;
        const first = activeCard.payload.first as { r: number; c: number };
        if (first.r === r && first.c === c) return;
        const nb: Board = board.map((row) => row.map((p) => (p ? { ...p } : null)));
        const a = nb[first.r][first.c]!, b = nb[r][c]!;
        nb[first.r][first.c] = { ...b, hasMoved: true };
        nb[r][c] = { ...a, hasMoved: true };
        if (isInCheck(nb, turn)) {
          setMessage("That swap would expose your king. Pick again.");
          setActiveCard({ card, step: "translocate_first", payload: {} });
          return;
        }
        setBoard(nb);
        setMessage("Pieces swapped.");
        consumeCard(card.id); clearActive(); break;
      }
      case "whisper_pawn": {
        if (!piece || piece.color !== opp || piece.type !== "pawn") return;
        const enemyDir = opp === "white" ? -1 : 1;
        const nr = r + enemyDir;
        if (!inBounds(nr, c) || board[nr][c]) {
          setMessage("That pawn cannot move forward. Pick another."); return;
        }
        const nb: Board = board.map((row) => row.map((p) => (p ? { ...p } : null)));
        nb[nr][c] = { ...nb[r][c]!, hasMoved: true };
        nb[r][c] = null;
        if (isInCheck(nb, turn)) {
          setMessage("That would put you in check. Pick another."); return;
        }
        setBoard(nb);
        setLastMove({ from: { r, c }, to: { r: nr, c } });
        consumeCard(card.id); clearActive();
        endTurn(nb);
        break;
      }
    }
  }

  function pickReincarnateType(type: PieceType) {
    if (!activeCard) return;
    setActiveCard({
      ...activeCard, step: "reincarnate_place",
      payload: { ...activeCard.payload, pickedType: type },
    });
    setMessage(`Click an empty square on your back rank to place the ${type}.`);
  }

  function handleNewGame() {
    setBoard(makeInitialBoard()); setTurn("white");
    setHands({ white: [], black: [] }); setPoints({ white: 0, black: 0 });
    setSelected(null); setActiveCard(null);
    setCardPlayedThisTurn(false); setBoughtThisTurn(false);
    setExtraMoves(0); setKnightLeapPieceId(null);
    setBishopsBlessingActive(false); setQuickstepActive(false);
    setEffects([]); setCaptured({ white: [], black: [] });
    setGameOver(null);
    setMessage("White to move. Capture pieces to earn points and buy cards.");
    setLastMove(null); setHideHand(false); setDrawAnimation(null);
  }

  function handleSkipExtra() { if (extraMoves > 0) endTurn(board); }

  const targetHighlight = useMemo<Set<string>>(() => {
    if (!activeCard) return new Set();
    const set = new Set<string>();
    const opp: Color = turn === "white" ? "black" : "white";
    const step = activeCard.step;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (step === "select_own_piece" && p && p.color === turn) set.add(`${r},${c}`);
      if (step === "select_own_pawn_shield" && p && p.color === turn && p.type === "pawn") set.add(`${r},${c}`);
      if (step === "select_enemy_piece" && p && p.color === opp && p.type !== "king") set.add(`${r},${c}`);
      if (step === "select_enemy_pawn_freeze" && p && p.color === opp && p.type === "pawn") set.add(`${r},${c}`);
      if (step === "select_pawn" && p && p.type === "pawn") set.add(`${r},${c}`);
      if (step === "conscript_place") {
        const rank = turn === "white" ? 6 : 1;
        if (r === rank && !p) set.add(`${r},${c}`);
      }
      if (step === "reincarnate_place") {
        const rank = turn === "white" ? 7 : 0;
        if (r === rank && !p) set.add(`${r},${c}`);
      }
      if (step === "coronate_pawn" && p && p.color === turn && p.type === "pawn") set.add(`${r},${c}`);
      if (step === "translocate_first" && p && p.color === turn && p.type !== "king") set.add(`${r},${c}`);
      if (step === "translocate_second" && p && p.color === turn && p.type !== "king") {
        const f = activeCard.payload.first as { r: number; c: number } | undefined;
        if (!(f && f.r === r && f.c === c)) set.add(`${r},${c}`);
      }
      if (step === "whisper_pawn" && p && p.color === opp && p.type === "pawn") {
        const dir = opp === "white" ? -1 : 1;
        if (inBounds(r + dir, c) && !board[r + dir][c]) set.add(`${r},${c}`);
      }
    }
    return set;
  }, [activeCard, board, turn]);

  const piecesWithEffects = useMemo<Map<string, string[]>>(() => {
    const m = new Map<string, string[]>();
    for (const e of effects) {
      if (e.targetId) {
        const arr = m.get(e.targetId) || [];
        arr.push(e.kind); m.set(e.targetId, arr);
      }
    }
    if (knightLeapPieceId) {
      const arr = m.get(knightLeapPieceId) || [];
      arr.push("knight_leap"); m.set(knightLeapPieceId, arr);
    }
    return m;
  }, [effects, knightLeapPieceId]);

  const opp: Color = turn === "white" ? "black" : "white";
  const sieged = effects.find((e) => e.kind === "siege" && e.restrictedColor === turn);

  return (
    <div className="min-h-screen w-full text-stone-100 select-none" style={{
      background: "radial-gradient(ellipse at top, #1a1614 0%, #0c0a09 50%, #050403 100%)",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
    }}>
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 fade-in">
          <div className="max-w-lg w-full p-6 rounded-sm border border-amber-700/50 max-h-[90vh] overflow-y-auto" style={{
            background: "linear-gradient(180deg, #1a1410 0%, #0e0a07 100%)",
            boxShadow: "0 0 60px rgba(212,162,79,0.15)",
          }}>
            <div className="text-amber-400/80 text-xs font-display tracking-widest mb-2">CHESS · POWERED UP</div>
            <h1 className="font-display text-3xl text-stone-100 mb-4">PowerChess</h1>
            <div className="font-serif-classic text-stone-300 space-y-3 text-base leading-relaxed">
              <p>Standard chess. Two players. Same device. No starting hand.</p>
              <p>Captured pieces grant <span className="text-amber-300">points</span> — pawn 1, knight or bishop 2, rook 3, queen 5. Spend points to draw a random card from one of three tiers.</p>
              <div className="grid grid-cols-3 gap-2 my-3 text-center">
                <div className="border border-stone-700 p-2"><div className="font-display text-[10px] tracking-widest" style={{color:"#a8a29e"}}>COMMON</div><div className="font-display text-amber-300 mt-1">2</div></div>
                <div className="border border-stone-700 p-2"><div className="font-display text-[10px] tracking-widest" style={{color:"#cd853f"}}>ARCANE</div><div className="font-display text-amber-300 mt-1">4</div></div>
                <div className="border border-stone-700 p-2"><div className="font-display text-[10px] tracking-widest" style={{color:"#d4a24f"}}>ROYAL</div><div className="font-display text-amber-300 mt-1">7</div></div>
              </div>
              <p>Each turn you may buy <em>one</em> card and play <em>one</em> card. Hand limit is three.</p>
              <p className="font-serif-italic text-stone-400 text-sm">Castling and pawn promotion (to queen) work as in standard chess. En passant is omitted.</p>
            </div>
            <button onClick={dismissRules}
              className="mt-6 w-full py-3 font-display text-sm tracking-widest border border-amber-600/60 text-amber-200 hover:bg-amber-900/20 transition">
              ENTER THE GAME
            </button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 fade-in">
          <div className="max-w-md w-full p-8 rounded-sm border border-amber-700/50 text-center" style={{
            background: "linear-gradient(180deg, #1a1410 0%, #0e0a07 100%)",
            boxShadow: "0 0 60px rgba(212,162,79,0.2)",
          }}>
            <div className="text-amber-400/70 text-xs font-display tracking-widest mb-2">{gameOver.reason.toUpperCase()}</div>
            <h2 className="font-display text-4xl mb-4">
              {gameOver.winner ? `${cap(gameOver.winner)} prevails` : "A draw"}
            </h2>
            <p className="font-serif-italic text-stone-400 mb-6">
              {gameOver.winner ? "The throne stands." : "Neither flag falls."}
            </p>
            <button onClick={handleNewGame}
              className="w-full py-3 font-display text-sm tracking-widest border border-amber-600/60 text-amber-200 hover:bg-amber-900/20 transition">
              NEW GAME
            </button>
          </div>
        </div>
      )}

      {drawAnimation && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="draw-anim">
            <CardFace cardKey={drawAnimation.cardKey} large />
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-3 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-amber-500/70 text-[10px] font-display tracking-[0.3em]">POWERCHESS</span>
          </Link>
          <button onClick={handleNewGame}
            className="font-display text-[11px] tracking-widest border border-stone-700 text-stone-400 hover:text-stone-100 hover:border-stone-500 px-3 py-1.5 transition">
            NEW GAME
          </button>
        </div>

        <PlayerHeader color={opp} handCount={hands[opp].length} captured={captured[turn]}
          points={points[opp]} inCheck={inCheckColor === opp} />

        <div className="my-3 fade-in">
          <BoardView board={board} selected={selected} legalMoves={legalMoves}
            onSquareClick={handleSquareClick} inCheckColor={inCheckColor}
            targetHighlight={targetHighlight} piecesWithEffects={piecesWithEffects}
            lastMove={lastMove} />
        </div>

        <StatusLine message={message} extraMoves={extraMoves} siegedYou={!!sieged}
          bishopsBlessingActive={bishopsBlessingActive} quickstepActive={quickstepActive}
          cardPlayedThisTurn={cardPlayedThisTurn} activeCard={activeCard} />

        {activeCard && activeCard.step === "reincarnate_pick" && (
          <div className="my-2 p-3 border border-amber-700/40 rounded-sm fade-in" style={{background:"rgba(20,15,10,0.7)"}}>
            <div className="font-display text-[10px] tracking-widest text-amber-300 text-center mb-2">CHOOSE A FALLEN</div>
            <div className="flex justify-center gap-2">
              {(activeCard.payload.unique as Piece[]).map((p) => (
                <button key={p.type} onClick={() => pickReincarnateType(p.type)}
                  className="w-14 h-14 flex flex-col items-center justify-center border border-stone-600 hover:border-amber-400 transition"
                  style={{background:"linear-gradient(180deg, #2a221a 0%, #161210 100%)"}}>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <PieceSVG type={p.type} color={p.color} />
                  </div>
                  <span className="text-[8px] font-display tracking-widest text-stone-400 mt-0.5">{p.type.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <PlayerHand color={turn} hand={hands[turn]} onCardClick={handleCardClick}
          activeCard={activeCard} cardPlayedThisTurn={cardPlayedThisTurn}
          extraMoves={extraMoves} captured={captured[opp]} points={points[turn]}
          hideHand={hideHand} setHideHand={setHideHand} onCardHover={setHoveredCard}
          inCheck={inCheckColor === turn} />

        <Shop points={points[turn]} onBuy={handleBuy}
          handFull={hands[turn].length >= HAND_LIMIT}
          boughtThisTurn={boughtThisTurn} activeCard={activeCard}
          extraMoves={extraMoves} gameOver={!!gameOver}
          setHoveredTier={setHoveredTier} />

        {hoveredCard && !activeCard && (
          <div className="mt-3 text-center font-serif-classic text-stone-300 text-sm fade-in">
            <span className="text-amber-300 font-display tracking-wider text-xs mr-2">
              {CARDS[hoveredCard].name.toUpperCase()} · TIER {CARDS[hoveredCard].tier}
            </span>
            {CARDS[hoveredCard].description}
            <div className="font-serif-italic text-stone-500 text-xs mt-0.5">{CARDS[hoveredCard].flavor}</div>
          </div>
        )}

        {hoveredTier && !activeCard && !hoveredCard && (
          <div className="mt-3 text-center fade-in">
            <div className="font-display text-xs tracking-widest mb-2" style={{color: TIERS[hoveredTier].color}}>
              {TIERS[hoveredTier].name} · {TIERS[hoveredTier].cost} POINTS
            </div>
            <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
              {CARD_KEYS.filter((k) => CARDS[k].tier === hoveredTier).map((k) => (
                <div key={k} className="text-center">
                  <div className="text-2xl" style={{color: TIERS[hoveredTier].color}}>{CARDS[k].glyph}</div>
                  <div className="text-[8px] font-display tracking-wider text-stone-400">{CARDS[k].name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCard && (
          <div className="mt-2 text-center fade-in">
            <button onClick={() => { clearActive(); setMessage(`${cap(turn)} to move.`); }}
              className="font-display text-[11px] tracking-widest border border-stone-700 text-stone-400 hover:text-stone-100 px-3 py-1.5 transition">
              CANCEL CARD
            </button>
          </div>
        )}

        {extraMoves > 0 && !activeCard && (
          <div className="mt-2 text-center">
            <button onClick={handleSkipExtra}
              className="font-display text-[11px] tracking-widest border border-stone-700 text-stone-400 hover:text-stone-100 px-3 py-1.5 transition">
              END TURN (SKIP EXTRA MOVE)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// SUB-COMPONENTS
// =====================================================================

interface BoardViewProps {
  board: Board;
  selected: { r: number; c: number } | null;
  legalMoves: Move[];
  onSquareClick: (r: number, c: number) => void;
  inCheckColor: Color | null;
  targetHighlight: Set<string>;
  piecesWithEffects: Map<string, string[]>;
  lastMove: { from: { r: number; c: number }; to: { r: number; c: number } } | null;
}

function BoardView({ board, selected, legalMoves, onSquareClick, inCheckColor, targetHighlight, piecesWithEffects, lastMove }: BoardViewProps) {
  const moveSet = new Set(legalMoves.map((m) => `${m.r},${m.c}`));
  const captureSet = new Set(legalMoves.filter((m) => m.capture || board[m.r][m.c]).map((m) => `${m.r},${m.c}`));

  return (
    <div className="relative grain rounded-sm overflow-hidden" style={{
      boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 0 0 2px #2a1f15, 0 0 0 6px #14100c",
    }}>
      <div className="grid grid-cols-8 aspect-square"
        style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr))' }}>
        {board.map((row, r) => row.map((piece, c) => {
          const dark = (r + c) % 2 === 1;
          const isSelected = selected && selected.r === r && selected.c === c;
          const isMoveTarget = moveSet.has(`${r},${c}`);
          const isCapture = captureSet.has(`${r},${c}`);
          const isCardTarget = targetHighlight.has(`${r},${c}`);
          const isCheck = piece && piece.type === "king" && piece.color === inCheckColor;
          const isLastMove = lastMove && (
            (lastMove.from.r === r && lastMove.from.c === c) ||
            (lastMove.to.r === r && lastMove.to.c === c)
          );
          const effectsOn = piece ? (piecesWithEffects.get(piece.id) || []) : [];
          const shielded = effectsOn.includes("aegis");
          const frozen = effectsOn.includes("frost_bind");
          const knightLeap = effectsOn.includes("knight_leap");

          const style: React.CSSProperties = {
            background: dark
              ? "linear-gradient(135deg, #5a4226 0%, #4a3520 100%)"
              : "linear-gradient(135deg, #e8d5b0 0%, #d8c195 100%)",
          };
          if (isLastMove) style.boxShadow = "inset 0 0 0 100px rgba(212,162,79,0.18)";
          if (isSelected) style.boxShadow = "inset 0 0 0 3px #d4a24f, inset 0 0 0 100px rgba(212,162,79,0.25)";
          if (isCheck) style.boxShadow = "inset 0 0 0 3px #b42828, inset 0 0 30px rgba(180,40,40,0.4)";

          return (
            <button key={`${r}-${c}`} onClick={() => onSquareClick(r, c)}
              className="relative flex items-center justify-center transition-colors" style={style}>
              {c === 0 && (
                <span className="absolute top-0.5 left-1 text-[8px] font-display"
                  style={{color: dark ? "#d8c195" : "#5a4226", opacity: 0.5}}>{8 - r}</span>
              )}
              {r === 7 && (
                <span className="absolute bottom-0 right-1 text-[8px] font-display"
                  style={{color: dark ? "#d8c195" : "#5a4226", opacity: 0.5}}>{String.fromCharCode(97 + c)}</span>
              )}

              {piece && (
                <div className="relative z-10 piece-breathe flex items-center justify-center w-full h-full" style={{
                  animationDelay: `${((r * 8 + c) % 7) * 0.4}s`,
                  filter: frozen ? "hue-rotate(180deg) brightness(0.85)" : (shielded ? "drop-shadow(0 0 6px rgba(212,162,79,0.8))" : "none"),
                }}>
                  <PieceSVG type={piece.type} color={piece.color} />
                </div>
              )}

              {effectsOn.length > 0 && (
                <div className="absolute top-0.5 right-0.5 flex flex-col gap-0.5 z-20">
                  {shielded && <span className="text-[10px] sm:text-xs leading-none" style={{color:"#d4a24f", textShadow:"0 0 3px rgba(0,0,0,0.8)"}}>◈</span>}
                  {frozen && <span className="text-[10px] sm:text-xs leading-none" style={{color:"#7eb8e0", textShadow:"0 0 3px rgba(0,0,0,0.8)"}}>❄</span>}
                  {knightLeap && <span className="text-[10px] sm:text-xs leading-none" style={{color:"#d4a24f", textShadow:"0 0 3px rgba(0,0,0,0.8)"}}>♞</span>}
                </div>
              )}

              {isMoveTarget && !isCapture && (
                <span className="absolute z-0 rounded-full"
                  style={{width: "28%", height: "28%", background: "rgba(20,15,10,0.45)"}} />
              )}
              {isCapture && (
                <span className="absolute inset-1 rounded-sm border-2 border-red-700/70 z-0" />
              )}
              {isCardTarget && (
                <span className="absolute inset-0 pulse-gold pointer-events-none z-0"
                  style={{boxShadow: "inset 0 0 0 3px rgba(212,162,79,0.7)"}} />
              )}
            </button>
          );
        }))}
      </div>
    </div>
  );
}

interface StatusLineProps {
  message: string;
  extraMoves: number;
  siegedYou: boolean;
  bishopsBlessingActive: boolean;
  quickstepActive: boolean;
  cardPlayedThisTurn: boolean;
  activeCard: ActiveCard | null;
}

function StatusLine({ message, extraMoves, siegedYou, bishopsBlessingActive, quickstepActive, cardPlayedThisTurn, activeCard }: StatusLineProps) {
  const tags: { label: string; color: string }[] = [];
  if (extraMoves > 0) tags.push({ label: "DOUBLE STRIKE", color: "#d4a24f" });
  if (bishopsBlessingActive) tags.push({ label: "BISHOPS BLESSED", color: "#d4a24f" });
  if (quickstepActive) tags.push({ label: "QUICKSTEP", color: "#a8a29e" });
  if (siegedYou) tags.push({ label: "UNDER SIEGE", color: "#b42828" });
  if (cardPlayedThisTurn && !activeCard && extraMoves === 0) tags.push({ label: "CARD SPENT", color: "#777" });

  return (
    <div className="text-center my-2 min-h-[2.5rem] fade-in" key={message}>
      <div className="font-serif-classic text-stone-200 text-base sm:text-lg italic leading-tight">{message}</div>
      {tags.length > 0 && (
        <div className="flex justify-center gap-2 mt-1 flex-wrap">
          {tags.map((t, i) => (
            <span key={i} className="font-display text-[9px] tracking-widest px-2 py-0.5 border"
              style={{color: t.color, borderColor: t.color + "60"}}>{t.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

interface PlayerHeaderProps {
  color: Color;
  handCount: number;
  captured: Piece[];
  points: number;
  inCheck: boolean;
}

function PlayerHeader({ color, handCount, captured, points, inCheck }: PlayerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border border-stone-800 rounded-sm" style={{
      background: "linear-gradient(180deg, rgba(20,16,12,0.6) 0%, rgba(10,8,6,0.4) 100%)",
    }}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
          background: color === "white" ? "#fafaf5" : "#1c1410", boxShadow: "0 0 0 1px #44342a",
        }} />
        <span className="font-display text-[11px] tracking-widest text-stone-400">{color.toUpperCase()}</span>
        {inCheck && <span className="font-display text-[9px] tracking-widest px-1.5 py-0.5 border border-red-700 text-red-400">CHECK</span>}
      </div>
      <div className="flex items-center gap-3">
        <CapturedRow captured={captured} />
        <div className="flex items-center gap-1">
          <span className="font-display text-[10px] tracking-widest text-amber-400/80">⚔</span>
          <span className="font-display text-sm text-amber-300">{points}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({length: HAND_LIMIT}).map((_, i) => (
              <div key={i} className="w-1.5 h-3 rounded-sm border" style={{
                background: i < handCount ? "linear-gradient(180deg,#3a2515,#1a0f08)" : "transparent",
                borderColor: i < handCount ? "#a87234" : "#3a2515",
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlayerHandProps {
  color: Color;
  hand: Card[];
  onCardClick: (card: Card) => void;
  activeCard: ActiveCard | null;
  cardPlayedThisTurn: boolean;
  extraMoves: number;
  captured: Piece[];
  points: number;
  hideHand: boolean;
  setHideHand: (fn: (h: boolean) => boolean) => void;
  onCardHover: (key: CardKey | null) => void;
  inCheck: boolean;
}

function PlayerHand({ color, hand, onCardClick, activeCard, cardPlayedThisTurn, extraMoves, captured, points, hideHand, setHideHand, onCardHover, inCheck }: PlayerHandProps) {
  const slots: (Card | null)[] = Array.from({length: HAND_LIMIT}, (_, i) => hand[i] || null);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
            background: color === "white" ? "#fafaf5" : "#1c1410", boxShadow: "0 0 0 1px #44342a",
          }} />
          <span className="font-display text-[11px] tracking-widest text-amber-300">
            {color.toUpperCase()} — YOUR HAND
          </span>
          {inCheck && <span className="font-display text-[9px] tracking-widest px-1.5 py-0.5 border border-red-700 text-red-400">CHECK</span>}
        </div>
        <div className="flex items-center gap-2">
          <CapturedRow captured={captured} />
          <div className="flex items-center gap-1 px-2 py-0.5 border border-amber-700/40 rounded-sm">
            <span className="font-display text-[10px] tracking-widest text-amber-400/80">⚔</span>
            <span className="font-display text-sm text-amber-200">{points}</span>
          </div>
          <button onClick={() => setHideHand((h) => !h)}
            className="font-display text-[9px] tracking-widest text-stone-500 hover:text-stone-300 px-2 py-0.5 border border-stone-800 transition"
            title="Hide hand for hot-seat play">
            {hideHand ? "SHOW" : "HIDE"}
          </button>
        </div>
      </div>

      {hideHand ? (
        <div onClick={() => setHideHand(() => false)}
          className="border border-stone-800 rounded-sm py-8 text-center font-serif-italic text-stone-500 cursor-pointer hover:bg-stone-900/40 transition"
          style={{background: "linear-gradient(180deg, rgba(20,16,12,0.6) 0%, rgba(10,8,6,0.4) 100%)"}}>
          Pass the device, then tap to reveal {cap(color)}&apos;s hand.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {slots.map((card, i) => {
            if (!card) {
              return (
                <div key={`empty-${i}`} className="aspect-[2/3] flex items-center justify-center" style={{
                  border: "1px dashed rgba(90,66,38,0.4)",
                  background: "linear-gradient(180deg, rgba(20,16,12,0.4) 0%, rgba(10,8,6,0.2) 100%)",
                }}>
                  <span className="font-serif-italic text-stone-700 text-xs">empty</span>
                </div>
              );
            }
            const def = CARDS[card.key];
            const isActive = activeCard && activeCard.card.id === card.id;
            const disabled = (cardPlayedThisTurn && !isActive) || extraMoves > 0;
            const tier = TIERS[def.tier];
            return (
              <button key={card.id} onClick={() => onCardClick(card)}
                onMouseEnter={() => onCardHover(card.key)} onMouseLeave={() => onCardHover(null)}
                disabled={disabled}
                className="relative aspect-[2/3] flex flex-col items-center justify-between p-1.5 sm:p-2 transition-all"
                style={{
                  background: isActive
                    ? "linear-gradient(180deg, #f4e4c4 0%, #d8c195 100%)"
                    : "linear-gradient(180deg, #e8dcc0 0%, #c8b495 100%)",
                  border: isActive ? `1.5px solid ${tier.color}` : "1px solid #5a4226",
                  boxShadow: isActive
                    ? `0 0 18px ${tier.glow}, inset 0 0 0 1px rgba(255,255,255,0.4)`
                    : disabled ? "0 1px 4px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.5)",
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                  transform: isActive ? "translateY(-2px)" : "none",
                }}>
                <div className="absolute inset-0 pointer-events-none" style={{border: `1px solid ${tier.color}40`, margin: "3px"}} />
                <div className="text-[8px] font-display tracking-widest self-stretch text-center pt-0.5" style={{color: tier.color}}>
                  {tier.name}
                </div>
                <div className="text-2xl sm:text-3xl my-0.5" style={{color: "#3a2515", textShadow: "0 1px 0 rgba(255,255,255,0.4)"}}>
                  {def.glyph}
                </div>
                <div className="text-[8px] sm:text-[9px] font-display tracking-wider text-center text-stone-800 leading-tight px-0.5">
                  {def.name.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ShopProps {
  points: number;
  onBuy: (tier: 1 | 2 | 3) => void;
  handFull: boolean;
  boughtThisTurn: boolean;
  activeCard: ActiveCard | null;
  extraMoves: number;
  gameOver: boolean;
  setHoveredTier: (t: 1 | 2 | 3 | null) => void;
}

function Shop({ points, onBuy, handFull, boughtThisTurn, activeCard, extraMoves, gameOver, setHoveredTier }: ShopProps) {
  return (
    <div className="mt-3">
      <div className="font-display text-[10px] tracking-widest text-stone-500 mb-1.5 text-center">— DRAW A CARD —</div>
      <div className="grid grid-cols-3 gap-2">
        {([1, 2, 3] as const).map((tier) => {
          const t = TIERS[tier];
          const canAfford = points >= t.cost;
          const disabled = !canAfford || handFull || boughtThisTurn || !!activeCard || extraMoves > 0 || gameOver;
          let reason = "";
          if (gameOver) reason = "";
          else if (boughtThisTurn) reason = "BOUGHT";
          else if (handFull) reason = "HAND FULL";
          else if (!canAfford) reason = `${t.cost - points} MORE`;

          return (
            <button key={tier} onClick={() => onBuy(tier)}
              onMouseEnter={() => setHoveredTier(tier)} onMouseLeave={() => setHoveredTier(null)}
              disabled={disabled}
              className="relative py-3 px-2 transition-all" style={{
                background: t.bg,
                border: `1px solid ${disabled ? "#3a3530" : t.color}`,
                boxShadow: disabled ? "none" : `0 0 12px ${t.glow}, inset 0 0 0 1px ${t.color}30`,
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}>
              <div className="font-display text-[10px] tracking-widest" style={{color: t.color}}>TIER {tier}</div>
              <div className="font-display text-xs tracking-widest mt-0.5" style={{color: t.color}}>{t.name}</div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="font-display text-[10px] text-amber-400/80">⚔</span>
                <span className="font-display text-lg" style={{color: disabled ? "#666" : t.color}}>{t.cost}</span>
              </div>
              {reason && <div className="font-display text-[8px] tracking-widest text-stone-500 mt-1">{reason}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CapturedRow({ captured }: { captured: Piece[] }) {
  if (!captured || captured.length === 0) return <div className="h-4 w-4" />;
  const order: PieceType[] = ["queen", "rook", "bishop", "knight", "pawn"];
  const sorted = [...captured].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
  return (
    <div className="flex items-center flex-wrap max-w-[120px]">
      {sorted.slice(0, 16).map((p, i) => (
        <span key={i} style={{
          width: "16px", height: "16px",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginLeft: i === 0 ? 0 : -3, opacity: 0.85,
        }}>
          <PieceSVG type={p.type} color={p.color} />
        </span>
      ))}
    </div>
  );
}

function CardFace({ cardKey, large }: { cardKey: CardKey; large?: boolean }) {
  const def = CARDS[cardKey];
  const tier = TIERS[def.tier];
  const w = large ? "w-48 sm:w-56" : "w-24";
  const h = large ? "h-72 sm:h-80" : "h-36";
  return (
    <div className={`${w} ${h} relative flex flex-col items-center justify-between p-3 rounded-sm`} style={{
      background: "linear-gradient(180deg, #f4e4c4 0%, #c8b495 100%)",
      border: `2px solid ${tier.color}`,
      boxShadow: `0 0 40px ${tier.glow}, 0 8px 30px rgba(0,0,0,0.6)`,
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{border: `1px solid ${tier.color}60`, margin: "6px"}} />
      <div className="font-display text-[10px] tracking-widest text-center" style={{color: tier.color}}>
        {tier.name} · TIER {def.tier}
      </div>
      <div className="text-6xl sm:text-7xl" style={{color: "#3a2515", textShadow: "0 2px 0 rgba(255,255,255,0.5)"}}>
        {def.glyph}
      </div>
      <div className="text-center px-2">
        <div className="font-display text-sm tracking-widest text-stone-900 mb-1">{def.name.toUpperCase()}</div>
        <div className="font-serif-italic text-[10px] text-stone-700 leading-tight">{def.flavor}</div>
      </div>
    </div>
  );
}
