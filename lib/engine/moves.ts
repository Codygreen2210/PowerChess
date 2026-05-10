// PowerChess engine — move generation, attack detection, move application.

import type { Board, Color, Move, PieceType } from "./types";
import { inBounds, findKing } from "./board";

interface PieceMoveOpts {
  asType?: PieceType | null;
  includeCastle?: boolean;
  quickstepActive?: boolean;
}

export function getPieceMoves(board: Board, r: number, c: number, opts: PieceMoveOpts = {}): Move[] {
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

export function squareAttacked(board: Board, r: number, c: number, byColor: Color): boolean {
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

export function isInCheck(board: Board, color: Color): boolean {
  const k = findKing(board, color);
  if (!k) return false;
  const opp: Color = color === "white" ? "black" : "white";
  return squareAttacked(board, k.r, k.c, opp);
}

export function applyMove(board: Board, fr: number, fc: number, move: Move): Board {
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
