# SkinMate 2.0 — Premium Personal Beauty, Care & Shopping Destination

> **"Your beauty. Your way."**  
> Discover what works for you. Build routines, explore new looks and find products that fit your needs.

SkinMate 2.0 is a complete redesign of the platform from a diagnostic AI workstation into an editorial beauty, personal-care, and lifestyle shopping destination. Inspired by contemporary beauty publications and luxury DTC shopping experiences (such as Violet Grey, Aesop, and Glossier), SkinMate puts consumer beauty first while preserving powerful intelligence underneath.

---

## 1. Design Philosophy & Visual Identity

- **Consumer-First Aesthetic**: Replaces dark diagnostic telemetry and corporate AI dashboards with a warm, welcoming editorial layout.
- **Editorial Color Palette**:
  - **Warm Ivory** (`#F8F6F0`): Primary canvas foundation.
  - **Soft Cream** (`#EFECE3`): Secondary card backgrounds and drawers.
  - **Deep Forest** (`#243C32`): Elegant primary brand accents, dark contrast buttons, and active tabs.
  - **Muted Sage** (`#A6B39A`): Botanical brand accents and category highlights.
  - **Charcoal Typography** (`#252923`): High-legibility text contrast without stark black.
  - **Muted Grey** (`#85877F`): Subtle secondary copy and border definition.
  - **Restrained Lime Accent** (`#B4D836`): Used with disciplined restraint for subtle interactive highlights.
- **Typography**:
  - **Editorial Serif** (*Playfair Display*): Expressive headlines, editorial quotes, and product titles.
  - **Modern Clean Sans** (*Plus Jakarta Sans*): Crisp, comfortable body copy and navigation.
- **Authentic Imagery**: High-impact editorial portraiture and authentic product photography.

---

## 2. Platform Architecture & Navigation

SkinMate 2.0 provides an intuitive 5-pillar consumer navigation:

1. **Home (`/home`)**:
   - Hero: *"Your beauty. Your way."* with spacious lifestyle photography and primary call-to-actions.
   - Three editorial entry points: *Skin & Skincare*, *Hair & Haircare*, and *Beauty & Grooming*.
   - Personal vanity routine preview (AM/PM sequence with onboarding state when unconfigured).
   - Curated product discovery showcase with verified Indian retail pricing (INR ₹).
   - Editorial inspiration lookbook grid with instant try-on launchers.

2. **Discover (`/discover`)**:
   - Welcoming, approachable skin and hair consultations (no clinical intimidation).
   - 6-step guided experience: Introduction → Photo Capture/Upload → Lighting & Angle Quality Check → Gentle Analysis → Plain-English Findings → Tailored Routine Recommendations.
   - Interactive split before/after visualizer.
   - Clear distinction between live consultations and demonstration sample data.

3. **My Routine (`/routine`)**:
   - Assembles like a personal luxury vanity cabinet rather than a database table.
   - Four dedicated regimens: Morning Skincare (AM), Evening Skincare (PM), Haircare, Grooming & Beard.
   - Step sequence with high-resolution imagery, actives, and prices.
   - Interactive Target Budget slider and one-click smart cost optimization.
   - Formula Harmony & Pairing notes explaining complementary actives in plain English.
   - Full product substitution modal with live price deltas.

4. **Beauty Studio (`/studio`)**:
   - Visual-first experimentation space with 5 creative studios: Hairstyles, Hair Colors, Beard Grooming, Makeup Looks, and Nail Finishes.
   - Live split-screen slider comparison.
   - Portrait switcher to upload custom photos or capture live camera selfies.
   - Personal lookbook saving with custom titles.

5. **Shop (`/shop`)**:
   - High-end beauty e-commerce marketplace featuring vetted Indian (Minimalist, Dot & Key, The Derma Co, Nykaa, Bare Anatomy) and international brands (CeraVe, COSRX, Olaplex).
   - Multi-category pills, keyword search by brand/active botanical, and sorting.
   - Full INCI formulation drawer with pH and texture indicators.
   - Side-by-side formulation comparison modal (up to 3 items).

6. **Profile (`/profile`)**:
   - Discrete profile and preferences manager.
   - Zero hardcoded identities or fake biological ages.
   - Ethical formulation filters: Fragrance-Free only, Cruelty-Free certified, and custom budget tiers.
   - Ingredient sensitivities tracker (flags matching formulas across routines).
   - Local privacy assurance with full one-click data reset.

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Google Fonts (*Playfair Display* & *Plus Jakarta Sans*).
- **Tooling & Build**: Vite, PostCSS, Autoprefixer.
- **Backend Service**: Python 3 FastAPI S2S backend proxy (`backend/`) handling YouCam API requests, server-side authentication, image transfers, and recommendations.
- **Rules Engine**: Pairwise biochemical compatibility checking (`src/data/rules/ingredientRules.ts`) evaluating active interactions (e.g. Retinol + AHA/BHA, Vitamin C + Retinol) into human-friendly pairing guidance.
- **Data Persistence**: Privacy-centric `LocalStorage` caching for offline routines and saved looks.

---

## 4. Local Development

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ (for backend proxy)

### Frontend
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build production bundle
npm run build
```

### Backend Proxy (Optional for S2S Live API)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 5. Deployment on Render

SkinMate is production-ready for deployment on [Render](https://render.com) using either the included multi-stage `Dockerfile` or Render Blueprints (`render.yaml`).

### Option 1: 1-Click Render Blueprint (Recommended)
1. Fork or push this repository to GitHub.
2. In the Render Dashboard, click **New +** → **Blueprint**.
3. Connect your repository. Render will automatically read `render.yaml` and deploy SkinMate as a unified full-stack service with auto-deploy enabled.

### Option 2: Web Service (Docker)
1. In Render, select **New +** → **Web Service**.
2. Connect your repository.
3. Select **Docker** as the runtime.
4. Set Environment Variables:
   - `PORT`: `8000`
   - `YOUCAM_MOCK_MODE`: `true` (or set `false` with your live YouCam API keys)
   - `YOUCAM_BASE_URL`: `https://yce-api-01.makeupar.com`
5. Click **Create Web Service**.

---

## 6. Official Hackathon Demo Video & Assets

- **Official Demo Video**: [`SkinMate_Hackathon_Demo.mp4`](SkinMate_Hackathon_Demo.mp4) (1080p Full HD, 2m 44s, H.264 / AAC)
- **YouTube Thumbnail**: [`SkinMate_Demo_Thumbnail.png`](SkinMate_Demo_Thumbnail.png) (1920×1080)
- **Production & QA Report**: [`SkinMate_Demo_Production_Report.md`](SkinMate_Demo_Production_Report.md)
- **Visual Contact Sheet**: [`demo_contact_sheet.png`](demo_contact_sheet.png)
- **Voiceover Master**: [`SkinMate_Demo_Voiceover.wav`](SkinMate_Demo_Voiceover.wav) (48 kHz stereo PCM)

