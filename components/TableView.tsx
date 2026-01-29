
import React, { useMemo, useState } from 'react';
import { Node } from 'reactflow';
import { Sparkles, Zap, ShieldAlert, Lock, Play, LayoutGrid, ChevronDown, ChevronUp, Trash2, CheckCircle2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { SkillNodeData, CATEGORY_THEMES, SkillCategory } from '../types';
import { INITIAL_SKILLS } from '../constants';

interface TableViewProps {
  nodes: Node<SkillNodeData>[];
  onLearn: (id: string) => void;
  onForget: (id: string) => void;
  remainingPA: number;
  remainingPE: number;
}

type StatusFilter = 'known' | 'learnable';

const CATEGORIES: { label: string; value: SkillCategory; icon: string }[] = [
  { label: 'General', value: 'GENERAL', icon: 'ArrowUpCircle' },
  { label: 'Vital', value: 'VITAL', icon: 'Heart' },
  { label: 'Magic', value: 'MAGIC', icon: 'Wand2' },
  { label: 'Skill', value: 'SKILL', icon: 'GraduationCap' },
  { label: 'Utility', value: 'UTILITY', icon: 'RotateCw' },
  { label: 'Extra', value: 'EXTRA', icon: 'PlusSquare' },
];

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

const TableView: React.FC<TableViewProps> = ({ nodes, onLearn, onForget, remainingPA, remainingPE }) => {
  const [filterCategory, setFilterCategory] = useState<SkillCategory | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const orderMap = useMemo(() => {
    const map: Record<string, number> = {};
    INITIAL_SKILLS.forEach((skill, index) => {
      map[skill.id] = index;
    });
    return map;
  }, []);

  const filteredNodes = useMemo(() => {
    return nodes
      .map(n => n.data)
      .filter(skill => {
        // Category Filter
        if (filterCategory && skill.category !== filterCategory) return false;
        
        // Status Filter
        if (statusFilter === 'known') {
          if (!skill.isActive) return false;
        } else if (statusFilter === 'learnable') {
          const canAfford = remainingPA >= skill.costAscension && remainingPE >= skill.costEvolution;
          // Include if already active OR (unlocked AND affordable)
          const isAffordableAndUnlocked = skill.isUnlocked && canAfford;
          if (!skill.isActive && !isAffordableAndUnlocked) return false;
        }
        
        return true;
      })
      .sort((a, b) => (orderMap[a.id] ?? 0) - (orderMap[b.id] ?? 0));
  }, [nodes, filterCategory, statusFilter, orderMap, remainingPA, remainingPE]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div 
      className="w-full h-full bg-[#060608] flex flex-col pt-[72px] md:pt-28 overflow-y-auto custom-scrollbar"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col px-4 md:px-6 mb-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-4 md:mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-white tracking-tight">Compendium</h2>
          </div>
          
          {/* Filters Wrapper */}
          <div className="flex flex-col gap-3">
            {/* Main Filters: All, Category, Status */}
            <div className="flex flex-wrap gap-2 pointer-events-auto overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => { setFilterCategory(null); setStatusFilter(null); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[10px] md:text-xs font-bold uppercase tracking-wider shrink-0 ${
                  filterCategory === null && statusFilter === null
                    ? 'bg-white text-black border-white shadow-lg' 
                    : 'bg-[#111] border-[#333] text-gray-500 hover:text-gray-300 hover:border-[#444]'
                }`}
              >
                <LayoutGrid size={14} />
                <span>All</span>
              </button>

              {/* Status Specific Filters */}
              <button
                onClick={() => setStatusFilter(statusFilter === 'known' ? null : 'known')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[10px] md:text-xs font-bold uppercase tracking-wider shrink-0 ${
                  statusFilter === 'known'
                    ? 'bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                    : 'bg-[#111] border-[#333] text-gray-500 hover:text-green-400 hover:border-green-900/50'
                }`}
              >
                <CheckCircle2 size={14} />
                <span>Known</span>
              </button>

              <button
                onClick={() => setStatusFilter(statusFilter === 'learnable' ? null : 'learnable')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[10px] md:text-xs font-bold uppercase tracking-wider shrink-0 ${
                  statusFilter === 'learnable'
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]' 
                    : 'bg-[#111] border-[#333] text-gray-500 hover:text-amber-400 hover:border-amber-900/50'
                }`}
              >
                <Zap size={14} />
                <span>Learnable</span>
              </button>

              <div className="w-px h-8 bg-[#333] mx-1 hidden md:block" />

              {/* Category Filters */}
              {CATEGORIES.map((cat) => {
                const theme = CATEGORY_THEMES[cat.value];
                const IconComp = (Icons as any)[cat.icon] || Icons.Circle;
                const isActive = filterCategory === cat.value;

                return (
                  <button
                    key={cat.value}
                    onClick={() => setFilterCategory(isActive ? null : cat.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-[10px] md:text-xs font-bold uppercase tracking-wider group shrink-0`}
                    style={{
                      borderColor: isActive ? theme.primary : '#333',
                      backgroundColor: isActive ? theme.primary : '#111',
                      color: isActive ? '#000' : '#6b7280',
                      boxShadow: isActive ? `0 0 15px ${theme.glow}` : 'none'
                    }}
                  >
                    <IconComp size={14} style={{ color: isActive ? '#000' : theme.primary }} />
                    <span style={{ color: isActive ? '#000' : 'inherit' }}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="rounded-xl md:rounded-2xl border border-[#222] bg-[#0c0c0e]/50 backdrop-blur-sm shadow-2xl overflow-visible">
          <table className="w-full text-left border-collapse table-auto md:table-fixed">
            <thead className="md:sticky md:top-0 bg-[#111] z-20 shadow-sm border-b border-[#222]">
              <tr>
                <th className="px-3 md:px-6 py-4 text-[9px] md:text-[10px] font-cinzel font-bold text-gray-500 uppercase tracking-widest w-2/5 md:w-1/4">Skill</th>
                <th className="hidden md:table-cell px-2 md:px-6 py-4 text-[9px] md:text-[10px] font-cinzel font-bold text-gray-500 uppercase tracking-widest text-center w-12 md:w-20">Tier</th>
                <th className="px-2 md:px-6 py-4 text-[9px] md:text-[10px] font-cinzel font-bold text-gray-500 uppercase tracking-widest w-20 md:w-24">Cost</th>
                <th className="hidden md:table-cell px-6 py-4 text-[10px] font-cinzel font-bold text-gray-500 uppercase tracking-widest">Effect</th>
                <th className="px-3 md:px-6 py-4 text-[9px] md:text-[10px] font-cinzel font-bold text-gray-500 uppercase tracking-widest text-right w-24 md:w-32">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1c]">
              {filteredNodes.map((skill) => {
                const theme = CATEGORY_THEMES[skill.category];
                const iconName = getIconForSkill(skill.name);
                const IconComp = (Icons as any)[iconName] || Icons.Circle;
                const canAfford = remainingPA >= skill.costAscension && remainingPE >= skill.costEvolution;
                const isAvailable = skill.isUnlocked && !skill.isActive;
                const isExpanded = expandedId === skill.id;

                return (
                  <React.Fragment key={skill.id}>
                    <tr 
                      onClick={() => toggleExpand(skill.id)}
                      className={`group hover:bg-white/[0.02] transition-colors cursor-pointer ${isExpanded ? 'bg-white/[0.01]' : ''}`}
                    >
                      <td className="px-3 md:px-6 py-4 md:py-5">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div 
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border flex items-center justify-center transition-all shrink-0 ${skill.isActive ? 'shadow-lg shadow-white/10' : ''}`}
                            style={{ 
                              borderColor: skill.isActive ? theme.primary : (skill.isUnlocked ? theme.primary + '66' : '#222'),
                              backgroundColor: skill.isActive ? theme.primary + '22' : (skill.isUnlocked ? theme.primary + '08' : 'transparent'),
                              boxShadow: skill.isActive ? `0 0 10px ${theme.glow}` : 'none'
                            }}
                          >
                            <IconComp size={16} className="md:w-[18px] md:h-[18px]" style={{ color: skill.isActive || skill.isUnlocked ? theme.primary : '#333' }} />
                          </div>
                          <div className="flex flex-col">
                            <span 
                              className={`font-bold text-[11px] md:text-sm tracking-tight transition-all duration-300 leading-tight`}
                              style={{ 
                                color: skill.isActive ? '#FFFFFF' : (skill.isUnlocked ? theme.primary : '#4b5563'),
                                textShadow: skill.isActive ? `0 0 8px ${theme.glow}` : 'none'
                              }}
                            >
                              {skill.name}
                            </span>
                            <div className="md:hidden flex items-center gap-1 mt-1">
                               {isExpanded ? <ChevronUp size={10} className="text-gray-600" /> : <ChevronDown size={10} className="text-gray-600" />}
                               <span className="text-[8px] text-gray-600 uppercase font-cinzel">{isExpanded ? 'Hide Info' : 'Show Info'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-2 md:px-6 py-4 md:py-5 text-center">
                        <span className="px-1.5 md:px-2 py-0.5 rounded bg-[#1a1a1c] text-[9px] md:text-[10px] font-bold text-gray-500 border border-[#333]">
                          {skill.tier}
                        </span>
                      </td>
                      <td className="px-2 md:px-6 py-4 md:py-5">
                        <div className="flex flex-col gap-0.5 md:gap-1">
                          {skill.costAscension > 0 && (
                            <div className={`flex items-center gap-1 text-[9px] md:text-xs shrink-0 ${(!canAfford && isAvailable) ? 'text-red-500/80' : 'text-white/80'}`}>
                              <Sparkles size={8} className="md:w-[10px] md:h-[10px]" /> {skill.costAscension}<span>&nbsp;PA</span>
                            </div>
                          )}
                          {skill.costEvolution > 0 && (
                            <div className={`flex items-center gap-1 text-[9px] md:text-xs shrink-0 ${(!canAfford && isAvailable) ? 'text-red-500/80' : 'text-blue-400/80'}`}>
                              <Zap size={8} className="md:w-[10px] md:h-[10px]" /> {skill.costEvolution}<span>&nbsp;PE</span>
                            </div>
                          )}
                          {skill.costAscension === 0 && skill.costEvolution === 0 && (
                            <span className="text-[9px] md:text-xs text-gray-600">Free</span>
                          )}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-5">
                        <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all">
                          {skill.description}
                        </p>
                      </td>
                      <td className="px-3 md:px-6 py-4 md:py-5 text-right">
                        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        {skill.isActive ? (
                          <button 
                            onClick={() => onForget(skill.id)}
                            className="inline-flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/50 transition-all active:scale-95 group/btn"
                          >
                            <Trash2 size={10} className="md:w-[12px] md:h-[12px]" />
                            <span>Forget</span>
                          </button>
                        ) : skill.isUnlocked ? (
                          <button 
                            disabled={!canAfford}
                            onClick={() => onLearn(skill.id)}
                            className={`
                              inline-flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95
                              ${canAfford 
                                ? 'bg-white text-black border border-white hover:bg-gray-200 shadow-lg' 
                                : 'bg-black/40 border border-[#222] text-gray-600 cursor-not-allowed opacity-50'}
                            `}
                          >
                            {canAfford ? <Play size={8} className="md:w-[10px] md:h-[10px]" fill="currentColor" /> : <ShieldAlert size={10} className="md:w-[12px] md:h-[12px]" />}
                            <span>{canAfford ? 'Learn' : 'Locked'}</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-lg bg-black/40 border border-[#222] text-gray-700 text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-40 cursor-not-allowed">
                            <Lock size={10} className="md:w-[12px] md:h-[12px]" /> <span>Unavailable</span>
                          </div>
                        )}
                        </div>
                      </td>
                    </tr>
                    {/* Expandable row for mobile description */}
                    {isExpanded && (
                      <tr className="md:hidden bg-white/[0.03]">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                             <h4 className="text-[8px] font-cinzel text-gray-500 uppercase tracking-widest mb-1">Effect Description</h4>
                             <p className="text-xs text-gray-400 italic leading-relaxed border-l-2 border-[#333] pl-3">
                               {skill.description}
                             </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          
          {filteredNodes.length === 0 && (
            <div className="py-20 text-center space-y-2">
              <p className="text-gray-600 font-cinzel italic tracking-widest">No matching skills discovered...</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar { 
          width: 6px; 
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: rgba(0, 0, 0, 0.4); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.2); 
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: rgba(255, 255, 255, 0.4); 
        }

        /* Enhanced Mobile Scrollbar visibility */
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar { 
            width: 4px; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.35);
          }
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TableView;
