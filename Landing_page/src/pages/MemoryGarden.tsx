import { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🌸', '🌿', '🦋', '🌙', '⭐', '🌈', '☁️', '💜'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MemoryGarden = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const initializeGame = () => {
    const cardPairs = [...emojis, ...emojis].map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setIsLocked(false);
    setMoves(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setTimeout(() => setIsComplete(true), 500);
    }
  }, [cards]);

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isMatched: true } 
              : c
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Memory Garden</h1>
            <p className="text-muted-foreground text-lg">
              Take your time. There is no rush.
            </p>
          </div>

          {/* Controls */}
          <div 
            className="flex items-center justify-center gap-4 mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <button
              onClick={initializeGame}
              className="flex items-center gap-2 px-5 py-3 bg-card rounded-2xl shadow-card hover:shadow-hover transition-all"
            >
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Restart</span>
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-2 px-5 py-3 bg-card rounded-2xl shadow-card hover:shadow-hover transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-primary" />
              )}
              <span className="text-foreground font-medium">{isMuted ? 'Sound Off' : 'Sound On'}</span>
            </button>

            <div className="px-5 py-3 bg-lavender-light rounded-2xl">
              <span className="text-foreground font-medium">Moves: {moves}</span>
            </div>
          </div>

          {/* Game Grid */}
          <div 
            className="grid grid-cols-4 gap-4 mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  memory-card aspect-square cursor-pointer
                  ${card.isMatched ? 'opacity-50' : ''}
                `}
              >
                <div className={`memory-card-inner ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}>
                  {/* Card Back */}
                  <div className="memory-card-front bg-gradient-lavender shadow-card hover:shadow-hover transition-all">
                    <div className="w-8 h-8 rounded-full bg-lavender/50" />
                  </div>
                  
                  {/* Card Front */}
                  <div className="memory-card-back bg-card shadow-soft">
                    <span className="text-4xl">{card.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Encouragement */}
          <p className="text-center text-muted-foreground">
            Breathe. Focus on one card at a time. 🌸
          </p>

          {/* Completion Modal */}
          {isComplete && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-card p-10 rounded-3xl shadow-glow text-center max-w-sm animate-fade-in-up">
                <div className="text-6xl mb-4">🌟</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Wonderful!</h2>
                <p className="text-muted-foreground mb-6">
                  You completed the game in {moves} moves.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={initializeGame}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-soft btn-glow transition-all hover:scale-[1.02]"
                  >
                    Play Again
                  </button>
                  <Link
                    to="/games"
                    className="w-full py-4 bg-card border border-border text-foreground rounded-2xl font-semibold shadow-soft transition-all hover:scale-[1.02] hover:bg-muted"
                  >
                    Back to Games
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MemoryGarden;
