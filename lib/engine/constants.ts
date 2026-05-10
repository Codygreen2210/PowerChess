// PowerChess engine — chess piece values for capture-point economy.

import type { PieceType } from "./types";

export const PIECE_VALUE: Record<PieceType, number> = {
  pawn: 1, knight: 2, bishop: 2, rook: 3, queen: 5, king: 0,
};
