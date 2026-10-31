import os
from PIL import Image

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCREEN_DIR = os.path.join(BASE_DIR, "assets/screen-recordings")
FRAMED_DIR = os.path.join(BASE_DIR, "graphics/framed")
os.makedirs(FRAMED_DIR, exist_ok=True)

def prepare_vertical_frames():
    target_w, target_h = 1080, 1920

    # 1. Scene 3A: Hero (Crop from y=200 to y=2300, scale to 1080x1920)
    im = Image.open(os.path.join(SCREEN_DIR, "v_scene3_hero.png"))
    # The hero section is centered around y=0 to y=2400
    crop3a = im.crop((0, 0, 2160, 3840)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop3a.save(os.path.join(FRAMED_DIR, "v_frame_s3_hero.png"))

    # 2. Scene 4A: Biometrics Cards (Recorded Skin Assessment)
    im = Image.open(os.path.join(SCREEN_DIR, "v_scene4_biometrics_cards.png"))
    # Focus on the 4 classification cards (Combination Skin, Type IV, Olive, Oval)
    # in original 2160x3840: cards are roughly y=600 to y=2800
    crop4a = im.crop((0, 150, 2160, 2750)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop4a.save(os.path.join(FRAMED_DIR, "v_frame_s4_cards.png"))

    # 3. Scene 4B: Split View (Diagnostic Portrait + Recommendations)
    im = Image.open(os.path.join(SCREEN_DIR, "v_scene4_split_view.png"))
    # Center around y=600 to y=3300
    crop4b = im.crop((0, 500, 2160, 3400)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop4b.save(os.path.join(FRAMED_DIR, "v_frame_s4_split.png"))

    # 4. Scene 5A: Routine Assembled
    im = Image.open(os.path.join(SCREEN_DIR, "v_scene5_routine_assembled.png"))
    # Focus on "My Care Routine", Budget metrics, and Steps 01 to 05 (y=200 to y=2700)
    crop5a = im.crop((0, 200, 2160, 2800)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop5a.save(os.path.join(FRAMED_DIR, "v_frame_s5_assembled.png"))

    # 5. Scene 5B: Replace Modal Focus
    im = Image.open(os.path.join(SCREEN_DIR, "v_scene5_replace_modal.png"))
    # Focus tightly on the modal in the center: y=1300 to y=2800, x=300 to x=1860
    # To maintain 9:16 aspect ratio: width 1600, height 2844
    cx, cy = 1080, 2100
    w_box, h_box = 1620, 2880
    crop5b = im.crop((cx - w_box // 2, cy - h_box // 2, cx + w_box // 2, cy + h_box // 2)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop5b.save(os.path.join(FRAMED_DIR, "v_frame_s5_modal.png"))

    # 6. Scene 5C: Routine Updated & Recalculated
    im = Image.open(os.path.join(SCREEN_DIR, "v_scene5_routine_updated.png"))
    crop5c = im.crop((0, 200, 2160, 2800)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop5c.save(os.path.join(FRAMED_DIR, "v_frame_s5_updated.png"))

    print("Framed vertical frames generated successfully.")

def prepare_horizontal_frames():
    target_w, target_h = 1920, 1080

    im = Image.open(os.path.join(SCREEN_DIR, "h_scene3_hero.png"))
    crop3 = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop3.save(os.path.join(FRAMED_DIR, "h_frame_s3_hero.png"))

    im = Image.open(os.path.join(SCREEN_DIR, "h_scene4_analysis.png"))
    crop4 = im.crop((0, 100, 3840, 2260)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop4.save(os.path.join(FRAMED_DIR, "h_frame_s4_analysis.png"))

    im = Image.open(os.path.join(SCREEN_DIR, "h_scene5_routine.png"))
    crop5a = im.crop((0, 80, 3840, 2240)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop5a.save(os.path.join(FRAMED_DIR, "h_frame_s5_routine.png"))

    im = Image.open(os.path.join(SCREEN_DIR, "h_scene5_modal.png"))
    crop5b = im.crop((0, 80, 3840, 2240)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    crop5b.save(os.path.join(FRAMED_DIR, "h_frame_s5_modal.png"))

    print("Framed horizontal frames generated successfully.")

if __name__ == "__main__":
    prepare_vertical_frames()
    prepare_horizontal_frames()
