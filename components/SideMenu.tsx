
import React from 'react';
import { X, Download, Upload, Share2, Trash2, Shield } from 'lucide-react';
import { ViewMode } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
  onShare: () => void;
  onReset: () => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ 
  isOpen, 
  onClose, 
  onExport, 
  onImport, 
  onShare, 
  onReset
}) => {
  return (
    <>
      {/* Backdrop with Blur */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Side Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-[#0c0c0e] border-r border-[#333] z-[101] shadow-2xl
        transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#111]">
          <div className="flex items-center gap-3 text-white">
            <Shield className="w-5 h-5 text-gray-400" />
            <h2 className="font-cinzel font-bold tracking-widest text-lg">MENU</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
          <div>
            <h3 className="text-[10px] font-cinzel text-gray-500 uppercase tracking-[0.2em] mb-4">Build Management</h3>
            <div className="space-y-2">
              <button 
                onClick={onExport}
                className="w-full flex items-center gap-4 p-4 bg-[#161618] hover:bg-[#1c1c1e] border border-[#222] rounded-xl text-gray-300 transition-all text-sm group"
              >
                <Download className="w-4 h-4 group-hover:text-white" />
                <span>Export Build</span>
              </button>
              <button 
                onClick={onImport}
                className="w-full flex items-center gap-4 p-4 bg-[#161618] hover:bg-[#1c1c1e] border border-[#222] rounded-xl text-gray-300 transition-all text-sm group"
              >
                <Upload className="w-4 h-4 group-hover:text-white" />
                <span>Import Build</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-cinzel text-gray-500 uppercase tracking-[0.2em] mb-4">Sharing</h3>
            <button 
              onClick={onShare}
              className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-sm group"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>Share Build URL</span>
            </button>
          </div>

          <div className="pt-8">
            <button 
              onClick={onReset}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-950/20 border border-[#222] hover:border-red-900/50 rounded-xl text-red-500/80 hover:text-red-500 transition-all text-sm group"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset All Progress</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#222] text-center">
          <span className="text-[9px] text-gray-600 font-cinzel uppercase tracking-widest">Ascension Path v1.5</span>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default SideMenu;
