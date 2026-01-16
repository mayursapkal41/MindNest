import { Heart, Users, Calendar, Gamepad2, BookOpen, Phone, Sparkles, HandHeart, ArrowDown, MessageCircle, Trophy, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import jessicaAvatar from '@/assets/jessica-avatar.png';
import meditationBowl from '@/assets/meditation-bowl.png';

const Index = () => {
  return (
    <Layout showParticles={true}>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lavender/30 mb-6 animate-breathe">
              <HandHeart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground tracking-tight">
              Mind<span className="text-primary">Nest</span>
            </h1>
          </div>

          {/* Tagline */}
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl text-foreground/90 font-light mb-6 opacity-0 animate-fade-in-up leading-relaxed"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            You don't have to go through it alone.
          </h2>

          {/* Sub-text */}
          <p 
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up leading-relaxed"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            A safe space to talk, heal, grow, and breathe — at your own pace.
          </p>

          {/* CTA Button */}
          <div 
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
          >
            <a 
              href="#jessica"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-soft btn-glow transition-all duration-300 hover:scale-105"
            >
              <span>Enter MindNest</span>
              <ArrowDown className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}>
          <div className="w-8 h-12 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Jessica - Virtual Therapist Section */}
      <section id="jessica" className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-lavender">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary-foreground">Virtual Companion</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Meet <span className="text-primary">Jessica</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Your compassionate virtual companion, here to listen without judgment. 
              Whether you need someone to talk to at 3 AM or just want to process your thoughts, 
              Jessica is always here for you.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span>24/7 available for meaningful conversations</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span>Completely confidential and judgment-free</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Heart className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span>Gentle guidance with empathy and understanding</span>
              </li>
            </ul>
            <Link 
              to="/jessica"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-soft btn-glow transition-all duration-300 hover:scale-105"
            >
              Talk to Jessica
            </Link>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-lavender-light overflow-hidden shadow-glow animate-breathe">
                <img 
                  src={jessicaAvatar} 
                  alt="Jessica - Your virtual companion" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-card rounded-full shadow-card flex items-center justify-center animate-float-slow">
                <Heart className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Meditation Bowl Section */}
      <section
        id="meditation-bowl"
        className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-sage"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Image / Visual */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-sage-light overflow-hidden shadow-glow animate-breathe">
                <img
                  src={meditationBowl}
                  alt="Virtual Meditation Bowl"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">
                Sound Healing
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Virtual <span className="text-secondary-foreground">Meditation Bowl</span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Experience the soothing vibrations of a traditional singing bowl.
              Let the gentle, resonant tones wash over you, calming your mind
              and bringing you back to the present moment.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg">🎵</span>
                </div>
                <span>Authentic singing bowl sounds</span>
              </li>

              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg">🧘</span>
                </div>
                <span>Perfect for meditation and relaxation</span>
              </li>

              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg">✨</span>
                </div>
                <span>Interactive and immersive experience</span>
              </li>
            </ul>

            {/* Experience Button (EXTERNAL LINK) */}
            <a
              href="https://virtualmb.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground rounded-full text-lg font-semibold shadow-soft btn-glow transition-all duration-300 hover:scale-105"
            >
              Experience it!
            </a>
          </div>
        </div>
      </section>


      {/* Communities Section */}
      <section id="communities" className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-lavender">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/90 backdrop-blur rounded-3xl p-6 shadow-card transform hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-2xl bg-lavender-light flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Anxiety Support</h4>
                  <p className="text-sm text-muted-foreground">2,341 members</p>
                </div>
                <div className="bg-card/90 backdrop-blur rounded-3xl p-6 shadow-card transform hover:scale-105 transition-transform mt-8">
                  <div className="w-12 h-12 rounded-2xl bg-peach-light flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Healing & Hope</h4>
                  <p className="text-sm text-muted-foreground">3,102 members</p>
                </div>
                <div className="bg-card/90 backdrop-blur rounded-3xl p-6 shadow-card transform hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-2xl bg-sky-light flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Self-Growth</h4>
                  <p className="text-sm text-muted-foreground">2,567 members</p>
                </div>
                <div className="bg-card/90 backdrop-blur rounded-3xl p-6 shadow-card transform hover:scale-105 transition-transform mt-8">
                  <div className="w-12 h-12 rounded-2xl bg-sage-light flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Late-Night Talks</h4>
                  <p className="text-sm text-muted-foreground">1,543 members</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full mb-6">
              <Users className="w-5 h-5 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">Safe Spaces</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Find Your <span className="text-secondary-foreground">Community</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with others who truly understand. Our anonymous communities provide 
              safe spaces where you can share, support, and heal together.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span>Stay anonymous with your chosen identity</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <span>Like and reply to supportive messages</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <span>Moderated for kindness and safety</span>
              </li>
            </ul>
            <Link 
              to="/communities"
              className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground rounded-full text-lg font-semibold shadow-soft btn-glow transition-all duration-300 hover:scale-105"
            >
              Join Communities
            </Link>
          </div>
        </div>
      </section>

      {/* 30-Day Challenge Section */}
      <section id="challenge" className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-peach">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full mb-6">
              <Calendar className="w-5 h-5 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">Personal Journey</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              30 Days of <span className="text-accent-foreground">Gentle Healing</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Small, gentle steps each day toward a calmer, healthier you. 
              Track your progress, build streaks, and celebrate every milestone 
              on your personal wellness journey.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-accent-foreground" />
                </div>
                <span>Build streaks by completing daily tasks</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-accent-foreground" />
                </div>
                <span>New day unlocks at midnight</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent-foreground" />
                </div>
                <span>Your progress is saved and personalized</span>
              </li>
            </ul>
            <Link 
              to="/challenge"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-full text-lg font-semibold shadow-soft btn-glow transition-all duration-300 hover:scale-105"
            >
              Start Your Journey
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="bg-card/90 backdrop-blur rounded-3xl p-8 shadow-card max-w-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Your Journey</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-peach-light rounded-full">
                  <span className="text-lg">🔥</span>
                  <span className="font-bold text-foreground text-sm">7 day streak</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                      ${i < 7 
                        ? 'bg-primary text-primary-foreground shadow-glow' 
                        : i === 7 
                          ? 'bg-peach-light text-foreground ring-2 ring-primary/50' 
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-sage-light rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-sm text-foreground line-through">Drink a glass of water</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-muted-foreground/20 flex items-center justify-center">
                    🧘
                  </div>
                  <span className="text-sm text-foreground">5 minutes of deep breathing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relaxation Games Section */}
      <section id="games" className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-hero">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mb-4 text-3xl">
                  🌸
                </div>
                <h4 className="font-semibold text-foreground">Memory Garden</h4>
              </div>
              <div className="bg-card rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow mt-6">
                <div className="w-16 h-16 rounded-2xl bg-lavender-light flex items-center justify-center mb-4 text-3xl">
                  🎨
                </div>
                <h4 className="font-semibold text-foreground">Color Matching</h4>
              </div>
              <div className="bg-card rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-sky-light flex items-center justify-center mb-4 text-3xl">
                  🎯
                </div>
                <h4 className="font-semibold text-foreground">Calm Dot</h4>
              </div>
              <div className="bg-card rounded-3xl p-6 shadow-card hover:shadow-hover transition-shadow mt-6">
                <div className="w-16 h-16 rounded-2xl bg-peach-light flex items-center justify-center mb-4 text-3xl">
                  🔤
                </div>
                <h4 className="font-semibold text-foreground">Word Unscramble</h4>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-light rounded-full mb-6">
              <Gamepad2 className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">Mindful Play</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              <span className="text-primary">Relaxation</span> Games
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Peaceful games designed to calm your mind and ease anxiety. 
              Take a mindful break with activities that help you relax and refocus.
            </p>
            <Link 
              to="/games"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-soft btn-glow transition-all duration-300 hover:scale-105"
            >
              Play Games
            </Link>
          </div>
        </div>
      </section>

      {/* Articles & Emergency Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              More <span className="text-primary">Resources</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thoughtful reads and immediate support when you need it most
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Articles Card */}
            <Link 
              to="/articles" 
              className="group bg-card rounded-3xl p-8 shadow-card hover:shadow-hover transition-all card-hover"
            >
              <div className="w-16 h-16 rounded-2xl bg-lavender-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Healing Articles</h3>
              <p className="text-muted-foreground mb-6">
                Thoughtful reads to help you understand, heal, and grow. 
                Explore topics on mental health, self-care, and personal development.
              </p>
              <span className="text-primary font-medium group-hover:underline">
                Read articles →
              </span>
            </Link>

            {/* Emergency Card */}
            <Link 
              to="/emergency" 
              className="group bg-sage-light rounded-3xl p-8 shadow-card hover:shadow-hover transition-all card-hover"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Emergency Support</h3>
              <p className="text-muted-foreground mb-6">
                You're not alone. Access immediate help and crisis resources 
                whenever you need them. Help is just one tap away.
              </p>
              <span className="text-secondary-foreground font-medium group-hover:underline">
                Get help now →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-center border-t border-border/50">
        <p className="text-muted-foreground text-sm">
          Made with 💜 for your peace of mind
        </p>
      </footer>
    </Layout>
  );
};

export default Index;
