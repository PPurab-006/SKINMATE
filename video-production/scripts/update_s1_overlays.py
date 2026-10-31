import os
from PIL import Image, ImageDraw, ImageFont

def update_scene1_overlays():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    graphics_dir = os.path.join(base_dir, "graphics")
    fonts_dir = os.path.join(graphics_dir, "fonts")
    playfair_path = os.path.join(fonts_dir, "PlayfairDisplay.ttf")

    w_v, h_v = 1080, 1920
    c_cream = (253, 251, 247, 255)       # #FDFBF7
    c_gold = (212, 185, 145, 255)        # #D4B991
    c_bg = (18, 28, 22, 210)             # Rich translucent forest dark backing
    c_gold_border = (197, 168, 128, 220)

    font_s1 = ImageFont.truetype(playfair_path, 60)
    font_s1_accent = ImageFont.truetype(playfair_path, 66)

    # Common card dimensions
    card_w = 880
    card_h = 280
    card_x = (w_v - card_w) // 2
    card_y = 1420

    # Line 1 only
    im1 = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(im1)
    d1.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=32, fill=c_bg, outline=c_gold_border, width=2)
    tw1 = d1.textbbox((0, 0), "Tired of not knowing", font=font_s1)[2]
    d1.text(((w_v - tw1) // 2, card_y + 36), "Tired of not knowing", font=font_s1, fill=c_cream)
    im1.save(os.path.join(graphics_dir, "v_s1_line1.png"))

    # Line 1 + Line 2
    im2 = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(im2)
    d2.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=32, fill=c_bg, outline=c_gold_border, width=2)
    d2.text(((w_v - tw1) // 2, card_y + 36), "Tired of not knowing", font=font_s1, fill=c_cream)
    tw2 = d2.textbbox((0, 0), "what actually works", font=font_s1)[2]
    d2.text(((w_v - tw2) // 2, card_y + 110), "what actually works", font=font_s1, fill=c_cream)
    im2.save(os.path.join(graphics_dir, "v_s1_line2.png"))

    # Line 1 + Line 2 + Line 3
    im3 = Image.new("RGBA", (w_v, h_v), (0, 0, 0, 0))
    d3 = ImageDraw.Draw(im3)
    d3.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=32, fill=c_bg, outline=c_gold_border, width=2)
    d3.text(((w_v - tw1) // 2, card_y + 36), "Tired of not knowing", font=font_s1, fill=c_cream)
    d3.text(((w_v - tw2) // 2, card_y + 110), "what actually works", font=font_s1, fill=c_cream)
    tw3 = d3.textbbox((0, 0), "for your skin?", font=font_s1_accent)[2]
    d3.text(((w_v - tw3) // 2, card_y + 185), "for your skin?", font=font_s1_accent, fill=c_gold)
    im3.save(os.path.join(graphics_dir, "v_s1_all.png"))

    # Horizontal Scene 1 overlay
    w_h, h_h = 1920, 1080
    c_w_h = 1100
    c_h_h = 240
    cx_h = (w_h - c_w_h) // 2
    cy_h = 760

    im_h = Image.new("RGBA", (w_h, h_h), (0, 0, 0, 0))
    dh = ImageDraw.Draw(im_h)
    dh.rounded_rectangle([cx_h, cy_h, cx_h + c_w_h, cy_h + c_h_h], radius=28, fill=c_bg, outline=c_gold_border, width=2)
    font_s1_h = ImageFont.truetype(playfair_path, 48)
    font_s1_accent_h = ImageFont.truetype(playfair_path, 54)
    t1 = "Tired of not knowing what actually works"
    t2 = "for your skin?"
    tw1_h = dh.textbbox((0, 0), t1, font=font_s1_h)[2]
    tw2_h = dh.textbbox((0, 0), t2, font=font_s1_accent_h)[2]
    dh.text(((w_h - tw1_h) // 2, cy_h + 40), t1, font=font_s1_h, fill=c_cream)
    dh.text(((w_h - tw2_h) // 2, cy_h + 125), t2, font=font_s1_accent_h, fill=c_gold)
    im_h.save(os.path.join(graphics_dir, "h_s1_all.png"))

    print("Updated Scene 1 cards with luxury frosted backing.")

if __name__ == "__main__":
    update_scene1_overlays()
