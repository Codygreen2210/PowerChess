import type { Metadata } from "next";
import Game from "../components/Game";

export const metadata: Metadata = {
  title: "Play — PowerChess",
  description:
    "Two-player chess with power-up cards. No signup. Free in your browser.",
};

export default function PlayPage() {
  return <Game />;
}
