# SkinMate — Official Hackathon Technical Demonstration Report

**Deliverable Artifact**: `SkinMate_Hackathon_Demo.mp4`  
**Duration**: 2 minutes 44 seconds (164.19s) | **Resolution**: 1920×1080 Full HD | **Framerate**: 30.0 FPS  
**Target Audience**: Hackathon Judges & Technical Evaluators  
**Submission Category**: AI-Powered Beauty & Personal Care Experience  

---

## 1. Executive Summary

This production report documents the official technical product demonstration video for **SkinMate**, submitted to the hackathon. Unlike a promotional marketing commercial, this demonstration is an authentic, end-to-end walkthrough of the live application running on local infrastructure (`http://127.0.0.1:5173`).

The video is designed to give hackathon judges immediate clarity on:
1. **What SkinMate does**: An open-architecture, guest-first personal-care configurator inspired by PCPartPicker that eliminates guesswork and prevents harmful ingredient clashes.
2. **How the application works end-to-end**: From raw portrait upload through optical computer vision analysis to targeted discovery and routine curation.
3. **How the YouCam API is integrated**: Direct integration with Perfect Corp's Server-to-Server (S2S) AI Skin Analysis API for biometric profiling and optical heatmap overlays.
4. **What the Routine Curator does**: The hero configurator that enables step-by-step assembly, real-time budget tracking, chemical conflict detection (Formula Harmony), and alternative formula swapping.
5. **What makes the application useful**: Real products with verified Open Beauty Facts data and direct Google search redirects, with zero registration gates or privacy tracking.

---

## 2. Demonstration Timeline Breakdown

| Timestamp | Scene | Segment Description | On-Screen Technical Elements | Narration Core Message |
| :--- | :--- | :--- | :--- | :--- |
| **0:00 – 0:23** | **Scene 1: Introduction** | SkinMate Homepage in Google Chrome | Brand hero, category filters, verified catalogue highlights (Minimalist, CeraVe, Olaplex) | Problem: skincare is overwhelming and contradictory. Solution: SkinMate unifies skin analysis, discovery, and routine building. |
| **0:23 – 0:43** | **Scene 2: Photo Upload & YouCam API** | My Skin & Hair portal and upload dropzone | Natural portrait drag-and-drop, sample selector, 4-stage optical analysis loader | Real upload workflow triggering Perfect Corp's YouCam AI Skin Analysis API. Technical pill annotation displayed. |
| **0:43 – 1:05** | **Scene 3: Biometric Analysis Results** | Diagnostic Results Screen | Biometric breakdown (Combination Skin, Phototype IV, Olive undertone), optical pore heatmap overlay | Results translated into consumer guidance rather than arbitrary score numbers. |
| **1:05 – 1:27** | **Scene 4: Product Discovery** | Targeted Recommendations & Marketplace | Verified product cards, clinical rationale pills, Open Beauty Facts verified tags, Find on Google button | Connects detected skin concerns directly with catalogue formulations and ingredient rationale. |
| **1:27 – 2:14** | **Scene 5: The Routine Curator (Hero)** | 5-Step Routine Configurator & Compatibility Engine | Ritual sequence, Target Budget bar (₹3,500), live cost recalculation (₹898 → ₹948), Formula Harmony indicator, alternative substitution modal | **Hero Feature**: Assembles recommendations into a practical daily regimen, checks chemical clash safety, and recalculates total cost in real time. |
| **2:14 – 2:29** | **Scene 6: Local Persistence (My Lists)** | Saved Routines & Regimen Retrieval | "Save Routine" action, persistent feedback toast, offline browser storage (IndexedDB/localStorage) | Guest-first architecture: routines and lists persist across browser sessions with zero user accounts or registration gates. |
| **2:29 – 2:45** | **Scene 7: Architecture Closing** | Editorial Architecture Summary Card | SkinMate monogram, 4 core technical pillars, hackathon submission credentials | "SkinMate combines YouCam-powered skin insights with product discovery and practical routine planning. Less guesswork, more informed skincare choices." |

---

## 3. Technical Integration: Perfect Corp YouCam AI Skin Analysis API

SkinMate implements a secure, modular Server-to-Server (S2S) integration with the YouCam AI Skin Analysis API:

