// PowerChess engine — core types.
// Pure data, no runtime dependencies. Safe on client and server.

export type Color = "white" | "black";
export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

export interface Piece {
  id: string;
  type: PieceType;
  color: Color;
  hasMoved: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Move {
  r: number;
  c: number;
  capture?: boolean;
  castle?: "kingside" | "queenside";
}

export interface Effect {
  id: string;
  kind: "frost_bind" | "aegis" | "siege";
  targetId?: string;
  ownerOfTarget?: Color;
  restrictedColor?: Color;
  expiresAfter: Color;
}

export interface GameOver {
  winner: Color | null;
  reason: string;
}
