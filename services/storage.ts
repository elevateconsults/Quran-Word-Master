import { Word, Settings } from '../types';
import { PRELOADED_WORDS, DEFAULT_SETTINGS } from '../constants';

const KEYS = {
  USER_WORDS: 'quran_wm_user_words',
  SETTINGS: 'quran_wm_settings',
  BOOKMARKS: 'quran_wm_bookmarks',
};

// Returns merged list of (Preloaded + Bookmarked status) AND (User Created Words)
export const getStoredWords = (): Word[] => {
  try {
    // 1. Get User Added Words
    const storedUserWords = localStorage.getItem(KEYS.USER_WORDS);
    const userWords: Word[] = storedUserWords ? JSON.parse(storedUserWords) : [];

    // 2. Get Bookmarks (Set of IDs)
    const storedBookmarks = localStorage.getItem(KEYS.BOOKMARKS);
    const bookmarkedIds: string[] = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    // 3. Process Preloaded words to attach bookmark status
    const processedPreloaded = PRELOADED_WORDS.map(word => ({
      ...word,
      isBookmarked: bookmarkedIds.includes(word.id)
    }));

    return [...processedPreloaded, ...userWords];
  } catch (e) {
    return PRELOADED_WORDS;
  }
};

export const saveUserWord = (word: Word): Word[] => {
  try {
    const stored = localStorage.getItem(KEYS.USER_WORDS);
    const userWords: Word[] = stored ? JSON.parse(stored) : [];
    
    // Simple check to prevent immediate duplicate adds via UI
    if (userWords.some(w => w.arabic === word.arabic)) {
        alert('This word already exists in your personal collection.');
        return getStoredWords();
    }

    const updated = [...userWords, { ...word, source: 'user-added', isBookmarked: true }]; 
    localStorage.setItem(KEYS.USER_WORDS, JSON.stringify(updated));
    return getStoredWords(); 
  } catch (e) {
    console.error(e);
    return PRELOADED_WORDS;
  }
};

export const updateUserWord = (updatedWord: Word): Word[] => {
    try {
        const stored = localStorage.getItem(KEYS.USER_WORDS);
        if (!stored) return getStoredWords();
        
        const userWords: Word[] = JSON.parse(stored);
        const index = userWords.findIndex(w => w.id === updatedWord.id);
        
        if (index !== -1) {
            userWords[index] = updatedWord;
            localStorage.setItem(KEYS.USER_WORDS, JSON.stringify(userWords));
        }
        return getStoredWords();
    } catch (e) {
        console.error("Update error", e);
        return getStoredWords();
    }
};

export const bulkImportUserWords = (newWords: any[]): Word[] => {
    try {
        // Fetch ALL words (including preloaded) to check for duplicates against everything
        const allCurrentWords = getStoredWords();
        const existingArabicSet = new Set(allCurrentWords.map(w => w.arabic.trim()));

        const stored = localStorage.getItem(KEYS.USER_WORDS);
        const existingUserWords: Word[] = stored ? JSON.parse(stored) : [];
        
        const validNewWords: Word[] = [];

        newWords.forEach((w, idx) => {
            const arabicText = (w.arabic || '').trim();
            
            // DEDUPLICATION CHECK:
            // If the arabic word exists in the entire library, skip it.
            if (arabicText && !existingArabicSet.has(arabicText)) {
                validNewWords.push({
                    id: `import_${Date.now()}_${idx}`,
                    arabic: w.arabic || 'Unknown',
                    english: w.english || 'Unknown',
                    transliteration: w.transliteration || '',
                    root: w.root || '-',
                    context: w.context || 'Imported',
                    source: 'user-added',
                    masteryLevel: 0,
                    isBookmarked: true
                });
                // Add to set to prevent duplicates within the import file itself
                existingArabicSet.add(arabicText);
            }
        });

        if (validNewWords.length === 0) {
            alert("No new words imported. Duplicates were skipped.");
            return getStoredWords();
        }

        const updated = [...existingUserWords, ...validNewWords];
        localStorage.setItem(KEYS.USER_WORDS, JSON.stringify(updated));
        return getStoredWords();
    } catch (e) {
        console.error("Bulk Import Error", e);
        return getStoredWords();
    }
};

export const deleteUserWord = (id: string): Word[] => {
    try {
        const stored = localStorage.getItem(KEYS.USER_WORDS);
        if (!stored) return getStoredWords();
        const userWords: Word[] = JSON.parse(stored);
        const updated = userWords.filter(w => w.id !== id);
        localStorage.setItem(KEYS.USER_WORDS, JSON.stringify(updated));
        return getStoredWords();
    } catch(e) {
        return PRELOADED_WORDS;
    }
}

export const toggleBookmark = (id: string): Word[] => {
  try {
    const storedBookmarks = localStorage.getItem(KEYS.BOOKMARKS);
    let bookmarkedIds: string[] = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    if (bookmarkedIds.includes(id)) {
      bookmarkedIds = bookmarkedIds.filter(bid => bid !== id);
    } else {
      bookmarkedIds.push(id);
    }

    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarkedIds));
    return getStoredWords();
  } catch (e) {
    console.error("Bookmark error", e);
    return getStoredWords();
  }
}

export const getSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};