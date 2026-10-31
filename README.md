# SkinMate — AI Personal Beauty & Care Intelligence Platform

> **"Understand your appearance. Experiment with possibilities. Build your personal care routine."**

SkinMate is an ambitious consumer beauty-tech web platform combining AI visual diagnostics, virtual try-on studios, biochemical ingredient compatibility checking, and budget-optimized product routines into a single cohesive experience.

---

## 1. Visual & Editorial Identity

- **Palette**: Deep charcoal surfaces (`#0A0B0D`, `#111317`, `#16181E`) accented with electric editorial lime (`#D4F83C`).
- **Typography**: Editorial display headers set in *Syne* paired with high-precision UI body copy in *Plus Jakarta Sans*.
- **Tactile Details**: Subtle glassmorphism (`backdrop-blur-md`), hairline borders (`rgba(255, 255, 255, 0.08)`), responsive micro-animations, and interactive split comparison sliders.

---

## 2. Platform Architecture

```
skinmate/
├── backend/                       # Python FastAPI S2S backend proxy
│   ├── config.py                  # Environment settings & credentials
│   ├── main.py                    # App entrypoint & CORS middleware
│   ├── requirements.txt           # Python dependencies
│   └── routers/
│       ├── recommendations.py     # AI recommendation & structured schemas
│       └── youcam.py              # S2S YouCam API upload, task & polling proxies
├── src/
│   ├── components/
│   │   ├── common/                # Navbar, Footer, Badge, Modal, SplitSlider, CameraCapture, ImageDropzone
│   │   ├── dashboard/             # PersonalDashboard, metrics strips, saved looks carousel
│   │   ├── skin/                  # SkinLab, SkinConcernsVisualizer, heatmap overlay, before/after simulation
│   │   ├── hair/                  # HairLab, wave pattern detection, porosity & density
│   │   ├── style/                 # StyleStudio with 5 sub-studios (Hair, Beard, Makeup, Nails, Face)
│   │   ├── routine/               # PCPartPicker-style RoutineBuilder, ProductSubstitutionModal, conflicts drawer
│   │   ├── marketplace/           # Marketplace, ProductCard, ProductDetailModal, ProductCompareModal
│   │   └── profile/               # UserProfile, formulation sensitivities, privacy & biometric purge
│   ├── data/
│   │   ├── mockAnalysis.ts        # Realistic dermal & follicle diagnostic baselines
│   │   ├── mockPresets.ts         # Style presets for hair, beard, makeup, nails, face
│   │   ├── mockProducts.ts        # India-first & international catalog with INR (₹) pricing
│   │   ├── mockRoutines.ts        # Pre-configured morning, evening, hair, and beard regimens
│   │   └── rules/
│   │       └── ingredientRules.ts # PCPartPicker pairwise biochemical compatibility engine
│   ├── services/
│   │   ├── recommendationEngine.ts# Profile matching & budget optimization algorithms
│   │   ├── storage.ts             # Safe LocalStorage persistence
│   │   └── youcam/                # YouCam client, Live S2S service & neural mock adapters
│   ├── types/                     # Complete TypeScript interfaces
│   ├── App.tsx                    # Central application shell
│   ├── index.css                  # Tailored Tailwind directives & design system
│   └── main.tsx                   # React root entrypoint
├── .env.example                   # Environment credentials template
└── package.json
```

---

## 3. Key Modules & Capabilities

### A. Home / Personal Dashboard
- Personalized greeting and appearance profile snapshot (Skin Type: Combination, Fitzpatrick: IV, Undertone: Warm Olive, Hair: 2B Wavy).
- Diagnostic health scores (Skin Health Index: 84/100, Biological age: -2 years).
- Active care routines summary with live price breakdown in INR.
- Saved beauty looks gallery and quick launches to all intelligence modules.

### B. Skin Lab
- Dual input: Live WebRTC camera viewfinder with face oval alignment guidelines, or file upload with 1-click sample portraits.
- Image quality validation checklist (illumination, centering, resolution).
- AI diagnostic breakdown across 8 dermal dimensions: Pores, Spots/Hyperpigmentation, Wrinkles, Texture, Redness, Moisture, Oiliness, and Dark Circles.
- Interactive facial heatmap visualizer placing coordinate markers on the user's selfie.
- 4-week, 8-week, and 12-week predictive simulation with an interactive draggable before/after split slider.
- Fitzpatrick Phototype Scale (Type IV) and chromophore undertone analysis.

