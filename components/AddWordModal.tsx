import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { X, Save } from 'lucide-react';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (word: Word) => void;
  initialData?: Word | null; // Added for Edit Mode
}

const AddWordModal: React.FC<AddWordModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    arabic: '',
    english: '',
    transliteration: '',
    context: '',
  });

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
        setFormData({
            arabic: initialData.arabic,
            english: initialData.english,
            transliteration: initialData.transliteration,
            context: initialData.context || '',
        });
    } else {
        setFormData({ arabic: '', english: '', transliteration: '', context: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wordToSave: Word = {
        id: initialData ? initialData.id : Date.now().toString(), // Keep ID if editing
        arabic: formData.arabic,
        english: formData.english,
        transliteration: formData.transliteration,
        context: formData.context,
        source: initialData ? initialData.source : 'user-added',
        masteryLevel: initialData ? initialData.masteryLevel : 0,
        isBookmarked: initialData ? initialData.isBookmarked : true // New words are bookmarked
    };
    onSave(wordToSave);
    if (!initialData) {
        setFormData({ arabic: '', english: '', transliteration: '', context: '' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 border border-slate-100 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                {initialData ? 'Edit Word' : 'Add New Word'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Arabic Word</label>
                <input 
                    required
                    type="text" 
                    dir="rtl"
                    className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-arabic text-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    placeholder="كِتَابٌ"
                    value={formData.arabic}
                    onChange={e => setFormData({...formData, arabic: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">English Meaning</label>
                <input 
                    required
                    type="text" 
                    className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    placeholder="Book"
                    value={formData.english}
                    onChange={e => setFormData({...formData, english: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transliteration</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        placeholder="Kitab"
                        value={formData.transliteration}
                        onChange={e => setFormData({...formData, transliteration: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Context (Optional)</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        placeholder="2:2"
                        value={formData.context}
                        onChange={e => setFormData({...formData, context: e.target.value})}
                    />
                </div>
            </div>

            <div className="pt-2">
                <button type="submit" className="w-full bg-emerald-600 dark:bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 dark:hover:bg-emerald-600 transition shadow-sm flex items-center justify-center gap-2">
                    <Save size={18} />
                    {initialData ? 'Save Changes' : 'Add to Bank'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddWordModal;