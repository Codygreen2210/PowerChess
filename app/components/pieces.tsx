"use client";

import React from "react";

export type PieceColor = "white" | "black";
export type PieceTypeKey = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

export interface PieceStyle {
  whiteFill: string;
  whiteStroke: string;
  whiteAccent: string;
  whiteShadow: string;
  blackFill: string;
  blackStroke: string;
  blackAccent: string;
  blackShadow: string;
}

// Default style: classic ivory/ebony, gold accents, drop shadows.
// Outlines are always contrasting against either light or dark squares.
export const DEFAULT_PIECE_STYLE: PieceStyle = {
  whiteFill: "#fafaf5",
  whiteStroke: "#3a1a08",
  whiteAccent: "#fffeed",
  whiteShadow: "drop-shadow(0 1px 1px rgba(0,0,0,0.4))",
  blackFill: "#1c1410",
  blackStroke: "#0a0503",
  blackAccent: "#d4a24f",
  blackShadow: "drop-shadow(0 1px 1px rgba(0,0,0,0.5))",
};

interface PieceProps {
  type: PieceTypeKey;
  color: PieceColor;
  style?: PieceStyle;
  animClass?: string;
  animDelaySeconds?: number;
}

export function Piece({
  type,
  color,
  style = DEFAULT_PIECE_STYLE,
  animClass = "piece-breathe",
  animDelaySeconds = 0,
}: PieceProps) {
  const fill = color === "white" ? style.whiteFill : style.blackFill;
  const stroke = color === "white" ? style.whiteStroke : style.blackStroke;
  const accent = color === "white" ? style.whiteAccent : style.blackAccent;
  const shadow = color === "white" ? style.whiteShadow : style.blackShadow;

  const pieceProps = { fill, stroke, accent, color };

  return (
    <svg
      viewBox="0 0 45 45"
      width="86%"
      height="86%"
      style={{
        filter: shadow,
        overflow: "visible",
        animationDelay: `${animDelaySeconds}s`,
      }}
      className={animClass}
    >
      {type === "pawn" && <Pawn {...pieceProps} />}
      {type === "rook" && <Rook {...pieceProps} />}
      {type === "knight" && <Knight {...pieceProps} />}
      {type === "bishop" && <Bishop {...pieceProps} />}
      {type === "queen" && <Queen {...pieceProps} />}
      {type === "king" && <King {...pieceProps} />}
    </svg>
  );
}

interface ShapeProps {
  fill: string;
  stroke: string;
  accent: string;
  color: PieceColor;
}

const SW = 1.2;

function Pawn({ fill, stroke, accent }: ShapeProps) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path
        d="M 22.5,9 C 19,9 17,11.5 17,14.5 C 17,16 17.5,17 18.5,18 C 16.5,19 14.5,21 14.5,24 C 14.5,26 15.5,27.5 17,28.5 L 17,30 L 12,30 L 12,33 L 9,36 L 9,38 L 36,38 L 36,36 L 33,33 L 33,30 L 28,30 L 28,28.5 C 29.5,27.5 30.5,26 30.5,24 C 30.5,21 28.5,19 26.5,18 C 27.5,17 28,16 28,14.5 C 28,11.5 26,9 22.5,9 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 21,11 C 19.5,11 18.5,12.5 18.5,14 C 18.5,14.5 18.7,15 19,15.5"
        fill="none"
        stroke={accent}
        strokeWidth={0.8}
        opacity="0.6"
      />
    </g>
  );
}

function Rook({ fill, stroke, accent }: ShapeProps) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path
        d="M 9,38 L 36,38 L 36,35 L 33,33 L 33,18 L 35,16 L 35,11 L 31,11 L 31,13 L 27,13 L 27,11 L 23,11 L 23,13 L 22,13 L 22,11 L 18,11 L 18,13 L 14,13 L 14,11 L 10,11 L 10,16 L 12,18 L 12,33 L 9,35 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <line x1="12" y1="18" x2="33" y2="18" stroke={stroke} strokeWidth={SW * 0.7} />
      <line x1="12" y1="33" x2="33" y2="33" stroke={stroke} strokeWidth={SW * 0.7} />
      <line x1="9" y1="35" x2="36" y2="35" stroke={stroke} strokeWidth={SW * 0.5} opacity="0.6" />
      <path d="M 13,16 L 13,32" stroke={accent} strokeWidth={0.6} opacity="0.5" />
    </g>
  );
}

