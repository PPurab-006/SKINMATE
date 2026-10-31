import os
import subprocess
import json

VOICE = "en-IN-NeerjaExpressiveNeural"
RATE = "-2%"

SECTIONS = [
    {
        "id": "sec1_intro",
        "title": "Introduction",
        "text": "Hello, and welcome to SkinMate. Choosing skincare can be overwhelming. There are countless products, conflicting recommendations, and very little guidance on what actually suits your needs. SkinMate brings skin analysis, product discovery and personalised routine building into one experience.",
        "target_sec": 15.0
    },
    {
        "id": "sec2_upload",
        "title": "Photo Upload and YouCam Integration",
        "text": "We start by uploading a photograph. SkinMate integrates Perfect Corp's YouCam AI Skin Analysis API to analyse supported skin characteristics and return skin insights.",
        "target_sec": 20.0
    },
    {
        "id": "sec3_results",
        "title": "Analysis Results",
        "text": "These results are then presented through SkinMate's interface, helping users understand the findings rather than simply receiving a collection of numbers.",
        "target_sec": 25.0
    },
    {
        "id": "sec4_discovery",
        "title": "Product Discovery",
        "text": "Next, we move into product discovery. SkinMate connects relevant skin concerns with products from its catalogue, helping users explore options and understand why particular products may be relevant.",
        "target_sec": 25.0
    },
    {
        "id": "sec5_curator",
        "title": "Routine Curator",
        "text": "But the core of SkinMate is the Routine Curator. Here, users can assemble a skincare routine using available products. They can explore product alternatives, review compatibility information, and consider the overall cost of their routine. Instead of leaving users with a list of recommendations, SkinMate helps turn those recommendations into a practical routine.",
        "target_sec": 50.0
    },
    {
        "id": "sec6_lists",
        "title": "My Lists",
        "text": "Users can also save their selections and revisit their routines through My Lists.",
        "target_sec": 20.0
    },
    {
        "id": "sec7_closing",
        "title": "Closing",
        "text": "SkinMate combines YouCam-powered skin insights with product discovery and practical routine planning. Our goal is simple: less guesswork, more informed skincare choices. Thank you for watching.",
        "target_sec": 10.0
    }
]

out_dir = "demo-production/assets/voiceover"
os.makedirs(out_dir, exist_ok=True)

print("Synthesizing voiceover sections using edge-tts...")
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
    
    # Convert to standard 48kHz stereo WAV
    subprocess.run([
        "ffmpeg", "-y", "-i", mp3_path,
        "-ar", "48000", "-ac", "2",
        wav_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    # Measure duration
    ffprobe_cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        wav_path
    ]
    raw_dur = subprocess.check_output(ffprobe_cmd, text=True).strip()
    dur = float(raw_dur)
    durations[s["id"]] = dur
    print(f"  {s['id']} ({s['title']}): speech duration = {dur:.2f}s (allocated segment = {s['target_sec']}s)")

with open(os.path.join(out_dir, "speech_durations.json"), "w") as f:
    json.dump(durations, f, indent=2)

print("\nAll voiceover sections synthesized successfully.")
