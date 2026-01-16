import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Flower2, Palette, Target, Type } from 'lucide-react';

interface GameCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  delay: number;
}

const GameCard = ({ icon, title, description, to, delay }: GameCardProps) => (
  <Link
    to={to}
    className="group block bg-card rounded-3xl p-8 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 opacity-0 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-lavender flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium group-hover:scale-105 transition-transform">
        Play {title}
      </span>
    </div>
  </Link>
);

const GamesHub = () => {
  const games = [
    {
      icon: <Flower2 className="w-10 h-10 text-primary" />,
      title: "Memory Garden",
      description: "A peaceful memory game to gently train focus.",
      to: "/games/memory-garden"
    },
    {
      icon: <Palette className="w-10 h-10 text-primary" />,
      title: "Color Matching",
      description: "Match calming colors and let your mind slow down.",
      to: "/games/color-matching"
    },
    {
      icon: <Target className="w-10 h-10 text-primary" />,
      title: "Click the Calm Dot",
      description: "Follow the dot. Stay present.",
      to: "/games/calm-dot"
    },
    {
      icon: <Type className="w-10 h-10 text-primary" />,
      title: "Word Unscramble",
      description: "Rearrange gentle words and reconnect with positivity.",
      to: "/games/word-unscramble"
    }
  ];

  return (
    <Layout showBackButton>
      <div className="min-h-screen px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Gentle Games for a Calm Mind
            </h1>
            <p className="text-xl text-muted-foreground">
              Play slowly. There is no rush here.
            </p>
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {games.map((game, index) => (
              <GameCard
                key={game.title}
                {...game}
                delay={(index + 1) * 100}
              />
            ))}
          </div>

          {/* Footer Message */}
          <p 
            className="text-center text-muted-foreground mt-16 text-lg opacity-0 animate-fade-in-up"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            🌱 A quiet garden where the mind can rest.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default GamesHub;
