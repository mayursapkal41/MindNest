import { useState, useEffect } from 'react';
import { RotateCcw, ArrowLeft, SkipForward, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const positiveWords = [
  'HOPE',
  'CALM',
  'PEACE',
  'HEAL',
  'TRUST',
  'LOVE',
  'JOY',
  'REST',
  'SAFE',
  'GROW',
  'LIGHT',
  'SMILE',
  'DREAM',
  'BRAVE',
  'SHINE',
  'GRACE',
  'BLOOM',
  'CARE',
  'KIND',
  'FREE',
];

const scrambleWord = (word: string): string => {
  const letters = word.split('');
  // Keep scrambling until it's different from original
  let scrambled = [...letters];
  do {
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
  } while (scrambled.join('') === word && word.length > 1);
  return scrambled.join('');
};

const WordUnscramble = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const getNewWord = () => {
    // Get available words that haven't been used
    const availableWords = positiveWords.filter(w => !usedWords.has(w));
    
    // If all words used, reset
    if (availableWords.length === 0) {
      setUsedWords(new Set());
      const randomWord = positiveWords[Math.floor(Math.random() * positiveWords.length)];
      setCurrentWord(randomWord);
      setScrambledWord(scrambleWord(randomWord));
      setUsedWords(new Set([randomWord]));
    } else {
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentWord(randomWord);
      setScrambledWord(scrambleWord(randomWord));
      setUsedWords(prev => new Set([...prev, randomWord]));
    }
    
    setUserInput('');
    setIsCorrect(false);
    setShowSuccess(false);
  };

  useEffect(() => {
    getNewWord();
  }, []);

  const handleInputChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setUserInput(upperValue);

    if (upperValue === currentWord) {
      setIsCorrect(true);
      setShowSuccess(true);
      setWordsCompleted(prev => prev + 1);
      
      // Auto advance after a moment
      setTimeout(() => {
        getNewWord();
      }, 1500);
    }
  };

  const handleSkip = () => {
    getNewWord();
  };

  const resetGame = () => {
    setWordsCompleted(0);
    setUsedWords(new Set());
    getNewWord();
  };

  return (
    <Layout>
      <div className="min-h-screen px-6 py-24">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/games" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 opacity-0 animate-fade-in-up"
            style={{ animationFillMode: 'forwards' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
            <h1 className="text-4xl font-bold text-foreground mb-4">Word Unscramble</h1>
            <p className="text-muted-foreground text-lg">
              Rearrange gentle words and reconnect with positivity.
            </p>
          </div>

          {/* Stats */}
          <div 
            className="flex justify-center mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <div className="px-6 py-3 bg-lavender-light rounded-2xl">
              <span className="text-foreground font-medium">Words Found: {wordsCompleted}</span>
            </div>
          </div>

          {/* Game Area */}
          <div 
            className="bg-card rounded-3xl shadow-card p-8 md:p-12 mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
          >
            {/* Scrambled Word Display */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-4">Unscramble this word:</p>
              <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
                {scrambledWord.split('').map((letter, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 md:w-16 md:h-16 bg-gradient-lavender rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold text-foreground shadow-soft"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="text-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Type your answer..."
                maxLength={currentWord.length}
                disabled={isCorrect}
                className={`w-full max-w-xs mx-auto text-center text-2xl font-bold py-4 px-6 rounded-2xl border-2 transition-all outline-none ${
                  isCorrect 
                    ? 'border-sage bg-sage/10 text-sage' 
                    : 'border-border bg-background focus:border-primary'
                }`}
              />
              
              {/* Success Animation */}
              {showSuccess && (
                <div className="mt-6 flex flex-col items-center animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mb-3">
                    <Check className="w-8 h-8 text-sage" />
                  </div>
                  <p className="text-lg font-medium text-sage">Perfect! 🌟</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div 
            className="flex items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <button
              onClick={handleSkip}
              disabled={isCorrect}
              className="flex items-center gap-2 px-5 py-3 bg-card rounded-2xl shadow-card hover:shadow-hover transition-all disabled:opacity-50"
            >
              <SkipForward className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground font-medium">Skip Word</span>
            </button>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-5 py-3 bg-card rounded-2xl shadow-card hover:shadow-hover transition-all"
            >
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Reset</span>
            </button>
          </div>

          {/* Encouragement */}
          <p className="text-center text-muted-foreground mt-8">
            There are no wrong attempts here. 💜
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default WordUnscramble;
