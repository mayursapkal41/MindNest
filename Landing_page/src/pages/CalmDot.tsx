import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const TOTAL_DOTS = 10;
const DOT_VISIBLE_TIME = 1500; // 1.5 seconds

const CalmDot = () => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'complete'>('ready');
  const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 });
  const [isDotVisible, setIsDotVisible] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [dotClicked, setDotClicked] = useState(false);

  const getRandomPosition = () => {
    // Keep dot within safe bounds (20-80% of container)
    return {
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
    };
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentRound(0);
    setScore(0);
    setDotClicked(false);
    showNextDot();
  };

  const showNextDot = useCallback(() => {
    if (currentRound >= TOTAL_DOTS) {
      setGameState('complete');
      return;
    }

    setDotClicked(false);
    setDotPosition(getRandomPosition());
    setIsDotVisible(true);

    // Hide dot after visible time
    setTimeout(() => {
      setIsDotVisible(false);
      setCurrentRound(prev => prev + 1);
    }, DOT_VISIBLE_TIME);
  }, [currentRound]);

  useEffect(() => {
    if (gameState === 'playing' && !isDotVisible && currentRound > 0) {
      if (currentRound >= TOTAL_DOTS) {
        setGameState('complete');
      } else {
        // Show next dot after a brief pause
        const timer = setTimeout(() => {
          showNextDot();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isDotVisible, currentRound, gameState, showNextDot]);

  const handleDotClick = () => {
    if (isDotVisible && !dotClicked) {
      setDotClicked(true);
      setScore(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setCurrentRound(0);
    setScore(0);
    setIsDotVisible(false);
    setDotClicked(false);
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Click the Calm Dot</h1>
            <p className="text-muted-foreground text-lg">
              Follow the dot. Stay present.
            </p>
          </div>

          {/* Game Area */}
          <div 
            className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-muted/30 to-muted/50 rounded-3xl shadow-card mb-8 opacity-0 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            {gameState === 'ready' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Ready to Begin?</h3>
                <p className="text-muted-foreground mb-6">
                  A dot will appear {TOTAL_DOTS} times. Click it while it's visible.
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-soft btn-glow transition-all hover:scale-[1.02]"
                >
                  Start
                </button>
              </div>
            )}

            {gameState === 'playing' && (
              <>
                {/* Progress indicator */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {currentRound}/{TOTAL_DOTS}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Found: {score}
                  </span>
                </div>

                {/* The Dot */}
                {isDotVisible && (
                  <button
                    onClick={handleDotClick}
                    className={`absolute w-16 h-16 rounded-full transition-all duration-200 ${
                      dotClicked 
                        ? 'bg-sage scale-110' 
                        : 'bg-primary shadow-glow animate-pulse hover:scale-110'
                    }`}
                    style={{
                      left: `${dotPosition.x}%`,
                      top: `${dotPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {dotClicked && (
                      <span className="text-2xl">✓</span>
                    )}
                  </button>
                )}

                {/* Waiting state between dots */}
                {!isDotVisible && currentRound < TOTAL_DOTS && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-muted-foreground/20 animate-pulse" />
                  </div>
                )}
              </>
            )}

            {gameState === 'complete' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  You found {score} out of {TOTAL_DOTS} moments.
                </h3>
                <p className="text-muted-foreground mb-6">
                  Well done. Awareness matters more than speed.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-soft btn-glow transition-all hover:scale-[1.02]"
                  >
                    Play Again
                  </button>
                  <Link
                    to="/games"
                    className="w-full py-4 bg-card border border-border text-foreground rounded-2xl font-semibold shadow-soft transition-all hover:scale-[1.02] hover:bg-muted text-center"
                  >
                    Back to Games
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          {gameState === 'playing' && (
            <div className="flex justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-5 py-3 bg-card rounded-2xl shadow-card hover:shadow-hover transition-all"
              >
                <RotateCcw className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">Reset Game</span>
              </button>
            </div>
          )}

          {/* Footer Message */}
          <p className="text-center text-muted-foreground mt-8">
            Stay present. 🎯
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CalmDot;
