
import React from 'react';
import { Sparkles, Zap, Menu } from 'lucide-react';
import { PlayerStats } from '../types';

interface ControlPanelProps {
  stats: PlayerStats;
  remainingPA: number;
  remainingPE: number;
  onStatsChange: (key: keyof PlayerStats, val: number) => void;
  onMenuToggle: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  stats, 
  remainingPA, 
  remainingPE, 
  onStatsChange, 
  onMenuToggle 
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-start pointer-events-none">
      {/* Menu Trigger */}
      <button 
        onClick={onMenuToggle}
        className="pointer-events-auto flex items-center justify-center w-12 h-12 bg-[#111] border border-[#333] rounded-xl shadow-2xl hover:bg-[#222] transition-all text-white active:scale-95"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Stats Display */}
      <div className="flex items-center gap-6 bg-[#111] border border-[#333] p-3 px-6 rounded-2xl shadow-2xl pointer-events-auto backdrop-blur-md">
        {/* PA Section */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 opacity-50">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-[9px] font-cinzel font-bold tracking-widest text-white uppercase">Ascensione</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-lg font-bold font-cinzel ${remainingPA < 0 ? 'text-red-500' : 'text-white'}`}>
              {remainingPA}
            </span>
            <span className="text-xs text-gray-600">/</span>
            <input 
              type="number" 
              value={stats.totalAscensionPoints} 
              onChange={(e) => onStatsChange('totalAscensionPoints', parseInt(e.target.value) || 0)}
              className="w-14 bg-transparent text-gray-400 font-cinzel text-sm outline-none border-b border-transparent focus:border-white/20 transition-all text-center hover:text-white"
              title="Modifica PA Totali"
            />
          </div>
        </div>

        <div className="w-px h-10 bg-[#333]" />

        {/* PE Section */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 opacity-50">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-cinzel font-bold tracking-widest text-blue-400 uppercase">Evoluzione</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-lg font-bold font-cinzel ${remainingPE < 0 ? 'text-red-500' : 'text-blue-400'}`}>
              {remainingPE}
            </span>
            <span className="text-xs text-gray-600">/</span>
            <input 
              type="number" 
              value={stats.totalEvolutionPoints} 
              onChange={(e) => onStatsChange('totalEvolutionPoints', parseInt(e.target.value) || 0)}
              className="w-14 bg-transparent text-gray-400 font-cinzel text-sm outline-none border-b border-transparent focus:border-blue-400/20 transition-all text-center hover:text-blue-400"
              title="Modifica PE Totali"
            />
          </div>
        </div>
      </div>

      {/* Invisible spacer for balance */}
      <div className="w-12" />
    </div>
  );
};

export default ControlPanel;
