import { ImageResponse } from "next/og";

export const alt = "Ryan Stulp — Calgary and area real estate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
        background: "#111111",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-120px",
          bottom: "-190px",
          width: "600px",
          height: "600px",
          display: "flex",
          borderRadius: "50%",
          background: "#c91836",
        }}
      />
      <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
        RYAN <span style={{ color: "#e12442" }}>STULP</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            maxWidth: "850px",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-3px",
          }}
        >
          Make your next move with clarity.
        </div>
        <div style={{ display: "flex", color: "#c9c6c0", fontSize: 28 }}>
          Calgary and area real estate · The Real Estate District
        </div>
      </div>
    </div>,
    size,
  );
}
