import React, { useState } from 'react';
import { X, User, Sparkles, Zap, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { CharacterData } from '../types';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterData[];
  onSelect: (char: CharacterData) => void;
  isLoading: boolean;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ isOpen, onClose, characters, onSelect, isLoading }) => {
  const [confirmChar, setConfirmChar] = useState<CharacterData | null>(null);

  if (!isOpen) return null;

  const handleSelect = (char: CharacterData) => {
    setConfirmChar(char);
  };

  const handleConfirm = () => {
    if (confirmChar) {
      onSelect(confirmChar);
      setConfirmChar(null);
      onClose();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0c0c0e] border border-[#333] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="font-cinzel font-bold text-lg tracking-widest text-white">CHARACTER ROSTER</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-white/5 rounded-full transition-colors group flex items-center gap-2"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              <span className="hidden md:block text-[10px] font-cinzel text-gray-500 group-hover:text-white">REFRESH</span>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {confirmChar ? (
            <div className="py-4 space-y-6 animate-in slide-in-from-bottom-4 duration-300 text-center">
              <div className="flex justify-center">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Update Budget?</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                  Are you sure you want to load the attributes for <span className="text-white font-bold">{confirmChar.name}</span>? This will overwrite your current PA and PE totals.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirm}
                  className="w-full py-4 bg-white text-black rounded-xl font-cinzel font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} strokeWidth={3} />
                  Confirm Update
                </button>
                <button 
                  onClick={() => setConfirmChar(null)}
                  className="w-full py-3 bg-[#1a1a1c] text-gray-400 rounded-xl font-cinzel font-bold hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              <span className="text-xs font-cinzel text-gray-500 tracking-widest uppercase">Fetching Roster...</span>
            </div>
          ) : characters.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-600 italic font-cinzel tracking-widest">No data found in chronicles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <p className="text-[10px] text-gray-500 font-cinzel uppercase tracking-[0.2em] mb-1">Available Characters</p>
              {characters.map((char) => (
                <button
                  key={char.name}
                  onClick={() => handleSelect(char)}
                  className="group relative w-full p-4 bg-[#161618] hover:bg-[#1c1c1e] border border-[#222] hover:border-white/20 rounded-2xl transition-all text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-[#333] group-hover:border-white/30 transition-all">
                       <User size={18} className="text-gray-500 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white tracking-tight">{char.name}</h4>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs text-white">
                        <Sparkles size={10} />
                        <span className="font-cinzel font-bold">{char.pa}</span>
                      </div>
                      <span className="text-[8px] text-gray-600 uppercase font-cinzel">PA</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs text-blue-400">
                        <Zap size={10} />
                        <span className="font-cinzel font-bold">{char.pe}</span>
                      </div>
                      <span className="text-[8px] text-gray-600 uppercase font-cinzel">PE</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111] border-t border-[#222] text-center">
           <p className="text-[8px] text-gray-600 font-cinzel uppercase tracking-[0.3em]">Data synced with Chronicles Repository</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;