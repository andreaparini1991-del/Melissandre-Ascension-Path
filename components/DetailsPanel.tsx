
import React from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { SkillNodeData, CATEGORY_THEMES } from '../types';

interface DetailsPanelProps {
  skill: SkillNodeData | null;
  onClose: () => void;
  onLearn: (id: string) => void;
  onForget: (id: string) => void;
  canAfford: boolean;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ skill, onClose, onLearn, onForget, canAfford }) => {
  if (!skill) return null;

  const theme = CATEGORY_THEMES[skill.category];
  const IconComponent = (Icons as any)[skill.iconName] || Icons.Circle;

  return (
    <>
      {/* Mobile Backdrop */}
      <div className="md:hidden fixed inset-0 bg-black/60 z-[60]" onClick={onClose} />
      
      <div className={`
        fixed z-[70] bg-[#111] border-[#333] shadow-2xl transition-all duration-300 ease-in-out
        md:top-20 md:right-6 md:w-80 md:h-[calc(100vh-120px)] md:rounded-2xl md:border
        bottom-0 left-0 right-0 w-full h-[60vh] rounded-t-3xl border-t
        flex flex-col
      `}>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-start">
              <div 
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0" 
                style={{ borderColor: theme.primary, backgroundColor: theme.secondary + '22' }}
              >
                 <IconComponent size={24} style={{ color: theme.primary }} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-cinzel tracking-widest opacity-60" style={{ color: theme.primary }}>
                  {skill.category} Tier {skill.tier}
                </span>
                <h2 className="text-xl font-cinzel font-bold text-white mt-1 leading-tight">{skill.name}</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#222] rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">
            {skill.description}
          </p>

          <div className="space-y-4">
            <h3 className="text-xs font-cinzel uppercase tracking-wider text-gray-500">Requirements</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
                <span className="block text-[10px] text-gray-500 uppercase">Ascension</span>
                <span className={`text-lg font-bold ${!canAfford && !skill.isActive ? 'text-red-400' : 'text-white'}`}>
                  {skill.costAscension}
                </span>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
                <span className="block text-[10px] text-gray-500 uppercase">Evolution</span>
                <span className={`text-lg font-bold ${!canAfford && !skill.isActive ? 'text-red-400' : 'text-blue-400'}`}>
                  {skill.costEvolution}
                </span>
              </div>
            </div>

            {!skill.isUnlocked && !skill.isActive && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-900/40 rounded-lg text-red-200 text-xs">
                <AlertCircle className="w-4 h-4" />
                Unlock previous skills first.
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-[#0c0c0e] rounded-b-2xl border-t border-[#222]">
          {skill.isActive ? (
            <button 
              onClick={() => onForget(skill.id)}
              className="w-full py-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/50 text-red-400 font-cinzel font-bold transition-all"
            >
              Forget Skill
            </button>
          ) : (
            <button 
              disabled={!skill.isUnlocked || !canAfford}
              onClick={() => onLearn(skill.id)}
              className={`
                w-full py-4 rounded-xl font-cinzel font-bold transition-all border
                ${skill.isUnlocked && canAfford 
                  ? 'bg-white text-black hover:bg-gray-200 border-white shadow-lg' 
                  : 'bg-gray-800 text-gray-500 border-transparent cursor-not-allowed'}
              `}
            >
              Learn Skill
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailsPanel;
