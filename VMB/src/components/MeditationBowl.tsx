import { useState, useRef, useCallback, useEffect } from "react";

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

const MeditationBowl = () => {
  const [isActive, setIsActive] = useState(false);
  const [isCircling, setIsCircling] = useState(false);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [showGuidance, setShowGuidance] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const bowlRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef<number | null>(null);
  const circleCountRef = useRef(0);
  const rippleIdRef = useRef(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const guidanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const circleStopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio context for bowl sounds
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const extraOscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTapSound = useCallback(() => {
    const ctx = initAudio();
    
    // Authentic singing bowl frequencies with slight detuning for beating effect
    const fundamentalFreq = 220; // A3 - warm fundamental
    const harmonics = [
      { freq: fundamentalFreq, gain: 0.4, detune: 0 },
      { freq: fundamentalFreq * 1.02, gain: 0.3, detune: 2 }, // Slight beating
      { freq: fundamentalFreq * 2, gain: 0.25, detune: 0 }, // Octave
      { freq: fundamentalFreq * 2.98, gain: 0.15, detune: -3 }, // Fifth
      { freq: fundamentalFreq * 3.02, gain: 0.12, detune: 3 }, // Fifth with beating
      { freq: fundamentalFreq * 4, gain: 0.08, detune: 0 }, // 2nd octave
      { freq: fundamentalFreq * 5.5, gain: 0.05, detune: 5 }, // Higher shimmer
    ];

    const masterGain = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();
    const reverb = ctx.createConvolver();
    
    // Create impulse response for reverb
    const reverbLength = 3;
    const sampleRate = ctx.sampleRate;
    const impulse = ctx.createBuffer(2, sampleRate * reverbLength, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channelData.length, 2.5);
      }
    }
    reverb.buffer = impulse;

    const dryGain = ctx.createGain();
    const wetGain = ctx.createGain();
    dryGain.gain.value = 0.7;
    wetGain.gain.value = 0.4;

    // Create oscillators for each harmonic
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    harmonics.forEach(({ freq, gain, detune }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime(detune, ctx.currentTime);
      
      // Individual envelope for each harmonic - higher harmonics decay faster
      const decayTime = 8 - (freq / fundamentalFreq) * 0.8;
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(gain * 0.7, ctx.currentTime + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decayTime);
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      
      oscillators.push(osc);
      gains.push(oscGain);
    });

    // Connect audio graph
    masterGain.connect(compressor);
    compressor.connect(dryGain);
    compressor.connect(reverb);
    reverb.connect(wetGain);
    dryGain.connect(ctx.destination);
    wetGain.connect(ctx.destination);

    // Master envelope
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.01);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 10);

    // Start and stop all oscillators
    oscillators.forEach(osc => {
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 10);
    });
  }, [initAudio]);

  const startContinuousSound = useCallback(() => {
    const ctx = initAudio();
    
    if (oscillatorRef.current) return;
    
    // Create rich, evolving drone for circular motion
    const fundamentalFreq = 174; // F3 - deep, calming frequency
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const osc4 = ctx.createOscillator();
    
    const masterGain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Multiple detuned oscillators for rich, shimmering sound
    osc1.frequency.setValueAtTime(fundamentalFreq, ctx.currentTime);
    osc2.frequency.setValueAtTime(fundamentalFreq * 1.005, ctx.currentTime); // Slight detune
    osc3.frequency.setValueAtTime(fundamentalFreq * 2, ctx.currentTime); // Octave
    osc4.frequency.setValueAtTime(fundamentalFreq * 3, ctx.currentTime); // Fifth
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc3.type = 'sine';
    osc4.type = 'sine';
    
    // LFO for gentle wavering
    lfo.frequency.setValueAtTime(0.3, ctx.currentTime);
    lfo.type = 'sine';
    lfoGain.gain.setValueAtTime(3, ctx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);
    
    // Warm lowpass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);
    
    // Connect oscillators with different gains
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const gain3 = ctx.createGain();
    const gain4 = ctx.createGain();
    
    gain1.gain.value = 0.35;
    gain2.gain.value = 0.3;
    gain3.gain.value = 0.15;
    gain4.gain.value = 0.08;
    
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    osc4.connect(gain4);
    
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    gain3.connect(masterGain);
    gain4.connect(masterGain);
    
    masterGain.connect(filter);
    filter.connect(ctx.destination);
    
    // Smooth fade in
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 1.5);
    
    osc1.start();
    osc2.start();
    osc3.start();
    osc4.start();
    lfo.start();
    
    oscillatorRef.current = osc1;
    gainNodeRef.current = masterGain;
    
    // Store extra oscillators for cleanup
    extraOscillatorsRef.current = [osc2, osc3, osc4, lfo];
  }, [initAudio]);

  const stopContinuousSound = useCallback(() => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
      
      setTimeout(() => {
        oscillatorRef.current?.stop();
        extraOscillatorsRef.current.forEach(osc => osc.stop());
        oscillatorRef.current = null;
        extraOscillatorsRef.current = [];
        gainNodeRef.current = null;
      }, 2000);
    }
  }, []);

  const addRipple = useCallback((x: number, y: number) => {
    const id = rippleIdRef.current++;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 2000);
  }, []);

  const handleBowlClick = useCallback((e: React.MouseEvent) => {
    setIsActive(true);
    setSessionEnded(false);
    playTapSound();
    
    const rect = bowlRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      addRipple(x, y);
    }

    // Reset inactivity timer - extended to 2 minutes
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setSessionEnded(true);
      setIsActive(false);
    }, 120000); // 2 minutes of inactivity

    // Show guidance after some activity
    if (!showGuidance && !guidanceTimerRef.current) {
      guidanceTimerRef.current = setTimeout(() => {
        setShowGuidance(true);
      }, 8000);
    }
  }, [playTapSound, addRipple, showGuidance]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!bowlRef.current) return;
    
    const rect = bowlRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    
    // Always reset the stop timer on any mouse movement while circling
    if (isCircling && circleStopTimerRef.current) {
      clearTimeout(circleStopTimerRef.current);
    }
    
    if (lastAngleRef.current !== null) {
      const diff = angle - lastAngleRef.current;
      
      // Detect circular motion
      if (Math.abs(diff) > 0.03 && Math.abs(diff) < 0.8) {
        circleCountRef.current++;
        
        if (circleCountRef.current > 8 && !isCircling) {
          setIsCircling(true);
          startContinuousSound();
        }
      }
    }
    
    // Set timer to stop sound only if mouse stops moving entirely
    if (isCircling) {
      circleStopTimerRef.current = setTimeout(() => {
        setIsCircling(false);
        stopContinuousSound();
        circleCountRef.current = 0;
      }, 500); // Stop after 500ms of no mouse movement
    }
    
    lastAngleRef.current = angle;
  }, [isCircling, startContinuousSound, stopContinuousSound]);

  const handleMouseLeave = useCallback(() => {
    lastAngleRef.current = null;
    circleCountRef.current = 0;
    if (circleStopTimerRef.current) {
      clearTimeout(circleStopTimerRef.current);
    }
    if (isCircling) {
      setIsCircling(false);
      stopContinuousSound();
    }
  }, [isCircling, stopContinuousSound]);

  const resetSession = useCallback(() => {
    setSessionEnded(false);
    setIsActive(false);
    setShowGuidance(false);
    if (guidanceTimerRef.current) {
      clearTimeout(guidanceTimerRef.current);
      guidanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (guidanceTimerRef.current) clearTimeout(guidanceTimerRef.current);
      if (circleStopTimerRef.current) clearTimeout(circleStopTimerRef.current);
      stopContinuousSound();
    };
  }, [stopContinuousSound]);

  if (sessionEnded) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div 
          className="text-center opacity-0 animate-fade-in-slower"
          style={{ animationFillMode: 'forwards' }}
        >
          <p className="sacred-heading text-3xl md:text-4xl text-foreground mb-12">
            Carry this calm with you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetSession}
              className="px-8 py-4 bg-primary/20 hover:bg-primary/30 text-foreground rounded-full 
                         transition-all duration-500 sacred-text text-lg border border-primary/30"
            >
              Begin Again
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent hover:bg-secondary/50 text-foreground/70 
                         hover:text-foreground rounded-full transition-all duration-500 
                         sacred-text text-lg border border-border/50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="relative z-10 text-center">
        {/* Instructions */}
        <div 
          className="mb-16 opacity-0 animate-fade-in-slow"
          style={{ animationFillMode: 'forwards' }}
        >
          <p className="sacred-text text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            Find a comfortable position.
            <br />
            <span className="text-foreground/70">
              Tap the bowl gently, or move in a slow circle.
            </span>
          </p>
        </div>

        {/* The Bowl */}
        <div 
          ref={bowlRef}
          onClick={handleBowlClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`
            relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96
            rounded-full cursor-pointer
            bg-gradient-to-br from-bronze-light via-bronze to-temple-brown
            bowl-glow
            transition-transform duration-1000
            ${isActive ? 'scale-100' : 'hover:scale-105'}
          `}
          style={{ 
            animation: 'fade-in-slow 2s ease-out forwards, breathing 4s ease-in-out infinite',
            animationDelay: '500ms, 2500ms'
          }}
        >
          {/* Inner bowl details */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gold-shimmer/30 via-transparent to-transparent" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-tl from-temple-brown/50 via-transparent to-transparent" />
          <div className="absolute inset-12 rounded-full border border-gold-shimmer/20" />
          
          {/* Center point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`
              w-4 h-4 rounded-full bg-gold-shimmer/50
              ${isActive ? 'animate-gentle-pulse' : ''}
            `} />
          </div>

          {/* Ripple effects */}
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="absolute w-20 h-20 rounded-full border-2 border-gold-shimmer/40 animate-ripple pointer-events-none"
              style={{
                left: `${ripple.x}%`,
                top: `${ripple.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

          {/* Circling indicator */}
          {isCircling && (
            <div className="absolute inset-0 rounded-full border-4 border-gold-shimmer/30 animate-gentle-pulse" />
          )}
        </div>

        {/* Session Guidance */}
        {showGuidance && (
          <div 
            className="mt-16 opacity-0 animate-fade-in-slower"
            style={{ animationFillMode: 'forwards' }}
          >
            <p className="sacred-text text-muted-foreground italic">
              Stay as long as you feel comfortable.
            </p>
            
            <button
              onClick={() => setSessionEnded(true)}
              className="mt-8 px-6 py-3 bg-transparent hover:bg-secondary/50 text-muted-foreground 
                         hover:text-foreground rounded-full transition-all duration-500 
                         sacred-text text-sm border border-border/30 hover:border-border/50"
            >
              End Session
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MeditationBowl;
