# SkinMate Launch Advertisement — Video Production Project

This directory contains the complete, reproducible production pipeline for the **SkinMate** launch commercial campaign.

---

## 1. Directory Structure

```text
video-production/
├── assets/
│   ├── branding/
│   │   └── SkinMate_Final_Thumbnail.png    # High-resolution social media launch thumbnail
│   ├── music/
│   │   ├── track_138.mp3                   # "Forest Treasure" by Alejandro Magaña (royalty-free)
│   │   └── music_trimmed.wav               # Normalized, volume-prepared musical stem
│   ├── screen-recordings/
│   │   ├── raw_homepage_desktop.png        # Authentic high-DPI capture of SkinMate homepage
│   │   ├── raw_analysis_desktop.png        # Authentic capture of diagnostic biometrics & recommendations
│   │   ├── raw_routine_desktop.png         # Authentic capture of Routine Curator with formula harmony
│   │   └── raw_routine_modal.png           # Authentic capture of compatible replacement modal
│   ├── stock/
│   │   ├── skin_12843.mp4                  # Woman examining skin in mirror (Scene 1)
│   │   ├── jars_39909.mp4                  # Skincare jars & vanity clutter (Scene 2A)
│   │   ├── product_50417.mp4               # Picking up serum bottle (Scene 2B)
│   │   └── skin_51172.mp4                  # Relatable bathroom hesitation (Scene 2C)
│   └── voiceover/
│       ├── SkinMate_Voiceover.wav          # 48kHz stereo master narration
│       └── timeline.json                   # Exact timecodes and scene cue points
├── attribution/
│   └── LICENSES.md                         # Full licensing & attribution documentation
├── graphics/
│   ├── fonts/
│   │   ├── PlayfairDisplay.ttf             # Luxury serif typography
│   │   └── PlusJakartaSans.ttf             # Clean contemporary geometric sans
│   ├── framed/
│   │   ├── v_frame_s3_hero.png             # Vertical framed homepage hero
│   │   ├── v_frame_s4_cards.png            # Vertical framed biometric assessment
│   │   ├── v_frame_s4_split.png            # Vertical framed diagnostic portrait + cleanser recommendation
│   │   ├── v_frame_s5_assembled.png        # Vertical framed Routine Curator (Morning AM)
│   │   ├── v_frame_s5_modal.png            # Vertical framed compatibility alternatives modal
│   │   ├── v_frame_s5_updated.png          # Vertical framed updated regimen with recalculated budget
│   │   ├── h_frame_s3_hero.png             # Horizontal framed homepage hero
│   │   ├── h_frame_s4_analysis.png         # Horizontal framed biometrics & recommendations
│   │   ├── h_frame_s5_routine.png          # Horizontal framed Routine Curator overview
│   │   └── h_frame_s5_modal.png            # Horizontal framed compatibility modal
│   └── *.png                               # Translucent pill badges & luxury brand cards
├── renders/
│   ├── master_audio.wav                    # Ducked, volume-balanced master soundtrack
│   ├── contact_sheet.png                   # 4x3 visual QA contact sheet (Vertical 9:16)
│   ├── contact_sheet_16x9.png              # 4x3 visual QA contact sheet (Horizontal 16:9)
│   ├── SkinMate_Launch_Reel.mp4            # Final vertical advertisement (1080x1920)
│   └── SkinMate_Launch_Reel_16x9.mp4       # Final horizontal advertisement (1920x1080)
├── scripts/
│   ├── capture_real_app.cjs                # Puppeteer script capturing live app at 127.0.0.1:5173
│   ├── generate_voiceover.py               # Edge TTS voiceover synthesis script
│   ├── generate_audio_mix.py               # Dynamic sidechain ducking & mastering script
│   ├── prepare_cinematic_frames.py         # Image cropping & UI framing processor
│   ├── refine_overlays.py                  # PIL script generating typography & badges
│   ├── generate_thumbnail.py               # High-res social thumbnail generator
│   └── render_video.py                     # Master FFmpeg multi-stage rendering engine
└── README.md                               # This documentation file
```

---

## 2. Reproduction Steps

To re-render or modify the advertisement from source:

### Step 1: Ensure Prerequisites
- FFmpeg 8.x+ with `libx264`, `aac`, and filter complex support.
- Python 3.12+ with `Pillow` and `edge-tts`.
- Node.js with Puppeteer (if re-capturing live app screens).

### Step 2: Synthesize Voiceover & Master Audio
```bash
# Generate the professional female voiceover (en-IN-NeerjaExpressiveNeural)
python3 video-production/scripts/generate_voiceover.py

# Mix the music track with dynamic voice ducking (-18 dB under dialogue)
python3 video-production/scripts/generate_audio_mix.py
```

### Step 3: Capture Authentic Application Screens (Optional if reusing frames)
With SkinMate running locally on `http://127.0.0.1:5173`:
```bash
node video-production/scripts/capture_real_app.cjs
python3 video-production/scripts/prepare_cinematic_frames.py
```

### Step 4: Generate Graphic Badges & Thumbnail
```bash
python3 video-production/scripts/refine_overlays.py
python3 video-production/scripts/generate_thumbnail.py
```

### Step 5: Execute Master Video Render
```bash
python3 video-production/scripts/render_video.py
```
This renders both `SkinMate_Launch_Reel.mp4` (9:16 vertical) and `SkinMate_Launch_Reel_16x9.mp4` (16:9 horizontal) into the workspace root and the `renders/` directory.

### Step 6: Visual Quality Assurance
```bash
ffmpeg -y -i SkinMate_Launch_Reel.mp4 -vf "select='eq(n\,90)+eq(n\,195)+eq(n\,285)+eq(n\,390)+eq(n\,495)+eq(n\,600)+eq(n\,705)+eq(n\,810)+eq(n\,930)+eq(n\,1050)+eq(n\,1185)+eq(n\,1380)',scale=270:480,tile=4x3" -frames:v 1 contact_sheet.png
```

---

## 3. Technical Specifications

- **Vertical Reel:** 1080 × 1920 (9:16), 30.00 FPS, H.264 High Profile (CRF 17–18, ~3.8 Mbps), AAC Stereo 48 kHz (256 kbps), duration 49.58 seconds.
- **Horizontal Reel:** 1920 × 1080 (16:9), 30.00 FPS, H.264 High Profile (CRF 17, ~3.1 Mbps), AAC Stereo 48 kHz (256 kbps), duration 49.58 seconds.
