import { Phone, Heart, MessageCircle, Globe } from 'lucide-react';
import Layout from '@/components/Layout';

interface Helpline {
  name: string;
  phone: string;
  description: string;
  icon: React.ReactNode;
  available: string;
}

const helplines: Helpline[] = [
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: 'Free, confidential support for people in distress',
    icon: <Phone className="w-6 h-6" />,
    available: '24/7',
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free, 24/7 crisis support via text message',
    icon: <MessageCircle className="w-6 h-6" />,
    available: '24/7',
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Treatment referrals and information service',
    icon: <Heart className="w-6 h-6" />,
    available: '24/7, 365 days',
  },
  {
    name: 'International Association for Suicide Prevention',
    phone: 'Visit IASP.info',
    description: 'Find crisis centers around the world',
    icon: <Globe className="w-6 h-6" />,
    available: 'Always available',
  },
];

const Emergency = () => {
  return (
    <Layout showBackButton>
      <div className="min-h-screen px-6 py-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-light mb-6">
              <Heart className="w-10 h-10 text-secondary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              You Are <span className="text-primary">Not Alone</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              If things feel overwhelming right now, please reach out. 
              Help is available, and you deserve support.
            </p>
          </div>

          {/* Reassurance */}
          <div 
            className="bg-lavender-light rounded-3xl p-8 mb-10 text-center opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <p className="text-lg text-foreground leading-relaxed">
              Whatever you're going through, it's okay to ask for help. 
              Reaching out is a sign of strength, not weakness. 
              <span className="text-primary font-medium"> You matter.</span>
            </p>
          </div>

          {/* Helplines */}
          <div className="space-y-4">
            {helplines.map((helpline, index) => (
              <div
                key={helpline.name}
                className="bg-card rounded-3xl p-6 shadow-card hover:shadow-hover transition-all opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="p-4 bg-sage-light rounded-2xl self-start">
                    {helpline.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{helpline.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{helpline.description}</p>
                    <p className="text-xs text-muted-foreground">Available: {helpline.available}</p>
                  </div>

                  <a
                    href={helpline.phone.startsWith('Text') || helpline.phone.startsWith('Visit') 
                      ? '#' 
                      : `tel:${helpline.phone.replace(/[^0-9]/g, '')}`
                    }
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold shadow-soft btn-glow transition-all hover:scale-[1.02] whitespace-nowrap"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{helpline.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div 
            className="mt-12 text-center opacity-0 animate-fade-in-up"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <p className="text-muted-foreground mb-6">
              If you're in immediate danger, please call your local emergency number.
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-peach-light rounded-full">
              <span className="text-2xl">💜</span>
              <span className="text-foreground font-medium">We believe in you</span>
            </div>
          </div>

          {/* Self-Care Reminder */}
          <div 
            className="mt-12 p-8 bg-gradient-lavender rounded-3xl text-center opacity-0 animate-fade-in-up"
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">While You Wait</h3>
            <p className="text-muted-foreground mb-6">
              Try these grounding techniques:
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card/80 rounded-2xl p-4">
                <p className="text-2xl mb-2">🫁</p>
                <p className="text-sm text-foreground">Deep breaths</p>
              </div>
              <div className="bg-card/80 rounded-2xl p-4">
                <p className="text-2xl mb-2">💧</p>
                <p className="text-sm text-foreground">Drink water</p>
              </div>
              <div className="bg-card/80 rounded-2xl p-4">
                <p className="text-2xl mb-2">🧊</p>
                <p className="text-sm text-foreground">Hold something cold</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Emergency;
