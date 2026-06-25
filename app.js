/* ============================================================
   LEXIFY DAILY — App Logic
   - Daily word rotation (seeded by date)
   - Quiz engine with scoring
   - Streak tracking (localStorage)
   - Saved words
   - Share / Web Share API
   - Countdown timer to next day
   - Archive grid generation
   ============================================================ */

'use strict';

// ===================== WORD DATABASE =====================
const WORDS = [
  {
    word: "Ephemeral",
    phonetic: "/ɪˈfem.ər.əl/",
    pos: "adjective",
    definition: "Lasting for a very short time; transitory. Describing things that are momentarily beautiful but not enduring.",
    etymology: "From Greek ephḗmeros, meaning 'lasting only a day' — epi ('on') + hēmera ('day'). First used in English in the late 16th century to describe short-lived plants.",
    example: "The ephemeral beauty of cherry blossoms draws millions of visitors to Japan each spring, precisely because it lasts only two weeks.",
    synonyms: ["Transient", "Fleeting", "Momentary", "Transitory", "Brief"],
  },
  {
    word: "Sonder",
    phonetic: "/ˈsɒn.dər/",
    pos: "noun",
    definition: "The profound realization that each passerby has a life as vivid and complex as one's own — filled with ambitions, routines, worries, and joys.",
    etymology: "Coined by John Koenig in The Dictionary of Obscure Sorrows (2012), inspired by the German verb sinnen ('to contemplate') and the English word wonder.",
    example: "Sitting in the café, she was struck by a sudden sonder — every stranger walking past carried an entire inner world she would never know.",
    synonyms: ["Awareness", "Empathy", "Contemplation", "Realization"],
  },
  {
    word: "Petrichor",
    phonetic: "/ˈpet.rɪ.kɔːr/",
    pos: "noun",
    definition: "The pleasant, distinctive smell that frequently accompanies the first rain after a long period of warm, dry weather.",
    etymology: "Coined in 1964 by scientists Isabel Joy Bear and R.G. Thomas in Nature magazine. From Greek petra ('stone') + ichor (the fluid that flows in the veins of the gods in Greek mythology).",
    example: "The petrichor that rose from the scorched earth after the summer storm transported her instantly back to childhood monsoons.",
    synonyms: ["Earthscent", "Geosmin"],
  },
  {
    word: "Luminous",
    phonetic: "/ˈluː.mɪ.nəs/",
    pos: "adjective",
    definition: "Emitting or reflecting light; bright or shining. Metaphorically used for things that are intellectually brilliant or spiritually enlightened.",
    etymology: "From Latin luminosus ('full of light'), derived from lumen ('light'). Entered English in the 15th century through Old French lumineux.",
    example: "The luminous prose of the novel lit up the darkest passages of human experience with unexpected warmth and clarity.",
    synonyms: ["Radiant", "Glowing", "Incandescent", "Resplendent", "Brilliant"],
  },
  {
    word: "Mellifluous",
    phonetic: "/mɪˈlɪf.lu.əs/",
    pos: "adjective",
    definition: "Having a pleasant musical sound; flowing smoothly and sweetly like honey. Used to describe voices, music, or words that are exceptionally pleasant to hear.",
    etymology: "From Latin mel ('honey') + fluere ('to flow'). The full Latin root mellifluus literally means 'flowing with honey.' First recorded in English in the 15th century.",
    example: "The jazz singer's mellifluous voice seemed to slow time itself, filling every corner of the room with warm, amber sound.",
    synonyms: ["Dulcet", "Euphonious", "Harmonious", "Smooth", "Honeyed"],
  },
  {
    word: "Schadenfreude",
    phonetic: "/ˈʃɑː.dən.frɔɪ.də/",
    pos: "noun",
    definition: "The pleasure derived from another person's misfortune. A complex emotion that most people feel but few openly admit to experiencing.",
    etymology: "German compound word: Schaden ('damage, harm') + Freude ('joy, pleasure'). Borrowed directly into English in the 19th century — one of the rare German loanwords that English adopted wholesale.",
    example: "Despite his best efforts to appear sympathetic, a small flicker of schadenfreude crossed his face when his rival's pitch failed spectacularly.",
    synonyms: ["Gloating", "Malicious joy"],
  },
  {
    word: "Liminal",
    phonetic: "/ˈlɪm.ɪ.nəl/",
    pos: "adjective",
    definition: "Occupying a position at, or on both sides of, a boundary or threshold. Describing transitional states between two stages, conditions, or phases.",
    etymology: "From Latin limen ('threshold'). Popularized in anthropology by Arnold van Gennep (1909) and Victor Turner to describe transitional phases in rituals.",
    example: "The hospital waiting room existed in a liminal space — neither the safety of home nor the certainty of a diagnosis — just suspended, uncertain time.",
    synonyms: ["Transitional", "Threshold", "Intermediate", "In-between", "Borderline"],
  },
  {
    word: "Hiraeth",
    phonetic: "/ˈhɪər.aɪθ/",
    pos: "noun",
    definition: "A Welsh concept of longing, nostalgia, or grief for something lost — often for a home, a time, or a version of yourself that can never be returned to.",
    etymology: "Welsh in origin, considered untranslatable into English. Composed of hir ('long') + aeth (from the root meaning 'gone, grief'). The word carries cultural weight unique to Welsh identity.",
    example: "Reading her grandmother's old letters filled her with hiraeth — a longing not just for a person but for an entire world that had dissolved with her passing.",
    synonyms: ["Nostalgia", "Longing", "Homesickness", "Yearning", "Wistfulness"],
  },
  {
    word: "Perspicacious",
    phonetic: "/ˌpɜː.spɪˈkeɪ.ʃəs/",
    pos: "adjective",
    definition: "Having a ready insight into things; shrewdly perceptive. Describing someone with an unusually sharp ability to understand complex situations.",
    etymology: "From Latin perspicax ('seeing clearly through'), built from per ('through') + specere ('to look'). Related to perspicuous and spectacular. First English use in the 17th century.",
    example: "The perspicacious young analyst identified the flaw in the financial model that three senior partners had overlooked for weeks.",
    synonyms: ["Astute", "Shrewd", "Perceptive", "Discerning", "Insightful"],
  },
  {
    word: "Susurrus",
    phonetic: "/suːˈsʊr.əs/",
    pos: "noun",
    definition: "A whispering or rustling sound; a murmur. Often used to describe the soft, continuous sound of wind through leaves, distant conversation, or flowing water.",
    etymology: "Directly from Latin susurrus ('a humming, murmuring, whisper'), from the verb susurrare ('to whisper, hum'). An onomatopoeic word — it sounds like what it means.",
    example: "The only sound in the library was the susurrus of pages turning and the faint rhythm of rain on the tall windows.",
    synonyms: ["Murmur", "Whisper", "Rustle", "Sibilance", "Hiss"],
  },
  {
    word: "Halcyon",
    phonetic: "/ˈhæl.si.ən/",
    pos: "adjective",
    definition: "Denoting a period of time that was idyllically happy and peaceful. Often used to describe a golden time in the past, fondly remembered.",
    etymology: "From Greek alkyon ('kingfisher'), a mythical bird believed to nest on the sea and calm the waves during the winter solstice. The halcyon days referred to 14 days of calm winter weather.",
    example: "He spoke of his halcyon years at university with such warmth that his students felt almost nostalgic for a time they had never lived.",
    synonyms: ["Peaceful", "Blissful", "Golden", "Idyllic", "Tranquil"],
  },
  {
    word: "Serendipity",
    phonetic: "/ˌser.ənˈdɪp.ɪ.ti/",
    pos: "noun",
    definition: "The occurrence and development of events by chance in a happy or beneficial way; a fortunate coincidence.",
    etymology: "Coined by Horace Walpole in 1754 in a letter, inspired by the Persian fairy tale The Three Princes of Serendip (Serendip = old name for Sri Lanka), whose heroes constantly made fortunate discoveries by accident.",
    example: "By pure serendipity, the scientist spilled a chemical on the lab bench and discovered what would become the world's most widely used antibiotic.",
    synonyms: ["Fortune", "Chance", "Luck", "Coincidence", "Providence"],
  },
  {
    word: "Ineffable",
    phonetic: "/ɪˈnef.ə.bəl/",
    pos: "adjective",
    definition: "Too great or extreme to be expressed or described in words; inexpressible. Describes experiences, feelings, or things so profound that language falls short.",
    etymology: "From Latin ineffabilis ('unutterable'), from in- ('not') + effabilis ('speakable'), from effari ('to speak out'). First used in English in the 14th century in religious contexts.",
    example: "The conductor paused after the final note, as if the silence itself needed time to absorb the ineffable emotion of the performance.",
    synonyms: ["Indescribable", "Inexpressible", "Unspeakable", "Unutterable", "Beyond words"],
  },
  {
    word: "Ebullience",
    phonetic: "/ɪˈbʊl.jəns/",
    pos: "noun",
    definition: "The quality of being cheerful and full of energy; exuberance. The state of bubbling over with enthusiasm and high spirits.",
    etymology: "From Latin ebullire ('to bubble up, boil over'), composed of e- ('out') + bullire ('to boil'). The image is of a spirit so full of joy it literally bubbles and overflows.",
    example: "The coach's natural ebullience was contagious — within minutes of his arrival, the team's entire mood had transformed.",
    synonyms: ["Exuberance", "Vivacity", "Enthusiasm", "Zeal", "Effervescence"],
  },
  {
    word: "Quixotic",
    phonetic: "/kwɪkˈsɒt.ɪk/",
    pos: "adjective",
    definition: "Exceedingly idealistic; unrealistic and impractical. Describing someone who pursues romantic, noble, or lofty goals without regard for obstacles.",
    etymology: "From Don Quixote, the idealistic hero of Miguel de Cervantes's 1605 novel, who famously tilts at windmills he believes are giants. One of the few words derived directly from a fictional character's name.",
    example: "Her quixotic plan to cycle across Africa solo was met with skepticism — but eighteen months later, she had raised two million dollars for clean water projects.",
    synonyms: ["Idealistic", "Utopian", "Romantic", "Impractical", "Visionary"],
  },
  {
    word: "Aegis",
    phonetic: "/ˈiː.dʒɪs/",
    pos: "noun",
    definition: "The protection, backing, or support of a particular person or organization. Originally, the divine shield or protection of a god.",
    etymology: "From Greek aigis, the mythological shield of Zeus (and sometimes Athena), which was made from the skin of the goat Amalthea and bore the head of Medusa.",
    example: "The research was conducted under the aegis of the World Health Organization, lending it immediate global credibility.",
    synonyms: ["Protection", "Sponsorship", "Patronage", "Auspices", "Guardianship"],
  },
  {
    word: "Truculent",
    phonetic: "/ˈtrʌk.jʊ.lənt/",
    pos: "adjective",
    definition: "Eager or quick to argue or fight; aggressively defiant. Describing someone who is combative and hostile in their manner.",
    etymology: "From Latin truculentus ('fierce, savage'), related to trux ('savage, grim'). The word entered English in the early 16th century, originally describing savage cruelty, softening over time to mean argumentative.",
    example: "The truculent witness refused to answer the attorney's questions directly, turning every cross-examination into a confrontation.",
    synonyms: ["Belligerent", "Aggressive", "Combative", "Pugnacious", "Defiant"],
  },
  {
    word: "Lacuna",
    phonetic: "/ləˈkjuː.nə/",
    pos: "noun",
    definition: "An unfilled space or interval; a gap. Used in academic, medical, and literary contexts to describe something missing from a text, record, or sequence.",
    etymology: "Directly from Latin lacuna ('pit, hole, pool'), related to lacus ('lake'). The plural is lacunae. In manuscripts, it refers specifically to a section that has been lost or damaged.",
    example: "There is a significant lacuna in the historical record — no documents survive from the two decades following the city's founding.",
    synonyms: ["Gap", "Void", "Hiatus", "Blank", "Absence"],
  },
  {
    word: "Sanguine",
    phonetic: "/ˈsæŋ.ɡwɪn/",
    pos: "adjective",
    definition: "Optimistic or positive, especially in a difficult situation. Historically, it also described someone with a ruddy complexion, associated with a cheerful temperament.",
    etymology: "From Latin sanguineus ('of blood'), from sanguis ('blood'). In medieval humoral theory, a sanguine person was dominated by blood, which was thought to produce cheerfulness and optimism.",
    example: "Despite the market downturn, the CEO remained sanguine about the company's long-term prospects, pointing to their product pipeline.",
    synonyms: ["Optimistic", "Hopeful", "Buoyant", "Cheerful", "Positive"],
  },
  {
    word: "Palimpsest",
    phonetic: "/ˈpæl.ɪmp.sest/",
    pos: "noun",
    definition: "A manuscript or piece of writing material on which the original writing has been partially erased and written over again. Metaphorically, anything that shows layers of history or multiple overlapping traces.",
    etymology: "From Greek palimpsēstos ('scraped again'), from palin ('again') + psēn ('to scrape'). Ancient scribes reused expensive parchment by scraping off old text, though traces often remained visible.",
    example: "The old city was a palimpsest of its history — Roman columns embedded in medieval walls, Arab arches framing Renaissance doorways.",
    synonyms: ["Overlay", "Layering", "Trace", "Manuscript", "Stratification"],
  },
];

