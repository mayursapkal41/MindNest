import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
  gradient?: 'lavender' | 'sage' | 'peach' | 'sky';
  delay?: number;
}

const SectionCard = ({ icon, title, description, to, gradient = 'lavender', delay = 0 }: SectionCardProps) => {
  const gradientClasses = {
    lavender: 'bg-lavender-light hover:bg-lavender/30',
    sage: 'bg-sage-light hover:bg-sage/30',
    peach: 'bg-peach-light hover:bg-peach/30',
    sky: 'bg-sky-light hover:bg-sky/30',
  };

  const iconBgClasses = {
    lavender: 'bg-lavender/40',
    sage: 'bg-sage/40',
    peach: 'bg-peach/40',
    sky: 'bg-sky/40',
  };

  return (
    <Link
      to={to}
      className={`
        group block p-8 rounded-3xl
        ${gradientClasses[gradient]}
        shadow-card card-hover
        opacity-0 animate-fade-in-up
        border border-transparent hover:border-primary/20
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`
        w-16 h-16 rounded-2xl ${iconBgClasses[gradient]}
        flex items-center justify-center mb-6
        group-hover:scale-110 transition-transform duration-500
      `}>
        <div className="text-foreground/80">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
      
      <div className="mt-6 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Explore</span>
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  );
};

export default SectionCard;
