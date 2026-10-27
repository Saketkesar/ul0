import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UL0 — Fast URL Shortener & File Tools",
    short_name: "UL0",
    description:
      "Free URL shortener, branded custom domains, dynamic QR codes, bill splitter, and private client-side PDF file tools.",
    start_url: "/files",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#18181b",
    orientation: "any",
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
