import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

const TacticalModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'CONFIRM',
  type = 'warning',
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-black border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={
                type === 'danger' ? 'text-status-error' : 'text-status-warning'
              }
              size={16}
            />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-[11px] text-white/60 font-medium leading-relaxed tracking-tight uppercase">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/[0.02] border-t border-white/5">
          <button
            onClick={onClose}
            className="flex-1 h-10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 rounded transition-all"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 h-10 text-[9px] font-black uppercase tracking-widest rounded transition-all active:scale-95 ${
              type === 'danger'
                ? 'bg-status-error text-white'
                : 'bg-primary text-black'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TacticalModal;
