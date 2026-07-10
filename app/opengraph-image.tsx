import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "./lib/site";

// Branded 1200x630 social share card, generated at build time. Applies to the
// home page (and as the default) — section pages set their own OG images. Using
// the real Juana face keeps the card on-brand with the site's editorial serif.
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const juana = await readFile(
    join(process.cwd(), "public/fonts/Juana ExtraLight.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#FAF2E6",
          color: "#2C2C2C",
          fontFamily: "Juana",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 10, opacity: 0.55 }}>
          {"PORTFOLIO"}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, lineHeight: 1 }}>
            {"Kevin Chen"}
          </div>
          <div style={{ display: "flex", fontSize: 46, opacity: 0.7, marginTop: 20 }}>
            {"Engineer & Creative Developer"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            opacity: 0.6,
          }}
        >
          <div style={{ display: "flex" }}>
            {"Robotics · Embedded · Software · Photography"}
          </div>
          <div style={{ display: "flex" }}>{"kevinchen.com.au"}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Juana", data: juana, weight: 400, style: "normal" }],
    },
  );
}
