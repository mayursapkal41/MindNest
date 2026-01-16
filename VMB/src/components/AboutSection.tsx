const AboutSection = () => {
  return (
    <section className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-2xl">
        {/* Parchment-style card */}
        <div 
          className="parchment-card rounded-2xl p-10 md:p-16 opacity-0 animate-fade-in-slow"
          style={{ animationFillMode: 'forwards' }}
        >
          <h2 className="sacred-heading text-3xl md:text-4xl lg:text-5xl text-center text-foreground mb-10">
            The Meditation Bowl
          </h2>

          <div className="sacred-text text-base md:text-lg text-foreground/80 space-y-6">
            <p>
              Meditation bowls, often used in Northern India and the Himalayan regions, 
              have been part of spiritual and healing practices for centuries.
            </p>
            
            <p>
              When gently tapped or moved in a circular motion, the bowl produces a deep, 
              resonating sound that helps the mind slow down and return to the present moment.
            </p>
            
            <p>
              This sound is believed to calm the nervous system, reduce mental noise, 
              and create a feeling of inner balance.
            </p>
          </div>

          {/* Highlight Box */}
          <div className="mt-12 p-8 bg-secondary/50 rounded-xl border border-border/50">
            <p className="sacred-heading text-xl md:text-2xl text-center text-foreground italic">
              You do not need to meditate perfectly.
              <br />
              <span className="text-accent">You only need to be present.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
