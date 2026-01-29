import React from 'react';
import { Sparkles, Zap, Menu, Undo2, Disc, List } from 'lucide-react';
import { PlayerStats, ViewMode } from '../types';

interface ControlPanelProps {
  stats: PlayerStats;
  remainingPA: number;
  remainingPE: number;
  onStatsChange: (key: keyof PlayerStats, val: number) => void;
  onMenuToggle: () => void;
  onUndo: () => void;
  canUndo: boolean;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  stats, 
  remainingPA, 
  remainingPE, 
  onStatsChange, 
  onMenuToggle,
  onUndo,
  canUndo,
  viewMode,
  onViewChange
}) => {
  return (
    <div className="absolute top-3 md:top-6 left-0 right-0 px-2 md:px-6 z-50 flex justify-center md:justify-between items-start pointer-events-none">
      
      {/* Mobile-Only Layout (Visible < 768px) */}
      <div className="md:hidden flex items-center w-full pointer-events-none px-1">
        {/* Left: Menu */}
        <div className="pointer-events-auto flex-[1] flex justify-start">
          <button 
            onClick={onMenuToggle}
            className="flex items-center justify-center w-11 h-11 bg-[#111] border border-[#333] rounded-xl shadow-2xl text-white active:scale-95"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Center: Centered, Compact, and Taller PA/PE Box */}
        <div className="pointer-events-auto flex-[2.5] flex justify-center">
          <div className="flex items-center justify-around gap-2 bg-[#111] border border-[#333] py-2.5 px-3 rounded-xl shadow-2xl backdrop-blur-md min-w-[160px] max-w-[190px]">
            {/* PA Section */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1 opacity-50">
                <Sparkles className="w-2.5 h-2.5 text-white" />
                <span className="text-[7px] font-cinzel font-bold tracking-wider text-white uppercase">PA</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className={`text-sm font-bold font-cinzel ${remainingPA < 0 ? 'text-red-500' : 'text-white'}`}>
                  {remainingPA}
                </span>
                <span className="text-[9px] text-gray-600">/</span>
                <input 
                  type="number" 
                  value={stats.totalAscensionPoints} 
                  onChange={(e) => onStatsChange('totalAscensionPoints', parseInt(e.target.value) || 0)}
                  className="w-9 bg-transparent text-gray-400 font-cinzel text-[10px] outline-none text-center"
                />
              </div>
            </div>

            <div className="w-px h-8 bg-[#333]" />

            {/* PE Section */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1 opacity-50">
                <Zap className="w-2.5 h-2.5 text-blue-400" />
                <span className="text-[7px] font-cinzel font-bold tracking-wider text-blue-400 uppercase">PE</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className={`text-sm font-bold font-cinzel ${remainingPE < 0 ? 'text-red-500' : 'text-blue-400'}`}>
                  {remainingPE}
                </span>
                <span className="text-[9px] text-gray-600">/</span>
                <input 
                  type="number" 
                  value={stats.totalEvolutionPoints} 
                  onChange={(e) => onStatsChange('totalEvolutionPoints', parseInt(e.target.value) || 0)}
                  className="w-9 bg-transparent text-gray-400 font-cinzel text-[10px] outline-none text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: View Toggles */}
        <div className="pointer-events-auto flex-[1] flex justify-end">
          <div className="flex items-center bg-[#111] border border-[#333] p-1 rounded-xl shadow-2xl h-11">
            <button 
              onClick={() => onViewChange('radial')}
              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${viewMode === 'radial' ? 'bg-white text-black' : 'text-gray-500'}`}
            >
              <Disc size={18} />
            </button>
            <button 
              onClick={() => onViewChange('table')}
              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-black' : 'text-gray-500'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout (Visible >= 768px) */}
      <div className="hidden md:flex justify-between items-start w-full pointer-events-none">
        {/* Left: Menu Container */}
        <div className="flex-1 flex justify-start pointer-events-none">
          <button 
            onClick={onMenuToggle}
            className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-[#111] border border-[#333] rounded-2xl shadow-2xl hover:bg-[#222] transition-all text-white active:scale-95 shrink-0"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Center: The 3 Primary HUD Boxes */}
        <div className="flex items-center gap-3 pointer-events-auto px-4">
          {/* Desktop View Toggles */}
          <div className="flex bg-[#111] border border-[#333] p-1.5 rounded-2xl shadow-2xl h-14 shrink-0">
            <button 
              onClick={() => onViewChange('radial')}
              className={`flex items-center justify-center w-12 rounded-xl transition-all ${viewMode === 'radial' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              title="Radial Tree View"
            >
              <Disc size={22} />
            </button>
            <button 
              onClick={() => onViewChange('table')}
              className={`flex items-center justify-center w-12 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              title="Compendium Table View"
            >
              <List size={22} />
            </button>
          </div>

          {/* Stats Box */}
          <div className="flex items-center justify-around gap-8 bg-[#111] border border-[#333] p-3 px-8 rounded-2xl shadow-2xl backdrop-blur-md">
            {/* PA Section */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 opacity-50">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-cinzel font-bold tracking-wider text-white uppercase">PA</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xl font-bold font-cinzel ${remainingPA < 0 ? 'text-red-500' : 'text-white'}`}>
                  {remainingPA}
                </span>
                <span className="text-sm text-gray-600">/</span>
                <input 
                  type="number" 
                  value={stats.totalAscensionPoints} 
                  onChange={(e) => onStatsChange('totalAscensionPoints', parseInt(e.target.value) || 0)}
                  className="w-16 bg-transparent text-gray-400 font-cinzel text-base outline-none border-b border-transparent focus:border-white/20 transition-all text-center hover:text-white"
                />
              </div>
            </div>

            <div className="w-px h-12 bg-[#333]" />

            {/* PE Section */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 opacity-50">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-cinzel font-bold tracking-wider text-blue-400 uppercase">PE</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xl font-bold font-cinzel ${remainingPE < 0 ? 'text-red-500' : 'text-blue-400'}`}>
                  {remainingPE}
                </span>
                <span className="text-sm text-gray-600">/</span>
                <input 
                  type="number" 
                  value={stats.totalEvolutionPoints} 
                  onChange={(e) => onStatsChange('totalEvolutionPoints', parseInt(e.target.value) || 0)}
                  className="w-16 bg-transparent text-gray-400 font-cinzel text-base outline-none border-b border-transparent focus:border-blue-400/20 transition-all text-center hover:text-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Undo Button */}
          <button 
            onClick={onUndo}
            disabled={!canUndo}
            className={`
              flex items-center justify-center w-14 h-14 bg-[#111] border border-[#333] rounded-2xl shadow-2xl transition-all text-white shrink-0
              ${canUndo ? 'hover:bg-[#222] hover:border-white/20 active:scale-95' : 'opacity-30 cursor-not-allowed grayscale'}
            `}
            title="Annulla"
          >
            <Undo2 className="w-6 h-6" />
          </button>
        </div>

        {/* Right: Symmetric Spacer for centering */}
        <div className="flex-1 flex justify-end pointer-events-none">
          <div className="w-14" />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;