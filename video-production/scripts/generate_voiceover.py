import os
import subprocess
import json

VOICE = "en-IN-NeerjaExpressiveNeural"
RATE = "-3%"  # Slightly deliberate pacing for premium commercial feel

SECTIONS = [
    {
        "id": "scene1",
        "text": "Tired of not knowing what actually works for your skin?",
        "pause_after": 0.8
    },
    {
        "id": "scene2",
        "text": "Endless products. Conflicting advice. And a bathroom shelf full of things you're not even sure you need.",
        "pause_after": 0.9
    },
    {
        "id": "scene3",
        "text": "What if finding your skincare routine didn't have to be so complicated? Meet SkinMate.",
        "pause_after": 0.8
    },
    {
        "id": "scene4",
        "text": "Get AI-powered skin insights and discover products selected around your needs.",
        "pause_after": 0.8
    },
    {
        "id": "scene5",
        "text": "Build a personalised routine with our Routine Curator. Compare products, check compatibility, explore alternatives and keep your budget in mind.",
        "pause_after": 0.9
    },
    {
        "id": "scene6",
        "text": "Less guesswork. More confidence. Your skin, your routine, your SkinMate.",
        "pause_after": 2.0
    }
]

out_dir = "video-production/assets/voiceover"
os.makedirs(out_dir, exist_ok=True)

durations = {}

for s in SECTIONS:
    mp3_path = os.path.join(out_dir, f"{s['id']}.mp3")
    wav_path = os.path.join(out_dir, f"{s['id']}.wav")
    cmd = [
        "backend/venv/bin/edge-tts",
        "--voice", VOICE,
        "--rate", RATE,
        "--text", s["text"],
        "--write-media", mp3_path
    ]
    subprocess.run(cmd, check=True)
    
    # Convert to WAV 48kHz stereo for studio mixing
    subprocess.run([
        "ffmpeg", "-y", "-i", mp3_path,
        "-ac", "2", "-ar", "48000",
        wav_path
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Probe duration
    probe = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "json", wav_path
    ], capture_output=True, text=True, check=True)
    dur = float(json.loads(probe.stdout)["format"]["duration"])
    durations[s["id"]] = dur
    print(f"[{s['id']}] Duration: {dur:.2f}s | Text: {s['text'][:40]}...")

print("\n--- Generating master combined voiceover SkinMate_Voiceover.wav ---")
filter_complex = ""
inputs = []
curr_time = 0.0
timeline = []

for idx, s in enumerate(SECTIONS):
    wav_path = os.path.join(out_dir, f"{s['id']}.wav")
    inputs.extend(["-i", wav_path])
    timeline.append({
        "id": s["id"],
        "start": curr_time,
        "duration": durations[s["id"]],
        "end": curr_time + durations[s["id"]],
        "text": s["text"]
    })
    curr_time += durations[s["id"]] + s["pause_after"]

# Build concat/adelay filter or sequential mix
adelay_parts = []
for idx, item in enumerate(timeline):
    delay_ms = int(item["start"] * 1000)
    adelay_parts.append(f"[{idx}:a]adelay={delay_ms}|{delay_ms}[a{idx}]")

mix_inputs = "".join(f"[a{idx}]" for idx in range(len(timeline)))
filter_str = ";".join(adelay_parts) + f";{mix_inputs}amix=inputs={len(timeline)}:dropout_transition=0,volume=1.0[outa]"

master_wav = os.path.join(out_dir, "SkinMate_Voiceover.wav")
root_master_wav = "SkinMate_Voiceover.wav"

cmd = ["ffmpeg", "-y"] + inputs + [
    "-filter_complex", filter_str,
    "-map", "[outa]",
    "-c:a", "pcm_s16le",
    "-ar", "48000",
    master_wav
]
subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Copy to root deliverable
import shutil
shutil.copyfile(master_wav, root_master_wav)

probe = subprocess.run([
    "ffprobe", "-v", "error", "-show_entries", "format=duration",
    "-of", "json", master_wav
], capture_output=True, text=True, check=True)
total_dur = float(json.loads(probe.stdout)["format"]["duration"])
print(f"Master voiceover generated: {master_wav} ({total_dur:.2f}s)")

with open(os.path.join(out_dir, "timeline.json"), "w") as f:
    json.dump({
        "total_duration": total_dur,
        "voice": VOICE,
        "scenes": timeline
    }, f, indent=2)

print("Voiceover timeline saved to timeline.json")
