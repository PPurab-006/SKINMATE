import os
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
PROD_DIR = os.path.join(BASE_DIR, "demo-production")
RAW_DIR = os.path.join(PROD_DIR, "assets/screen-recordings/raw_frames")
GRAPHICS_DIR = os.path.join(PROD_DIR, "graphics")
RENDERS_DIR = os.path.join(PROD_DIR, "renders")
SEG_DIR = os.path.join(RENDERS_DIR, "segments")
MASTER_AUDIO = os.path.join(RENDERS_DIR, "demo_master_audio.wav")

os.makedirs(SEG_DIR, exist_ok=True)

def run_cmd(cmd, desc=""):
    print(f"\n--- {desc} ---")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print("Command failed:")
        print(" ".join(cmd))
        print("Error output:\n", res.stderr[-1000:])
        raise RuntimeError(f"Step failed: {desc}")
    print(f"Success: {desc}")

def render_scene1():
    """Scene 1: Introduction & Homepage Overview (23.0s)"""
    out_file = os.path.join(SEG_DIR, "seg1_intro.mp4")
    # Sub-clips: s1_01 (6s), s1_02 (6s), s1_03 (6s), s1_04 (5s)
    # Using subtle editorial zoompan and overlay badge
    fc = (
        "[0:v]zoompan=z='min(zoom+0.0003,1.03)':d=180:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v0];"
        "[1:v]zoompan=z='min(zoom+0.0003,1.03)':d=180:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v1];"
        "[2:v]zoompan=z='min(zoom+0.0003,1.03)':d=180:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v2];"
        "[3:v]zoompan=z='min(zoom+0.0003,1.03)':d=150:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v3];"
        "[v0][v1][v2][v3]concat=n=4:v=1:a=0[base];"
        "[4:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.3:d=0.4[ov];"
        "[base][ov]overlay=0:0[out]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s1_01_home_hero.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s1_02_home_cards.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s1_03_home_trending.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s1_04_home_cta_hover.png"),
        "-i", os.path.join(GRAPHICS_DIR, "badge_sec1.png"),
        "-filter_complex", fc,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "23.0",
        out_file
    ]
    run_cmd(cmd, "Render Scene 1 (Introduction)")
    return out_file

def render_scene2():
    """Scene 2: Photo Upload and YouCam Integration (20.0s)"""
    out_file = os.path.join(SEG_DIR, "seg2_upload.mp4")
    # Sub-clips: dropzone (5s), portrait hover (5s), stage1 (2.5s), stage2 (2.5s), stage3 (2.5s), stage4 (2.5s)
    fc = (
        "[0:v]zoompan=z='min(zoom+0.0003,1.03)':d=150:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v0];"
        "[1:v]zoompan=z='min(zoom+0.0003,1.03)':d=150:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v1];"
        "[2:v]scale=1920:1080,fps=30,trim=duration=2.5[v2];"
        "[3:v]scale=1920:1080,fps=30,trim=duration=2.5[v3];"
        "[4:v]scale=1920:1080,fps=30,trim=duration=2.5[v4];"
        "[5:v]scale=1920:1080,fps=30,trim=duration=2.5[v5];"
        "[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[base];"
        "[6:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.2:d=0.3[b_ov];"
        "[7:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.5:d=0.4[ann_ov];"
        "[base][b_ov]overlay=0:0[base1];"
        "[base1][ann_ov]overlay=0:0[out]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s2_01_upload_dropzone.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s2_02_sample_portrait_hover.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s2_03_analyzing_stage1.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s2_04_analyzing_stage2.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s2_05_analyzing_stage3.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s2_06_analyzing_stage4.png"),
        "-i", os.path.join(GRAPHICS_DIR, "badge_sec2.png"),
        "-i", os.path.join(GRAPHICS_DIR, "overlay_youcam_annotation.png"),
        "-filter_complex", fc,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "20.0",
        out_file
    ]
    run_cmd(cmd, "Render Scene 2 (Upload & YouCam Integration)")
    return out_file

def render_scene3():
    """Scene 3: Analysis Results (22.0s)"""
    out_file = os.path.join(SEG_DIR, "seg3_results.mp4")
    # Sub-clips: s3_01 (7s), s3_02 (7s), s3_04 (8s)
    fc = (
        "[0:v]zoompan=z='min(zoom+0.0003,1.03)':d=210:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v0];"
        "[1:v]zoompan=z='min(zoom+0.0003,1.03)':d=210:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v1];"
        "[2:v]zoompan=z='min(zoom+0.0003,1.03)':d=240:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v2];"
        "[v0][v1][v2]concat=n=3:v=1:a=0[base];"
        "[3:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.2:d=0.3[b_ov];"
        "[4:v]loop=loop=-1:size=1:start=0,format=rgba[ann_ov];"
        "[base][b_ov]overlay=0:0[base1];"
        "[base1][ann_ov]overlay=0:0[out]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s3_01_biometric_overview.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s3_02_diagnostic_portrait_pore.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s3_04_consumer_guidance.png"),
        "-i", os.path.join(GRAPHICS_DIR, "badge_sec3.png"),
        "-i", os.path.join(GRAPHICS_DIR, "overlay_youcam_annotation.png"),
        "-filter_complex", fc,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "22.0",
        out_file
    ]
    run_cmd(cmd, "Render Scene 3 (Analysis Results)")
    return out_file

