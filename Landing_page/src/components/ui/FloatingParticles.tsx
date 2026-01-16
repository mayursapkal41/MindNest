import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: 'lavender' | 'sage' | 'peach' | 'sky';
}

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors: Particle['color'][] = ['lavender', 'sage', 'peach', 'sky'];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 20,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles(newParticles);
  }, []);

  const getColorClass = (color: Particle['color']) => {
    switch (color) {
      case 'lavender':
        return 'bg-lavender/20';
      case 'sage':
        return 'bg-sage/20';
      case 'peach':
        return 'bg-peach/20';
      case 'sky':
        return 'bg-sky/20';
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle animate-float ${getColorClass(particle.color)}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
