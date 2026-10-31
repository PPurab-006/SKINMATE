# YouCam API Integration Reference Map

This document establishes the official integration specification for Perfect Corp's YouCam AI Server-to-Server (S2S v2.0) suite in SkinMate.

---

## 1. Authentication & Global Conventions

- **Base URL**: `https://yce-api-01.makeupar.com`
- **Authentication Scheme**: HTTP Bearer Token (`Authorization: Bearer <YOUCAM_API_KEY>`)
- **Credentials Policy**: Server-side only via Python FastAPI backend. Never exposed to browser clients.
- **Workflow Pattern**:
  1. **Upload Asset**: Request pre-signed URL via `POST /s2s/v2.0/file`, then upload image binary, obtaining a `file_id` (or supply public CDN `src_file_url`).
  2. **Create Task**: Asynchronous `POST /s2s/v2.0/task/{service_slug}` with `file_id` and options, receiving a unique `task_id`.
  3. **Poll Task**: Periodic `GET /s2s/v2.0/task/{service_slug}/{task_id}` until status is `success` or `failed`.
- **Account Status**: 1,000 bonus units allocated. Unit consumption protection and idempotency checks are mandatory.

---

## 2. Capability Integration Matrix

| # | Capability Name | Category | Official S2S Endpoint | Image Requirements | Workflow & Format | Documented Unit Cost | Implementation Status |
|---|----------------|----------|----------------------|-------------------|-------------------|----------------------|-----------------------|
| 1 | **AI Skin Analysis** | Skin | `POST /s2s/v2.0/task/skin-analysis`<br>`GET /s2s/v2.0/task/skin-analysis/{task_id}` | Frontal selfie, even light, neutral expression, no glasses/heavy makeup. Min 512x512, max 4096x4096px, JPG/PNG < 10MB. | Multi-concern analysis (spots, wrinkles, texture, dark circles, redness, oiliness, pores, moisture, acne). Returns severity scores (0-100) & localized heatmap overlays. | 1 unit / call | **Implemented (Live & Mock)** |
| 2 | **Fitzpatrick Skin Type Analysis** | Skin | `POST /s2s/v2.0/task/fitzpatrick-scale-analyzer`<br>`GET /s2s/v2.0/task/fitzpatrick-scale-analyzer/{task_id}` | Clear frontal portrait, natural ambient lighting without harsh tinted filters. | Evaluates melanin pigmentation to classify phototypes I through VI based on UV sensitivity. | 1 unit / call | **Implemented (Live & Mock)** |
| 3 | **Facial Color Tones Analyzer** | Skin | `POST /s2s/v2.0/task/facial-color-tones`<br>`GET /s2s/v2.0/task/facial-color-tones/{task_id}` | Clear frontal face, exposed forehead and jawline. | Analyzes skin undertones (Warm, Cool, Neutral, Olive), dominant RGB/HEX, and seasonal color palette. | 1 unit / call | **Implemented (Live & Mock)** |
| 4 | **Face Attributes & Ratio Analyzer** | Skin / Face | `POST /s2s/v2.0/task/face-attr-analysis`<br>`GET /s2s/v2.0/task/face-attr-analysis/{task_id}` | Frontal portrait, neutral gaze, hair tucked behind ears. | Geometric landmark analysis returning face shape (Oval, Round, Heart, Square, Oblong), symmetry, eye distance, golden ratio. | 1 unit / call | **Implemented (Live & Mock)** |
| 5 | **AI Skin Simulation** | Skin | `POST /s2s/v2.0/task/skin-simulation`<br>`GET /s2s/v2.0/task/skin-simulation/{task_id}` | Frontal selfie matching AI Skin Analysis input. | Simulates skin improvement/progression over 4-12 weeks for selected concerns (e.g. reduced spots or smoothed texture). Returns simulated image URL. | 2 units / call | **Implemented (Live & Mock)** |
| 6 | **Face Lift** | Appearance | `POST /s2s/v2.0/task/face-lift`<br>`GET /s2s/v2.0/task/face-lift/{task_id}` | Frontal portrait, high resolution. | AI cheek and jawline firming simulation with intensity level (0-100). | 1 unit / call | **Implemented (Live & Mock)** |
| 7 | **Face Reshape** | Appearance | `POST /s2s/v2.0/task/face-reshape`<br>`GET /s2s/v2.0/task/face-reshape/{task_id}` | Frontal portrait, high resolution. | Micro-adjustments for jawline, chin length, cheekbone contour, nose width. | 1 unit / call | **Implemented (Live & Mock)** |
| 8 | **Body Reshape** | Appearance | `POST /s2s/v2.0/task/body-reshape`<br>`GET /s2s/v2.0/task/body-reshape/{task_id}` | Full or 3/4 standing portrait, unobstructed body silhouette. | Body contour adjustments (waist, legs, silhouette slimming). | 2 units / call | **Implemented (Live & Mock)** |
| 9 | **Breast Augmentation Simulator** | Appearance | `POST /s2s/v2.0/task/breast-augmentation`<br>`GET /s2s/v2.0/task/breast-augmentation/{task_id}` | Frontal upper torso portrait. | Esthetic volumetric simulation with cup size parameters. | 2 units / call | **Implemented (Live & Mock)** |
| 10 | **AI Smile** | Appearance | `POST /s2s/v2.0/task/ai-smile`<br>`GET /s2s/v2.0/task/ai-smile/{task_id}` | Frontal face, mouth visible. | Realistic smiling expression generator with intensity levels. | 1 unit / call | **Implemented (Live & Mock)** |
| 11 | **AI Teeth Whitening** | Appearance | `POST /s2s/v2.0/task/teeth-whitening`<br>`GET /s2s/v2.0/task/teeth-whitening/{task_id}` | Frontal face showing open smile with visible teeth. | Natural teeth shade brightening (0-100% intensity). | 1 unit / call | **Implemented (Live & Mock)** |
| 12 | **AI Abs Filter** | Appearance | `POST /s2s/v2.0/task/ai-abs`<br>`GET /s2s/v2.0/task/ai-abs/{task_id}` | Exposed midsection/torso photograph. | Abdominal muscle definition enhancement filter. | 2 units / call | **Implemented (Live & Mock)** |
| 13 | **Makeup Virtual Try-On** | Beauty | `POST /s2s/v2.0/task/makeup-vto`<br>`GET /s2s/v2.0/task/makeup-vto/{task_id}` | Frontal selfie, neutral lighting, mouth closed. | Applies lipstick, eyeshadow, blush, foundation, and eyeliner with specific hex colors, textures (matte/dewy/gloss), and opacity. | 1 unit / call | **Implemented (Live & Mock)** |
| 14 | **Makeup Transfer** | Beauty | `POST /s2s/v2.0/task/makeup-transfer`<br>`GET /s2s/v2.0/task/makeup-transfer/{task_id}` | Target face selfie + reference makeup photograph. | Extracts cosmetics palette from reference image and transfers to target portrait. | 2 units / call | **Implemented (Live & Mock)** |
| 15 | **Look Virtual Try-On** | Beauty | `POST /s2s/v2.0/task/look-vto`<br>`GET /s2s/v2.0/task/look-vto/{task_id}` | Frontal portrait. | Complete thematic makeup look preset (e.g. Editorial Glow, Sunset Bronze, Parisian Chic). | 1 unit / call | **Implemented (Live & Mock)** |
| 16 | **Nail Virtual Try-On** | Beauty | `POST /s2s/v2.0/task/nail-vto`<br>`GET /s2s/v2.0/task/nail-vto/{task_id}` | Clear photo of hands/fingernails on neutral background. | Applies nail polish color, finish (matte, shimmer, chrome, gloss), and nail shape. | 1 unit / call | **Implemented (Live & Mock)** |
| 17 | **Nail Transfer** | Beauty | `POST /s2s/v2.0/task/ai-nail`<br>`GET /s2s/v2.0/task/ai-nail/{task_id}` | Photo of hands + reference nail art photograph. | Transfers intricate patterns, French tips, and 3D nail designs onto detected fingernails. | 2 units / call | **Implemented (Live & Mock)** |
| 18 | **Eye Color Lens Virtual Try-On** | Beauty | `POST /s2s/v2.0/task/eye-color`<br>`GET /s2s/v2.0/task/eye-color/{task_id}` | Close-up face or eye region, eyes open, no tinted sunglasses. | Contact lens color simulation (Hazel, Honey, Emerald, Sapphire, Gray) with iris pattern overlays. | 1 unit / call | **Implemented (Live & Mock)** |
| 19 | **Hair Style Virtual Try-On** | Hair | `POST /s2s/v2.0/task/hair-transfer`<br>`GET /s2s/v2.0/task/hair-transfer/{task_id}` | Frontal headshot with natural hair pulled slightly back or neutral. | Applies 3D volumetric hairstyle presets (Bob, Pixie, Waves, Curly Shag, Curtain Bangs). | 2 units / call | **Implemented (Live & Mock)** |
| 20 | **Hair Color Virtual Try-On** | Hair | `POST /s2s/v2.0/task/hair-color`<br>`GET /s2s/v2.0/task/hair-color/{task_id}` | Frontal headshot, visible hair strands. | Single-tone, ombré, balayage, or two-tone hair color simulation with metallic/shine parameters. | 1 unit / call | **Implemented (Live & Mock)** |
| 21 | **Hair Extension Virtual Try-On** | Hair | `POST /s2s/v2.0/task/hair-ext`<br>`GET /s2s/v2.0/task/hair-ext/{task_id}` | Upper body portrait with visible hair ends. | Simulates added hair length and volume (+10cm to +30cm extensions). | 2 units / call | **Implemented (Live & Mock)** |
| 22 | **Bangs Filter Virtual Try-On** | Hair | `POST /s2s/v2.0/task/hair-bangs`<br>`GET /s2s/v2.0/task/hair-bangs/{task_id}` | Frontal face with exposed or partially exposed forehead. | Simulates fringe variations (Wispy, Curtain, Blunt, Micro-bangs). | 1 unit / call | **Implemented (Live & Mock)** |
| 23 | **Hair Volume Virtual Try-On** | Hair | `POST /s2s/v2.0/task/hair-volume`<br>`GET /s2s/v2.0/task/hair-volume/{task_id}` | Headshot with visible hair crown. | Volumetric hair lift simulation at roots and sides. | 1 unit / call | **Implemented (Live & Mock)** |
| 24 | **Wavy Hair Virtual Try-On** | Hair | `POST /s2s/v2.0/task/wavy-hair`<br>`GET /s2s/v2.0/task/wavy-hair/{task_id}` | Headshot, straight or slightly wavy hair. | Transforms straight strands into beach waves or defined soft curls. | 1 unit / call | **Implemented (Live & Mock)** |
| 25 | **Beard Style Generator** | Beard | `POST /s2s/v2.0/task/beard-style`<br>`GET /s2s/v2.0/task/beard-style/{task_id}` | Frontal male/masculine portrait, chin and jawline visible. | Generates or shapes facial hair (Stubble, Full Beard, Goatee, Van Dyke, Moustache). | 1 unit / call | **Implemented (Live & Mock)** |
| 26 | **Hair Type Detection** | Hair | `POST /s2s/v2.0/task/hair-type-detection`<br>`GET /s2s/v2.0/task/hair-type-detection/{task_id}` | Frontal headshot (multi-angle profile optional for enhanced precision). | Detects curl pattern: Straight (Type 1), Wavy (Type 2A-2C), Curly (Type 3A-3C), Coily (Type 4A-4C). | 1 unit / call | **Implemented (Live & Mock)** |
| 27 | **Hair Length Detection** | Hair | `POST /s2s/v2.0/task/hair-length-detection`<br>`GET /s2s/v2.0/task/hair-length-detection/{task_id}` | Upper body portrait with visible hair ends against clothing. | Classifies hair length: Very Short / Buzz, Short / Bob, Medium / Shoulder, Long, Extra Long. | 1 unit / call | **Implemented (Live & Mock)** |
| 28 | **Hair Frizziness Detection** | Hair | `POST /s2s/v2.0/task/hair-frizziness`<br>`GET /s2s/v2.0/task/hair-frizziness/{task_id}` | High-resolution close-up of hair strands and crown. | Measures flyaways, surface roughness, and cuticle frizziness score (0-100). | 1 unit / call | **Implemented (Live & Mock)** |
| 29 | **Hair Density Detection** | Hair | `POST /s2s/v2.0/task/hair-density`<br>`GET /s2s/v2.0/task/hair-density/{task_id}` | Crown view or frontal hairline view. | Estimates follicular coverage: Low / Thinning, Medium, Dense. | 1 unit / call | **Implemented (Live & Mock)** |

---

## 3. Unit Consumption Protection Rules

1. **Strict Idempotency Guard**: Every image upload produces a SHA-256 content hash. Identical image + parameter combinations within a 24-hour window return cached task results rather than debiting units.
2. **Explicit User Confirmation**: No multi-endpoint batches run automatically on upload. Users select specific consultations (*Skin* vs *Hair* vs *Studio Effects*).
3. **Mock Fallback**: When `YOUCAM_API_KEY` is unset or `VITE_YOUCAM_MOCK_MODE=true`, the backend generates verified schema-compliant mock responses with realistic timing simulations, ensuring 0 units consumed during automated testing or evaluation.
4. **Local Quota Tracker**: Tracks remaining units locally (starting at 1,000 bonus units) and logs each external transaction with timestamp and payload size.
