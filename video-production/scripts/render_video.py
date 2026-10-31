import os
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
PROD_DIR = os.path.join(BASE_DIR, "video-production")
STOCK_DIR = os.path.join(PROD_DIR, "assets/stock")
FRAMED_DIR = os.path.join(PROD_DIR, "graphics/framed")
GRAPHICS_DIR = os.path.join(PROD_DIR, "graphics")
RENDERS_DIR = os.path.join(PROD_DIR, "renders")
MASTER_AUDIO = os.path.join(RENDERS_DIR, "master_audio.wav")

os.makedirs(RENDERS_DIR, exist_ok=True)

def run_cmd(cmd, desc=""):
    print(f"\n--- {desc} ---")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print("Command failed:")
        print(" ".join(cmd))
        print("Error output:\n", res.stderr[-1000:])
        raise RuntimeError(f"Step failed: {desc}")
    print(f"Success: {desc}")

def render_vertical():
    """Renders the primary 9:16 vertical video: SkinMate_Launch_Reel.mp4 (1080x1920, 30fps)."""
    seg_dir = os.path.join(RENDERS_DIR, "vertical_segments")
    os.makedirs(seg_dir, exist_ok=True)

    # 1. SCENE 1: The Hook (0:00–0:05, 5.0s, 150 frames)
    # Woman examining skin in mirror with relatable concerned expression
    # Text: "Tired of not knowing / what actually works / for your skin?"
    s1_out = os.path.join(seg_dir, "v_seg1.mp4")
    filter_s1 = (
        "[0:v]trim=start=0:end=5,setpts=PTS-STARTPTS,"
        "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba[t1];"
        "[2:v]loop=loop=-1:size=1:start=0,format=rgba[t2];"
        "[3:v]loop=loop=-1:size=1:start=0,format=rgba[t3];"
        "[bg][t1]overlay=0:0:enable='between(t,0.6,1.6)'[bg1];"
        "[bg1][t2]overlay=0:0:enable='between(t,1.6,2.6)'[bg2];"
        "[bg2][t3]overlay=0:0:enable='gte(t,2.6)'[out]"
    )
    cmd_s1 = [
        "ffmpeg", "-y",
        "-i", os.path.join(STOCK_DIR, "skin_12843.mp4"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s1_line1.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s1_line2.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s1_all.png"),
        "-filter_complex", filter_s1,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "5.0",
        s1_out
    ]
    run_cmd(cmd_s1, "Render Vertical Scene 1 (The Hook)")

    # 2. SCENE 2: The Problem (9.8s total)
    # 2A: jars_39909.mp4 + ENDLESS PRODUCTS (3.2s)
    s2a_out = os.path.join(seg_dir, "v_seg2a.mp4")
    filter_s2a = (
        "[0:v]trim=start=0:end=3.2,setpts=PTS-STARTPTS,"
        "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3,fade=t=out:st=2.8:d=0.4[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s2a = [
        "ffmpeg", "-y",
        "-i", os.path.join(STOCK_DIR, "jars_39909.mp4"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s2_endless.png"),
        "-filter_complex", filter_s2a,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.2",
        s2a_out
    ]
    run_cmd(cmd_s2a, "Render Vertical Scene 2A (Endless Products)")

    # 2B: product_50417.mp4 + CONFLICTING ADVICE (3.3s)
    s2b_out = os.path.join(seg_dir, "v_seg2b.mp4")
    filter_s2b = (
        "[0:v]trim=start=0.5:end=3.8,setpts=PTS-STARTPTS,"
        "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3,fade=t=out:st=2.9:d=0.4[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s2b = [
        "ffmpeg", "-y",
        "-i", os.path.join(STOCK_DIR, "product_50417.mp4"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s2_conflicting.png"),
        "-filter_complex", filter_s2b,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.3",
        s2b_out
    ]
    run_cmd(cmd_s2b, "Render Vertical Scene 2B (Conflicting Advice)")

    # 2C: skin_51172.mp4 + TOO MUCH GUESSWORK (3.3s)
    s2c_out = os.path.join(seg_dir, "v_seg2c.mp4")
    filter_s2c = (
        "[0:v]trim=start=0:end=3.3,setpts=PTS-STARTPTS,"
        "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3,fade=t=out:st=2.9:d=0.4[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s2c = [
        "ffmpeg", "-y",
        "-i", os.path.join(STOCK_DIR, "skin_51172.mp4"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s2_guesswork.png"),
        "-filter_complex", filter_s2c,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.3",
        s2c_out
    ]
    run_cmd(cmd_s2c, "Render Vertical Scene 2C (Too Much Guesswork)")

    # 3. SCENE 3: The Transition (7.2s: 3A 3.6s, 3B 3.6s)
    # 3A: Homepage Hero + Meet SkinMate (3.6s)
    s3a_out = os.path.join(seg_dir, "v_seg3a.mp4")
    filter_s3a = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='min(zoom+0.0006,1.05)':d=108:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.3:d=0.4[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s3a = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "v_frame_s3_hero.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s3_meet.png"),
        "-filter_complex", filter_s3a,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.6",
        s3a_out
    ]
    run_cmd(cmd_s3a, "Render Vertical Scene 3A (Meet SkinMate)")

    # 3B: Discover Your Skin & Hair CTA focus (3.6s)
    s3b_out = os.path.join(seg_dir, "v_seg3b.mp4")
    filter_s3b = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='min(zoom+0.0006,1.06)':d=108:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s3b = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "v_frame_s3_hero.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s3_meet.png"),
        "-filter_complex", filter_s3b,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.6",
        s3b_out
    ]
    run_cmd(cmd_s3b, "Render Vertical Scene 3B (Discover Your Skin & Hair)")

    # 4. SCENE 4: Skin Analysis & Discovery (7.5s: 4A 3.5s, 4B 4.0s)
    # 4A: Biometrics Cards (3.5s)
    s4a_out = os.path.join(seg_dir, "v_seg4a.mp4")
    filter_s4a = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='min(zoom+0.0005,1.04)':d=105:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s4a = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "v_frame_s4_cards.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s4_understand.png"),
        "-filter_complex", filter_s4a,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.5",
        s4a_out
    ]
    run_cmd(cmd_s4a, "Render Vertical Scene 4A (Understand Your Skin)")

    # 4B: Split View (Diagnostic Portrait + Recommendations) (4.0s)
    s4b_out = os.path.join(seg_dir, "v_seg4b.mp4")
    filter_s4b = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='min(zoom+0.0005,1.04)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s4b = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "v_frame_s4_split.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s4_discover.png"),
        "-filter_complex", filter_s4b,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "4.0",
        s4b_out
    ]
    run_cmd(cmd_s4b, "Render Vertical Scene 4B (Discover Your Products)")

    # 5. SCENE 5: The Hero Feature: Routine Curator (12.0s: 5A 4.0s, 5B 4.0s, 5C 4.0s)
    # 5A: Routine Assembled Overview (4.0s)
    s5a_out = os.path.join(seg_dir, "v_seg5a.mp4")
    filter_s5a = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='min(zoom+0.0005,1.04)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s5a = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "v_frame_s5_assembled.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s5_build.png"),
        "-filter_complex", filter_s5a,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "4.0",
        s5a_out
    ]
    run_cmd(cmd_s5a, "Render Vertical Scene 5A (Build Your Routine)")

    # 5B: Modal with Compatible Alternatives (4.0s)
    s5b_out = os.path.join(seg_dir, "v_seg5b.mp4")
    filter_s5b = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='min(zoom+0.0005,1.04)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s5b = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "v_frame_s5_modal.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s5_compat.png"),
        "-filter_complex", filter_s5b,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "4.0",
        s5b_out
    ]
    run_cmd(cmd_s5b, "Render Vertical Scene 5B (Check Compatibility)")

    # 5C: Recalculated Routine Cost & Save (4.0s)
    s5c_out = os.path.join(seg_dir, "v_seg5c.mp4")
    filter_s5c = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='min(zoom+0.0005,1.04)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s5c = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "v_frame_s5_updated.png"),
        "-i", os.path.join(GRAPHICS_DIR, "v_s5_budget.png"),
        "-filter_complex", filter_s5c,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "4.0",
        s5c_out
    ]
    run_cmd(cmd_s5c, "Render Vertical Scene 5C (Stay Within Budget)")

    # 6. SCENE 6: The Brand Reveal (8.1s)
    s6_out = os.path.join(seg_dir, "v_seg6.mp4")
    filter_s6 = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='min(zoom+0.00025,1.03)':d=243:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[out]"
    )
    cmd_s6 = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(GRAPHICS_DIR, "v_s6_brand_card.png"),
        "-filter_complex", filter_s6,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "8.1",
        s6_out
    ]
    run_cmd(cmd_s6, "Render Vertical Scene 6 (Brand Reveal)")

    # 7. CONCATENATE VERTICAL SEGMENTS WITH MASTER SOUNDTRACK
    concat_list = os.path.join(seg_dir, "concat_list.txt")
    segments = [s1_out, s2a_out, s2b_out, s2c_out, s3a_out, s3b_out, s4a_out, s4b_out, s5a_out, s5b_out, s5c_out, s6_out]
    with open(concat_list, "w") as f:
        for seg in segments:
            f.write(f"file '{seg}'\n")

    final_v_out = os.path.join(BASE_DIR, "SkinMate_Launch_Reel.mp4")
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list,
        "-i", MASTER_AUDIO,
        "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
        "-shortest",
        final_v_out
    ]
    run_cmd(cmd_concat, "Concatenate and Master SkinMate_Launch_Reel.mp4 (Vertical 9:16)")
    subprocess.run(["cp", final_v_out, os.path.join(RENDERS_DIR, "SkinMate_Launch_Reel.mp4")])

