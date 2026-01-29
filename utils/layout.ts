
import { SkillCategory, SkillNodeData } from '../types';

const CATEGORY_ORDER: SkillCategory[] = ['GENERAL', 'VITAL', 'MAGIC', 'SKILL', 'UTILITY', 'EXTRA'];
// Raggi per Tier: Tier 0 posizionato a 160px dall'origine (0,0)
const TIER_RADIUS = [160, 450, 750, 1050, 1350]; 

export const calculateInitialPosition = (node: SkillNodeData, totalBranches: number, branchIndex: number) => {
  const categoryIndex = CATEGORY_ORDER.indexOf(node.category);
  // Ogni settore è di 60 gradi
  const baseAngle = (categoryIndex * (Math.PI * 2)) / 6;
  
  // Spread angolare all'interno del settore per evitare sovrapposizioni nei tier alti
  const angleSpread = Math.PI / 4.5; 
  
  const angleVariance = (node.tier === 0 || totalBranches <= 1)
    ? 0
    : (branchIndex / (totalBranches - 1) - 0.5) * angleSpread;

  const angle = baseAngle + angleVariance;
  const radius = TIER_RADIUS[node.tier] !== undefined ? TIER_RADIUS[node.tier] : node.tier * 300;

  // Conversione polare -> cartesiana orientata verso l'alto (sottraendo PI/2)
  const rawX = radius * Math.cos(angle - Math.PI / 2);
  const rawY = radius * Math.sin(angle - Math.PI / 2);

  // Per centrare un nodo di 64x64 pixel sulla coordinata polar (rawX, rawY),
  // dobbiamo impostare la sua posizione top-left a (rawX - 32, rawY - 32).
  // Questo elimina la necessità di CSS translate che rompe le hitbox di React Flow.
  return {
    x: rawX - 32,
    y: rawY - 32,
  };
};