```
[Browser Client]
       │
       ▼ (multipart/form-data: natural face portrait)
[SkinMate FastAPI Backend: /api/youcam/skin/analyze]
       │
       ▼ (HTTPS S2S HMAC / API Key Authorized Payload)
[Perfect Corp YouCam Cloud Engine: yce-api-01.makeupar.com/v1.0/skin/skin-analysis]
       │
       ▼ (JSON Biometric Scores + Optical Heatmap Overlays)
[SkinMate Biometric Normalizer & Clinical Classifier]
       │
       ▼ (Normalized Skin Profile: Sebum, Pores, Redness, Texture, Phototype)
[Biometric HUD & Routine Compatibility Engine]
```

### Supported Characteristics Specifically Demonstrated:
- **Surface Sebum & Oiliness**: Quantitative T-zone vs. cheek lipid profiling.
- **Pore Distribution Mapping**: Optical computer vision localization and density measurement.
- **Epidermal Texture Relief**: Fine line and roughness variance analysis.
- **Redness & Erythema Detection**: Capillary flare and inflammation sensitivity index.
- **Under-Eye Dark Circles**: Periorbital vascular and melanin contrast.
- **Fitzpatrick Phototyping**: Scientific skin phototype detection (accurately identified as **Type IV - Olive**).

### Technical Transparency & Compliance:
- A non-intrusive on-screen annotation pill is permanently displayed during analysis sections:
  `"Powered by Perfect Corp YouCam AI Skin Analysis API"`
- No claims are made regarding unused endpoints; only the actual `/skin/skin-analysis` service is referenced and demonstrated.
- Zero mock data substitution: all displayed analysis metrics originate from real computer vision processing.

---

## 4. The Hero Feature: Routine Curator

The largest segment of the demonstration (47.0 seconds, ~29% of runtime) is dedicated to the **Routine Curator**.

### Key Architectural Capabilities Demonstrated:
1. **PCPartPicker-Style Step Assembly**:
   - Organizes daily skincare into structured, numbered ritual steps: Cleanser, Essence/Toner, Target Active Serum, Barrier Moisturizer, and Broad-Spectrum SPF.
2. **Formula Harmony (Biochemical Conflict Detection)**:
   - Real-time safety validation preventing common harmful skincare mistakes (e.g., pairing direct Salicylic Acid with high-strength Retinoids or AHAs, preventing barrier damage).
   - In the video, the status indicator dynamically confirms **"Harmonious Pairing (1 pairing note)"**.
3. **Live Cost Calculation & Budget Tracking**:
   - The user sets a target budget limit (e.g. ₹3,500).
   - When substituting the gentle cleanser for a targeted foaming cleanser, the total ritual cost immediately recalculates on-screen from **₹898 to ₹948**, displaying the exact remaining budget (₹2,552).
4. **Interactive Formula Swapping**:
   - Users can tap "Replace" on any ritual slot to open a curated alternatives drawer showing product descriptions, active ingredients, and price deltas.

---

## 5. Technical Video Specifications & Encoding

The video was rendered using a multi-stage, high-fidelity FFmpeg pipeline:

```text
[Raw 1920x1080 Screen Captures] ──> [Pan/Zoom Motion Filter] ──┐
[Vector Badges & Annotations]    ──> [Alpha Overlay Filter]  ──┼──> [Segment Renderers]
                                                               │         │
[Segment Concat File] ─────────────────────────────────────────┘         ▼
                                                                  [Video Stream (H.264)]
[Master Audio: Dialogue + Ducked Ambient Music (-22 LUFS)] ─────> [Audio Stream (AAC)]
                                                                         │
                                                                         ▼
                                                          [SkinMate_Hackathon_Demo.mp4]
```

### Technical Metrics:
- **Container**: MP4 (ISO/IEC 14496-14)
- **Video Stream**:
  - Codec: H.264 / MPEG-4 AVC (High Profile, Level 4.2)
  - Dimensions: 1920 × 1080 (16:9 widescreen)
  - Framerate: 30.000 fps (constant framerate)
  - Color Space: YUV 4:2:0 progressive
  - Encoding Quality: CRF 17 (visually lossless master)
  - Video Bitrate: ~1,540 kbps
