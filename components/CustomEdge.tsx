
import React from 'react';
import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow';
import { CATEGORY_THEMES, SkillCategory } from '../types';

const CustomEdge: React.FC<EdgeProps & { data?: { category: SkillCategory; isActive: boolean } }> = ({
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
  const isActive = data?.isActive || false;

  const edgeStyle: React.CSSProperties = {
    ...style,
    stroke: isActive ? theme.primary : '#1a1a1e',
    strokeWidth: isActive ? 3 : 1.5,
    filter: isActive ? `drop-shadow(0 0 8px ${theme.primary}) drop-shadow(0 0 2px ${theme.primary})` : 'none',
    opacity: isActive ? 1 : 0.2,
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      {isActive && (
        <g>
          <circle r="4" fill={theme.primary} className="animate-pulse">
            <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
          </circle>
          <circle r="2" fill="#fff">
            <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
          </circle>
        </g>
      )}
    </>
  );
};

export default React.memo(CustomEdge);
