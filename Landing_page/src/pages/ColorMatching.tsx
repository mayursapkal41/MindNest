import { useState, useEffect } from 'react';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

interface ColorCard {
  id: number;
  color: string;
  colorName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const pastelColors = [
  { color: 'bg-[#FFB5BA]', name: 'Rose' },
  { color: 'bg-[#B5D8FF]', name: 'Sky' },
  { color: 'bg-[#C5F0C8]', name: 'Mint' },
  { color: 'bg-[#FFE5B5]', name: 'Peach' },
  { color: 'bg-[#E0B5FF]', name: 'Lavender' },
  { color: 'bg-[#B5FFF0]', name: 'Aqua' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ColorMatching = () => {
  const [cards, setCards] = useState<ColorCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);

  const initializeGame = () => {
    const cardPairs = [...pastelColors, ...pastelColors].map((item, index) => ({
      id: index,
      color: item.color,
      colorName: item.name,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setIsLocked(false);
    setIsComplete(false);
    setMatchedCount(0);
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
      setIsLocked(true);

      const [first, second] = newFlipped;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);

      if (firstCard?.color === secondCard?.color) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isMatched: true } 
              : c
          ));
          setMatchedCount(prev => prev + 1);
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Color Matching</h1>
            <p className="text-muted-foreground text-lg">
              Match calming colors and let your mind slow down.
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
              <span className="text-foreground font-medium">Reset Game</span>
            </button>

            <div className="px-5 py-3 bg-lavender-light rounded-2xl">
              <span className="text-foreground font-medium">Matched: {matchedCount}/{pastelColors.length}</span>
            </div>
          </div>

          {/* Game Grid */}
          <div 
            className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8 opacity-0 animate-fade-in-up"
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
                  <div className="memory-card-front bg-gradient-to-br from-muted to-muted/50 shadow-card hover:shadow-hover transition-all rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
                  </div>
                  
                  {/* Card Front */}
                  <div className={`memory-card-back ${card.color} shadow-soft rounded-2xl flex flex-col items-center justify-center gap-2`}>
                    <span className="text-sm font-medium text-foreground/70">{card.colorName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Encouragement */}
          <p className="text-center text-muted-foreground">
            Take your time. 🎨
          </p>

          {/* Completion Modal */}
          {isComplete && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-card p-10 rounded-3xl shadow-glow text-center max-w-sm animate-fade-in-up">
                <div className="text-6xl mb-4">🌈</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Beautiful!</h2>
                <p className="text-muted-foreground mb-6">
                  All colors matched. Your mind found its rhythm.
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

export default ColorMatching;
