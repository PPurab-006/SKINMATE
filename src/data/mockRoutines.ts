import { Routine } from '../types/routine';
import { MOCK_PRODUCTS } from './mockProducts';

const getProd = (id: string) => MOCK_PRODUCTS.find(p => p.id === id) || null;

export const INITIAL_ROUTINES: Routine[] = [
  // 1. Morning Skincare Routine (AM)
  {
    id: 'routine-am-skin',
    kind: 'morning-skin',
    title: 'Daily Antioxidant & Barrier Shield (AM)',
    description: 'Cleanse, hydrate, modulate T-zone sebum, and seal with broad-spectrum UV defense.',
    targetBudget: 3500,
    lastModified: 'Today',
    slots: [
      {
        id: 'am-slot-1',
        stepNumber: 1,
        slotName: 'Gentle Cleanser',
        allowedCategories: ['cleanser'],
        isRequired: true,
        product: getProd('prod-cleanse-01'), // Minimalist Aquaporin
        applicationTip: 'Massage on damp skin for 45 seconds with lukewarm water.'
      },
      {
        id: 'am-slot-2',
        stepNumber: 2,
        slotName: 'Hydrating Essence / Toner',
        allowedCategories: ['toner'],
        isRequired: false,
        product: getProd('prod-toner-01'), // COSRX Snail 96 Mucin
        applicationTip: 'Pat onto damp skin until fully absorbed.'
      },
      {
        id: 'am-slot-3',
        stepNumber: 3,
        slotName: 'Target Active Serum',
        allowedCategories: ['serum'],
        isRequired: true,
        product: getProd('prod-serum-01'), // Minimalist 10% Niacinamide + Zinc
        applicationTip: 'Apply 2-3 drops concentrating on central T-zone pores.'
      },
      {
        id: 'am-slot-4',
        stepNumber: 4,
        slotName: 'Lightweight Barrier Moisturizer',
        allowedCategories: ['moisturizer'],
        isRequired: true,
        product: getProd('prod-moist-02'), // Minimalist B5 Gel Moisturizer
        applicationTip: 'Smooth over face and neck to buffer active ingredients.'
      },
      {
        id: 'am-slot-5',
        stepNumber: 5,
        slotName: 'Broad-Spectrum Sunscreen (SPF)',
        allowedCategories: ['sunscreen'],
        isRequired: true,
        product: getProd('prod-spf-01'), // Minimalist SPF 50 Multi-Vitamin
        applicationTip: 'Apply two finger lengths 15 minutes before UV exposure.'
      }
    ]
  },

  // 2. Evening Skincare Routine (PM)
  {
    id: 'routine-pm-skin',
    kind: 'evening-skin',
    title: 'Cellular Turnover & Lipid Barrier Repair (PM)',
    description: 'Deep cleansing, retinoid cell signaling, and ceramide lipid sealing.',
    targetBudget: 4000,
    lastModified: 'Today',
    slots: [
      {
        id: 'pm-slot-1',
        stepNumber: 1,
        slotName: 'Clarifying Cleanser',
        allowedCategories: ['cleanser'],
        isRequired: true,
        product: getProd('prod-cleanse-01'),
        applicationTip: 'Wash away urban pollution and excess daytime sebum.'
      },
      {
        id: 'pm-slot-2',
        stepNumber: 2,
        slotName: 'Hydration Buffer',
        allowedCategories: ['toner', 'serum'],
        isRequired: false,
        product: getProd('prod-toner-01'),
        applicationTip: 'Hydrate skin base before applying cell turnover actives.'
      },
      {
        id: 'pm-slot-3',
        stepNumber: 3,
        slotName: 'Night Renewal Treatment (Retinoid)',
        allowedCategories: ['serum', 'exfoliant'],
        isRequired: true,
        product: getProd('prod-serum-03'), // Minimalist Retinol 0.3% in Squalane
        applicationTip: 'Use pea-sized amount on dry skin. Start 3 nights per week.'
      },
      {
        id: 'pm-slot-4',
        stepNumber: 4,
        slotName: 'Physiological Ceramide Seal',
        allowedCategories: ['moisturizer'],
        isRequired: true,
        product: getProd('prod-moist-01'), // Dot & Key 5 Ceramides Cream
        applicationTip: 'Cushions retinoid activity with lipid bilayer replenishment.'
      }
    ]
  },

  // 3. Haircare Routine
  {
    id: 'routine-hair',
    kind: 'haircare',
    title: 'Bond Repair & Anti-Frizz Protocol',
    description: 'Disulfide maintenance and ambient humidity lipid sealing for 2B Wavy hair.',
    targetBudget: 3000,
    lastModified: 'Yesterday',
    slots: [
      {
        id: 'hair-slot-1',
        stepNumber: 1,
        slotName: 'Pre-Wash Bond Multiplier',
        allowedCategories: ['haircare'],
        isRequired: true,
        product: getProd('prod-hair-01'), // Minimalist Maleic Bond Repair
        applicationTip: 'Apply on damp hair 15 minutes before shampooing.'
      },
      {
        id: 'hair-slot-2',
        stepNumber: 2,
        slotName: 'Deep Cuticle Conditioning Mask',
        allowedCategories: ['haircare'],
        isRequired: true,
        product: getProd('prod-hair-02'), // Bare Anatomy Ultra Smoothing Mask
        applicationTip: 'Leave on mid-lengths to ends for 7 minutes then rinse thoroughly.'
      }
    ]
  },

  // 4. Grooming & Beard Routine
  {
    id: 'routine-grooming',
    kind: 'grooming',
    title: 'Facial Hair Conditioning & Skin Barrier',
    description: 'Keep bristles soft and eliminate under-beard skin flaking.',
    targetBudget: 2000,
    lastModified: 'Oct 28',
    slots: [
      {
        id: 'groom-slot-1',
        stepNumber: 1,
        slotName: 'Beard & Face Wash',
        allowedCategories: ['beardcare', 'cleanser'],
        isRequired: true,
        product: getProd('prod-beard-02'), // Beardo Godfather Wash
        applicationTip: 'Gentle lather to clear trapped sebum without stripping.'
      },
      {
        id: 'groom-slot-2',
        stepNumber: 2,
        slotName: 'Beard Growth & Conditioning Oil',
        allowedCategories: ['beardcare'],
        isRequired: true,
        product: getProd('prod-beard-01'), // Bombay Shaving Company Cedarwood Oil
        applicationTip: 'Warm 3-4 drops between palms and massage into roots and jawline.'
      }
    ]
  }
];
