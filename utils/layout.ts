
import { SkillCategory, SkillNodeData } from '../types';

const CATEGORY_ORDER: SkillCategory[] = ['GENERAL', 'VITAL', 'MAGIC', 'SKILL', 'UTILITY', 'EXTRA'];
// Raggi per Tier aumentati per dare più respiro alle etichette (gap aumentato da 200 a 240)
const TIER_RADIUS = [150, 390, 630, 870, 1110]; 

export const calculateInitialPosition = (node: SkillNodeData, nodesInCategory: number, indexInCategory: number) => {
  const categoryIndex = CATEGORY_ORDER.indexOf(node.category);
  // Settori da 60 gradi (2*PI / 6)
  const baseAngle = (categoryIndex * (Math.PI * 2)) / 6;
  
  // Ridotto lo spread da PI/4 (45°) a PI/6 (30°) per garantire che le label
  // non intersechino i delimitatori radiali (che distano 30° dal centro del settore)
  const angleSpread = Math.PI / 6; 
  const angleVariance = nodesInCategory > 1 
    ? (indexInCategory / (nodesInCategory - 1) - 0.5) * angleSpread
    : 0;

  const angle = baseAngle + angleVariance;
  
  // Raggio base dal tier
  let radius = TIER_RADIUS[node.tier] !== undefined ? TIER_RADIUS[node.tier] : node.tier * 240;

  // Staggering leggero: se ci sono più nodi nello stesso tier/categoria, 
  // alterniamo leggermente il raggio per evitare che le label si tocchino lateralmente
  if (nodesInCategory > 1) {
    radius += (indexInCategory % 2 === 0 ? 15 : -15);
  }

  // Calcolo posizione polare -> cartesiana
  // Sottraiamo 32px (metà di w-16 = 64px) per centrare il nodo sulla coordinata
  const rawX = radius * Math.cos(angle - Math.PI / 2);
  const rawY = radius * Math.sin(angle - Math.PI / 2);

  return {
    x: rawX - 32,
    y: rawY - 32,
  };
};
