import os
import subprocess

def create_demo_audio():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    prod_dir = os.path.join(base_dir, "demo-production")
    vo_dir = os.path.join(prod_dir, "assets/voiceover")
    renders_dir = os.path.join(prod_dir, "renders")
    os.makedirs(renders_dir, exist_ok=True)

    sec_files = [
        ("sec1_intro.wav", 500),
        ("sec2_upload.wav", 23500),
        ("sec3_results.wav", 43500),
        ("sec4_discovery.wav", 65500),
        ("sec5_curator.wav", 87500),
        ("sec6_lists.wav", 134500),
        ("sec7_closing.wav", 149500),
    ]

    # 1. GENERATE STANDALONE VOICEOVER (SkinMate_Demo_Voiceover.wav)
    print("Assembling standalone voiceover: SkinMate_Demo_Voiceover.wav (165.0s)...")
    inputs = []
    filter_parts = []
    mix_inputs = []

    for idx, (fname, delay_ms) in enumerate(sec_files):
        fpath = os.path.join(vo_dir, fname)
        inputs.extend(["-i", fpath])
        filter_parts.append(f"[{idx}:a]adelay={delay_ms}|{delay_ms},volume=1.0[a{idx}];")
        mix_inputs.append(f"[a{idx}]")

    filter_complex_vo = "".join(filter_parts) + "".join(mix_inputs) + f"amix=inputs={len(sec_files)}:normalize=0:dropout_transition=0,alimiter=limit=-1.5dB[out]"

    final_vo_root = os.path.join(base_dir, "SkinMate_Demo_Voiceover.wav")
    final_vo_prod = os.path.join(vo_dir, "SkinMate_Demo_Voiceover.wav")

    cmd_vo = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_complex_vo,
        "-map", "[out]",
        "-c:a", "pcm_s16le",
        "-ar", "48000",
        "-ac", "2",
        "-t", "165.0",
        final_vo_root
    ]
    subprocess.run(cmd_vo, check=True)
    subprocess.run(["cp", final_vo_root, final_vo_prod], check=True)
    print(f"Standalone voiceover saved: {final_vo_root}")

    # 2. GENERATE MASTER DEMO SOUNDTRACK (Voiceover + gentle ducked background ambience)
    print("Mixing master soundtrack with subtle background music...")
    raw_music = os.path.join(base_dir, "video-production/assets/music/track_138.mp3")
    master_audio_out = os.path.join(renders_dir, "demo_master_audio.wav")

    # Ducked music volume: ~0.10 (-20dB) under pauses, 0.04 (-28dB) during narration
    # Using sidechain / volume curve with smooth fades
    filter_complex_master = (
        "[0:a]volume=1.2,compand=attacks=0.05:decays=0.3:points=-80/-80|-40/-30|-20/-14|0/-1:gain=0[vo];"
        "[1:a]aloop=loop=-1:size=2e+09,atrim=0:165.0,asetpts=PTS-STARTPTS,"
        "volume='if(between(t,0,23),0.07,if(between(t,23,43),0.06,if(between(t,43,65),0.07,if(between(t,65,87),0.07,if(between(t,87,134),0.06,if(between(t,134,149),0.08,0.08))))))':eval=frame,"
        "afade=t=in:ss=0:d=2.0,afade=t=out:st=162.0:d=3.0[bgm];"
        "[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2,alimiter=limit=-1.0dB[out]"
    )

    cmd_master = [
        "ffmpeg", "-y",
        "-i", final_vo_root,
        "-i", raw_music,
        "-filter_complex", filter_complex_master,
        "-map", "[out]",
        "-c:a", "pcm_s16le",
        "-ar", "48000",
        "-ac", "2",
        "-t", "165.0",
        master_audio_out
    ]
    subprocess.run(cmd_master, check=True)
    print(f"Master soundtrack generated at: {master_audio_out}")

    # Inspect loudness
    cmd_stat = [
        "ffmpeg", "-i", master_audio_out,
        "-af", "volumedetect",
        "-vn", "-sn", "-dn",
        "-f", "null", "/dev/null"
    ]
    stat_res = subprocess.run(cmd_stat, stderr=subprocess.PIPE, text=True)
    for line in stat_res.stderr.splitlines():
        if "volume:" in line:
            print("  " + line.strip())

if __name__ == "__main__":
    create_demo_audio()
