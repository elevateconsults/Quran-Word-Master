import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { Clock, Unlock, X } from 'lucide-react';

interface StandbyModeProps {
  words: Word[];
  onExit: () => void;
}

const StandbyMode: React.FC<StandbyModeProps> = ({ words, onExit }) => {
  const [time, setTime] = useState(new Date());
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  
  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Challenge generator
  const triggerChallenge = () => {
    if (words.length < 4) return;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const distractors = words
        .filter(w => w.id !== randomWord.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.english);
    
    setCurrentWord(randomWord);
    setOptions([...distractors, randomWord.english].sort(() => 0.5 - Math.random()));
    setLocked(true);
  };

  // Trigger challenge every 30 seconds for demo (would be longer in real usage)
  useEffect(() => {
    const interval = setInterval(() => {
        if (!locked) triggerChallenge();
    }, 30000); 
    
    // Initial trigger
    triggerChallenge();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);

  const handleAnswer = (answer: string) => {
    if (!currentWord) return;
    if (answer === currentWord.english) {
        setLocked(false);
        setCurrentWord(null);
    } else {
        // Simple shake animation logic could go here
        alert("Try again!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col items-center justify-between py-12 px-6">
      {/* Header / Exit */}
      <div className="w-full flex justify-end">
        <button onClick={onExit} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
            <X size={20} />
        </button>
      </div>

      {/* Clock Content */}
      <div className="flex flex-col items-center transition-all duration-500">
         <Clock size={32} className="mb-4 text-emerald-400 opacity-80" />
         <h1 className="text-6xl font-light tracking-tighter">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </h1>
         <p className="text-emerald-400/80 mt-2 font-medium">
            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
         </p>
      </div>

      {/* Quiz Overlay */}
      {locked && currentWord && (
         <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="flex items-center gap-2 mb-4 text-emerald-300">
                <Unlock size={16} />
                <span className="text-xs uppercase tracking-widest font-bold">Unlock to Continue</span>
            </div>
            
            <h2 className="text-3xl font-arabic text-center mb-6" dir="rtl">{currentWord.arabic}</h2>
            
            <div className="grid grid-cols-1 gap-2">
                {options.map((opt, i) => (
                    <button 
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="py-3 px-4 bg-white/5 hover:bg-emerald-600/50 rounded-lg text-sm transition text-left border border-white/5"
                    >
                        {opt}
                    </button>
                ))}
            </div>
         </div>
      )}

      {/* Footer */}
      {!locked && (
        <div className="text-white/30 text-xs">
            Standby Mode Active &bull; Learning in progress
        </div>
      )}
    </div>
  );
};

export default StandbyMode;