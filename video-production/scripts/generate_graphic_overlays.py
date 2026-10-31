import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_overlays():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    graphics_dir = os.path.join(base_dir, "graphics")
    fonts_dir = os.path.join(graphics_dir, "fonts")
    os.makedirs(graphics_dir, exist_ok=True)

    playfair_path = os.path.join(fonts_dir, "PlayfairDisplay.ttf")
    jakarta_path = os.path.join(fonts_dir, "PlusJakartaSans.ttf")

    # Colors
    c_cream = (253, 251, 247, 255)       # #FDFBF7
    c_forest = (26, 48, 38, 255)         # #1A3026
    c_gold = (197, 168, 128, 255)        # #C5A880
    c_ivory_bg = (248, 246, 240, 255)    # #F8F6F0
    c_shadow = (15, 20, 18, 180)

    # -------------------------------------------------------------
    # 1. VERTICAL OVERLAYS (1080 x 1920)
    # -------------------------------------------------------------
    w_v, h_v = 1080, 1920

    # Helper function for text with shadow
    def draw_text_with_shadow(draw, pos, text, font, fill, shadow_fill=c_shadow, offset=(2, 3)):
        x, y = pos
        ox, oy = offset
        draw.text((x + ox, y + oy), text, font=font, fill=shadow_fill)
        draw.text((x, y), text, font=font, fill=fill)

    # Scene 1: Sequential Hook Text
    # Line 1: Tired of not knowing
    # Line 2: what actually works
    # Line 3: for your skin?
    font_s1 = ImageFont.truetype(playfair_path, 64)
    font_s1_italic = ImageFont.truetype(playfair_path, 68)

    # Scene 1 - Step 1
    im_s1_1 = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_s1_1)
    bbox1 = d.textbbox((0, 0), "Tired of not knowing", font=font_s1)
    tw1 = bbox1[2] - bbox1[0]
    draw_text_with_shadow(d, ((w_v - tw1) // 2, 1350), "Tired of not knowing", font_s1, c_cream)
    im_s1_1.save(os.path.join(graphics_dir, "v_s1_line1.png"))

    # Scene 1 - Step 2 (Lines 1 & 2)
    im_s1_2 = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_s1_2)
    draw_text_with_shadow(d, ((w_v - tw1) // 2, 1350), "Tired of not knowing", font_s1, c_cream)
    bbox2 = d.textbbox((0, 0), "what actually works", font=font_s1)
    tw2 = bbox2[2] - bbox2[0]
    draw_text_with_shadow(d, ((w_v - tw2) // 2, 1440), "what actually works", font_s1, c_cream)
    im_s1_2.save(os.path.join(graphics_dir, "v_s1_line2.png"))

    # Scene 1 - Step 3 (All 3 lines with accent)
    im_s1_3 = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_s1_3)
    draw_text_with_shadow(d, ((w_v - tw1) // 2, 1350), "Tired of not knowing", font_s1, c_cream)
    draw_text_with_shadow(d, ((w_v - tw2) // 2, 1440), "what actually works", font_s1, c_cream)
    bbox3 = d.textbbox((0, 0), "for your skin?", font=font_s1_italic)
    tw3 = bbox3[2] - bbox3[0]
    draw_text_with_shadow(d, ((w_v - tw3) // 2, 1530), "for your skin?", font_s1_italic, c_gold)
    im_s1_3.save(os.path.join(graphics_dir, "v_s1_all.png"))

    # Scene 2: Problem Statements (Uppercase, bold, impactful)
    font_s2 = ImageFont.truetype(jakarta_path, 52)
    def make_problem_card(text, filename):
        im = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        bbox = d.textbbox((0, 0), text, font=font_s2)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        
        # Pill card background
        pad_x, pad_y = 48, 24
        card_w = tw + pad_x * 2
        card_h = th + pad_y * 2
        card_x = (w_v - card_w) // 2
        card_y = 1500

        # Semi-transparent dark pill with subtle gold border
        d.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=card_h // 2, fill=(18, 28, 22, 225), outline=c_gold, width=2)
        d.text((card_x + pad_x, card_y + pad_y - 2), text, font=font_s2, fill=c_cream)
        im.save(os.path.join(graphics_dir, filename))

    make_problem_card("ENDLESS PRODUCTS.", "v_s2_endless.png")
    make_problem_card("CONFLICTING ADVICE.", "v_s2_conflicting.png")
    make_problem_card("TOO MUCH GUESSWORK.", "v_s2_guesswork.png")

    # Scene 3: Meet SkinMate
    im_s3 = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
    d = ImageDraw.Draw(im_s3)
    font_s3_sub = ImageFont.truetype(jakarta_path, 36)
    font_s3_title = ImageFont.truetype(playfair_path, 76)
    
    # Elegant top header banner
    banner_w, banner_h = 720, 160
    bx = (w_v - banner_w) // 2
    by = 180
    d.rounded_rectangle([bx, by, bx + banner_w, by + banner_h], radius=24, fill=(248, 246, 240, 240), outline=c_forest, width=2)
    
    # Emblem icon
    d.ellipse([bx + 40, by + 35, bx + 130, by + 125], fill=c_forest)
    font_s = ImageFont.truetype(playfair_path, 54)
    d.text((bx + 64, by + 46), "S", font=font_s, fill=c_cream)

    d.text((bx + 160, by + 35), "Meet SkinMate.", font=font_s3_title, fill=c_forest)
    d.text((bx + 164, by + 105), "YOUR PERSONAL CARE CURATOR", font=font_s3_sub, fill=c_gold)
    im_s3.save(os.path.join(graphics_dir, "v_s3_meet.png"))

    # Scene 4: Pillars (Understand Your Skin, Discover Your Products)
    def make_feature_pill(title, subtitle, filename):
        im = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        font_title = ImageFont.truetype(jakarta_path, 42)
        font_sub = ImageFont.truetype(jakarta_path, 28)
        
        tw = d.textbbox((0, 0), title, font=font_title)[2]
        pad_x, pad_y = 50, 22
        card_w = max(tw + pad_x * 2, 680)
        card_h = 110
        card_x = (w_v - card_w) // 2
        card_y = 220

        d.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=card_h // 2, fill=(26, 48, 38, 245), outline=c_gold, width=2)
        d.text(((w_v - tw) // 2, card_y + 18), title, font=font_title, fill=c_cream)
        stw = d.textbbox((0, 0), subtitle, font=font_sub)[2]
        d.text(((w_v - stw) // 2, card_y + 68), subtitle, font=font_sub, fill=c_gold)
        im.save(os.path.join(graphics_dir, filename))

    make_feature_pill("UNDERSTAND YOUR SKIN.", "OPTICAL BIOMETRIC PROFILING", "v_s4_understand.png")
    make_feature_pill("DISCOVER YOUR PRODUCTS.", "TARGETED FORMULATIONS FOR YOU", "v_s4_discover.png")

    # Scene 5: Routine Curator (The Hero Feature)
    make_feature_pill("BUILD YOUR ROUTINE.", "PERSONAL VANITY CONFIGURATOR", "v_s5_build.png")
    make_feature_pill("CHECK COMPATIBILITY.", "100% FORMULA HARMONY & ZERO CLASHES", "v_s5_compat.png")
    make_feature_pill("STAY WITHIN BUDGET.", "REAL-TIME REGIMEN COST CALCULATOR", "v_s5_budget.png")

    # Scene 6: Brand Reveal Card (Warm Ivory luxury aesthetic)
    im_s6 = Image.new("RGBA", (w_v, h_v), c_ivory_bg)
    d = ImageDraw.Draw(im_s6)

    # Subtle decorative borders
    border_inset = 60
    d.rectangle([border_inset, border_inset, w_v - border_inset, h_v - border_inset], outline=(225, 218, 205, 255), width=2)
    d.rectangle([border_inset + 12, border_inset + 12, w_v - border_inset - 12, h_v - border_inset - 12], outline=c_gold, width=1)

    # Central Emblem
    emblem_center_y = 750
    emblem_radius = 110
    # Gold outer glow / ring
    d.ellipse([(w_v // 2) - emblem_radius - 8, emblem_center_y - emblem_radius - 8,
               (w_v // 2) + emblem_radius + 8, emblem_center_y + emblem_radius + 8], outline=c_gold, width=3)
    d.ellipse([(w_v // 2) - emblem_radius, emblem_center_y - emblem_radius,
               (w_v // 2) + emblem_radius, emblem_center_y + emblem_radius], fill=c_forest)
    font_s_logo = ImageFont.truetype(playfair_path, 130)
    d.text(((w_v // 2) - 48, emblem_center_y - 88), "S", font=font_s_logo, fill=c_cream)

    # Brand Title: SkinMate
    font_brand = ImageFont.truetype(playfair_path, 108)
    bw = d.textbbox((0, 0), "SkinMate", font=font_brand)[2]
    d.text(((w_v - bw) // 2, 940), "SkinMate", font=font_brand, fill=c_forest)

    # Tagline 1: Understand your skin. Build your routine.
    font_tag1 = ImageFont.truetype(playfair_path, 46)
    tag1 = "Understand your skin. Build your routine."
    t1w = d.textbbox((0, 0), tag1, font=font_tag1)[2]
    d.text(((w_v - t1w) // 2, 1090), tag1, font=font_tag1, fill=c_gold)

    # Tagline 2: Supporting luxury descriptor
    font_tag2 = ImageFont.truetype(jakarta_path, 28)
    tag2 = "AI-POWERED SKINCARE DISCOVERY & ROUTINE CURATOR"
    t2w = d.textbbox((0, 0), tag2, font=font_tag2)[2]
    d.text(((w_v - t2w) // 2, 1170), tag2, font=font_tag2, fill=(80, 95, 88, 255))

    # Divider ornament
    div_y = 1240
    d.line([(w_v // 2) - 150, div_y, (w_v // 2) + 150, div_y], fill=c_gold, width=2)
    d.ellipse([(w_v // 2) - 5, div_y - 5, (w_v // 2) + 5, div_y + 5], fill=c_forest)

    # Bottom Callout: Less guesswork. More confidence.
    font_bot = ImageFont.truetype(jakarta_path, 34)
    bot_text = "Less guesswork. More confidence."
    btw = d.textbbox((0, 0), bot_text, font=font_bot)[2]
    d.text(((w_v - btw) // 2, 1310), bot_text, font=font_bot, fill=c_forest)

    im_s6.save(os.path.join(graphics_dir, "v_s6_brand_card.png"))
    print("Created all vertical overlays.")

    # -------------------------------------------------------------
    # 2. HORIZONTAL OVERLAYS (1920 x 1080)
    # -------------------------------------------------------------
    w_h, h_h = 1920, 1080

    # Horizontal Brand Card
    im_s6_h = Image.new("RGBA", (w_h, h_h), c_ivory_bg)
    d_h = ImageDraw.Draw(im_s6_h)

    # Decorative borders
    d_h.rectangle([40, 40, w_h - 40, h_h - 40], outline=(225, 218, 205, 255), width=2)
    d_h.rectangle([50, 50, w_h - 50, h_h - 50], outline=c_gold, width=1)

    # Center Emblem & Brand Name in horizontal alignment
    em_h_y = 440
    em_rad = 90
    d_h.ellipse([(w_h // 2) - em_rad - 6, em_h_y - em_rad - 6,
                 (w_h // 2) + em_rad + 6, em_h_y + em_rad + 6], outline=c_gold, width=2)
    d_h.ellipse([(w_h // 2) - em_rad, em_h_y - em_rad,
                 (w_h // 2) + em_rad, em_h_y + em_rad], fill=c_forest)
    font_s_logo_h = ImageFont.truetype(playfair_path, 110)
    d_h.text(((w_h // 2) - 40, em_h_y - 74), "S", font=font_s_logo_h, fill=c_cream)

    font_brand_h = ImageFont.truetype(playfair_path, 96)
    bw_h = d_h.textbbox((0, 0), "SkinMate", font=font_brand_h)[2]
    d_h.text(((w_h - bw_h) // 2, 580), "SkinMate", font=font_brand_h, fill=c_forest)

    font_tag1_h = ImageFont.truetype(playfair_path, 40)
    t1w_h = d_h.textbbox((0, 0), tag1, font=font_tag1_h)[2]
    d_h.text(((w_h - t1w_h) // 2, 700), tag1, font=font_tag1_h, fill=c_gold)

    font_tag2_h = ImageFont.truetype(jakarta_path, 24)
    t2w_h = d_h.textbbox((0, 0), tag2, font=font_tag2_h)[2]
    d_h.text(((w_h - t2w_h) // 2, 770), tag2, font=font_tag2_h, fill=(80, 95, 88, 255))

    font_bot_h = ImageFont.truetype(jakarta_path, 30)
    btw_h = d_h.textbbox((0, 0), bot_text, font=font_bot_h)[2]
    d_h.text(((w_h - btw_h) // 2, 850), bot_text, font=font_bot_h, fill=c_forest)

    im_s6_h.save(os.path.join(graphics_dir, "h_s6_brand_card.png"))

    # Horizontal Pills
    def make_feature_pill_h(title, subtitle, filename):
        im = Image.new("RGBA", (w_h, h_h), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        font_title = ImageFont.truetype(jakarta_path, 36)
        font_sub = ImageFont.truetype(jakarta_path, 24)
        
        tw = d.textbbox((0, 0), title, font=font_title)[2]
        pad_x, pad_y = 44, 18
        card_w = max(tw + pad_x * 2, 600)
        card_h = 96
        card_x = (w_h - card_w) // 2
        card_y = 120

        d.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=card_h // 2, fill=(26, 48, 38, 240), outline=c_gold, width=2)
        d.text(((w_h - tw) // 2, card_y + 14), title, font=font_title, fill=c_cream)
        stw = d.textbbox((0, 0), subtitle, font=font_sub)[2]
        d.text(((w_h - stw) // 2, card_y + 56), subtitle, font=font_sub, fill=c_gold)
        im.save(os.path.join(graphics_dir, filename))

    make_feature_pill_h("UNDERSTAND YOUR SKIN.", "OPTICAL BIOMETRIC PROFILING", "h_s4_understand.png")
    make_feature_pill_h("DISCOVER YOUR PRODUCTS.", "TARGETED FORMULATIONS FOR YOU", "h_s4_discover.png")
    make_feature_pill_h("BUILD YOUR ROUTINE.", "PERSONAL VANITY CONFIGURATOR", "h_s5_build.png")
    make_feature_pill_h("CHECK COMPATIBILITY.", "100% FORMULA HARMONY & ZERO CLASHES", "h_s5_compat.png")
    make_feature_pill_h("STAY WITHIN BUDGET.", "REAL-TIME REGIMEN COST CALCULATOR", "h_s5_budget.png")

    print("Created all horizontal overlays.")

if __name__ == "__main__":
    create_overlays()
