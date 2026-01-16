import { Heart } from 'lucide-react';
import Layout from '@/components/Layout';

const Jessica = () => {
  return (
    <Layout showBackButton>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">

          {/* Header */}
          <h1 
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4 opacity-0 animate-fade-in-up"
            style={{ animationFillMode: 'forwards' }}
          >
            Meet <span className="text-primary">Jessica</span>
          </h1>
          
          <p 
            className="text-lg sm:text-xl text-muted-foreground mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            Your virtual companion, here to listen without judgment.
          </p>

          {/* Avatar Area */}
          <div 
            className="mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <div className="relative inline-block">
              {/* Glow effect behind avatar */}
              <div className="absolute inset-0 bg-lavender/30 rounded-full blur-3xl animate-pulse-soft" />
              
              {/* Avatar placeholder */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-lavender flex items-center justify-center animate-breathe shadow-glow">
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-lavender-light flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse-soft" />
                    <p className="text-primary font-medium text-lg">Jessica</p>
                    <p className="text-muted-foreground text-sm mt-1">Virtual Therapist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p 
            className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Jessica is here whenever you need to talk. She listens with patience, 
            offers gentle guidance, and creates a safe space for you to express yourself.
          </p>

          {/* Talk Button */}
          <div 
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <button
              onClick={() => window.open("https://jessica-frontend.web.app/", "_blank")}
              className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-primary-foreground rounded-full text-xl font-semibold shadow-soft btn-glow animate-pulse-soft hover:scale-105 transition-transform duration-300"
            >
              <Heart className="w-6 h-6" />
              <span>Talk to Jessica</span>
            </button>
            
            <p className="text-sm text-muted-foreground mt-6">
              Take your time. There's no rush here.
            </p>
          </div>

          {/* Gentle reminders */}
          <div 
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            {[
              { title: "Confidential", desc: "Your conversations stay private" },
              { title: "Non-judgmental", desc: "Share freely without fear" },
              { title: "Always Available", desc: "Here whenever you need" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-lavender-light/50">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Jessica;