function Knight({ fill, stroke, accent, color }: ShapeProps) {
  const eyeFill = color === "white" ? "#1a0a0a" : "#fafaf5";
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path
        d="M 22,10 C 32,11 36,17 36,30 L 12,30 C 12,28 13.5,25 17,23 C 14,22 12,19 13,15 C 14,16 16,16 17,15 C 17,12 19,10 22,10 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 11,30 L 37,30 L 37,33 L 11,33 Z M 9,33 L 39,33 L 39,38 L 9,38 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 24,13 C 26,14 28,16 29,19"
        fill="none"
        stroke={stroke}
        strokeWidth={SW * 0.6}
      />
      <circle cx="29" cy="17" r="0.9" fill={eyeFill} />
      <path
        d="M 21,12 C 22,12 23,12.5 24,13"
        fill="none"
        stroke={accent}
        strokeWidth={0.8}
        opacity="0.5"
      />
    </g>
  );
}

function Bishop({ fill, stroke, accent }: ShapeProps) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <circle cx="22.5" cy="8" r="2.2" fill={fill} stroke={stroke} strokeWidth={SW} />
      <path
        d="M 22.5,11 C 19,11 17,15 17,19 C 17,22 18.5,25 22.5,26 C 26.5,25 28,22 28,19 C 28,15 26,11 22.5,11 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path d="M 19.5,16 L 25.5,16" stroke={stroke} strokeWidth={SW * 0.8} />
      <path
        d="M 15,26 L 30,26 L 30,30 L 15,30 Z M 12,30 L 33,30 L 33,33 L 12,33 Z M 9,33 L 36,33 L 36,38 L 9,38 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 20,13 C 19,15 18.5,17 19,19"
        fill="none"
        stroke={accent}
        strokeWidth={0.8}
        opacity="0.5"
      />
    </g>
  );
}

function Queen({ fill, stroke, accent }: ShapeProps) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <circle cx="9" cy="13" r="2" fill={fill} stroke={stroke} strokeWidth={SW} />
      <circle cx="16" cy="9" r="2" fill={fill} stroke={stroke} strokeWidth={SW} />
      <circle cx="22.5" cy="7" r="2.2" fill={fill} stroke={stroke} strokeWidth={SW} />
      <circle cx="29" cy="9" r="2" fill={fill} stroke={stroke} strokeWidth={SW} />
      <circle cx="36" cy="13" r="2" fill={fill} stroke={stroke} strokeWidth={SW} />
      <path
        d="M 9,15 L 11,22 L 16,11 L 19.5,22 L 22.5,9 L 25.5,22 L 29,11 L 34,22 L 36,15 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 11,22 L 34,22 L 33,26 L 12,26 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 13,26 L 32,26 L 32,30 L 13,30 Z M 11,30 L 34,30 L 34,33 L 11,33 Z M 9,33 L 36,33 L 36,38 L 9,38 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path d="M 14,16 L 16,22" fill="none" stroke={accent} strokeWidth={0.6} opacity="0.5" />
    </g>
  );
}

function King({ fill, stroke, accent }: ShapeProps) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path
        d="M 22.5,4 L 22.5,9 M 20,6.5 L 25,6.5"
        fill="none"
        stroke={stroke}
        strokeWidth={SW * 1.5}
        strokeLinecap="round"
      />
      <path
        d="M 14,12 C 18,10 27,10 31,12 L 31,16 C 30,15 28,14 22.5,14 C 17,14 15,15 14,16 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 13,16 C 14,18 16,21 22.5,22 C 29,21 31,18 32,16 L 32,18 C 31,22 28,26 22.5,26 C 17,26 14,22 13,18 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 13,26 L 32,26 L 32,30 L 13,30 Z M 11,30 L 34,30 L 34,33 L 11,33 Z M 9,33 L 36,33 L 36,38 L 9,38 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={SW}
      />
      <path
        d="M 17,15 C 20,14 22,13.5 24,14"
        fill="none"
        stroke={accent}
        strokeWidth={0.8}
        opacity="0.5"
      />
    </g>
  );
}
