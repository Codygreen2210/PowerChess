// PowerChess engine — board creation, bounds check, king lookup, piece-id generator.

import type { Board, Color, PieceType } from "./types";

let _idCounter = 1;
export const cuid = () => `p${_idCounter++}`;
export const resetIdCounter = () => { _idCounter = 1; };

export const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

export function makeInitialBoard(): Board {
  resetIdCounter();
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

export function findKing(board: Board, color: Color): { r: number; c: number } | null {
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const p = board[i][j];
    if (p && p.type === "king" && p.color === color) return { r: i, c: j };
  }
  return null;
}