// ===================== QUIZ QUESTION BANK =====================
const QUIZ_QUESTIONS_POOL = [
  {
    q: "What does 'ephemeral' most precisely mean?",
    options: ["Eternal and enduring", "Lasting only a very short time", "Relating to the atmosphere", "Extremely heavy"],
    answer: 1
  },
  {
    q: "The word 'petrichor' describes:",
    options: ["A type of ancient rock", "The sound of rain on stone", "The smell of earth after rain", "A geological time period"],
    answer: 2
  },
  {
    q: "Which word means 'having a pleasant musical sound'?",
    options: ["Perspicacious", "Mellifluous", "Truculent", "Lacunae"],
    answer: 1
  },
  {
    q: "'Schadenfreude' comes from which language?",
    options: ["Swedish", "Dutch", "German", "Danish"],
    answer: 2
  },
  {
    q: "A 'liminal' space is best described as:",
    options: ["A very large space", "A threshold or transitional space", "An underground space", "A sacred space"],
    answer: 1
  },
  {
    q: "The word 'sonder' was coined in:",
    options: ["1899", "1952", "2012", "1984"],
    answer: 2
  },
  {
    q: "Which of these is a Welsh word for nostalgic longing?",
    options: ["Hiraeth", "Sonder", "Aegis", "Susurrus"],
    answer: 0
  },
  {
    q: "'Perspicacious' means:",
    options: ["Stubborn and inflexible", "Vague and unclear", "Shrewdly perceptive", "Overwhelmingly beautiful"],
    answer: 2
  },
  {
    q: "Which word's etymology literally means 'flowing with honey'?",
    options: ["Serendipity", "Mellifluous", "Halcyon", "Sanguine"],
    answer: 1
  },
  {
    q: "'Halcyon days' originally referred to:",
    options: ["The height of summer", "14 days of calm winter weather", "Ancient Greek holidays", "A period of drought"],
    answer: 1
  },
  {
    q: "The word 'serendipity' was inspired by:",
    options: ["A scientific discovery", "A Persian fairy tale", "A Greek myth", "A Shakespeare play"],
    answer: 1
  },
  {
    q: "Which word means 'too great to be expressed in words'?",
    options: ["Ebullience", "Quixotic", "Ineffable", "Trunculent"],
    answer: 2
  },
  {
    q: "'Quixotic' derives its meaning from:",
    options: ["A Greek philosopher", "A fictional literary character", "A Latin root for windmill", "A Spanish king"],
    answer: 1
  },
  {
    q: "In medicine and text scholarship, a 'lacuna' is:",
    options: ["A special type of cell", "A lake or body of water", "A gap or missing section", "A layer of sediment"],
    answer: 2
  },
  {
    q: "Which word originally relates to medieval humoral theory about blood?",
    options: ["Aegis", "Sanguine", "Palimpsest", "Luminous"],
    answer: 1
  },
  {
    q: "A 'palimpsest' originally referred to:",
    options: ["An ancient Egyptian tomb", "A reused manuscript with traces of old writing", "A painted portrait", "A stone inscription"],
    answer: 1
  },
  {
    q: "The Greek root of 'aegis' referred to:",
    options: ["An eagle's feathers", "A goat-skin divine shield", "A hero's sword", "A temple offering"],
    answer: 1
  },
  {
    q: "Which word best describes someone 'eagerly combative'?",
    options: ["Sanguine", "Luminous", "Truculent", "Halcyon"],
    answer: 2
  },
  {
    q: "What does 'ebullience' literally evoke in its Latin origin?",
    options: ["Fire burning", "Water bubbling or boiling over", "Wind rushing", "Earth shifting"],
    answer: 1
  },
  {
    q: "A 'susurrus' is a type of:",
    options: ["Bright flash of light", "Soft whispering or rustling sound", "Deep vibrating resonance", "Sharp percussive sound"],
    answer: 1
  },
  {
    q: "Which word describes 'the pleasure from another's misfortune'?",
    options: ["Sonder", "Hiraeth", "Schadenfreude", "Petrichor"],
    answer: 2
  },
  {
    q: "Which of these is an example of a 'serendipitous' discovery?",
    options: ["A planned laboratory experiment", "Penicillin found accidentally on contaminated bread", "A mathematical proof constructed over years", "An archaeological dig following historical maps"],
    answer: 1
  },
  {
    q: "Which word contains a Greek root meaning 'threshold'?",
    options: ["Liminal", "Luminous", "Lacuna", "Laconic"],
    answer: 0
  },
  {
    q: "If a city is described as a 'palimpsest,' it means:",
    options: ["It is very old and in ruins", "It shows layers of overlapping historical influences", "It was built on a manuscript site", "It is archaeologically preserved"],
    answer: 1
  },
  {
    q: "'Petrichor' was first coined by scientists in which decade?",
    options: ["1940s", "1950s", "1960s", "1970s"],
    answer: 2
  },
];