### C. Hair Lab
- Wave pattern classification (Type 2B Wavy).
- Cuticle porosity, length detection (~34 cm), and follicle density (194 hairs/cm²).
- Cuticle alignment and humidity frizz susceptibility metrics.
- Targeted active protocols (Disulfide bond repair, cold-pressed argan lipid seal).

### D. Style Studio
Experimentation workspace featuring 5 dedicated studios:
1. **Hair Studio**: Hairstyle VTO (French Bob, Curtain Bangs, Beach Waves, Pixie, Liquid Silk) & Balayage hair coloring.
2. **Beard Studio**: Designer stubble, short boxed beard, sculpted balbo, and natural full beard.
3. **Makeup Studio**: Complete look transfer (Editorial Sunlit Bronze, Parisienne Crimson, Golden Hour Glow, Tokyo Cyberpunk) with lipstick, blush, and eyeliner palettes.
4. **Nail Studio**: Almond, Square, and Oval shapes with Glazed Chrome, Velvet Bordeaux, and Nordic Sage finishes.
5. **Face Studio**: Golden ratio anatomical proportion mapping, AI enamel whitening, and smile harmonization.
- Features real-time split comparisons, intensity sliders, and "Save Look to Profile".

### E. My Care / Routine Builder (PCPartPicker for Personal Care)
- Configures 4 distinct regimens: Morning (AM) Skincare, Evening (PM) Skincare, Haircare, and Grooming/Beard.
- **Biochemical Conflict Engine**: Real-time evaluation of clinical active pairings:
  - *Conflict Alert*: Flags harmful combinations like Retinoids + AHA/BHA (barrier disruption risk).
  - *Caution Flag*: Low-pH Vitamin C + Niacinamide flushing alerts.
  - *Synergy Detected*: Gold-standard pairings like Hyaluronic Acid + Ceramides (lipid barrier hydration lock).
- **Live Budget Meter**: Dynamic INR total calculation, target budget limit slider, and progress bar.
- **Auto-Optimize Budget**: Intelligently swaps expensive items for clinically equivalent affordable alternatives to get under target budget with 1 click.
- **Product Substitution**: Clicking "Substitute" opens a side-by-side drawer displaying alternative formulas, active ingredient diffs, and exact price deltas (+₹200 / -₹450).

### F. Product Marketplace
- Vetted catalogue featuring real products and verifiable INR pricing from brands like Minimalist, Dot & Key, The Derma Co, CeraVe, COSRX, Olaplex, Bare Anatomy, Bombay Shaving Company, Beardo, Maybelline, and Nykaa Cosmetics.
- Deep category filtering, instant search across actives, and sorting (Match %, Price, Rating).
- **Product Detail Modal**: Full INCI ingredients formulation breakdown, pH values, textures, and direct retailer purchase links (Nykaa, Amazon India, Brand official).
- **Side-by-Side Comparison**: Compare up to 3 formulations simultaneously.

### G. My Profile & Privacy
- Personal appearance profile, formulation preferences (Fragrance-free, Cruelty-free), and budget tiers.
- Granular privacy controls: Local-only storage toggle, telemetry opt-out.
- One-click permanent biometric data deletion modal.

---

## 4. YouCam API Integration & Sandbox Safety

To ensure zero waste of developer quota during evaluation:
- The platform includes both a **Live Production S2S Adapter** (`https://yce-api-01.makeupar.com`) and a **High-Fidelity Neural Sandbox Mock Adapter**.
- The top navigation bar features a visible status indicator: `[Sandbox Mode - 1,000 Units]` vs `[YouCam Live API]`.
- Clicking the indicator opens the API Configuration modal, allowing users to enter a Bearer key or toggle Sandbox mode without touching source code.

---

## 5. Running the Application

### Frontend (Vite + React + TypeScript)
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build
```
Access the application at: `http://localhost:5173`

### Backend (Python FastAPI)
```bash
# 1. Setup virtual environment
python3 -m venv backend/venv
source backend/venv/bin/activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Run FastAPI server
uvicorn backend.main:app --port 8000 --reload
```
API Documentation available at: `http://localhost:8000/docs`
