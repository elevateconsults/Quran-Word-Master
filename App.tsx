import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from './components/Layout';
import WordCard from './components/WordCard';
import AddWordModal from './components/AddWordModal';
import Quiz from './components/Quiz';
import StandbyMode from './components/StandbyMode';
import { Word, Settings } from './types';
import { getStoredWords, saveUserWord, deleteUserWord, updateUserWord, getSettings, saveSettings, toggleBookmark, bulkImportUserWords } from './services/storage';
import { Plus, Search, Heart, BookOpen, Upload, Download, FileJson, Moon, Sun, Bell, Clock, CheckSquare, X, Share2, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bank');
  const [bankTab, setBankTab] = useState<'collection' | 'library'>('collection'); 
  
  const [words, setWords] = useState<Word[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettingsState] = useState<Settings>(getSettings());
  
  // Selection Mode State
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWords(getStoredWords());
    
    const root = document.documentElement;
    if (settings.theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
  }, [settings.theme]);

  const collectionCount = useMemo(() => words.filter(w => w.source === 'user-added' || w.isBookmarked).length, [words]);
  const libraryCount = useMemo(() => words.length, [words]);

  const filteredWords = useMemo(() => {
    let tabWords = words;
    if (bankTab === 'collection') {
        tabWords = words.filter(w => w.source === 'user-added' || w.isBookmarked);
    } else {
        tabWords = words;
    }

    if (!searchQuery) return tabWords;

    return tabWords.filter(word => 
      word.arabic.includes(searchQuery) || 
      word.english.toLowerCase().includes(searchQuery.toLowerCase()) || 
      word.transliteration.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [words, searchQuery, bankTab]);

  // --- CRUD Operations ---

  const handleSaveWord = (word: Word) => {
    if (editingWord) {
        const updated = updateUserWord(word);
        setWords(updated);
        setEditingWord(null);
    } else {
        const updated = saveUserWord(word);
        setWords(updated);
        setBankTab('collection');
    }
    setIsAddModalOpen(false);
  };

  const handleEditClick = (word: Word) => {
      setEditingWord(word);
      setIsAddModalOpen(true);
  };

  const handleAddClick = () => {
      setEditingWord(null);
      setIsAddModalOpen(true);
  };

  const handleDeleteWord = (id: string) => {
    if(window.confirm("Are you sure you want to delete this word?")) {
        const updated = deleteUserWord(id);
        setWords(updated);
    }
  };

  const handleToggleBookmark = (id: string) => {
      const updated = toggleBookmark(id);
      setWords(updated);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);
    saveSettings(updated);
    
    if (newSettings.notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  // --- Import / Export ---

  const handleImportClick = () => {
      if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const content = event.target?.result as string;
              const data = JSON.parse(content);
              if (Array.isArray(data)) {
                  const updated = bulkImportUserWords(data);
                  setWords(updated);
                  alert(`Import complete. New words added, duplicates skipped.`);
                  setBankTab('collection');
                  setActiveTab('bank');
              } else {
                  alert("Invalid format: The file must contain a JSON list of words.");
              }
          } catch (err) {
              alert("Error parsing file. Please ensure it is valid JSON.");
          }
      };
      reader.readAsText(file);
      e.target.value = '';
  };

  const downloadTemplate = () => {
      const template = [
          {
              "arabic": "اَلْسَّلَامُ عَلَيْكُمْ",
              "english": "Peace be upon you",
              "transliteration": "As-salamu alaykum",
              "root": "س ل م",
              "context": "Greeting"
          }
      ];
      downloadJson(template, 'quran_wordmaster_template.json');
  };

  const downloadJson = (data: any, filename: string) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  // --- Selection Mode Logic ---

  const toggleSelectionMode = () => {
      if (selectionMode) {
          setSelectionMode(false);
          setSelectedIds(new Set());
      } else {
          setSelectionMode(true);
      }
  };

  const handleToggleSelect = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
      if (selectedIds.size === filteredWords.length) {
          setSelectedIds(new Set());
      } else {
          const allIds = filteredWords.map(w => w.id);
          setSelectedIds(new Set(allIds));
      }
  };

  const handleExportSelected = () => {
      const idsToExport = selectedIds.size > 0 
        ? selectedIds 
        : new Set(words.map(w => w.id)); // If nothing selected (or logic called elsewhere), export all

      if (idsToExport.size === 0) {
          alert("No words to export.");
          return;
      }
      
      const wordsToExport = words
        .filter(w => idsToExport.has(w.id))
        .map(({id, masteryLevel, isBookmarked, source, ...rest}) => rest); // Clean data
      
      downloadJson(wordsToExport, 'my_quran_words_export.json');
      setSelectionMode(false);
      setSelectedIds(new Set());
  };

  // --- Smart Notifications with Service Worker Actions ---

  useEffect(() => {
    if (!settings.notificationsEnabled || !('Notification' in window)) return;

    const checkAndNotify = async () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Active Hours Check
      if (currentHour < settings.activeHourStart || currentHour >= settings.activeHourEnd) {
          return;
      }

      const collectionWords = words.filter(w => w.source === 'user-added' || w.isBookmarked);

      if (Notification.permission === 'granted' && collectionWords.length >= 4) {
        
        // 1. Pick a random word
        const randomWord = collectionWords[Math.floor(Math.random() * collectionWords.length)];
        
        // 2. Determine Direction (50/50 Chance)
        // 'ar_to_en': Show Arabic, options are English
        // 'en_to_ar': Show English, options are Arabic
        const direction = Math.random() > 0.5 ? 'ar_to_en' : 'en_to_ar';
        
        const questionText = direction === 'ar_to_en' 
            ? randomWord.arabic 
            : randomWord.english;

        const correctAnswer = direction === 'ar_to_en'
            ? randomWord.english
            : randomWord.arabic;

        // 3. Generate Distractors
        const distractors = words
            .filter(w => w.id !== randomWord.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => direction === 'ar_to_en' ? w.english : w.arabic);

        // 4. Create Options & Actions
        const options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
        
        // Chrome/Android limit actions to ~2-3 usually, but spec allows more. 
        // We will try to show up to 3 options as buttons, or 2 if text is long.
        // For best reliability, we keep options short.
        const actions = options.slice(0, 3).map(opt => ({
            action: opt,
            title: opt.length > 20 ? opt.substring(0, 17) + '...' : opt
        }));

        // 5. Send Notification via Service Worker
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
            reg.showNotification(`Quiz: ${direction === 'ar_to_en' ? 'Translate' : 'Arabic for'}: ${questionText}`, {
                body: `Tap an option below:\n${options.map(o => `• ${o}`).join('\n')}`,
                icon: '/icon.png', // Ensure icon exists in public
                badge: '/badge.png',
                tag: 'quran-quiz',
                renotify: true,
                actions: actions, // This enables the buttons!
                data: {
                    correctAnswer: correctAnswer,
                    question: questionText
                },
                requireInteraction: true // Keeps it on screen until user interacts
            } as any);
        }
      }
    };

    const intervalMs = settings.notificationFrequency * 60 * 1000;
    // Initial check after 5 seconds to test
    const initialTimer = setTimeout(checkAndNotify, 5000); 
    const interval = setInterval(checkAndNotify, intervalMs);

    return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
    };
  }, [settings, words]);


  const renderContent = () => {
    switch (activeTab) {
      case 'bank':
        return (
          <div className="space-y-4">
            {/* Header: Select/Export Controls */}
            <div className="flex justify-between items-center mb-2 min-h-[40px]">
                {selectionMode ? (
                    <div className="flex items-center gap-2 w-full animate-in fade-in bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                        <button onClick={toggleSelectionMode} className="p-1 text-slate-500">
                            <X size={20} />
                        </button>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedIds.size} selected</span>
                        
                        <div className="ml-auto flex gap-2">
                             <button onClick={handleSelectAll} className="text-xs text-emerald-600 font-medium px-2">
                                {selectedIds.size === filteredWords.length ? 'None' : 'All'}
                             </button>
                             <button 
                                onClick={handleExportSelected}
                                disabled={selectedIds.size === 0}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50"
                             >
                                <Share2 size={16} /> Export
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex justify-end">
                        <button 
                            onClick={toggleSelectionMode}
                            className="text-xs flex items-center gap-1 text-slate-500 hover:text-emerald-600 transition px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <CheckSquare size={14} /> Select / Export
                        </button>
                    </div>
                )}
            </div>

            {/* Top Toggle Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
                <button 
                    onClick={() => { setBankTab('collection'); setSelectionMode(false); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        bankTab === 'collection' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <Heart size={16} className={bankTab === 'collection' ? "fill-current" : ""} />
                    My Collection <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-1.5 rounded-full">{collectionCount}</span>
                </button>
                <button 
                    onClick={() => { setBankTab('library'); setSelectionMode(false); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        bankTab === 'library' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <BookOpen size={16} />
                    Full Library <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-1.5 rounded-full">{libraryCount}</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder={bankTab === 'collection' ? "Search your words..." : "Search Quranic words..."} 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 dark:text-white shadow-sm transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Info Banner for Empty Collection */}
            {bankTab === 'collection' && filteredWords.length === 0 && !searchQuery && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-xl p-6 text-center">
                    <Heart className="w-12 h-12 text-emerald-200 dark:text-emerald-800 mx-auto mb-2" />
                    <h3 className="text-emerald-800 dark:text-emerald-400 font-bold">Start your collection</h3>
                    <p className="text-emerald-600 dark:text-emerald-500 text-sm mt-1">
                        Go to the <b>Full Library</b> tab and tap the heart icon to save common Quranic words, or add your own custom words below.
                    </p>
                    <button onClick={() => setBankTab('library')} className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400 underline">
                        Browse Library
                    </button>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-4 pb-20">
                {filteredWords.length > 0 ? (
                    filteredWords.map(word => (
                        <WordCard 
                            key={word.id} 
                            word={word} 
                            onDelete={word.source === 'user-added' ? handleDeleteWord : undefined}
                            onEdit={handleEditClick}
                            onToggleBookmark={handleToggleBookmark}
                            selectionMode={selectionMode}
                            isSelected={selectedIds.has(word.id)}
                            onToggleSelect={handleToggleSelect}
                        />
                    ))
                ) : (
                    filteredWords.length === 0 && searchQuery && (
                        <div className="text-center py-10 text-slate-400">
                            <p>No words found matching "{searchQuery}".</p>
                        </div>
                    )
                )}
            </div>

            {/* FAB (Hidden in Selection Mode) */}
            {!selectionMode && (
                <button 
                    onClick={handleAddClick}
                    className="fixed bottom-24 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition transform hover:scale-105 z-40 flex items-center gap-2 pr-6"
                >
                    <Plus size={24} />
                    <span className="font-medium">Add Word</span>
                </button>
            )}

            <AddWordModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSave={handleSaveWord} 
                initialData={editingWord}
            />
          </div>
        );

      case 'quiz':
        return <Quiz words={words} />;

      case 'settings':
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-8">
                <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">Settings</h2>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                             {settings.theme === 'dark' ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-orange-400" />}
                             Appearance
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Switch between Light and Dark mode.</p>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                        <button 
                            onClick={() => updateSettings({ theme: 'light' })}
                            className={`p-2 rounded-md transition ${settings.theme === 'light' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600' : 'text-slate-400'}`}
                        >
                            <Sun size={18} />
                        </button>
                        <button 
                            onClick={() => updateSettings({ theme: 'dark' })}
                            className={`p-2 rounded-md transition ${settings.theme === 'dark' ? 'bg-slate-700 shadow text-emerald-400' : 'text-slate-400'}`}
                        >
                            <Moon size={18} />
                        </button>
                    </div>
                </div>

                {/* Data Management Section */}
                <div className="space-y-4">
                    <h3 className="font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <FileJson className="text-emerald-600 dark:text-emerald-400" size={20} />
                        Data Management
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                             <p className="text-sm text-slate-600 dark:text-slate-400">
                                Import word lists or backup your collection.
                            </p>
                            <button 
                                onClick={() => {
                                    handleSelectAll();
                                    handleExportSelected();
                                }}
                                className="text-xs text-emerald-600 dark:text-emerald-400 underline"
                            >
                                Export Full Library
                            </button>
                        </div>
                       
                        <div className="flex gap-3">
                            <button 
                                onClick={downloadTemplate}
                                className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                                <Download size={16} />
                                Template
                            </button>
                            <button 
                                onClick={handleImportClick}
                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 py-2 rounded-lg text-sm text-white hover:bg-emerald-700 transition shadow-sm"
                            >
                                <Upload size={16} />
                                Import JSON
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".json"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications & Active Hours */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Bell className="text-emerald-600 dark:text-emerald-400" size={20} />
                                Smart Notifications
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Get flashcard quizzes from your <b>Collection</b>.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={settings.notificationsEnabled}
                                onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                    
                    {settings.notificationsEnabled && (
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-4 border border-slate-100 dark:border-slate-700">
                             <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-3 rounded text-xs flex gap-2 items-start">
                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                <p>Ensure "Allow Notifications" is enabled in your browser/OS. Action buttons work best on Android/Chrome.</p>
                             </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Quiz Frequency</label>
                                <select 
                                    value={settings.notificationFrequency}
                                    onChange={(e) => updateSettings({ notificationFrequency: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 dark:text-white"
                                >
                                    <option value={1}>Every 1 Minute (High Intensity)</option>
                                    <option value={3}>Every 3 Minutes</option>
                                    <option value={5}>Every 5 Minutes</option>
                                    <option value={15}>Every 15 Minutes</option>
                                    <option value={30}>Every 30 Minutes</option>
                                    <option value={60}>Every 1 Hour</option>
                                    <option value={120}>Every 2 Hours</option>
                                    <option value={360}>Every 6 Hours</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-2">
                                    <Clock size={14} /> Active Hours (Do Not Disturb)
                                </label>
                                <div className="flex gap-2 items-center">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 block mb-1">Start Time (24h)</label>
                                        <input 
                                            type="number" 
                                            min="0" max="23"
                                            value={settings.activeHourStart}
                                            onChange={(e) => updateSettings({ activeHourStart: parseInt(e.target.value) })}
                                            className="w-full p-2 border rounded bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
                                        />
                                    </div>
                                    <span className="text-slate-400 mt-5">to</span>
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 block mb-1">End Time (24h)</label>
                                        <input 
                                            type="number" 
                                            min="0" max="23"
                                            value={settings.activeHourEnd}
                                            onChange={(e) => updateSettings({ activeHourEnd: parseInt(e.target.value) })}
                                            className="w-full p-2 border rounded bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Notifications will only arrive between {settings.activeHourStart}:00 and {settings.activeHourEnd}:00.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Font Size */}
                <div>
                     <label className="block font-medium text-slate-800 dark:text-slate-100 mb-2">App Font Size</label>
                     <div className="flex gap-2">
                         {['small', 'medium', 'large'].map((size) => (
                             <button
                                key={size}
                                onClick={() => updateSettings({ fontSize: size as any })}
                                className={`flex-1 py-2 border rounded-lg text-sm capitalize transition-colors ${
                                    settings.fontSize === size 
                                    ? 'bg-emerald-600 text-white border-emerald-600' 
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                             >
                                {size}
                             </button>
                         ))}
                     </div>
                </div>
                
                <div className="pt-4 text-center">
                    <p className="text-xs text-slate-400">Quran WordMaster v1.5 - Netlify Ready</p>
                </div>
            </div>
        );

      default:
        return null;
    }
  };

  if (activeTab === 'standby') {
      return <StandbyMode words={words} onExit={() => setActiveTab('bank')} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} settings={settings}>
      {renderContent()}
    </Layout>
  );
};

export default App;