import heroImage from "@/assets/hero-monk.jpg";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Monk meditating peacefully in the Himalayan mountains at dawn"
          className="h-full w-full object-cover object-center"
        />
        {/* Soft overlay for text readability */}
        <div className="absolute inset-0 bg-background/30" />
        {/* Vignette effect */}
        <div className="absolute inset-0 vignette-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 
          className="sacred-heading text-5xl md:text-7xl lg:text-8xl text-foreground opacity-0 animate-fade-in-slow"
          style={{ animationFillMode: 'forwards' }}
        >
          Stillness Begins Within
        </h1>
        
        <p 
          className="sacred-text mt-8 max-w-xl text-lg md:text-xl text-foreground/80 opacity-0 animate-fade-in-slower delay-700"
          style={{ animationFillMode: 'forwards', animationDelay: '700ms' }}
        >
          An ancient sound practice to calm the mind and ground the soul.
        </p>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-slow delay-1500"
        style={{ animationFillMode: 'forwards', animationDelay: '1500ms' }}
      >
        <div className="flex flex-col items-center text-foreground/50">
          <span className="text-sm tracking-widest uppercase mb-3">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-scroll-hint" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