// ===================== HELPERS =====================
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getDayIndex() {
  // Seed by days since epoch for consistent daily rotation
  const epoch = new Date('2025-01-01');
  const today = new Date();
  today.setHours(0,0,0,0);
  epoch.setHours(0,0,0,0);
  return Math.floor((today - epoch) / 86400000);
}

function seededShuffle(arr, seed) {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ===================== STREAK SYSTEM =====================
const STREAK_KEY = 'lexify_streak';
const VISITED_KEY = 'lexify_visited';

function getStreak() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0, lastDate: null, history: [] };
  } catch { return { count: 0, lastDate: null, history: [] }; }
}

function updateStreak() {
  const today = getTodayKey();
  const streak = getStreak();
  const visited = JSON.parse(localStorage.getItem(VISITED_KEY) || '[]');

  if (streak.lastDate === today) {
    document.getElementById('streakCount').textContent = streak.count;
    return streak.count;
  }

  // Check if yesterday was visited
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

  if (streak.lastDate === yKey || !streak.lastDate) {
    streak.count = (streak.lastDate === yKey) ? streak.count + 1 : 1;
  } else {
    streak.count = 1; // Reset
  }
  streak.lastDate = today;
  if (!streak.history.includes(today)) streak.history.push(today);
  if (streak.history.length > 14) streak.history = streak.history.slice(-14);

  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  document.getElementById('streakCount').textContent = streak.count;

  if (streak.count > 1) {
    setTimeout(() => showToast(`🔥 ${streak.count}-day streak! Keep it up!`), 1500);
  }
  return streak.count;
}

