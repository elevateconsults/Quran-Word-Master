import React, { useState } from 'react';
import { Word, QuizQuestion } from '../types';
import { CheckCircle, XCircle, RefreshCw, Trophy, BookOpen, Heart } from 'lucide-react';

interface QuizProps {
  words: Word[];
}

const Quiz: React.FC<QuizProps> = ({ words }) => {
  const [mode, setMode] = useState<'none' | 'collection' | 'library'>('none');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Helper to start quiz
  const startQuiz = (quizMode: 'collection' | 'library') => {
    let pool: Word[] = [];

    if (quizMode === 'collection') {
        // Only user added or bookmarked words
        pool = words.filter(w => w.source === 'user-added' || w.isBookmarked);
        if (pool.length < 4) {
            alert("Your collection is too small! Add or bookmark at least 4 words.");
            return;
        }
    } else {
        // All words
        pool = words;
    }

    // Generate Questions
    const shuffledWords = [...pool].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, Math.min(10, shuffledWords.length)); 

    const newQuestions: QuizQuestion[] = selectedWords.map((word) => {
      // Distractors can come from the entire library for better difficulty
      const distractors = words
        .filter(w => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.english);

      const options = [...distractors, word.english].sort(() => 0.5 - Math.random());

      return {
        id: Math.random().toString(36).substr(2, 9),
        questionWord: word,
        options,
        correctAnswer: word.english
      };
    });

    setQuestions(newQuestions);
    setMode(quizMode);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; 
    setSelectedAnswer(answer);

    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
      setMode('none');
      setShowResult(false);
  };

  // --- RENDER: MODE SELECTION ---
  if (mode === 'none') {
      const myCount = words.filter(w => w.source === 'user-added' || w.isBookmarked).length;
      const libCount = words.length;

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 animate-in fade-in">
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-2">Quiz Mode</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-xs">Choose which word bank you want to practice today.</p>

            <div className="grid gap-4 w-full max-w-sm">
                <button 
                    onClick={() => startQuiz('collection')}
                    className="flex items-center p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-emerald-500 hover:shadow-md transition group text-left"
                >
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full mr-4 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition">
                        <Heart className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">My Collection</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Practice your {myCount} saved words</p>
                    </div>
                </button>

                <button 
                    onClick={() => startQuiz('library')}
                    className="flex items-center p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl hover:border-emerald-500 hover:shadow-md transition group text-left"
                >
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full mr-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition">
                        <BookOpen className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Full Library</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Challenge yourself with all {libCount} words</p>
                    </div>
                </button>
            </div>
        </div>
      );
  }

  // --- RENDER: RESULTS ---
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center animate-in zoom-in-95">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full mb-6">
            <Trophy className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{score} / {questions.length}</h2>
        <p className="text-emerald-600 dark:text-emerald-400 font-medium text-lg mb-8">{percentage === 100 ? "Perfect Score! MashAllah!" : "Great Practice Session!"}</p>
        
        <button 
          onClick={resetQuiz}
          className="bg-emerald-600 dark:bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Choose Another Quiz
        </button>
      </div>
    );
  }

  // --- RENDER: ACTIVE QUIZ ---
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-md mx-auto py-4">
      <div className="flex justify-between items-center mb-6 text-sm font-medium text-slate-400 dark:text-slate-500">
        <button onClick={resetQuiz} className="hover:text-slate-600 dark:hover:text-slate-300">Exit</button>
        <span>{currentQuestionIndex + 1} / {questions.length}</span>
      </div>

      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
        <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 text-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        <span className="inline-block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Translate this</span>
        <h3 className="text-4xl font-arabic mb-4 text-slate-800 dark:text-slate-100" dir="rtl">{currentQ.questionWord.arabic}</h3>
      </div>

      <div className="grid gap-3">
        {currentQ.options.map((option, idx) => {
          let stateStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200";
          let icon = null;

          if (selectedAnswer) {
            if (option === currentQ.correctAnswer) {
              stateStyle = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500";
              icon = <CheckCircle size={20} />;
            } else if (option === selectedAnswer) {
              stateStyle = "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300";
              icon = <XCircle size={20} />;
            } else {
              stateStyle = "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswer(option)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex justify-between items-center font-medium ${stateStyle}`}
            >
              {option}
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;