import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { Sparkles, Trash2, Volume2, Heart, Pencil, CheckSquare, Square } from 'lucide-react';
import { analyzeWordWithGemini, WordAnalysis } from '../services/geminiService';

interface WordCardProps {
  word: Word;
  onDelete?: (id: string) => void;
  onEdit?: (word: Word) => void;
  onToggleBookmark?: (id: string) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ 
    word, 
    onDelete, 
    onEdit, 
    onToggleBookmark,
    selectionMode = false,
    isSelected = false,
    onToggleSelect
}) => {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (!expanded) setAnalysis(null);
  }, [expanded]);

  const handleCardClick = () => {
      if (selectionMode && onToggleSelect) {
          onToggleSelect(word.id);
      } else {
          setExpanded(!expanded);
      }
  };

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (analysis) return;
    setLoadingAnalysis(true);
    const result = await analyzeWordWithGemini(word.arabic, word.context || 'General Quran');
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(word.arabic);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) onToggleBookmark(word.id);
  };

  return (
    <div 
      className={`rounded-xl shadow-sm border overflow-hidden transition-all duration-300 relative ${
        isSelected 
            ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
            : expanded 
                ? 'ring-2 ring-emerald-500 border-emerald-500 bg-white dark:bg-slate-800' 
                : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md'
      }`}
      onClick={handleCardClick}
    >
      <div className="p-4 flex justify-between items-start">
        {/* Selection Checkbox */}
        {selectionMode && (
            <div className="absolute top-4 right-4 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                {isSelected ? <CheckSquare size={24} fill="currentColor" className="text-emerald-200 dark:text-emerald-800" /> : <Square size={24} />}
            </div>
        )}

        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  word.source === 'user-added' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                }`}>
                    {word.source === 'user-added' ? 'My Word' : 'Library'}
                </span>
                {word.root && word.root !== '-' && <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-tight">Root: {word.root}</span>}
            </div>
            <h3 className="font-arabic text-3xl text-slate-800 dark:text-slate-100 mb-2 leading-relaxed" dir="rtl">{word.arabic}</h3>
            <p className="font-medium text-slate-700 dark:text-slate-300 text-lg">{word.english}</p>
            <p className="text-slate-500 dark:text-slate-500 italic text-sm">{word.transliteration}</p>
        </div>
        
        {!selectionMode && (
            <div className="flex flex-col gap-2">
            {onToggleBookmark && (
                <button 
                    onClick={handleBookmark}
                    className={`p-2 rounded-full transition-colors ${
                    word.isBookmarked 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40' 
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 hover:text-red-400'
                    }`}
                >
                    <Heart size={18} fill={word.isBookmarked ? "currentColor" : "none"} />
                </button>
            )}

            <button onClick={playAudio} className="p-2 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-700 rounded-full transition-colors">
                <Volume2 size={18} />
            </button>
            
            {/* Edit Button - Only for user-added words */}
            {word.source === 'user-added' && onEdit && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(word); }}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 bg-slate-50 dark:bg-slate-700 rounded-full transition-colors"
                >
                    <Pencil size={18} />
                </button>
            )}

            {word.source === 'user-added' && onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(word.id); }} 
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 bg-slate-50 dark:bg-slate-700 rounded-full transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            )}
            </div>
        )}
      </div>

      {expanded && !selectionMode && (
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 cursor-default" onClick={e => e.stopPropagation()}>
           <div className="flex justify-between items-center mb-3">
             <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
               Context: {word.context}
             </span>
             <button 
                onClick={handleAnalyze}
                disabled={loadingAnalysis}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 transition disabled:opacity-50"
             >
                <Sparkles size={14} />
                {loadingAnalysis ? 'Consulting AI...' : 'Gemini Insights'}
             </button>
           </div>

           {analysis ? (
             <div className="space-y-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900 shadow-sm">
                <div className="flex gap-4 text-sm">
                    <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Root</span>
                        <span className="font-arabic font-bold text-slate-700 dark:text-slate-200 text-lg">{analysis.root}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Type</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium">{analysis.grammar}</span>
                    </div>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Meaning Depth</span>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-emerald-300 pl-2">"{analysis.depth}"</p>
                </div>
                <div>
                     <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Related Words</span>
                     <div className="flex gap-2">
                        {analysis.relatedWords.map((w, i) => (
                            <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 font-arabic">{w}</span>
                        ))}
                     </div>
                </div>
             </div>
           ) : (
             <div className="text-center py-2">
                {!loadingAnalysis && <p className="text-xs text-slate-400 dark:text-slate-600 italic">Tap Gemini Insights for grammatical & spiritual depth.</p>}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default WordCard;