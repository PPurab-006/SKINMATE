import os
from PIL import Image, ImageDraw, ImageFont

def create_demo_thumbnail():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    prod_dir = os.path.join(base_dir, "demo-production")
    graphics_dir = os.path.join(prod_dir, "graphics")
    fonts_dir = os.path.join(base_dir, "video-production/graphics/fonts")
    raw_dir = os.path.join(prod_dir, "assets/screen-recordings/raw_frames")
    branding_dir = os.path.join(prod_dir, "assets/branding")
    os.makedirs(branding_dir, exist_ok=True)

    playfair_path = os.path.join(fonts_dir, "PlayfairDisplay.ttf")
    jakarta_path = os.path.join(fonts_dir, "PlusJakartaSans.ttf")

    w, h = 1920, 1080
    c_ivory_bg = (253, 251, 247, 255)
    c_forest = (26, 48, 38, 255)
    c_gold = (212, 185, 145, 255)
    c_gold_border = (197, 168, 128, 230)
    c_card_bg = (245, 241, 233, 255)

    im = Image.new("RGBA", (w, h), c_ivory_bg)
    d = ImageDraw.Draw(im)

    # 1. Luxury Outer and Inner Border
    d.rectangle([36, 36, w - 36, h - 36], outline=(225, 218, 205, 255), width=2)
    d.rectangle([48, 48, w - 48, h - 48], outline=c_gold, width=1)

    # 2. Left Section: Editorial Brand & Technical Credentials (Width: 820px)
    # Eyebrow Pill
    font_pill = ImageFont.truetype(jakarta_path, 20)
    eyebrow = "OFFICIAL HACKATHON DEMO  •  AI SKINCARE PLATFORM"
    tb = d.textbbox((0, 0), eyebrow, font=font_pill)
    pw, ph = tb[2] - tb[0] + 44, tb[3] - tb[1] + 20
    px = 90
    py = 100
    d.rounded_rectangle([px, py, px + pw, py + ph], radius=ph // 2, fill=(26, 48, 38, 240), outline=c_gold, width=2)
    d.text((px + 22, py + 10), eyebrow, font=font_pill, fill=c_ivory_bg)

    # Monogram Emblem
    em_x, em_y = 150, 240
    em_rad = 54
    d.ellipse([em_x - em_rad - 4, em_y - em_rad - 4, em_x + em_rad + 4, em_y + em_rad + 4], outline=c_gold, width=2)
    d.ellipse([em_x - em_rad, em_y - em_rad, em_x + em_rad, em_y + em_rad], fill=c_forest)
    font_s = ImageFont.truetype(playfair_path, 72)
    d.text((em_x - 24, em_y - 48), "S", font=font_s, fill=c_ivory_bg)

    # Main Brand Title
    font_brand = ImageFont.truetype(playfair_path, 84)
    d.text((230, 195), "SkinMate", font=font_brand, fill=c_forest)

    font_sub_brand = ImageFont.truetype(jakarta_path, 24)
    d.text((235, 290), "THE PERSONAL CARE & ROUTINE CONFIGURATOR", font=font_sub_brand, fill=c_gold)

    # Headline
    font_h1 = ImageFont.truetype(playfair_path, 54)
    h1_lines = ["Understand your skin.", "Build your routine."]
    for idx, line in enumerate(h1_lines):
        d.text((90, 370 + idx * 64), line, font=font_h1, fill=c_forest)

    # Highlights Bullet Card
    box_y = 530
    box_w, box_h = 760, 360
    d.rounded_rectangle([90, box_y, 90 + box_w, box_y + box_h], radius=24, fill=c_card_bg, outline=(225, 218, 205, 255), width=1)
    
    bullets = [
        ("YouCam S2S Computer Vision", "Optical surface sebum, pore mapping & Fitzpatrick phototyping."),
        ("The Routine Curator", "Hero configurator with real-time budget calculations & substitution."),
        ("100% Formula Harmony", "Biochemical ingredient clash analysis ensuring safe skincare combinations."),
        ("Guest-First Local Storage", "Persistent offline regimens with zero login barriers or user accounts.")
    ]
    font_b_title = ImageFont.truetype(jakarta_path, 20)
    font_b_desc = ImageFont.truetype(jakarta_path, 15)

    for i, (btitle, bdesc) in enumerate(bullets):
        by = box_y + 24 + i * 82
        # Bullet indicator dot
        d.ellipse([118, by + 6, 126, by + 14], fill=c_forest)
        d.text((140, by), btitle, font=font_b_title, fill=c_forest)
        d.text((140, by + 28), bdesc, font=font_b_desc, fill=(70, 95, 82, 255))

    # Bottom Tech Badge
    font_foot = ImageFont.truetype(jakarta_path, 20)
    foot = "Powered by Perfect Corp YouCam AI Skin Analysis API"
    d.text((90, 930), foot, font=font_foot, fill=c_gold)

    # 3. Right Section: Authentic Product Screenshot Showcase (Width: 920px)
    # Using s5_05_recalculated_budget_948.png (Routine Curator) and s5_03_compatibility_modal.png
    show_x = 900
    show_y = 100
    show_w = 930
    show_h = 860

    # Composite screenshot card with perspective-like framing
    card_bg_x = show_x
    card_bg_y = show_y
    d.rounded_rectangle([card_bg_x + 8, card_bg_y + 10, card_bg_x + show_w + 8, card_bg_y + show_h + 10], radius=32, fill=(0, 0, 0, 35))
    d.rounded_rectangle([card_bg_x, card_bg_y, card_bg_x + show_w, card_bg_y + show_h], radius=32, fill=(255, 255, 255, 255), outline=c_gold_border, width=2)

    # Embed real Routine Curator interface
    rc_path = os.path.join(raw_dir, "s5_05_recalculated_budget_948.png")
    if os.path.exists(rc_path):
        rc_img = Image.open(rc_path).convert("RGBA")
        # Crop the central interactive routine area (1920x1080 -> 1500x820)
        cropped = rc_img.crop((180, 100, 1740, 960)).resize((show_w - 40, show_h - 40), Image.Resampling.LANCZOS)
        
        mask = Image.new("L", (show_w - 40, show_h - 40), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.rounded_rectangle([0, 0, show_w - 40, show_h - 40], radius=22, fill=255)
        
        im.paste(cropped, (card_bg_x + 20, card_bg_y + 20), mask)

    # Floating badge over screenshot: "THE ROUTINE CURATOR"
    font_badge = ImageFont.truetype(jakarta_path, 24)
    badge_txt = "★  THE ROUTINE CURATOR IN ACTION  ★"
    bb = d.textbbox((0, 0), badge_txt, font=font_badge)
    bw = (bb[2] - bb[0]) + 48
    bh = 50
    bx = show_x + (show_w - bw) // 2
    by = show_y + show_h - 25
    d.rounded_rectangle([bx + 3, by + 3, bx + bw + 3, by + bh + 3], radius=bh // 2, fill=(0, 0, 0, 50))
    d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=bh // 2, fill=c_forest, outline=c_gold, width=2)
    d.text((bx + 24, by + 12), badge_txt, font=font_badge, fill=c_gold)

    # Save to deliverables
    final_thumb_root = os.path.join(base_dir, "SkinMate_Demo_Thumbnail.png")
    final_thumb_prod = os.path.join(branding_dir, "SkinMate_Demo_Thumbnail.png")
    im.save(final_thumb_root, format="PNG")
    im.save(final_thumb_prod, format="PNG")
    print(f"Demo thumbnail saved to {final_thumb_root}")

if __name__ == "__main__":
    create_demo_thumbnail()
