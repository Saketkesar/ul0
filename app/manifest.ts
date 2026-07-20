import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ul0 — Free URL Shortener, QR Codes & Tools",
    short_name: "ul0",
    description:
      "Free URL shortener with QR codes, click analytics, UTM tools, expense splitting, and more. No signup required.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#000000",
    orientation: "portrait-primary",
    categories: ["utilities", "productivity"],
    icons: [
      {
        src: "/ul0.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/ul0.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
