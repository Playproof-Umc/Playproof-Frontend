// src/components/ui/ConfirmModal.tsx

import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  isDangerous?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onClose,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-[400px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDangerous ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
              <AlertCircle size={24} />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <Button 
            variant="outline" 
            fullWidth 
            onClick={onClose}
            className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            {cancelText}
          </Button>
          <Button 
            variant={isDangerous ? 'primary' : 'primary'} 
            fullWidth 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-xl font-bold ${isDangerous ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
