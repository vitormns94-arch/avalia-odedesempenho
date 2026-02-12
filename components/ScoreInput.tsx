
import React from 'react';

interface ScoreInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export const ScoreInput: React.FC<ScoreInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`flex-1 py-3 text-lg font-bold rounded-xl border-2 transition-all ${
              value === score
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
};