document.getElementById('streakBtn').addEventListener('click', () => {
  const streak = getStreak();
  document.getElementById('modalStreakNum').textContent = streak.count;

  // Build 7-day calendar
  const cal = document.getElementById('streakCalendar');
  cal.innerHTML = '';
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const label = d.toLocaleDateString('en', { weekday: 'short' }).slice(0,2).toUpperCase();
    const active = streak.history && streak.history.includes(key);
    const div = document.createElement('div');
    div.className = `streak-day ${active ? 'active' : 'inactive'}`;
    div.textContent = label;
    cal.appendChild(div);
  }
  document.getElementById('streakModal').style.display = 'flex';
});

// ===================== TODAY'S WORD =====================
function loadTodayWord() {
  const idx = getDayIndex() % WORDS.length;
  const word = WORDS[idx];

  document.getElementById('heroDate').textContent = formatDate(new Date());
  document.getElementById('mainWord').textContent = word.word;
  document.getElementById('wordPhonetic').textContent = word.phonetic;
  document.getElementById('wordPos').textContent = word.pos;
  document.getElementById('wordDef').textContent = word.definition;
  document.getElementById('wordEtym').textContent = word.etymology;
  document.getElementById('wordExample').textContent = '"' + word.example + '"';

  const synContainer = document.getElementById('wordSynonyms');
  synContainer.innerHTML = '';
  word.synonyms.forEach(s => {
    const tag = document.createElement('span');
    tag.className = 'syn-tag';
    tag.textContent = s;
    tag.addEventListener('click', () => {
      showToast(`Searching "${s}"…`);
    });
    synContainer.appendChild(tag);
  });

  // Update page title with word
  document.title = `${word.word} — Lexify Daily`;

  return word;
}

