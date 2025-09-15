import React from 'react';
import type { Vibe } from '../types';

interface VibeButtonProps {
  vibe: Vibe;
  isSelected: boolean;
  onClick: () => void;
}

export const VibeButton: React.FC<VibeButtonProps> = ({ vibe, isSelected, onClick }) => {
  const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer";
  const selectedClasses = "bg-purple-600 text-white shadow-md";
  const unselectedClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <span>{vibe.icon}</span>
      <span>{vibe.name}</span>
    </button>
  );
};