- **Audio Stream**:
  - Codec: AAC-LC
  - Sample Rate: 48,000 Hz
  - Channels: 2 (Stereo)
  - Bitrate: 256 kbps CBR
  - Peak Loudness: -1.1 dBFS
  - Integrated Loudness: -22.0 LUFS (EBU R128 broadcast standard)
- **Total Duration**: 164.188 seconds (2m 44.2s)
  - *Strict Hackathon Rule*: Must be between 1 and 3 minutes (Target: 2m 45s). Result is accurate to within 0.8 seconds of target.
- **Final File Size**: 36,987,440 bytes (~35.3 MB), optimal for smooth 1080p web playback and instant judge review.

---

## 6. Voiceover & Audio Design

- **Narration**: Professional, natural Indian English voice (`en-IN-NeerjaExpressiveNeural` via Microsoft Edge Neural Speech Engine), synthesized at -2% pacing for deliberate cadence.
- **Script Fidelity**: Exactly matched the approved hackathon creative brief.
- **Ambient Music**: *"Forest Treasure"* by Alejandro Magaña (Mixkit Commercial License, free for commercial video productions in perpetuity).
- **Audio Ducking**: The background music is ducked to -22 dB to -28 dB beneath dialogue, ensuring 100% voice clarity throughout.
- **Third-Party Rights**: Zero commercial copyrighted music or unlicensed sound effects used.

---

## 7. Quality Assurance Audit

| # | Inspection Item | Verification Method | Status | Notes |
| :---: | :--- | :--- | :---: | :--- |
| **1** | Total Duration (1–3 min) | `ffprobe -show_entries format=duration` | ✅ **PASS** | Exactly 164.188s (2m 44.2s), precisely within requirements. |
| **2** | Native 1080p Resolution | `ffprobe -show_entries stream=width,height` | ✅ **PASS** | Exactly 1920×1080 horizontal 16:9. |
| **3** | Real Application Footage | Visual frame inspection via contact sheet | ✅ **PASS** | 100% captured from live local app (`http://127.0.0.1:5173`). |
| **4** | YouCam API Integration | Visual & audio timeline verification | ✅ **PASS** | Explicitly explained in Scene 2 & 3 with on-screen attribution pill. |
| **5** | Routine Curator Centerpiece | Runtime & content breakdown | ✅ **PASS** | Dedicated 47.0 seconds showing live budget update, swap modal, and harmony. |
| **6** | No Fabricated UI / Mocks | Code & frame audit | ✅ **PASS** | Genuine catalogue products, real biometrics, real browser interaction. |
| **7** | No Copyright Infringements | `LICENSES.md` review | ✅ **PASS** | Royalty-free licensed music, SIL open fonts, zero unauthorized trademarks. |
| **8** | Audio Clarity & Pacing | Auditory QA & loudness meter | ✅ **PASS** | Crystal-clear narration, -22 LUFS broadcast standard, no clipping (-1.1 dB max). |
| **9** | Privacy & Security | Frame-by-frame visual audit | ✅ **PASS** | Zero API keys, secret tokens, or personal identifiers exposed on screen. |
| **10** | YouTube Thumbnail Ready | 1920×1080 image inspection | ✅ **PASS** | `SkinMate_Demo_Thumbnail.png` generated and verified. |

---

## 8. Final Deliverables Inventory

All primary deliverables are located in the project root:

1. **`SkinMate_Hackathon_Demo.mp4`**: The finished 1080p master video (164.2s, 35.3 MB).
2. **`SkinMate_Demo_Voiceover.wav`**: Standalone master vocal narration (48 kHz stereo PCM, 31.5 MB).
3. **`SkinMate_Demo_Thumbnail.png`**: High-resolution YouTube thumbnail (1920×1080, 257 KB).
4. **`demo_contact_sheet.png`**: Visual QA contact sheet with 14 keyframes (1968×1128, 643 KB).
5. **`SkinMate_Demo_Production_Report.md`**: This production report.
6. **`demo-production/`**: Self-contained production suite containing all automation scripts, raw screen recordings, audio assets, vector badges, and legal attributions.

> [!NOTE]  
> In accordance with the instructions, the video has **NOT** been uploaded to YouTube and is held locally for user review. Once reviewed, it can be published directly to YouTube or Vimeo.
