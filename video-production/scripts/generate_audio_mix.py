import subprocess
import os
import json

def build_audio_mix():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    vo_path = os.path.join(base_dir, "assets/voiceover/SkinMate_Voiceover.wav")
    music_path = os.path.join(base_dir, "assets/music/track_138.mp3")
    out_dir = os.path.join(base_dir, "renders")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "master_audio.wav")

    # Target total duration: 49.6 seconds
    total_duration = 49.6

    # FFmpeg filter complex to duck music under voiceover and master together
    # Voiceover: boost gain by +5.5dB, apply gentle highpass and compressor
    # Music: trim to 49.6s, volume ducked at ~0.16 (-16dB), swell to 0.25 between 14.0-15.0s, fade in 0.5s, fade out last 2.0s
    filter_complex = (
        "[0:a]volume=5.5dB,compand=attacks=0.05:decays=0.3:points=-80/-80|-40/-30|-20/-14|0/-1:gain=0[vo];"
        "[1:a]atrim=0:49.6,asetpts=PTS-STARTPTS,"
        "volume='if(between(t,14.0,15.2),0.26,if(between(t,41.0,42.0),0.24,0.16))':eval=frame,"
        "afade=t=in:ss=0:d=0.8,afade=t=out:st=47.6:d=2.0[bgm];"
        "[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2,alimiter=limit=-0.5dB[out]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-i", vo_path,
        "-i", music_path,
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-c:a", "pcm_s16le",
        "-ar", "48000",
        "-ac", "2",
        "-t", str(total_duration),
        out_path
    ]

    print("Running audio mixing command...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print("FFmpeg error:", res.stderr)
        raise RuntimeError("Audio mixing failed")
    
    print(f"Master audio generated successfully at: {out_path}")
    
    # Check volume stats
    stats_cmd = [
        "ffmpeg", "-i", out_path,
        "-af", "volumedetect",
        "-vn", "-sn", "-dn",
        "-f", "null", "/dev/null"
    ]
    stat_res = subprocess.run(stats_cmd, stderr=subprocess.PIPE, text=True)
    for line in stat_res.stderr.splitlines():
        if "volume:" in line:
            print(line.strip())

if __name__ == "__main__":
    build_audio_mix()
