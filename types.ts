export type SkillCategory = 'GENERAL' | 'VITAL' | 'MAGIC' | 'SKILL' | 'UTILITY' | 'EXTRA';
export type ViewMode = 'radial' | 'table';

export interface SkillNodeData {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  tier: number;
  costAscension: number;
  costEvolution: number;
  isActive: boolean;
  isUnlocked: boolean; // Can be learned based on parents
  iconName: string;
}

export interface PlayerStats {
  totalAscensionPoints: number;
  totalEvolutionPoints: number;
}

export interface CharacterData {
  name: string;
  pa: number;
  pe: number;
  build?: string;
}

export interface CategoryTheme {
  primary: string;
  secondary: string;
  glow: string;
}

export const CATEGORY_THEMES: Record<SkillCategory, CategoryTheme> = {
  GENERAL: { primary: '#ffffff', secondary: '#94a3b8', glow: 'rgba(255, 255, 255, 0.4)' },
  VITAL: { primary: '#ef4444', secondary: '#7f1d1d', glow: 'rgba(239, 68, 68, 0.4)' },
  MAGIC: { primary: '#3b82f6', secondary: '#1e3a8a', glow: 'rgba(59, 130, 246, 0.4)' },
  SKILL: { primary: '#eab308', secondary: '#713f12', glow: 'rgba(234, 179, 8, 0.4)' },
  UTILITY: { primary: '#22c55e', secondary: '#14532d', glow: 'rgba(34, 197, 94, 0.4)' },
  EXTRA: { primary: '#f97316', secondary: '#7c2d12', glow: 'rgba(249, 115, 22, 0.4)' },
};
