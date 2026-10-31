import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_thumbnail():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    prod_dir = os.path.join(base_dir, "video-production")
    graphics_dir = os.path.join(prod_dir, "graphics")
    fonts_dir = os.path.join(graphics_dir, "fonts")
    branding_dir = os.path.join(prod_dir, "assets/branding")
    framed_dir = os.path.join(graphics_dir, "framed")
    os.makedirs(branding_dir, exist_ok=True)

    playfair_path = os.path.join(fonts_dir, "PlayfairDisplay.ttf")
    jakarta_path = os.path.join(fonts_dir, "PlusJakartaSans.ttf")

    w, h = 1080, 1920
    c_ivory_bg = (253, 251, 247, 255)       # #FDFBF7 Warm Ivory
    c_forest = (26, 48, 38, 255)             # #1A3026 Deep Forest Green
    c_sage = (70, 95, 82, 255)               # #465F52 Muted Sage
    c_gold = (212, 185, 145, 255)            # #D4B991 Champagne Gold
    c_gold_border = (197, 168, 128, 230)
    c_card_bg = (245, 241, 233, 255)

    im = Image.new("RGBA", (w, h), c_ivory_bg)
    d = ImageDraw.Draw(im)

    # 1. Luxury Outer and Inner Border
    d.rectangle([36, 36, w - 36, h - 36], outline=(225, 218, 205, 255), width=2)
    d.rectangle([48, 48, w - 48, h - 48], outline=c_gold, width=1)

    # 2. Top Eyebrow Pill
    font_pill = ImageFont.truetype(jakarta_path, 24)
    eyebrow = "OFFICIAL LAUNCH  •  AI SKINCARE PLATFORM"
    tb = d.textbbox((0, 0), eyebrow, font=font_pill)
    pw, ph = tb[2] - tb[0] + 48, tb[3] - tb[1] + 24
    px = (w - pw) // 2
    py = 120
    d.rounded_rectangle([px, py, px + pw, py + ph], radius=ph // 2, fill=(26, 48, 38, 240), outline=c_gold, width=2)
    d.text(((w - (tb[2] - tb[0])) // 2, py + 12), eyebrow, font=font_pill, fill=c_ivory_bg)

    # 3. Brand Monogram Emblem
    em_y = 310
    em_rad = 85
    d.ellipse([(w // 2) - em_rad - 6, em_y - em_rad - 6, (w // 2) + em_rad + 6, em_y + em_rad + 6], outline=c_gold, width=2)
    d.ellipse([(w // 2) - em_rad, em_y - em_rad, (w // 2) + em_rad, em_y + em_rad], fill=c_forest)
    font_s = ImageFont.truetype(playfair_path, 110)
    d.text(((w // 2) - 38, em_y - 74), "S", font=font_s, fill=c_ivory_bg)

    # 4. Brand Title & Tagline
    font_title = ImageFont.truetype(playfair_path, 108)
    tw = d.textbbox((0, 0), "SkinMate", font=font_title)[2]
    d.text(((w - tw) // 2, 430), "SkinMate", font=font_title, fill=c_forest)

    font_tag1 = ImageFont.truetype(playfair_path, 42)
    tag1 = "Understand your skin. Build your routine."
    t1w = d.textbbox((0, 0), tag1, font=font_tag1)[2]
    d.text(((w - t1w) // 2, 560), tag1, font=font_tag1, fill=c_gold)

    # 5. Hero Feature Showcase Window (Routine Curator preview in phone frame)
    # Load v_frame_s5_assembled.png and composite into preview card
    showcase_y = 660
    card_w, card_h = 920, 880
    cx = (w - card_w) // 2
    # Drop shadow
    d.rounded_rectangle([cx + 6, showcase_y + 8, cx + card_w + 6, showcase_y + card_h + 8], radius=32, fill=(0, 0, 0, 40))
    d.rounded_rectangle([cx, showcase_y, cx + card_w, showcase_y + card_h], radius=32, fill=c_card_bg, outline=c_gold_border, width=2)

    # Try loading real routine frame
    frame_routine_path = os.path.join(framed_dir, "v_frame_s5_assembled.png")
    if os.path.exists(frame_routine_path):
        preview_img = Image.open(frame_routine_path).convert("RGBA")
        # Crop center portion of the routine
        # Routine frame is 1080x1920, let's take a 860x760 section
        crop_box = (110, 360, 970, 1180)
        cropped_preview = preview_img.crop(crop_box).resize((860, 760), Image.Resampling.LANCZOS)
        
        # Rounded mask for preview
        mask = Image.new("L", (860, 760), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, 860, 760], radius=20, fill=255)
        
        im.paste(cropped_preview, (cx + 30, showcase_y + 30), mask)

    # Floating Badge over showcase: "THE ROUTINE CURATOR"
    font_badge = ImageFont.truetype(jakarta_path, 28)
    badge_txt = "★  THE ROUTINE CURATOR  ★"
    bb = d.textbbox((0, 0), badge_txt, font=font_badge)
    bw = bb[2] - bb[0] + 50
    bh = 54
    bx = (w - bw) // 2
    by = showcase_y + card_h - 27
    d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=bh // 2, fill=c_forest, outline=c_gold, width=2)
    d.text(((w - (bb[2] - bb[0])) // 2, by + 12), badge_txt, font=font_badge, fill=c_gold)

    # 6. Highlights row (3 pillars)
    feat_y = 1600
    font_feat = ImageFont.truetype(jakarta_path, 26)
    font_feat_sub = ImageFont.truetype(jakarta_path, 20)
    
    pillars = [
        ("AI Skin Profiler", "Biometric Insight"),
        ("100% Compatibility", "Zero Ingredient Clash"),
        ("Smart Budgeting", "Real-Time Regimen Cost")
    ]
    col_w = w // 3
    for i, (p_title, p_sub) in enumerate(pillars):
        center_x = i * col_w + (col_w // 2)
        ptw = d.textbbox((0, 0), p_title, font=font_feat)[2]
        psw = d.textbbox((0, 0), p_sub, font=font_feat_sub)[2]
        d.text((center_x - (ptw // 2), feat_y), p_title, font=font_feat, fill=c_forest)
        d.text((center_x - (psw // 2), feat_y + 36), p_sub, font=font_feat_sub, fill=c_sage)

    # 7. Bottom Statement
    font_bot = ImageFont.truetype(playfair_path, 34)
    bot = "Less guesswork. More confidence. Your SkinMate."
    bw = d.textbbox((0, 0), bot, font=font_bot)[2]
    d.text(((w - bw) // 2, 1750), bot, font=font_bot, fill=c_forest)

    # Save to deliverables
    final_thumb_root = os.path.join(base_dir, "SkinMate_Final_Thumbnail.png")
    final_thumb_brand = os.path.join(branding_dir, "SkinMate_Final_Thumbnail.png")
    im.save(final_thumb_root, format="PNG")
    im.save(final_thumb_brand, format="PNG")
    print(f"Thumbnail saved to {final_thumb_root}")

if __name__ == "__main__":
    create_thumbnail()
