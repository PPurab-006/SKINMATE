import os
from PIL import Image, ImageDraw, ImageFont

def refine_overlays():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    graphics_dir = os.path.join(base_dir, "graphics")
    fonts_dir = os.path.join(graphics_dir, "fonts")
    os.makedirs(graphics_dir, exist_ok=True)

    playfair_path = os.path.join(fonts_dir, "PlayfairDisplay.ttf")
    jakarta_path = os.path.join(fonts_dir, "PlusJakartaSans.ttf")

    # Colors
    c_cream = (253, 251, 247, 255)       # #FDFBF7
    c_forest = (26, 48, 38, 255)         # #1A3026
    c_gold = (212, 185, 145, 255)        # #D4B991
    c_gold_border = (197, 168, 128, 230)
    c_pill_bg = (22, 38, 30, 245)        # High contrast deep forest green pill

    w_v, h_v = 1080, 1920

    # 1. Feature Pill Maker (Vertical)
    # Positioning at card_y = 100 ensures it sits cleanly in the header area above the content
    def make_feature_pill_v(title, subtitle, filename):
        im = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        font_title = ImageFont.truetype(jakarta_path, 42)
        font_sub = ImageFont.truetype(jakarta_path, 26)
        
        tw = d.textbbox((0, 0), title, font=font_title)[2]
        pad_x, pad_y = 52, 20
        card_w = max(tw + pad_x * 2, 700)
        card_h = 110
        card_x = (w_v - card_w) // 2
        card_y = 110

        # Subtle shadow
        d.rounded_rectangle([card_x + 3, card_y + 4, card_x + card_w + 3, card_y + card_h + 4], radius=card_h // 2, fill=(0, 0, 0, 80))
        # Pill body with gold outline
        d.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=card_h // 2, fill=c_pill_bg, outline=c_gold_border, width=2)
        
        # Center text inside pill
        d.text(((w_v - tw) // 2, card_y + 16), title, font=font_title, fill=c_cream)
        stw = d.textbbox((0, 0), subtitle, font=font_sub)[2]
        d.text(((w_v - stw) // 2, card_y + 66), subtitle, font=font_sub, fill=c_gold)
        im.save(os.path.join(graphics_dir, filename))

    make_feature_pill_v("UNDERSTAND YOUR SKIN.", "OPTICAL BIOMETRIC PROFILING", "v_s4_understand.png")
    make_feature_pill_v("DISCOVER YOUR PRODUCTS.", "TARGETED FORMULATIONS FOR YOU", "v_s4_discover.png")
    make_feature_pill_v("BUILD YOUR ROUTINE.", "PERSONAL VANITY CONFIGURATOR", "v_s5_build.png")
    make_feature_pill_v("CHECK COMPATIBILITY.", "100% FORMULA HARMONY & ZERO CLASHES", "v_s5_compat.png")
    make_feature_pill_v("STAY WITHIN BUDGET.", "REAL-TIME REGIMEN COST CALCULATOR", "v_s5_budget.png")

    # 2. Scene 3: Meet SkinMate Banner
    im_s3 = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
    d3 = ImageDraw.Draw(im_s3)
    font_s3_title = ImageFont.truetype(playfair_path, 72)
    font_s3_sub = ImageFont.truetype(jakarta_path, 30)

    banner_w, banner_h = 760, 160
    bx = (w_v - banner_w) // 2
    by = 120
    # Shadow + Card
    d3.rounded_rectangle([bx + 4, by + 5, bx + banner_w + 4, by + banner_h + 5], radius=28, fill=(0, 0, 0, 80))
    d3.rounded_rectangle([bx, by, bx + banner_w, by + banner_h], radius=28, fill=c_pill_bg, outline=c_gold_border, width=2)

    # Monogram icon
    d3.ellipse([bx + 38, by + 34, bx + 128, by + 124], fill=c_cream)
    font_s = ImageFont.truetype(playfair_path, 56)
    d3.text(((bx + 62), by + 44), "S", font=font_s, fill=c_forest)

    d3.text((bx + 155, by + 36), "Meet SkinMate.", font=font_s3_title, fill=c_cream)
    d3.text((bx + 158, by + 104), "YOUR PERSONAL ROUTINE CURATOR", font=font_s3_sub, fill=c_gold)
    im_s3.save(os.path.join(graphics_dir, "v_s3_meet.png"))

    # 3. Scene 3: Meet SkinMate Banner (Horizontal 1920x1080)
    w_h, h_h = 1920, 1080
    im_s3_h = Image.new("RGBA", (w_h, h_h), (0, 0, 0, 0))
    d3_h = ImageDraw.Draw(im_s3_h)
    font_s3_title_h = ImageFont.truetype(playfair_path, 64)
    font_s3_sub_h = ImageFont.truetype(jakarta_path, 26)

    banner_w_h, banner_h_h = 720, 140
    bx_h = (w_h - banner_w_h) // 2
    by_h = 70
    # Shadow + Card
    d3_h.rounded_rectangle([bx_h + 4, by_h + 5, bx_h + banner_w_h + 4, by_h + banner_h_h + 5], radius=24, fill=(0, 0, 0, 80))
    d3_h.rounded_rectangle([bx_h, by_h, bx_h + banner_w_h, by_h + banner_h_h], radius=24, fill=c_pill_bg, outline=c_gold_border, width=2)

    # Monogram icon
    d3_h.ellipse([bx_h + 34, by_h + 28, bx_h + 114, by_h + 108], fill=c_cream)
    font_s_h = ImageFont.truetype(playfair_path, 50)
    d3_h.text(((bx_h + 55), by_h + 36), "S", font=font_s_h, fill=c_forest)

    d3_h.text((bx_h + 140, by_h + 28), "Meet SkinMate.", font=font_s3_title_h, fill=c_cream)
    d3_h.text((bx_h + 142, by_h + 90), "YOUR PERSONAL ROUTINE CURATOR", font=font_s3_sub_h, fill=c_gold)
    im_s3_h.save(os.path.join(graphics_dir, "h_s3_meet.png"))

    # 4. Scene 2: Problem Cards (Horizontal 1920x1080)
    def make_problem_card_h(text, filename):
        im = Image.new("RGBA", (w_h, h_h), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        font_s2 = ImageFont.truetype(jakarta_path, 38)
        tw = d.textbbox((0, 0), text, font=font_s2)[2]
        pad_x, pad_y = 52, 22
        card_w = tw + pad_x * 2
        card_h = 88
        card_x = (w_h - card_w) // 2
        card_y = 860

        d.rounded_rectangle([card_x + 3, card_y + 4, card_x + card_w + 3, card_y + card_h + 4], radius=card_h // 2, fill=(0, 0, 0, 80))
        d.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=card_h // 2, fill=c_pill_bg, outline=c_gold_border, width=2)
        d.text(((w_h - tw) // 2, card_y + pad_y - 2), text, font=font_s2, fill=c_cream)
        im.save(os.path.join(graphics_dir, filename))

    make_problem_card_h("ENDLESS PRODUCTS.", "h_s2_endless.png")
    make_problem_card_h("CONFLICTING ADVICE.", "h_s2_conflicting.png")
    make_problem_card_h("TOO MUCH GUESSWORK.", "h_s2_guesswork.png")

    print("Refined vertical and horizontal overlays saved successfully.")

if __name__ == "__main__":
    refine_overlays()
