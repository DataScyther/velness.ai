#!/usr/bin/env python3
"""Generate Expo default assets from velness-logo.jpg with a premium circular canvas style"""

from PIL import Image, ImageOps, ImageDraw
import os

ASSETS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'shared', 'assets')
LOGO_PATH = os.path.join(ASSETS_DIR, 'velness-logo.jpg')

def crop_to_aspect(img, target_w, target_h):
    """Crop image to match the target aspect ratio, keeping center."""
    w, h = img.size
    target_aspect = target_w / target_h
    img_aspect = w / h

    if img_aspect > target_aspect:
        # Image is wider than target aspect ratio -> crop width
        new_w = int(h * target_aspect)
        left = (w - new_w) // 2
        top = 0
        right = left + new_w
        bottom = h
    else:
        # Image is taller than target aspect ratio -> crop height
        new_h = int(w / target_aspect)
        left = 0
        top = (h - new_h) // 2
        right = w
        bottom = top + new_h

    return img.crop((left, top, right, bottom))

def make_premium_logo_canvas(img, size, is_splash=False, target_w=1242, target_h=2436):
    """
    Creates a premium logo canvas that mirrors the Welcome Screen logo canvas:
    - Vertical gradient background (extracted from original logo edge)
    - A soft glowing/white circular container ring
    - A circular logo in the center of the ring
    Uses 2x supersampling for high-fidelity anti-aliased circles.
    """
    # 1. Determine size and create background
    if is_splash:
        w, h = target_w, target_h
    else:
        w, h = size, size
        
    draw_w, draw_h = w * 2, h * 2

    # Extract vertical gradient from the left edge of the original logo (736x920)
    orig_w, orig_h = img.size
    gradient_strip = img.crop((0, 0, 20, orig_h))
    canvas = gradient_strip.resize((draw_w, draw_h), Image.LANCZOS)
    
    # 2. Compute proportions at 2x size
    cx, cy = draw_w // 2, draw_h // 2
    base_dim = min(draw_w, draw_h)
    
    # Proportional sizes for outer ring and inner circular logo
    if is_splash:
        D_outer = int(base_dim * 0.40)
    else:
        D_outer = int(base_dim * 0.78)
        
    D_inner = int(D_outer * 0.77) # Matches the 120/156 logo ratio
    
    # 3. Create transparent overlay for vector shapes
    overlay = Image.new('RGBA', (draw_w, draw_h), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Draw outer ring background (filled with semi-transparent premium white)
    r_outer = D_outer // 2
    border_w = int(base_dim * 0.008) if not is_splash else int(base_dim * 0.004)
    overlay_draw.ellipse(
        (cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer),
        fill=(255, 255, 255, 215), # Semi-transparent white
        outline=(255, 255, 255, 255), # Solid white border
        width=max(1, border_w)
    )
    
    # 4. Extract circular logo mark from original logo
    logo_square = crop_to_aspect(img, 1, 1)
    logo_circle = logo_square.resize((D_inner, D_inner), Image.LANCZOS)
    
    # Create circular mask for the logo mark
    mask = Image.new('L', (D_inner, D_inner), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, D_inner, D_inner), fill=255)
    
    # Paste logo_circle onto overlay using mask
    r_inner = D_inner // 2
    logo_pos = (cx - r_inner, cy - r_inner)
    overlay.paste(logo_circle, logo_pos, mask)
    
    # Alpha composite the overlay onto the gradient canvas
    final_canvas = Image.alpha_composite(canvas, overlay)
    
    # Downsample to target size with high-quality LANCZOS anti-aliasing
    return final_canvas.resize((w, h), Image.LANCZOS)

def main():
    img = Image.open(LOGO_PATH).convert('RGBA')

    # 1. icon.png — 1024x1024 (Premium canvas)
    icon = make_premium_logo_canvas(img, 1024)
    icon.save(os.path.join(ASSETS_DIR, 'icon.png'), 'PNG')
    print(f"  ✓ icon.png (1024x1024)")

    # 2. adaptive-icon.png — 1024x1024 (Premium canvas)
    adaptive = make_premium_logo_canvas(img, 1024)
    adaptive.save(os.path.join(ASSETS_DIR, 'adaptive-icon.png'), 'PNG')
    print(f"  ✓ adaptive-icon.png (1024x1024)")

    # 3. favicon.png — 48x48 (Premium canvas)
    favicon = make_premium_logo_canvas(img, 48)
    favicon.save(os.path.join(ASSETS_DIR, 'favicon.png'), 'PNG')
    print(f"  ✓ favicon.png (48x48)")

    # 4. splash.png — 1242x2436 (Premium canvas vertical)
    splash = make_premium_logo_canvas(img, 0, is_splash=True, target_w=1242, target_h=2436)
    splash.save(os.path.join(ASSETS_DIR, 'splash.png'), 'PNG')
    print(f"  ✓ splash.png (1242x2436)")

    print(f"\nAll assets generated in {ASSETS_DIR}")

if __name__ == '__main__':
    main()
