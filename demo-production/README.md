# SkinMate Official Hackathon Demo Production Suite

This directory contains the production pipeline, raw screen captures, neural voiceovers, motion graphics, audio mixdown, and FFmpeg encoding scripts used to produce **`SkinMate_Hackathon_Demo.mp4`** for the hackathon judges.

---

## 📁 Directory Structure

```text
demo-production/
├── README.md                           # This production suite guide
├── assets/
│   ├── audio/                          # Licensed ambient background music
│   │   └── forest-treasure-mixkit.mp3  # "Forest Treasure" by Alejandro Magaña (Mixkit Commercial License)
│   ├── branding/                       # Clean logos and high-res YouTube thumbnail
│   │   ├── SkinMate_Demo_Thumbnail.png # 1920×1080 official video thumbnail
│   │   └── skinmate_logo.png
│   ├── screen-recordings/
│   │   └── raw_frames/                 # 22 authentic unmanipulated 1920×1080 PNG captures
│   │       ├── s1_01_home_hero.png ... s1_04_home_cta_hover.png
│   │       ├── s2_01_upload_dropzone.png ... s2_06_analyzing_stage4.png
│   │       ├── s3_01_biometric_overview.png ... s3_04_consumer_guidance.png
│   │       ├── s4_01_targeted_recommendations.png ... s4_03_marketplace_catalogue.png
│   │       ├── s5_01_routine_overview.png ... s5_06_formula_harmony_detail.png
│   │       └── s6_01_save_routine_toast.png ... s6_03_my_lists_saved_items.png
│   └── voiceover/                      # Individual neural voiceover segments (WAV, 48kHz stereo)
│       ├── sec1_intro.wav              # Scene 1: Introduction (23.0s)
│       ├── sec2_upload.wav             # Scene 2: Upload & YouCam Integration (20.0s)
│       ├── sec3_results.wav            # Scene 3: Biometric Analysis Results (22.0s)
│       ├── sec4_discovery.wav          # Scene 4: Product Discovery (22.0s)
│       ├── sec5_curator.wav            # Scene 5: Routine Curator Hero Section (47.0s)
│       ├── sec6_lists.wav              # Scene 6: My Lists & Local Persistence (15.0s)
│       └── sec7_closing.wav            # Scene 7: Closing Architectural Vision (16.0s)
├── attribution/
│   └── LICENSES.md                     # Complete IP, API, audio, and font attributions
├── graphics/
│   ├── badge_sec1.png ... badge_sec6.png # Editorial chapter badges
│   ├── overlay_youcam_annotation.png   # "Powered by Perfect Corp YouCam AI Skin Analysis API"
│   └── scene7_closing_card.png         # 1920×1080 luxury closing architecture card
├── renders/
│   ├── segments/                       # Individual scene video segments (seg1 to seg7)
│   ├── demo_master_audio.wav           # 165.0s mastered dual-track dialogue + ducked music
│   └── SkinMate_Hackathon_Demo.mp4     # Copy of final master video render
└── scripts/
    ├── generate_demo_voiceover.py      # Edge Neural TTS synthesis (en-IN-NeerjaExpressiveNeural)
    ├── generate_demo_audio_mix.py      # FFmpeg broadcast master mixdown (-22 LUFS)
    ├── capture_demo_walkthrough.cjs    # Puppeteer high-res Chrome 1920x1080 automated walkthrough
    ├── generate_demo_graphics.py       # High-DPI Cairo/Pillow graphics, badges & closing card
    ├── generate_demo_thumbnail.py      # 1920×1080 YouTube thumbnail generator
    └── render_demo_video.py            # FFmpeg multi-stage video rendering & muxing pipeline
```

---

## 🛠️ Reproduction Instructions

### Prerequisites
- Node.js 18+ (with `puppeteer-core`)
- Python 3.10+ (with `Pillow`, `edge-tts`)
- FFmpeg 6.0+ (with `libx264`, `aac`, `zoompan`)
- Running SkinMate frontend (`http://127.0.0.1:5173`) and FastAPI backend (`http://127.0.0.1:8000`)

### 1. Synthesize Voiceover & Master Soundtrack
```bash
python3 demo-production/scripts/generate_demo_voiceover.py
python3 demo-production/scripts/generate_demo_audio_mix.py
```

### 2. Capture Application Walkthrough Frames
```bash
node demo-production/scripts/capture_demo_walkthrough.cjs
```

### 3. Generate High-DPI Badges & Thumbnail
```bash
python3 demo-production/scripts/generate_demo_graphics.py
python3 demo-production/scripts/generate_demo_thumbnail.py
```

### 4. Execute Master FFmpeg Video Render
```bash
python3 demo-production/scripts/render_demo_video.py
```

The master video will be output to `SkinMate_Hackathon_Demo.mp4` in the project root.
