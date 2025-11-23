import { Word, Settings } from './types';

// A curated list of high-frequency Quranic words (Top 100+)
export const PRELOADED_WORDS: Word[] = [
  // --- BASICS & PHRASES ---
  { id: 'def_1', arabic: 'بِسْمِ ٱللَّٰهِ', english: 'In the name of Allah', transliteration: 'Bismillah', root: 'س م و', context: 'Common Phrase', source: 'quranic', masteryLevel: 0 },
  { id: 'def_2', arabic: 'الْحَمْدُ لِلَّٰهِ', english: 'All praise is due to Allah', transliteration: 'Alhamdulillah', root: 'ح م د', context: 'Common Phrase', source: 'quranic', masteryLevel: 0 },
  { id: 'def_3', arabic: 'رَبِّ', english: 'Lord / Sustainer', transliteration: 'Rabb', root: 'ر ب ب', context: 'Frequent (900+ times)', source: 'quranic', masteryLevel: 0 },
  { id: 'def_4', arabic: 'اللَّٰه', english: 'God (The One True God)', transliteration: 'Allah', root: 'أ ل ه', context: 'Frequent (2600+ times)', source: 'quranic', masteryLevel: 0 },
  { id: 'def_5', arabic: 'رَسُول', english: 'Messenger', transliteration: 'Rasool', root: 'ر س ل', context: 'Frequent', source: 'quranic', masteryLevel: 0 },
  { id: 'def_5b', arabic: 'نَبِيّ', english: 'Prophet', transliteration: 'Nabi', root: 'ن ب أ', context: 'Title', source: 'quranic', masteryLevel: 0 },

  // --- NOUNS: NATURE & CREATION ---
  { id: 'def_6', arabic: 'السَّمَاوَاتِ', english: 'The Heavens', transliteration: 'As-Samawat', root: 'س م و', context: 'Creation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_7', arabic: 'الْأَرْض', english: 'The Earth', transliteration: 'Al-Ard', root: 'أ ر ض', context: 'Creation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_8', arabic: 'الشَّمْس', english: 'The Sun', transliteration: 'Ash-Shams', root: 'ش م س', context: 'Creation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_9', arabic: 'الْقَمَر', english: 'The Moon', transliteration: 'Al-Qamar', root: 'ق م ر', context: 'Creation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_9b', arabic: 'نَجْم', english: 'Star', transliteration: 'Najm', root: 'ن ج م', context: 'Creation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_9c', arabic: 'لَيْل', english: 'Night', transliteration: 'Layl', root: 'ل ي ل', context: 'Time', source: 'quranic', masteryLevel: 0 },
  { id: 'def_9d', arabic: 'نَهَار', english: 'Day (Daytime)', transliteration: 'Nahar', root: 'ن ه ر', context: 'Time', source: 'quranic', masteryLevel: 0 },
  { id: 'def_9e', arabic: 'جِبَال', english: 'Mountains', transliteration: 'Jibal', root: 'ج ب ل', context: 'Creation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_9f', arabic: 'بَحْر', english: 'Sea / Ocean', transliteration: 'Bahr', root: 'ب ح ر', context: 'Creation', source: 'quranic', masteryLevel: 0 },

  // --- NOUNS: AFTERLIFE & RELIGION ---
  { id: 'def_10', arabic: 'جَنَّة', english: 'Garden / Paradise', transliteration: 'Jannah', root: 'ج ن ن', context: 'Afterlife', source: 'quranic', masteryLevel: 0 },
  { id: 'def_11', arabic: 'نَار', english: 'Fire / Hellfire', transliteration: 'Nar', root: 'ن و ر', context: 'Afterlife', source: 'quranic', masteryLevel: 0 },
  { id: 'def_12', arabic: 'يَوْم', english: 'Day (Epoch)', transliteration: 'Yawm', root: 'ي و م', context: 'Time', source: 'quranic', masteryLevel: 0 },
  { id: 'def_12b', arabic: 'يَوْمِ الدِّينِ', english: 'Day of Judgment', transliteration: 'Yawm ad-Deen', root: 'د ي ن', context: 'Afterlife', source: 'quranic', masteryLevel: 0 },
  { id: 'def_13', arabic: 'آيَة', english: 'Sign / Verse', transliteration: 'Ayah', root: 'أ ي ي', context: 'Revelation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_14', arabic: 'كِتَاب', english: 'Book / Scripture', transliteration: 'Kitab', root: 'ك ت ب', context: 'Revelation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_14b', arabic: 'قُرْآن', english: 'Quran / Recitation', transliteration: 'Quran', root: 'ق ر أ', context: 'Revelation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_14c', arabic: 'مَلَائِكَة', english: 'Angels', transliteration: 'Malaikah', root: 'م ل ك', context: 'Unseen', source: 'quranic', masteryLevel: 0 },
  { id: 'def_14d', arabic: 'شَيْطَان', english: 'Satan / Devil', transliteration: 'Shaytan', root: 'ش ط ن', context: 'Unseen', source: 'quranic', masteryLevel: 0 },

  // --- NOUNS: HUMANITY ---
  { id: 'def_15', arabic: 'قَلْب', english: 'Heart', transliteration: 'Qalb', root: 'ق ل ب', context: 'Human', source: 'quranic', masteryLevel: 0 },
  { id: 'def_16', arabic: 'نَفْس', english: 'Soul / Self', transliteration: 'Nafs', root: 'ن ف س', context: 'Human', source: 'quranic', masteryLevel: 0 },
  { id: 'def_17', arabic: 'نَاس', english: 'Mankind / People', transliteration: 'Nas', root: 'ن و س', context: 'Human', source: 'quranic', masteryLevel: 0 },
  { id: 'def_17b', arabic: 'إِنسَان', english: 'Human being', transliteration: 'Insan', root: 'أ ن س', context: 'Human', source: 'quranic', masteryLevel: 0 },
  { id: 'def_17c', arabic: 'عَبْد', english: 'Slave / Servant', transliteration: 'Abd', root: 'ع ب د', context: 'Human', source: 'quranic', masteryLevel: 0 },
  { id: 'def_17d', arabic: 'قَوْم', english: 'Nation / People', transliteration: 'Qawm', root: 'ق و م', context: 'Group', source: 'quranic', masteryLevel: 0 },

  // --- KEY CONCEPTS ---
  { id: 'def_18', arabic: 'إِيمَان', english: 'Faith / Belief', transliteration: 'Iman', root: 'أ م ن', context: 'Concept', source: 'quranic', masteryLevel: 0 },
  { id: 'def_19', arabic: 'كُفْر', english: 'Disbelief', transliteration: 'Kufr', root: 'ك ف ر', context: 'Concept', source: 'quranic', masteryLevel: 0 },
  { id: 'def_20', arabic: 'صَلَاة', english: 'Prayer', transliteration: 'Salah', root: 'ص ل و', context: 'Worship', source: 'quranic', masteryLevel: 0 },
  { id: 'def_21', arabic: 'زَكَاة', english: 'Purification / Charity', transliteration: 'Zakah', root: 'ز ك و', context: 'Worship', source: 'quranic', masteryLevel: 0 },
  { id: 'def_22', arabic: 'حَقّ', english: 'Truth / Right', transliteration: 'Haqq', root: 'ح ق ق', context: 'Concept', source: 'quranic', masteryLevel: 0 },
  { id: 'def_23', arabic: 'بَاطِل', english: 'Falsehood', transliteration: 'Batil', root: 'ب ط ل', context: 'Concept', source: 'quranic', masteryLevel: 0 },
  { id: 'def_24', arabic: 'عِلْم', english: 'Knowledge', transliteration: 'Ilm', root: 'ع ل م', context: 'Concept', source: 'quranic', masteryLevel: 0 },
  { id: 'def_25', arabic: 'عَذَاب', english: 'Punishment / Torment', transliteration: 'Adhab', root: 'ع ذ ب', context: 'Afterlife', source: 'quranic', masteryLevel: 0 },
  { id: 'def_26', arabic: 'أَجْر', english: 'Reward', transliteration: 'Ajr', root: 'أ ج ر', context: 'Afterlife', source: 'quranic', masteryLevel: 0 },
  { id: 'def_26b', arabic: 'رَحْمَة', english: 'Mercy', transliteration: 'Rahmah', root: 'ر ح م', context: 'Concept', source: 'quranic', masteryLevel: 0 },
  { id: 'def_26c', arabic: 'نُور', english: 'Light', transliteration: 'Noor', root: 'ن و ر', context: 'Concept', source: 'quranic', masteryLevel: 0 },
  { id: 'def_26d', arabic: 'تَقْوَىٰ', english: 'God-consciousness', transliteration: 'Taqwa', root: 'و ق ي', context: 'Concept', source: 'quranic', masteryLevel: 0 },

  // --- COMMON VERBS (PAST TENSE / 3RD PERSON MASCULINE) ---
  { id: 'def_27', arabic: 'خَلَقَ', english: 'He Created', transliteration: 'Khalaqa', root: 'خ ل ق', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_28', arabic: 'قَالَ', english: 'He Said', transliteration: 'Qala', root: 'ق و ل', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_29', arabic: 'كَانَ', english: 'He Was', transliteration: 'Kana', root: 'ك و ن', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_30', arabic: 'آمَنَ', english: 'He Believed', transliteration: 'Amana', root: 'أ م ن', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_31', arabic: 'عَمِلَ', english: 'He Did / Worked', transliteration: 'Amila', root: 'ع م ل', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_32', arabic: 'يَعْلَمُ', english: 'He Knows', transliteration: 'Ya\'lamu', root: 'ع ل م', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_33', arabic: 'جَعَلَ', english: 'He Made', transliteration: 'Ja\'ala', root: 'ج ع ل', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_33b', arabic: 'كَفَرَ', english: 'He Disbelieved', transliteration: 'Kafara', root: 'ك ف ر', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_33c', arabic: 'جَاءَ', english: 'He Came', transliteration: 'Ja\'a', root: 'ج ي أ', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_33d', arabic: 'أَتَىٰ', english: 'He Came / Brought', transliteration: 'Ata', root: 'أ ت ي', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_33e', arabic: 'رَأَىٰ', english: 'He Saw', transliteration: 'Ra\'a', root: 'ر أ ي', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_33f', arabic: 'شَاءَ', english: 'He Willed', transliteration: 'Sha\'a', root: 'ش ي أ', context: 'Verb', source: 'quranic', masteryLevel: 0 },
  { id: 'def_33g', arabic: 'هَدَىٰ', english: 'He Guided', transliteration: 'Hada', root: 'ه د ي', context: 'Verb', source: 'quranic', masteryLevel: 0 },

  // --- PRONOUNS & PREPOSITIONS ---
  { id: 'def_34', arabic: 'هُوَ', english: 'He', transliteration: 'Huwa', root: '-', context: 'Pronoun', source: 'quranic', masteryLevel: 0 },
  { id: 'def_35', arabic: 'هِيَ', english: 'She', transliteration: 'Hiya', root: '-', context: 'Pronoun', source: 'quranic', masteryLevel: 0 },
  { id: 'def_36', arabic: 'نَحْنُ', english: 'We', transliteration: 'Nahnu', root: '-', context: 'Pronoun', source: 'quranic', masteryLevel: 0 },
  { id: 'def_37', arabic: 'أَنْتَ', english: 'You (m)', transliteration: 'Anta', root: '-', context: 'Pronoun', source: 'quranic', masteryLevel: 0 },
  { id: 'def_38', arabic: 'هُمْ', english: 'They (m)', transliteration: 'Hum', root: '-', context: 'Pronoun', source: 'quranic', masteryLevel: 0 },
  { id: 'def_39', arabic: 'مِنْ', english: 'From', transliteration: 'Min', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },
  { id: 'def_40', arabic: 'إِلَىٰ', english: 'To', transliteration: 'Ila', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },
  { id: 'def_41', arabic: 'عَلَىٰ', english: 'On / Upon', transliteration: 'Ala', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },
  { id: 'def_42', arabic: 'فِي', english: 'In', transliteration: 'Fi', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },
  { id: 'def_43', arabic: 'مَعَ', english: 'With', transliteration: 'Ma\'a', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },
  { id: 'def_43b', arabic: 'عَنْ', english: 'About / Away from', transliteration: 'An', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },
  { id: 'def_43c', arabic: 'بَيْنَ', english: 'Between', transliteration: 'Bayna', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },
  { id: 'def_43d', arabic: 'قَبْل', english: 'Before', transliteration: 'Qabl', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },
  { id: 'def_43e', arabic: 'بَعْد', english: 'After', transliteration: 'Ba\'d', root: '-', context: 'Preposition', source: 'quranic', masteryLevel: 0 },

  // --- ADJECTIVES / ATTRIBUTES ---
  { id: 'def_44', arabic: 'عَظِيم', english: 'Great / Supreme', transliteration: 'Adheem', root: 'ع ظ م', context: 'Attribute', source: 'quranic', masteryLevel: 0 },
  { id: 'def_45', arabic: 'عَلِيم', english: 'All-Knowing', transliteration: 'Aleem', root: 'ع ل م', context: 'Attribute', source: 'quranic', masteryLevel: 0 },
  { id: 'def_46', arabic: 'حَكِيم', english: 'All-Wise', transliteration: 'Hakeem', root: 'ح ك م', context: 'Attribute', source: 'quranic', masteryLevel: 0 },
  { id: 'def_47', arabic: 'قَدِير', english: 'All-Powerful', transliteration: 'Qadeer', root: 'ق د ر', context: 'Attribute', source: 'quranic', masteryLevel: 0 },
  { id: 'def_48', arabic: 'غَفُور', english: 'All-Forgiving', transliteration: 'Ghafoor', root: 'غ ف ر', context: 'Attribute', source: 'quranic', masteryLevel: 0 },
  { id: 'def_48b', arabic: 'رَحِيم', english: 'Most Merciful', transliteration: 'Raheem', root: 'ر ح م', context: 'Attribute', source: 'quranic', masteryLevel: 0 },
  { id: 'def_48c', arabic: 'كَرِيم', english: 'Noble / Generous', transliteration: 'Kareem', root: 'ك ر م', context: 'Attribute', source: 'quranic', masteryLevel: 0 },
  { id: 'def_48d', arabic: 'شَدِيد', english: 'Severe / Strong', transliteration: 'Shadeed', root: 'ش د د', context: 'Attribute', source: 'quranic', masteryLevel: 0 },
  { id: 'def_48e', arabic: 'مُبِين', english: 'Clear / Manifest', transliteration: 'Mubeen', root: 'ب ي ن', context: 'Attribute', source: 'quranic', masteryLevel: 0 },

  // --- INTERROGATIVES & CONJUNCTIONS ---
  { id: 'def_50', arabic: 'هَلْ', english: 'Is? / Are?', transliteration: 'Hal', root: '-', context: 'Question', source: 'quranic', masteryLevel: 0 },
  { id: 'def_51', arabic: 'مَا', english: 'What / Not', transliteration: 'Ma', root: '-', context: 'Question', source: 'quranic', masteryLevel: 0 },
  { id: 'def_52', arabic: 'مَنْ', english: 'Who', transliteration: 'Man', root: '-', context: 'Question', source: 'quranic', masteryLevel: 0 },
  { id: 'def_53', arabic: 'إِذَا', english: 'When / If', transliteration: 'Idha', root: '-', context: 'Conjunction', source: 'quranic', masteryLevel: 0 },
  { id: 'def_54', arabic: 'إِنْ', english: 'If / Not', transliteration: 'In', root: '-', context: 'Conjunction', source: 'quranic', masteryLevel: 0 },
  { id: 'def_55', arabic: 'لَا', english: 'No / Not', transliteration: 'La', root: '-', context: 'Negation', source: 'quranic', masteryLevel: 0 },
  { id: 'def_56', arabic: 'لَمْ', english: 'Did not', transliteration: 'Lam', root: '-', context: 'Negation', source: 'quranic', masteryLevel: 0 },

  // --- PROPHETS ---
  { id: 'def_60', arabic: 'مُوسَىٰ', english: 'Moses', transliteration: 'Musa', root: '-', context: 'Prophet', source: 'quranic', masteryLevel: 0 },
  { id: 'def_61', arabic: 'عِيسَىٰ', english: 'Jesus', transliteration: 'Isa', root: '-', context: 'Prophet', source: 'quranic', masteryLevel: 0 },
  { id: 'def_62', arabic: 'إِبْرَاهِيم', english: 'Abraham', transliteration: 'Ibrahim', root: '-', context: 'Prophet', source: 'quranic', masteryLevel: 0 },
  { id: 'def_63', arabic: 'مُحَمَّد', english: 'Muhammad', transliteration: 'Muhammad', root: 'ح م د', context: 'Prophet', source: 'quranic', masteryLevel: 0 },
  { id: 'def_64', arabic: 'نُوح', english: 'Noah', transliteration: 'Nuh', root: '-', context: 'Prophet', source: 'quranic', masteryLevel: 0 },
  { id: 'def_65', arabic: 'آدَم', english: 'Adam', transliteration: 'Adam', root: '-', context: 'Prophet', source: 'quranic', masteryLevel: 0 },
  { id: 'def_66', arabic: 'يُوسُف', english: 'Joseph', transliteration: 'Yusuf', root: '-', context: 'Prophet', source: 'quranic', masteryLevel: 0 },

  // --- MISC & SURAH AL-FATIHA ---
  { id: '1', arabic: 'الْعَالَمِينَ', english: 'The Worlds', transliteration: 'Al-Alameen', root: 'ع ل م', context: 'Al-Fatiha 1:2', source: 'quranic', masteryLevel: 0 },
  { id: '6', arabic: 'مَالِكِ', english: 'Owner / Master', transliteration: 'Maliki', root: 'م ل ك', context: 'Al-Fatiha 1:4', source: 'quranic', masteryLevel: 0 },
  { id: '8', arabic: 'الدِّينِ', english: 'Judgment', transliteration: 'Ad-Deen', root: 'د ي ن', context: 'Al-Fatiha 1:4', source: 'quranic', masteryLevel: 0 },
  { id: '9', arabic: 'إِيَّاكَ', english: 'You alone', transliteration: 'Iyyaka', root: '-', context: 'Al-Fatiha 1:5', source: 'quranic', masteryLevel: 0 },
  { id: '13', arabic: 'الصِّرَاطَ', english: 'The Path', transliteration: 'As-Sirat', root: 'ص ر ط', context: 'Al-Fatiha 1:6', source: 'quranic', masteryLevel: 0 },
  { id: '14', arabic: 'الْمُسْتَقِيمَ', english: 'The Straight', transliteration: 'Al-Mustaqeem', root: 'ق و م', context: 'Al-Fatiha 1:6', source: 'quranic', masteryLevel: 0 },
  { id: '70', arabic: 'كُلّ', english: 'All / Every', transliteration: 'Kull', root: 'ك ل ل', context: 'Common', source: 'quranic', masteryLevel: 0 },
  { id: '71', arabic: 'خَيْر', english: 'Good', transliteration: 'Khayr', root: 'خ ي ر', context: 'Common', source: 'quranic', masteryLevel: 0 },
  { id: '72', arabic: 'شَرّ', english: 'Evil / Bad', transliteration: 'Sharr', root: 'ش ر ر', context: 'Common', source: 'quranic', masteryLevel: 0 },
];

export const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: false,
  notificationFrequency: 60,
  activeHourStart: 9, // 9 AM
  activeHourEnd: 21, // 9 PM
  lockScreenEnabled: false,
  theme: 'light',
  fontSize: 'medium',
};