def render_horizontal():
    """Renders the adapted 16:9 widescreen video: SkinMate_Launch_Reel_16x9.mp4 (1920x1080, 30fps)."""
    seg_dir = os.path.join(RENDERS_DIR, "horizontal_segments")
    os.makedirs(seg_dir, exist_ok=True)

    # 1. SCENE 1 Horizontal (5.0s)
    s1_out = os.path.join(seg_dir, "h_seg1.mp4")
    filter_s1 = (
        "[0:v]trim=start=0:end=5,setpts=PTS-STARTPTS,"
        "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.8:d=0.6[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s1 = [
        "ffmpeg", "-y",
        "-i", os.path.join(STOCK_DIR, "skin_12843.mp4"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s1_all.png"),
        "-filter_complex", filter_s1,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "5.0",
        s1_out
    ]
    run_cmd(cmd_s1, "Render Horizontal Scene 1")

    # 2. SCENE 2 Horizontal (3.2s, 3.3s, 3.3s)
    s2a_out = os.path.join(seg_dir, "h_seg2a.mp4")
    filter_s2a = (
        "[0:v]trim=start=0:end=3.2,setpts=PTS-STARTPTS,"
        "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3,fade=t=out:st=2.8:d=0.4[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s2a = [
        "ffmpeg", "-y",
        "-i", os.path.join(STOCK_DIR, "jars_39909.mp4"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s2_endless.png"),
        "-filter_complex", filter_s2a,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.2",
        s2a_out
    ]
    run_cmd(cmd_s2a, "Render Horizontal Scene 2A")

    s2b_out = os.path.join(seg_dir, "h_seg2b.mp4")
    filter_s2b = (
        "[0:v]trim=start=0.5:end=3.8,setpts=PTS-STARTPTS,"
        "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3,fade=t=out:st=2.9:d=0.4[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s2b = [
        "ffmpeg", "-y",
        "-i", os.path.join(STOCK_DIR, "product_50417.mp4"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s2_conflicting.png"),
        "-filter_complex", filter_s2b,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.3",
        s2b_out
    ]
    run_cmd(cmd_s2b, "Render Horizontal Scene 2B")

    s2c_out = os.path.join(seg_dir, "h_seg2c.mp4")
    filter_s2c = (
        "[0:v]trim=start=0:end=3.3,setpts=PTS-STARTPTS,"
        "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3,fade=t=out:st=2.9:d=0.4[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s2c = [
        "ffmpeg", "-y",
        "-i", os.path.join(STOCK_DIR, "skin_51172.mp4"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s2_guesswork.png"),
        "-filter_complex", filter_s2c,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.3",
        s2c_out
    ]
    run_cmd(cmd_s2c, "Render Horizontal Scene 2C")

    # 3. SCENE 3 Horizontal (7.2s)
    s3_out = os.path.join(seg_dir, "h_seg3.mp4")
    filter_s3 = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.0004,1.05)':d=216:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.5:d=0.5[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s3 = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "h_frame_s3_hero.png"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s3_meet.png"),
        "-filter_complex", filter_s3,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "7.2",
        s3_out
    ]
    run_cmd(cmd_s3, "Render Horizontal Scene 3")

    # 4. SCENE 4 Horizontal (7.5s: 4A 3.5s, 4B 4.0s)
    s4a_out = os.path.join(seg_dir, "h_seg4a.mp4")
    filter_s4a = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.0004,1.04)':d=105:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s4a = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "h_frame_s4_analysis.png"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s4_understand.png"),
        "-filter_complex", filter_s4a,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "3.5",
        s4a_out
    ]
    run_cmd(cmd_s4a, "Render Horizontal Scene 4A")

    s4b_out = os.path.join(seg_dir, "h_seg4b.mp4")
    filter_s4b = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.0004,1.04)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s4b = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "h_frame_s4_analysis.png"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s4_discover.png"),
        "-filter_complex", filter_s4b,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "4.0",
        s4b_out
    ]
    run_cmd(cmd_s4b, "Render Horizontal Scene 4B")

    # 5. SCENE 5 Horizontal (12.0s: 5A 4.0s, 5B 4.0s, 5C 4.0s)
    s5a_out = os.path.join(seg_dir, "h_seg5a.mp4")
    filter_s5a = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.0004,1.04)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s5a = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "h_frame_s5_routine.png"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s5_build.png"),
        "-filter_complex", filter_s5a,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "4.0",
        s5a_out
    ]
    run_cmd(cmd_s5a, "Render Horizontal Scene 5A")

    s5b_out = os.path.join(seg_dir, "h_seg5b.mp4")
    filter_s5b = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.0004,1.04)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s5b = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "h_frame_s5_modal.png"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s5_compat.png"),
        "-filter_complex", filter_s5b,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "4.0",
        s5b_out
    ]
    run_cmd(cmd_s5b, "Render Horizontal Scene 5B")

    s5c_out = os.path.join(seg_dir, "h_seg5c.mp4")
    filter_s5c = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.0004,1.04)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[bg];"
        "[1:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0:d=0.3[ov];"
        "[bg][ov]overlay=0:0[out]"
    )
    cmd_s5c = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(FRAMED_DIR, "h_frame_s5_routine.png"),
        "-i", os.path.join(GRAPHICS_DIR, "h_s5_budget.png"),
        "-filter_complex", filter_s5c,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "4.0",
        s5c_out
    ]
    run_cmd(cmd_s5c, "Render Horizontal Scene 5C")

    # 6. SCENE 6 Horizontal (8.1s)
    s6_out = os.path.join(seg_dir, "h_seg6.mp4")
    filter_s6 = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
        "zoompan=z='min(zoom+0.00025,1.03)':d=243:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[out]"
    )
    cmd_s6 = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(GRAPHICS_DIR, "h_s6_brand_card.png"),
        "-filter_complex", filter_s6,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "8.1",
        s6_out
    ]
    run_cmd(cmd_s6, "Render Horizontal Scene 6")

    # 7. CONCATENATE HORIZONTAL SEGMENTS WITH MASTER SOUNDTRACK
    concat_list = os.path.join(seg_dir, "concat_list_h.txt")
    segments = [s1_out, s2a_out, s2b_out, s2c_out, s3_out, s4a_out, s4b_out, s5a_out, s5b_out, s5c_out, s6_out]
    with open(concat_list, "w") as f:
        for seg in segments:
            f.write(f"file '{seg}'\n")

    final_h_out = os.path.join(BASE_DIR, "SkinMate_Launch_Reel_16x9.mp4")
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list,
        "-i", MASTER_AUDIO,
        "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
        "-shortest",
        final_h_out
    ]
    run_cmd(cmd_concat, "Concatenate and Master SkinMate_Launch_Reel_16x9.mp4 (Horizontal 16:9)")
    subprocess.run(["cp", final_h_out, os.path.join(RENDERS_DIR, "SkinMate_Launch_Reel_16x9.mp4")])

if __name__ == "__main__":
    print("Executing final master render pipeline...")
    render_vertical()
    render_horizontal()
    print("Master render pipeline completed successfully!")
