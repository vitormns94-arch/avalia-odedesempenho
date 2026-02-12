
import React from 'react';

interface StepLayoutProps {
  title: string;
  description: string;
  onNext: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
  children: React.ReactNode;
}

export const StepLayout: React.FC<StepLayoutProps> = ({ 
  title, 
  description, 
  onNext, 
  onPrev, 
  isNextDisabled, 
  children 
}) => {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-500 mb-8">{description}</p>
          
          <div className="space-y-6">
            {children}
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-200">
          {onPrev ? (
            <button
              onClick={onPrev}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
            >
              Voltar
            </button>
          ) : <div />}
          
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
              isNextDisabled 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
