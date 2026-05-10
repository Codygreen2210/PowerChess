import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PowerChess — Chess with power-ups";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at top, #1a1614 0%, #0c0a09 60%, #050403 100%)",
          color: "#f5f5f4",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            fontSize: 200,
            color: "rgba(212,162,79,0.12)",
            display: "flex",
          }}
        >
          ♚
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 100,
            fontSize: 180,
            color: "rgba(212,162,79,0.12)",
            display: "flex",
          }}
        >
          ♛
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#d4a24f",
            letterSpacing: 12,
            marginBottom: 30,
            display: "flex",
          }}
        >
          CHESS · POWERED UP
        </div>
        <div
          style={{
            fontSize: 130,
            fontWeight: 700,
            lineHeight: 1,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Chess.</span>
          <span style={{ color: "#d4a24f" }}>With power-ups.</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a8a29e",
            fontStyle: "italic",
            marginTop: 40,
            display: "flex",
          }}
        >
          Capture pieces to earn power-up cards.
        </div>
      </div>
    ),
    { ...size },
  );
}
