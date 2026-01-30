
import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#0c0c0e] border border-red-900/30 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-cinzel font-bold text-white mb-3 tracking-wider uppercase">Irreversible Action</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            You are about to reset all current build progress. 
            All learned skills will be removed and PA/PE points will return to their initial values.
            Do you wish to proceed?
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={onConfirm}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-cinzel font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Confirm Full Reset
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-[#1a1a1c] hover:bg-[#222] text-gray-400 rounded-xl font-cinzel font-bold text-xs uppercase tracking-[0.2em] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
