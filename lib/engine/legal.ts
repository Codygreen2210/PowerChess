// PowerChess engine — effect-aware legal move computation and stalemate detection.

import type { Board, Color, Effect, Move, PieceType } from "./types";
import { getPieceMoves, applyMove, isInCheck } from "./moves";

export interface LegalMoveOpts {
  knightLeapPieceId: string | null;
  bishopsBlessingActive: boolean;
  quickstepActive: boolean;
  effects: Effect[];
  turn: Color;
}

export function getEffectiveLegalMoves(board: Board, r: number, c: number, options: LegalMoveOpts): Move[] {
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

export function hasAnyLegalMove(board: Board, color: Color, effects: Effect[], quickstepActive = false): boolean {
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