// ===================== WORD ACTIONS =====================
let currentWord = null;

function speakWord() {
  if (!('speechSynthesis' in window)) { showToast('Speech not supported in your browser.'); return; }
  const w = currentWord;
  if (!w) return;
  const utterance = new SpeechSynthesisUtterance(w.word);
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  speechSynthesis.speak(utterance);
  showToast(`🔊 Playing: "${w.word}"`);
}

function saveWord() {
  const w = currentWord;
  if (!w) return;
  const saved = JSON.parse(localStorage.getItem('lexify_saved') || '[]');
  const today = getTodayKey();
  if (saved.some(s => s.word === w.word)) {
    showToast('Already saved! ✓');
    return;
  }
  saved.push({ word: w.word, def: w.definition, date: today });
  localStorage.setItem('lexify_saved', JSON.stringify(saved));
  document.getElementById('saveBtn').textContent = '✅ Saved';
  showToast(`"${w.word}" saved to your collection!`);
}

function shareWord() {
  const w = currentWord;
  if (!w) return;
  const text = `📖 Today's word on Lexify Daily:\n\n${w.word} (${w.pos})\n"${w.definition}"\n\nwww.lexifydaily.com`;
  if (navigator.share) {
    navigator.share({ title: `Lexify Daily: ${w.word}`, text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! Share away 📋'));
  }
}

// ===================== QUIZ ENGINE =====================
let quiz = {
  questions: [],
  current: 0,
  score: 0,
  answers: [],
  done: false,
};

function getTodayQuestions() {
  const seed = getDayIndex();
  const shuffled = seededShuffle(QUIZ_QUESTIONS_POOL, seed);
  return shuffled.slice(0, 5);
}

function checkQuizDone() {
  const key = 'lexify_quiz_' + getTodayKey();
  return localStorage.getItem(key);
}

function markQuizDone(score) {
  const key = 'lexify_quiz_' + getTodayKey();
  localStorage.setItem(key, JSON.stringify({ score, total: 5, ts: Date.now() }));
}

function initQuiz() {
  quiz.questions = getTodayQuestions();
  quiz.current = 0;
  quiz.score = 0;
  quiz.answers = [];
  quiz.done = false;

  document.getElementById('quizTotalQ').textContent = quiz.questions.length;

  const savedResult = checkQuizDone();
  if (savedResult) {
    const r = JSON.parse(savedResult);
    showQuizResult(r.score, r.total, true);
    return;
  }

  renderQuestion();
}

function renderQuestion() {
  const q = quiz.questions[quiz.current];
  const total = quiz.questions.length;

  document.getElementById('qNum').textContent = `Question ${quiz.current + 1}`;
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizCurrentQ').textContent = quiz.current + 1;
  document.getElementById('quizProgressFill').style.width = `${((quiz.current) / total) * 100}%`;
  document.getElementById('btnNext').style.display = 'none';

  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span>${opt}`;
    btn.addEventListener('click', () => selectAnswer(i));
    opts.appendChild(btn);
  });
}

function selectAnswer(idx) {
  const q = quiz.questions[quiz.current];
  const opts = document.querySelectorAll('.quiz-option');
  const correct = q.answer;

  quiz.answers.push({ chosen: idx, correct });

  opts.forEach(o => { o.disabled = true; o.classList.add('answered'); });

  if (idx === correct) {
    opts[idx].classList.add('correct');
    quiz.score++;
  } else {
    opts[idx].classList.add('wrong');
    opts[correct].classList.add('correct');
  }

  if (quiz.current < quiz.questions.length - 1) {
    document.getElementById('btnNext').style.display = 'inline-block';
  } else {
    setTimeout(() => finishQuiz(), 700);
  }
}

function nextQuestion() {
  quiz.current++;
  renderQuestion();
}

function finishQuiz() {
  markQuizDone(quiz.score);
  showQuizResult(quiz.score, quiz.questions.length, false);
}

function showQuizResult(score, total, alreadyDone) {
  document.getElementById('quizCard').style.display = 'none';
  const resultEl = document.getElementById('quizResult');
  resultEl.style.display = 'block';

  const pct = score / total;
  let emoji, msg;
  if (pct === 1) { emoji = '🏆'; msg = 'Perfect score! You\'re a walking dictionary.'; }
  else if (pct >= 0.8) { emoji = '🎯'; msg = 'Excellent! You clearly have a way with words.'; }
  else if (pct >= 0.6) { emoji = '📚'; msg = 'Solid effort! Keep building your vocabulary.'; }
  else if (pct >= 0.4) { emoji = '🌱'; msg = 'Good start. Check today\'s word and try again tomorrow!'; }
  else { emoji = '💡'; msg = 'No worries — every word you miss is one you\'ll remember next time.'; }

  if (alreadyDone) {
    msg = "You've already completed today's quiz. " + msg;
  }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultScore').textContent = `${score} / ${total}`;
  document.getElementById('resultMessage').textContent = msg;

  startCountdown();
}

function shareResult() {
  const score = document.getElementById('resultScore').textContent;
  const blocks = Array.from({ length: 5 }, (_, i) => {
    if (!quiz.answers[i]) return '⬜';
    return quiz.answers[i].chosen === quiz.answers[i].correct ? '🟩' : '🟥';
  }).join('');

  const text = `📖 Lexify Daily — ${getTodayKey()}\n\nScore: ${score}\n${blocks}\n\nPlay at www.lexifydaily.com`;
  if (navigator.share) {
    navigator.share({ title: 'Lexify Daily Quiz', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('Score copied to clipboard!'));
  }
}

function reviewQuiz() {
  // Show card again in review mode
  document.getElementById('quizCard').style.display = 'block';
  document.getElementById('quizResult').style.display = 'none';
  quiz.current = 0;
  quiz.done = true;
  renderReview();
}

function renderReview() {
  const q = quiz.questions[quiz.current];
  const total = quiz.questions.length;
  const answer = quiz.answers[quiz.current];

  document.getElementById('qNum').textContent = `Review: Question ${quiz.current + 1} of ${total}`;
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizCurrentQ').textContent = quiz.current + 1;

  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option answered';
    btn.disabled = true;
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span>${opt}`;
    if (answer && i === answer.correct) btn.classList.add('correct');
    if (answer && i === answer.chosen && i !== answer.correct) btn.classList.add('wrong');
    opts.appendChild(btn);
  });

  const nextBtn = document.getElementById('btnNext');
  if (quiz.current < total - 1) {
    nextBtn.style.display = 'inline-block';
    nextBtn.onclick = () => { quiz.current++; renderReview(); };
  } else {
    nextBtn.style.display = 'inline-block';
    nextBtn.textContent = 'Back to Results';
    nextBtn.onclick = () => {
      document.getElementById('quizCard').style.display = 'none';
      document.getElementById('quizResult').style.display = 'block';
    };
  }
}