def render_scene4():
    """Scene 4: Product Discovery (22.0s)"""
    out_file = os.path.join(SEG_DIR, "seg4_discovery.mp4")
    # Sub-clips: s4_01 (7.0s = 210 frames), s4_02 (7.5s = 225 frames), s4_03 (7.5s = 225 frames)
    fc = (
        "[0:v]zoompan=z='min(zoom+0.0003,1.03)':d=210:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v0];"
        "[1:v]zoompan=z='min(zoom+0.0003,1.03)':d=225:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v1];"
        "[2:v]zoompan=z='min(zoom+0.0003,1.03)':d=225:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v2];"
        "[v0][v1][v2]concat=n=3:v=1:a=0[base];"
        "[3:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.2:d=0.3[ov];"
        "[base][ov]overlay=0:0[out]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s4_01_targeted_recommendations.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s4_02_cleanser_rationale.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s4_03_marketplace_catalogue.png"),
        "-i", os.path.join(GRAPHICS_DIR, "badge_sec4.png"),
        "-filter_complex", fc,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "22.0",
        out_file
    ]
    run_cmd(cmd, "Render Scene 4 (Product Discovery)")
    return out_file

def render_scene5():
    """Scene 5: Routine Curator Hero Section (47.0s)"""
    out_file = os.path.join(SEG_DIR, "seg5_curator.mp4")
    # Sub-clips: s5_01 (8s), s5_02 (8s), s5_03 (10s), s5_04 (8s), s5_05 (7s), s5_06 (6s)
    fc = (
        "[0:v]zoompan=z='min(zoom+0.0003,1.03)':d=240:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v0];"
        "[1:v]zoompan=z='min(zoom+0.0003,1.03)':d=240:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v1];"
        "[2:v]zoompan=z='min(zoom+0.0003,1.03)':d=300:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v2];"
        "[3:v]zoompan=z='min(zoom+0.0003,1.03)':d=240:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v3];"
        "[4:v]zoompan=z='min(zoom+0.0003,1.03)':d=210:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v4];"
        "[5:v]zoompan=z='min(zoom+0.0003,1.03)':d=180:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v5];"
        "[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[base];"
        "[6:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.2:d=0.3[ov];"
        "[base][ov]overlay=0:0[out]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s5_01_routine_overview.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s5_02_step_sequence.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s5_03_compatibility_modal.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s5_04_modal_select_hover.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s5_05_recalculated_budget_948.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s5_06_formula_harmony_detail.png"),
        "-i", os.path.join(GRAPHICS_DIR, "badge_sec5.png"),
        "-filter_complex", fc,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "47.0",
        out_file
    ]
    run_cmd(cmd, "Render Scene 5 (Routine Curator Hero)")
    return out_file

def render_scene6():
    """Scene 6: My Lists (15.0s)"""
    out_file = os.path.join(SEG_DIR, "seg6_lists.mp4")
    # Sub-clips: s6_01 (5s), s6_02 (5s), s6_03 (5s)
    fc = (
        "[0:v]zoompan=z='min(zoom+0.0003,1.03)':d=150:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v0];"
        "[1:v]zoompan=z='min(zoom+0.0003,1.03)':d=150:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v1];"
        "[2:v]zoompan=z='min(zoom+0.0003,1.03)':d=150:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[v2];"
        "[v0][v1][v2]concat=n=3:v=1:a=0[base];"
        "[3:v]loop=loop=-1:size=1:start=0,format=rgba,fade=t=in:st=0.2:d=0.3[ov];"
        "[base][ov]overlay=0:0[out]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s6_01_save_routine_toast.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s6_02_my_lists_overview.png"),
        "-loop", "1", "-i", os.path.join(RAW_DIR, "s6_03_my_lists_saved_items.png"),
        "-i", os.path.join(GRAPHICS_DIR, "badge_sec6.png"),
        "-filter_complex", fc,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "15.0",
        out_file
    ]
    run_cmd(cmd, "Render Scene 6 (My Lists)")
    return out_file

def render_scene7():
    """Scene 7: Closing & Architecture Summary (16.0s)"""
    out_file = os.path.join(SEG_DIR, "seg7_closing.mp4")
    fc = (
        "[0:v]zoompan=z='min(zoom+0.0002,1.025)':d=480:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30[out]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", os.path.join(GRAPHICS_DIR, "scene7_closing_card.png"),
        "-filter_complex", fc,
        "-map", "[out]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-t", "16.0",
        out_file
    ]
    run_cmd(cmd, "Render Scene 7 (Closing Card)")
    return out_file

def master_demo():
    print("==================================================")
    print("Executing Master Render Pipeline for Hackathon Demo")
    print("==================================================")
    
    s1 = render_scene1()
    s2 = render_scene2()
    s3 = render_scene3()
    s4 = render_scene4()
    s5 = render_scene5()
    s6 = render_scene6()
    s7 = render_scene7()

    concat_txt = os.path.join(SEG_DIR, "concat_demo.txt")
    segments = [s1, s2, s3, s4, s5, s6, s7]
    with open(concat_txt, "w") as f:
        for seg in segments:
            f.write(f"file '{seg}'\n")

    final_demo_root = os.path.join(BASE_DIR, "SkinMate_Hackathon_Demo.mp4")
    final_demo_renders = os.path.join(RENDERS_DIR, "SkinMate_Hackathon_Demo.mp4")

    print("\nConcatenating segments with master soundtrack...")
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_txt,
        "-i", MASTER_AUDIO,
        "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
        "-shortest",
        final_demo_root
    ]
    run_cmd(cmd_concat, "Concatenate Master Video: SkinMate_Hackathon_Demo.mp4")
    subprocess.run(["cp", final_demo_root, final_demo_renders], check=True)
    print(f"\nFinal Hackathon Demo Video successfully rendered to:\n  {final_demo_root}")

if __name__ == "__main__":
    master_demo()
