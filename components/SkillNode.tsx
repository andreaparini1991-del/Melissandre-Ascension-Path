
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { SkillNodeData, CATEGORY_THEMES } from '../types';

// Helper per determinare l'icona corretta in base al nome del ramo
const getIconForSkill = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("ascendant path")) return "TrendingUp";
  if (n.includes("vital branch")) return "HeartPulse";
  if (n.includes("weapon attack")) return "Swords";
  if (n.includes("weapon precision")) return "Target";
  if (n.includes("critical weapon")) return "Skull";
  if (n.includes("magical branch")) return "Wand2";
  if (n.includes("abundant magic")) return "Sparkles";
  if (n.includes("sniper magic")) return "Crosshair";
  if (n.includes("strongest magic")) return "Flame";
  if (n.includes("skill branch")) return "Book";
  if (n.includes("flexibility skills")) return "Move";
  if (n.includes("advanced skills")) return "Award";
  if (n.includes("magnitudo skills")) return "Maximize";
  if (n.includes("utility branch")) return "Wrench";
  if (n.includes("advantageous situations")) return "Compass";
  if (n.includes("action economy")) return "Timer";
  if (n.includes("into the future")) return "Eye";
  if (n.includes("extra branch")) return "PlusCircle";
  if (n.includes("evolution management")) return "Dna";
  if (n.includes("avarice")) return "Coins";
  if (n.includes("mortal limit")) return "Zap";
  return "Circle";
};

const splitLabel = (name: string): string[] => {
  const words = name.split(' ');
  if (words.length <= 1 || name.length < 12) return [name];
  const middle = Math.floor(name.length / 2);
  let bestSpaceIndex = -1;
  let minDiff = Infinity;
  let currentPos = 0;
  for (let i = 0; i < words.length - 1; i++) {
    currentPos += words[i].length;
    const diff = Math.abs(currentPos - middle);
    if (diff <= minDiff) {
      minDiff = diff;
      bestSpaceIndex = i;
    }
    currentPos += 1;
  }
  if (bestSpaceIndex === -1) return [name];
  return [words.slice(0, bestSpaceIndex + 1).join(' '), words.slice(bestSpaceIndex + 1).join(' ')];
};

const getProgressionLevel = (name: string): number => {
  if (name.includes(" III") || name.includes(" IV")) return 3;
  if (name.includes(" II")) return 2;
  return 1;
};

const SkillNode: React.FC<NodeProps<SkillNodeData>> = ({ data, selected }) => {
  const theme = CATEGORY_THEMES[data.category];
  const progression = getProgressionLevel(data.name);
  const iconName = getIconForSkill(data.name);
  const IconComponent = (Icons as any)[iconName] || Icons.Circle;
  
  const cost = data.costAscension > 0 ? data.costAscension : data.costEvolution;
  const isPA = data.costAscension > 0;
  const isPE = data.costEvolution > 0;

  const statusStyles = {
    border: progression === 3 ? `5px solid ${theme.primary}` : (progression === 2 ? `3px solid ${theme.primary}` : `2px solid ${data.isActive ? theme.primary : (data.isUnlocked ? theme.primary + '88' : '#222')}`),
    boxShadow: (!data.isActive && !data.isUnlocked) ? 'none' : `0 0 ${progression === 3 ? '20px' : (progression === 2 ? '12px' : '6px')} ${theme.glow.replace('0.4', progression === 3 ? '0.8' : '0.4')}`,
    background: data.isActive ? `radial-gradient(circle, ${theme.secondary} 40%, #000 100%)` : (data.isUnlocked ? '#111' : '#0a0a0c'),
    opacity: data.isActive ? 1 : (data.isUnlocked ? 0.9 : 0.4),
    filter: !data.isActive && !data.isUnlocked ? 'grayscale(1)' : 'none'
  };

  const labelLines = splitLabel(data.name);

  return (
    <div className="flex flex-col items-center" style={{ transform: 'translate(-50%, -50%)' }}>
      <div 
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 
          ${selected ? 'scale-110 z-10' : ''} 
          ${progression === 3 && data.isActive ? 'animate-pulse' : ''}
        `}
        style={statusStyles}
      >
        <Handle type="target" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />

        <IconComponent 
          size={progression === 3 ? 28 : 24} 
          strokeWidth={progression === 3 ? 3 : 2.5}
          style={{ color: data.isActive ? theme.primary : (data.isUnlocked ? theme.primary + 'AA' : '#333') }} 
        />

        {(isPA || isPE) && !data.isActive && (
          <div 
            className={`absolute -top-2 -right-2 px-1.5 h-6 min-w-[1.5rem] rounded-full flex items-center justify-center text-[10px] font-bold border shadow-xl z-20 transition-transform ${selected ? 'scale-110' : ''}`}
            style={{ backgroundColor: '#000000', borderColor: isPA ? '#ffffff' : 'transparent', color: isPA ? '#ffffff' : '#38bdf8' }}
          >
            {cost}{isPA ? 'PA' : 'PE'}
          </div>
        )}
      </div>

      <div className="mt-2 text-center pointer-events-none select-none w-[140px] flex flex-col items-center justify-start min-h-[2.4em]">
        {labelLines.map((line, idx) => (
          <span 
            key={idx}
            className="font-cinzel uppercase block leading-tight text-[12px] transition-colors duration-300 whitespace-nowrap"
            style={{ color: data.isActive ? theme.primary : '#9ca3af' }}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SkillNode);
