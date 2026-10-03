import os
import math
from PIL import Image, ImageDraw, ImageFont

def render_brand_icon(size=512):
    # Create image with transparent or dark rounded container
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw smooth squircle background
    pad = int(size * 0.04)
    radius = int(size * 0.24)
    
    # Deep obsidian slate background
    draw.rounded_rectangle(
        [(pad, pad), (size - pad, size - pad)],
        radius=radius,
        fill=(11, 15, 25, 255),
        outline=(255, 255, 255, 35),
        width=int(size * 0.015)
    )
    
    # Scale factor for internal shapes
    scale = size / 48.0
    stroke_w = max(2, int(3.5 * scale))
    
    # Left 'U' path
    # (14, 18) down to (14, 25) arc to (20, 31) to (21.5, 31)
    u_points = [
        (14 * scale, 18 * scale),
        (14 * scale, 25 * scale),
        (14 * scale, 28.3 * scale),
        (16.7 * scale, 31 * scale),
        (20 * scale, 31 * scale),
        (21.5 * scale, 31 * scale)
    ]
    
    # Draw U shape with electric blue/indigo gradient simulation
    # Using smooth anti-aliased lines
    color_blue = (56, 189, 248, 255)   # #38bdf8
    color_indigo = (99, 102, 241, 255) # #6366f1
    color_purple = (168, 85, 247, 255) # #a855f7
    
    # Arc / U path
    draw.arc(
        [(14 * scale, 19 * scale), (26 * scale, 31 * scale)],
        start=0, end=180,
        fill=color_indigo,
        width=stroke_w
    )
    draw.line(
        [(14 * scale, 18 * scale), (14 * scale, 25 * scale)],
        fill=color_blue,
        width=stroke_w
    )
    
    # Top arc
    draw.arc(
        [(14 * scale, 12 * scale), (26 * scale, 24 * scale)],
        start=180, end=360,
        fill=(255, 255, 255, 255),
        width=stroke_w
    )
    draw.line(
        [(26 * scale, 18 * scale), (26 * scale, 21 * scale)],
        fill=(255, 255, 255, 255),
        width=stroke_w
    )
    
    # Right '0' loop
    draw.arc(
        [(22 * scale, 17 * scale), (34 * scale, 29 * scale)],
        start=180, end=360,
        fill=color_indigo,
        width=stroke_w
    )
    draw.arc(
        [(22 * scale, 23 * scale), (34 * scale, 35 * scale)],
        start=0, end=180,
        fill=color_purple,
        width=stroke_w
    )
    draw.line(
        [(22 * scale, 23 * scale), (22 * scale, 29 * scale)],
        fill=color_indigo,
        width=stroke_w
    )
    draw.line(
        [(34 * scale, 23 * scale), (34 * scale, 29 * scale)],
        fill=color_purple,
        width=stroke_w
    )
    
    # Center dot
    dot_r = 2.5 * scale
    cx = 28 * scale
    cy = 26 * scale
    draw.ellipse(
        [(cx - dot_r, cy - dot_r), (cx + dot_r, cy + dot_r)],
        fill=color_blue
    )
    
    return img

def main():
    out_dir = "/Users/saketkesar/Downloads/ul0/public"
    
    # 512x512 high-res brand icon
    icon_512 = render_brand_icon(512)
    icon_512.save(os.path.join(out_dir, "ul0.png"), "PNG")
    icon_512.save(os.path.join(out_dir, "apple-icon.png"), "PNG")
    
    # 32x32 favicons
    icon_32 = icon_512.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save(os.path.join(out_dir, "icon-dark-32x32.png"), "PNG")
    icon_32.save(os.path.join(out_dir, "icon-light-32x32.png"), "PNG")
    icon_32.save(os.path.join(out_dir, "favicon.png"), "PNG")
    
    # Also 16x16
    icon_16 = icon_512.resize((16, 16), Image.Resampling.LANCZOS)
    icon_16.save(os.path.join(out_dir, "favicon.ico"), "ICO")
    
    print("Brand assets generated successfully in", out_dir)

if __name__ == "__main__":
    main()
