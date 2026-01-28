
import React from 'react';
import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow';
import { CATEGORY_THEMES, SkillCategory } from '../types';

interface CustomEdgeData {
  category: SkillCategory;
  sourceActive: boolean;
  targetActive: boolean;
  targetUnlocked: boolean;
}

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
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const theme = data ? CATEGORY_THEMES[data.category] : { primary: '#333', glow: 'transparent' };
  
  // Determinazione delle modalità
  // 1. Firm Glowing: Entrambi i nodi acquistati
  const isMastered = data?.sourceActive && data?.targetActive;
  // 2. Animated Glow: Sorgente attiva, target sbloccato ma non ancora attivo
  const isPotential = data?.sourceActive && data?.targetUnlocked && !data?.targetActive;
  // 3. Flat Radial Color: Altrimenti (percorsi bloccati)
  const isDormant = !isMastered && !isPotential;

  const edgeStyle: React.CSSProperties = {
    ...style,
    stroke: theme.primary,
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
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
      
      {/* Animazione "Energy Flow" solo per percorsi Potential */}
      {isPotential && (
        <g>
          <circle r="4" fill={theme.primary} className="animate-pulse">
            <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
          </circle>
          <circle r="2" fill="#fff">
            <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
          </circle>
        </g>
      )}

      {/* Luce statica terminale per i percorsi Mastered per rafforzare la connessione */}
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
