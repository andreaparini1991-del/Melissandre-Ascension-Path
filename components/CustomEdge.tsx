
import React from 'react';
import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow';
import { CATEGORY_THEMES, SkillCategory } from '../types';

interface CustomEdgeData {
  category: SkillCategory;
  sourceActive: boolean;
  targetActive: boolean;
  targetUnlocked: boolean;
  sourceTier?: number;
  targetTier?: number;
}

const CATEGORY_ORDER: SkillCategory[] = ['GENERAL', 'VITAL', 'MAGIC', 'SKILL', 'UTILITY', 'EXTRA'];

const CustomEdge: React.FC<EdgeProps & { data?: CustomEdgeData }> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data
}) => {
  const isTierJump = data?.sourceTier === 0 && data?.targetTier === 2;
  
  let edgePath = '';

  if (isTierJump && data) {
    // Calcoliamo l'angolo centrale del settore
    const categoryIndex = CATEGORY_ORDER.indexOf(data.category);
    const baseAngle = (categoryIndex * (Math.PI * 2)) / 6;
    
    // Spostiamo il punto di controllo verso l'esterno rispetto al Tier 1 (r=390)
    // Usiamo un raggio di 560 per assicurarci di superare l'ingombro dei nodi T1 e delle loro label
    const controlRadius = 560;
    
    // L'angolo di controllo viene impostato sul bordo del settore (30 gradi dal centro)
    // Sottraiamo PI/2 per compensare l'orientamento verticale del layout
    const controlAngle = baseAngle - (Math.PI / 6) - (Math.PI / 2); 
    
    const cx = controlRadius * Math.cos(controlAngle);
    const cy = controlRadius * Math.sin(controlAngle);
    
    edgePath = `M ${sourceX} ${sourceY} Q ${cx} ${cy} ${targetX} ${targetY}`;
  } else {
    const [path] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
    edgePath = path;
  }

  const theme = data ? CATEGORY_THEMES[data.category] : { primary: '#333', glow: 'transparent' };
  
  const isMastered = data?.sourceActive && data?.targetActive;
  const isPotential = data?.sourceActive && data?.targetUnlocked && !data?.targetActive;

  const edgeStyle: React.CSSProperties = {
    ...style,
    stroke: theme.primary,
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'none'
  };

  if (isMastered) {
    edgeStyle.strokeWidth = 3.5;
    edgeStyle.filter = `drop-shadow(0 0 10px ${theme.primary}) drop-shadow(0 0 3px ${theme.primary})`;
    edgeStyle.opacity = 1;
  } else if (isPotential) {
    edgeStyle.strokeWidth = 2;
    edgeStyle.filter = `drop-shadow(0 0 5px ${theme.primary})`;
    edgeStyle.opacity = 0.6;
  } else {
    edgeStyle.strokeWidth = 1.2;
    edgeStyle.filter = 'none';
    edgeStyle.opacity = 0.15;
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      
      {isPotential && (
        <g>
          <circle r="4" fill={theme.primary} className="animate-pulse">
            <animateMotion dur="2.8s" repeatCount="indefinite" path={edgePath} />
          </circle>
          <circle r="2" fill="#fff">
            <animateMotion dur="2.8s" repeatCount="indefinite" path={edgePath} />
          </circle>
        </g>
      )}

      {isMastered && (
        <g>
           <circle cx={targetX} cy={targetY} r="3" fill={theme.primary} style={{ filter: `blur(1px)` }} />
           <circle cx={sourceX} cy={sourceY} r="3" fill={theme.primary} style={{ filter: `blur(1px)` }} />
        </g>
      )}
    </>
  );
};

export default React.memo(CustomEdge);
