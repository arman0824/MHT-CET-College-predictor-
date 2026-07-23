import React from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'slate';
  /** When true, chip is non-removable (used for static info chips). */
  static?: boolean;
  className?: string;
}

const COLOR_MAP: Record<NonNullable<ChipProps['color']>, string> = {
  blue: 'bg-google-blue-50 text-google-blue-700 border-google-blue-100',
  green: 'bg-google-green-50 text-google-green-700 border-google-green-100',
  yellow: 'bg-google-yellow-50 text-google-yellow-700 border-google-yellow-100',
  red: 'bg-google-red-50 text-google-red-700 border-google-red-100',
  slate: 'bg-slate-100 text-slate-700 border-slate-200'
};

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  color = 'slate',
  static: isStatic = false,
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full pl-3 pr-2 py-1.5 ${COLOR_MAP[color]} ${className}`}
    >
      <span className="truncate max-w-[140px]">{label}</span>
      {!isStatic && onRemove ? (
        <button
          onClick={onRemove}
          className="touch-target inline-flex items-center justify-center -mr-1 rounded-full hover:bg-black/5"
          aria-label={`Remove filter ${label}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : null}
    </span>
  );
};

export default Chip;
