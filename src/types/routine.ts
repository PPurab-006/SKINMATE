import { Product } from './product';

export type RoutineKind = 'morning-skin' | 'evening-skin' | 'haircare' | 'grooming';

export interface RoutineSlot {
  id: string;
  stepNumber: number;
  slotName: string; // e.g. "Cleanser", "Hydrating Toner", "Active Treatment", "Moisturizer", "Sunscreen (SPF)"
  allowedCategories: Product['category'][];
  isRequired: boolean;
  product: Product | null;
  applicationTip?: string;
}

export type CompatibilityLevel = 'synergy' | 'safe' | 'caution' | 'conflict';

export interface CompatibilityReportItem {
  id: string;
  level: CompatibilityLevel;
  ruleTitle: string;
  description: string;
  involvedProductNames: string[];
  scientificReason: string;
  recommendation: string;
}

export interface CompatibilityAnalysis {
  overallStatus: 'balanced' | 'caution' | 'conflict';
  synergiesCount: number;
  cautionsCount: number;
  conflictsCount: number;
  reports: CompatibilityReportItem[];
}

export interface Routine {
  id: string;
  kind: RoutineKind;
  title: string;
  description: string;
  targetBudget: number; // in INR ₹
  slots: RoutineSlot[];
  lastModified: string;
}

export interface BudgetSummary {
  targetBudget: number;
  currentTotal: number;
  remainingBalance: number;
  percentageUsed: number;
  isOverBudget: boolean;
}