// ===================== COUNTDOWN TIMER =====================
function startCountdown() {
  function tick() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    const diff = midnight - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    const el = document.getElementById('nextQuizTimer');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ===================== ARCHIVE GRID =====================
function buildArchive() {
  const grid = document.getElementById('archiveGrid');
  const today = getDayIndex();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const idx = (today - i + WORDS.length * 100) % WORDS.length;
    const w = WORDS[idx];
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = i === 0 ? 'Today' : `${days[d.getDay()]}, ${d.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`;

    const card = document.createElement('div');
    card.className = 'archive-card';
    card.innerHTML = `
      <div class="archive-card-date">${label}</div>
      <div class="archive-card-word">${w.word}</div>
      <div class="archive-card-def">${w.definition}</div>
    `;
    card.addEventListener('click', () => {
      if (i === 0) {
        document.getElementById('word').scrollIntoView({ behavior: 'smooth' });
      } else {
        showToast(`"${w.word}" — ${w.definition.slice(0,80)}…`);
      }
    });
    grid.appendChild(card);
  }
}

// ===================== SHARE STREAK =====================
function shareStreak() {
  const count = getStreak().count;
  const text = `🔥 I'm on a ${count}-day vocabulary streak on Lexify Daily!\nJoin me at www.lexifydaily.com`;
  if (navigator.share) {
    navigator.share({ title: 'My Lexify Streak', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('Streak copied!'));
    closeModal('streakModal');
  }
}

// ===================== CLOSE MODAL ON OVERLAY CLICK =====================
document.getElementById('streakModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal('streakModal');
});

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  currentWord = loadTodayWord();
  updateStreak();
  initQuiz();
  buildArchive();
});
