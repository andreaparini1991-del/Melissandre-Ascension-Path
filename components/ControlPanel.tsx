
import React from 'react';
import { Sparkles, Zap, Menu } from 'lucide-react';
import { PlayerStats } from '../types';

interface ControlPanelProps {
  stats: PlayerStats;
  onStatsChange: (key: keyof PlayerStats, val: number) => void;
  onMenuToggle: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ stats, onStatsChange, onMenuToggle }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
      {/* Menu Trigger */}
      <button 
        onClick={onMenuToggle}
        className="pointer-events-auto flex items-center justify-center w-12 h-12 bg-[#111] border border-[#333] rounded-xl shadow-2xl hover:bg-[#222] transition-all text-white active:scale-95"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Stats Display */}
      <div className="flex items-center gap-4 bg-[#111] border border-[#333] p-2 px-4 rounded-xl shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-xs font-cinzel text-gray-400">PA:</span>
          <input 
            type="number" 
            value={stats.ascensionPoints} 
            onChange={(e) => onStatsChange('ascensionPoints', parseInt(e.target.value) || 0)}
            className="w-12 bg-transparent text-white font-bold outline-none border-b border-transparent focus:border-white transition-all text-center"
          />
        </div>
        <div className="w-px h-6 bg-[#333]" />
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-cinzel text-gray-400">PE:</span>
          <input 
            type="number" 
            value={stats.evolutionPoints} 
            onChange={(e) => onStatsChange('evolutionPoints', parseInt(e.target.value) || 0)}
            className="w-12 bg-transparent text-white font-bold outline-none border-b border-transparent focus:border-blue-400 transition-all text-center"
          />
        </div>
      </div>

      {/* Spacer for layout balance */}
      <div className="w-12" />
    </div>
  );
};

export default ControlPanel;
