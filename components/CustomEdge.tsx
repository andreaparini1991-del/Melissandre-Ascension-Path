
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
  // Tutte le linee ora sono rette come richiesto dall'utente.
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

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
