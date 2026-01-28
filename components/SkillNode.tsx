
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { SkillNodeData, CATEGORY_THEMES } from '../types';

// Helper per determinare l'icona corretta in base al nome del ramo
const getIconForSkill = (name: string): string => {
  const n = name.toLowerCase();
  // Settore Bianco
  if (n.includes("ascendant path")) return "TrendingUp";
  // Settore Rosso
  if (n.includes("vital branch")) return "HeartPulse";
  if (n.includes("weapon attack")) return "Swords";
  if (n.includes("weapon precision")) return "Target";
  if (n.includes("critical weapon")) return "Skull";
  // Settore Blu
  if (n.includes("magical branch")) return "Wand2";
  if (n.includes("abundant magic")) return "Sparkles";
  if (n.includes("sniper magic")) return "Crosshair";
  if (n.includes("strongest magic")) return "Flame";
  // Settore Giallo
  if (n.includes("skill branch")) return "Book";
  if (n.includes("flexibility skills")) return "Move";
  if (n.includes("advanced skills")) return "Award";
  if (n.includes("magnitudo skills")) return "Maximize";
  // Settore Verde
  if (n.includes("utility branch")) return "Wrench";
  if (n.includes("advantageous situations")) return "Compass";
  if (n.includes("action economy")) return "Timer";
  if (n.includes("into the future")) return "Eye";
  // Settore Arancione
  if (n.includes("extra branch")) return "PlusCircle";
  if (n.includes("evolution management")) return "Dna";
  if (n.includes("avarice")) return "Coins";
  if (n.includes("mortal limit")) return "Zap";
  
  return "Circle"; // Default
};

// Helper per determinare il livello di progressione
const getProgressionLevel = (name: string): number => {
  if (name.includes(" III") || name.includes(" IV")) return 3;
  if (name.includes(" II")) return 2;
  return 1; // Base o I
};

const SkillNode: React.FC<NodeProps<SkillNodeData>> = ({ data, selected }) => {
  const theme = CATEGORY_THEMES[data.category];
  const progression = getProgressionLevel(data.name);
  const iconName = getIconForSkill(data.name);
  
  // Resolve icon
  const IconComponent = (Icons as any)[iconName] || Icons.Circle;
  
  // Cost logic
  const cost = data.costAscension > 0 ? data.costAscension : data.costEvolution;
  const isPA = data.costAscension > 0;
  const isPE = data.costEvolution > 0;

  // Visual Progression Styles
  const getBorderStyle = () => {
    if (progression === 3) return `5px solid ${theme.primary}`;
    if (progression === 2) return `3px solid ${theme.primary}`;
    return `2px solid ${data.isActive ? theme.primary : (data.isUnlocked ? theme.primary + '88' : '#222')}`;
  };

  const getGlowStyle = () => {
    if (!data.isActive && !data.isUnlocked) return 'none';
    const intensity = progression === 3 ? '20px' : (progression === 2 ? '12px' : '6px');
    const opacity = progression === 3 ? '0.8' : '0.4';
    return `0 0 ${intensity} ${theme.glow.replace('0.4', opacity)}`;
  };

  const statusStyles = {
    border: getBorderStyle(),
    boxShadow: getGlowStyle(),
    background: data.isActive 
      ? `radial-gradient(circle, ${theme.secondary} 40%, #000 100%)`
      : data.isUnlocked ? '#111' : '#0a0a0c',
    opacity: data.isActive ? 1 : (data.isUnlocked ? 0.9 : 0.4),
    filter: !data.isActive && !data.isUnlocked ? 'grayscale(1)' : 'none'
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Circle Body */}
      <div 
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 
          ${selected ? 'scale-110 z-10' : ''} 
          ${progression === 3 && data.isActive ? 'animate-pulse' : ''}
        `}
        style={statusStyles}
      >
        {/* Invisible Handles */}
        <Handle type="target" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />

        {/* Dynamic Icon */}
        <IconComponent 
          size={progression === 3 ? 28 : 24} 
          strokeWidth={progression === 3 ? 3 : 2.5}
          style={{ color: data.isActive ? theme.primary : (data.isUnlocked ? theme.primary + 'AA' : '#333') }} 
        />

        {/* Cost Badge - Positioned top-right */}
        {(isPA || isPE) && !data.isActive && (
          <div 
            className={`absolute -top-2 -right-2 px-1.5 h-6 min-w-[1.5rem] rounded-full flex items-center justify-center text-[9px] font-bold border shadow-xl z-20 transition-transform ${selected ? 'scale-110' : ''}`}
            style={{ 
              backgroundColor: '#000000',
              borderColor: isPA ? '#ffffff' : 'transparent',
              color: isPA ? '#ffffff' : '#38bdf8' 
            }}
          >
            {cost}{isPA ? 'PA' : 'PE'}
          </div>
        )}
      </div>

      {/* Subtitle Label - Center & Responsive */}
      <div className="mt-2 text-center pointer-events-none select-none max-w-[120px]">
        <span 
          className={`font-cinzel uppercase block leading-tight transition-colors duration-300 ${
            data.name.length > 15 ? 'text-[8px]' : 'text-[10px]'
          }`}
          style={{ color: data.isActive ? theme.primary : '#9ca3af' }}
        >
          {data.name}
        </span>
      </div>
    </div>
  );
};

export default React.memo(SkillNode);
