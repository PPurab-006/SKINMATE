import os
from PIL import Image, ImageDraw, ImageFont

def generate_graphics():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    prod_dir = os.path.join(base_dir, "demo-production")
    graphics_dir = os.path.join(prod_dir, "graphics")
    fonts_dir = os.path.join(base_dir, "video-production/graphics/fonts")
    os.makedirs(graphics_dir, exist_ok=True)

    playfair_path = os.path.join(fonts_dir, "PlayfairDisplay.ttf")
    jakarta_path = os.path.join(fonts_dir, "PlusJakartaSans.ttf")

    w, h = 1920, 1080

    c_cream = (253, 251, 247, 255)
    c_forest = (26, 48, 38, 255)
    c_gold = (212, 185, 145, 255)
    c_gold_border = (197, 168, 128, 230)
    c_pill_bg = (20, 36, 28, 240)

    # 1. Unobtrusive Technical Annotation: "Powered by Perfect Corp YouCam AI Skin Analysis API"
    im_ann = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d_ann = ImageDraw.Draw(im_ann)
    font_ann = ImageFont.truetype(jakarta_path, 20)
    font_ann_bold = ImageFont.truetype(jakarta_path, 20)

    ann_text = "Powered by Perfect Corp YouCam AI Skin Analysis API"
    tb = d_ann.textbbox((0, 0), ann_text, font=font_ann)
    aw, ah = (tb[2] - tb[0]) + 48, (tb[3] - tb[1]) + 20
    # Position in bottom right corner (padding 36px from edges)
    ax = w - aw - 40
    ay = h - ah - 36

    # Shadow + pill
    d_ann.rounded_rectangle([ax + 3, ay + 3, ax + aw + 3, ay + ah + 3], radius=ah // 2, fill=(0, 0, 0, 60))
    d_ann.rounded_rectangle([ax, ay, ax + aw, ay + ah], radius=ah // 2, fill=c_pill_bg, outline=c_gold_border, width=1)
    
    # Gold dot indicator
    d_ann.ellipse([ax + 18, ay + 14, ax + 26, ay + 22], fill=c_gold)
    d_ann.text((ax + 34, ay + 8), ann_text, font=font_ann, fill=c_cream)
    im_ann.save(os.path.join(graphics_dir, "overlay_youcam_annotation.png"))
    print("Created overlay_youcam_annotation.png")

    # 2. Chapter Badges (Top-Left corner)
    def make_chapter_badge(chapter_num, title, filename):
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        font_num = ImageFont.truetype(jakarta_path, 16)
        font_txt = ImageFont.truetype(jakarta_path, 20)
        
        full_txt = f"{chapter_num}  •  {title}"
        tb = d.textbbox((0, 0), full_txt, font=font_txt)
        bw, bh = (tb[2] - tb[0]) + 42, 44
        bx, by = 40, 28

        d.rounded_rectangle([bx + 2, by + 2, bx + bw + 2, by + bh + 2], radius=22, fill=(0, 0, 0, 60))
        d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=22, fill=c_pill_bg, outline=c_gold_border, width=1)
        
        d.text((bx + 20, by + 10), full_txt, font=font_txt, fill=c_cream)
        im.save(os.path.join(graphics_dir, filename))

    make_chapter_badge("01 / 06", "SYSTEM INTRODUCTION & HOMEPAGE", "badge_sec1.png")
    make_chapter_badge("02 / 06", "YOUCAM AI S2S SKIN ANALYSIS API", "badge_sec2.png")
    make_chapter_badge("03 / 06", "BIOMETRIC PROFILING & OPTICAL HEATMAPS", "badge_sec3.png")
    make_chapter_badge("04 / 06", "EVIDENCE-BASED PRODUCT DISCOVERY", "badge_sec4.png")
    make_chapter_badge("05 / 06", "THE ROUTINE CURATOR (HERO CONFIGURATOR)", "badge_sec5.png")
    make_chapter_badge("06 / 06", "GUEST-FIRST LOCAL STORAGE (MY LISTS)", "badge_sec6.png")
    print("Created all chapter badges.")

    # 3. Clean Professional Closing Card (Scene 7, 1920x1080)
    c_ivory_bg = (253, 251, 247, 255)
    im_close = Image.new("RGBA", (w, h), c_ivory_bg)
    d_close = ImageDraw.Draw(im_close)

    # Double Border
    d_close.rectangle([40, 40, w - 40, h - 40], outline=(225, 218, 205, 255), width=2)
    d_close.rectangle([50, 50, w - 50, h - 50], outline=c_gold, width=1)

    # Center Emblem & Title
    em_y = 260
    em_rad = 75
    d_close.ellipse([(w // 2) - em_rad - 5, em_y - em_rad - 5, (w // 2) + em_rad + 5, em_y + em_rad + 5], outline=c_gold, width=2)
    d_close.ellipse([(w // 2) - em_rad, em_y - em_rad, (w // 2) + em_rad, em_y + em_rad], fill=c_forest)
    font_s = ImageFont.truetype(playfair_path, 96)
    d_close.text(((w // 2) - 34, em_y - 65), "S", font=font_s, fill=c_cream)

    font_brand = ImageFont.truetype(playfair_path, 90)
    bw = d_close.textbbox((0, 0), "SkinMate", font=font_brand)[2]
    d_close.text(((w - bw) // 2, 380), "SkinMate", font=font_brand, fill=c_forest)

    font_tag = ImageFont.truetype(playfair_path, 36)
    tag = "Understand your skin. Build your routine."
    tw = d_close.textbbox((0, 0), tag, font=font_tag)[2]
    d_close.text(((w - tw) // 2, 490), tag, font=font_tag, fill=c_gold)

    # 4 Pillar Architecture Summary Cards
    card_y = 590
    card_w, card_h = 380, 200
    gap = 40
    start_x = (w - (card_w * 4 + gap * 3)) // 2

    pillars = [
        ("YouCam AI Vision", "Server-to-Server API", "Optical skin mapping, sebum profiling, and Fitzpatrick phototyping."),
        ("Routine Curator", "Vanity Configurator", "Step-by-step regimen assembly with real-time budget calculations."),
        ("Formula Harmony", "Biochemical Rules", "Ingredient clash checking ensuring 100% routine compatibility."),
        ("Guest-First Storage", "Local Persistence", "IndexedDB / localStorage. Zero registration gates or user accounts.")
    ]

    font_p_title = ImageFont.truetype(jakarta_path, 22)
    font_p_sub = ImageFont.truetype(jakarta_path, 16)
    font_p_desc = ImageFont.truetype(jakarta_path, 14)

    for i, (title, sub, desc) in enumerate(pillars):
        cx = start_x + i * (card_w + gap)
        # Card Background
        d_close.rounded_rectangle([cx, card_y, cx + card_w, card_y + card_h], radius=20, fill=(245, 241, 233, 255), outline=(225, 218, 205, 255), width=1)
        
        d_close.text((cx + 24, card_y + 24), title, font=font_p_title, fill=c_forest)
        d_close.text((cx + 24, card_y + 56), sub, font=font_p_sub, fill=c_gold)
        
        # Word wrap description
        words = desc.split(" ")
        lines = []
        cur_line = ""
        for word in words:
            test = cur_line + (" " if cur_line else "") + word
            if d_close.textbbox((0, 0), test, font=font_p_desc)[2] <= card_w - 48:
                cur_line = test
            else:
                lines.append(cur_line)
                cur_line = word
        if cur_line:
            lines.append(cur_line)
            
        for line_idx, line in enumerate(lines):
            d_close.text((cx + 24, card_y + 95 + line_idx * 22), line, font=font_p_desc, fill=(70, 95, 82, 255))

    # Bottom Thank You & Credentials
    font_bot = ImageFont.truetype(playfair_path, 32)
    bot = "Less guesswork. More confidence. Thank you for watching."
    btw = d_close.textbbox((0, 0), bot, font=font_bot)[2]
    d_close.text(((w - btw) // 2, 850), bot, font=font_bot, fill=c_forest)

    font_cred = ImageFont.truetype(jakarta_path, 20)
    cred = "Powered by Perfect Corp YouCam AI Skin Analysis API  •  Official Hackathon Submission"
    cw = d_close.textbbox((0, 0), cred, font=font_cred)[2]
    d_close.text(((w - cw) // 2, 920), cred, font=font_cred, fill=c_gold)

    im_close.save(os.path.join(graphics_dir, "scene7_closing_card.png"))
    print("Created scene7_closing_card.png")

if __name__ == "__main__":
    generate_graphics()
