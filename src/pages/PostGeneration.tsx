import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Copy, Check, Twitter, Linkedin, 
  Terminal, Zap, Coffee, Sparkles, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import cursorLogo from '@/assets/cursor-logo.png';

type Vibe = 'chill' | 'hype' | 'dev' | 'poetic';

const vibeEmoji: Record<Vibe, string> = {
  chill: '☕',
  hype: '🔥',
  dev: '⚡',
  poetic: '✨',
};

const vibeTemplates: Record<Vibe, string[]> = {
  chill: [
    "Spent the afternoon at Cafe Cursor. Good coffee, better conversations. Sometimes the best ideas come from just being present.",
    "There's something about this community that just clicks. No pressure, no pretense — just people building cool things together.",
    "Cafe Cursor vibes: ambient noise, warm drinks, and the quiet hum of keyboards. This is my happy place.",
  ],
  hype: [
    "JUST LEFT CAFE CURSOR AND MY MIND IS BLOWN! The energy in that room was INSANE! If you're not part of this community yet, you're missing out BIG TIME! 🚀🔥",
    "OK BUT CAN WE TALK ABOUT HOW AMAZING THE CAFE CURSOR COMMUNITY IS?! Met so many brilliant people today! THE FUTURE IS BEING BUILT RIGHT HERE IN COLOMBO!",
    "Cafe Cursor isn't just a meetup — it's a MOVEMENT! Every single time I leave more inspired than when I arrived! LET'S GOOO!",
  ],
  dev: [
    "// attended: CafeCursor\n// location: Colombo\n// status: inspired\n// next_action: ship more code\n\nSolid event. Great discussions on system design and AI tooling. 10/10 would compile again.",
    "Bug fixed: loneliness. Solution: Cafe Cursor community. Deployed to production: my motivation. No regressions detected.",
    "git commit -m \"Attended Cafe Cursor, merged new ideas into main branch\"\n\nPR approved by the community. Ready for deployment.",
  ],
  poetic: [
    "In the space between keystrokes, ideas bloom like steam from a fresh cup. Cafe Cursor — where code meets soul.",
    "We gather not just to build, but to become. Each conversation a thread in the tapestry of tomorrow. Colombo's heartbeat, digital and warm.",
    "Cursor blinking, coffee cooling, minds expanding. In this sanctuary of silicon dreams, we find our tribe.",
  ],
};

const MAX_CHARS = 280;

// Premium Coffee Cup with Cursor Logo Component
function CoffeeCupLogo({ vibe }: { vibe: Vibe }) {
  const [steamParticles, setSteamParticles] = useState<{ id: number; x: number; delay: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteamParticles(prev => {
        const newParticle = {
          id: Date.now(),
          x: 40 + Math.random() * 20,
          delay: Math.random() * 0.3
        };
        return [...prev.slice(-6), newParticle];
      });
    }, vibe === 'hype' ? 200 : 400);
    return () => clearInterval(interval);
  }, [vibe]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteamParticles(prev => prev.filter(p => Date.now() - p.id < 2500));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const vibeColors = {
    chill: { glow: 'rgba(180,140,100,0.15)', accent: '#D4A574' },
    hype: { glow: 'rgba(255,150,50,0.2)', accent: '#FF9B50' },
    dev: { glow: 'rgba(100,200,150,0.15)', accent: '#7DD3A8' },
    poetic: { glow: 'rgba(180,150,220,0.15)', accent: '#C9B8E8' },
  };

  return (
    <div className="relative flex flex-col items-center py-6">
      {/* Ambient glow */}
      <motion.div
        className="absolute w-56 h-56 rounded-full blur-3xl -top-8"
        style={{ background: vibeColors[vibe].glow }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Steam particles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-20 overflow-hidden z-20">
        <AnimatePresence>
          {steamParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 60, x: `${particle.x - 50}%`, scale: 0.3 }}
              animate={{ 
                opacity: [0, 0.5, 0], 
                y: -10,
                x: `${particle.x - 50 + (Math.random() - 0.5) * 25}%`,
                scale: 0.8
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, delay: particle.delay, ease: 'easeOut' }}
              className="absolute w-4 h-4 rounded-full bg-foreground/15 blur-md"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Coffee Cup SVG */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, y: -2 }}
        transition={{ duration: 0.4 }}
      >
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
          <defs>
            {/* Kraft paper gradient */}
            <linearGradient id="kraftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C4A77D" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#D4B896" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#D4B896" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#C4A77D" stopOpacity="0.9" />
            </linearGradient>
            
            {/* Lid gradient - dark plastic */}
            <linearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A4A4A" />
              <stop offset="50%" stopColor="#2A2A2A" />
              <stop offset="100%" stopColor="#1A1A1A" />
            </linearGradient>
            
            {/* Cup bottom rim */}
            <linearGradient id="rimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E8E8E8" />
              <stop offset="100%" stopColor="#CCCCCC" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="60" cy="155" rx="30" ry="4" fill="black" fillOpacity="0.15" />

          {/* Cup body - kraft paper */}
          <path
            d="M25 45 L32 140 C32 145 42 148 60 148 C78 148 88 145 88 140 L95 45 Z"
            fill="url(#kraftGradient)"
          />
          
          {/* Cup texture lines */}
          <path d="M27 60 L93 60" stroke="#B8976A" strokeWidth="0.5" strokeOpacity="0.3" />
          <path d="M28 80 L92 80" stroke="#B8976A" strokeWidth="0.5" strokeOpacity="0.3" />
          <path d="M30 100 L90 100" stroke="#B8976A" strokeWidth="0.5" strokeOpacity="0.3" />
          <path d="M31 120 L89 120" stroke="#B8976A" strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Bottom white rim */}
          <path
            d="M32 140 C32 145 42 148 60 148 C78 148 88 145 88 140 L88 145 C88 150 78 153 60 153 C42 153 32 150 32 145 Z"
            fill="url(#rimGradient)"
          />

          {/* Lid base */}
          <ellipse cx="60" cy="45" rx="37" ry="8" fill="url(#lidGradient)" />
          
          {/* Lid body */}
          <path
            d="M20 38 C20 30 35 24 60 24 C85 24 100 30 100 38 L100 45 C100 50 85 55 60 55 C35 55 20 50 20 45 Z"
            fill="url(#lidGradient)"
          />
          
          {/* Lid rim highlight */}
          <ellipse cx="60" cy="38" rx="35" ry="7" fill="none" stroke="#5A5A5A" strokeWidth="1" />
          
          {/* Sip opening */}
          <path
            d="M50 32 Q55 28 70 32"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Lid button/tab */}
          <rect x="55" y="26" width="10" height="4" rx="2" fill="#3A3A3A" />
        </svg>

        {/* Cursor Logo - positioned on cup */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }}
          animate={{ 
            scale: vibe === 'hype' ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <img 
            src={cursorLogo} 
            alt="Cursor Logo" 
            className="w-10 h-10 object-contain drop-shadow-lg"
            style={{ filter: 'brightness(0.2) contrast(1.2)' }}
          />
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-5 font-mono text-[10px] text-foreground/40 uppercase tracking-[0.25em]"
      >
        cafe cursor
      </motion.p>

      {/* Vibe indicator */}
      <motion.div
        className="mt-2 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.span
          key={vibe}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-base"
        >
          {vibeEmoji[vibe]}
        </motion.span>
        <span className="font-mono text-[10px] text-foreground/25">{vibe} mode</span>
      </motion.div>
    </div>
  );
}

export default function PostGeneration() {
  const [vibe, setVibe] = useState<Vibe>('chill');
  const [caption, setCaption] = useState(vibeTemplates.chill[0]);
  const [copied, setCopied] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState(caption);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect when caption changes
  useEffect(() => {
    if (isTyping) {
      let i = 0;
      setDisplayedText('');
      const interval = setInterval(() => {
        if (i < caption.length) {
          setDisplayedText(caption.slice(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(caption);
    }
  }, [caption, isTyping]);

  const charCount = caption.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleVibeChange = (newVibe: Vibe) => {
    setVibe(newVibe);
    const templates = vibeTemplates[newVibe];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setCaption(randomTemplate);
    setIsTyping(true);
  };

  const handleShuffle = () => {
    const templates = vibeTemplates[vibe];
    const currentIndex = templates.indexOf(caption);
    const nextIndex = (currentIndex + 1) % templates.length;
    setCaption(templates[nextIndex]);
    setIsTyping(true);
    toast.success('Shuffled!');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = caption + '\n\n#CafeCursor #Colombo #TechCommunity';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://cafecursor.com')}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Scanlines overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6 flex items-center justify-between border-b border-border/20">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono hidden sm:inline">~/cafe-cursor</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Terminal className="w-3 h-3" />
          <span>post-gen v1.0</span>
        </div>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-73px)] flex flex-col lg:flex-row">
        {/* Left Panel - Editor */}
        <div className="flex-1 p-4 md:p-8 lg:p-12 flex flex-col">
          {/* Title area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Coffee className="w-5 h-5 text-foreground/60" />
              <span className="text-xs font-mono text-foreground/40 uppercase tracking-widest">Brew your post</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              What's your <span className="text-foreground/60">vibe</span>?
            </h1>
          </motion.div>

          {/* Vibe selector - pill buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {(Object.keys(vibeTemplates) as Vibe[]).map((v) => (
              <button
                key={v}
                onClick={() => handleVibeChange(v)}
                className={`relative px-5 py-2.5 rounded-full font-mono text-sm transition-all duration-300 ${
                  vibe === v
                    ? 'bg-foreground text-background'
                    : 'bg-transparent border border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                <span className="mr-2">{vibeEmoji[v]}</span>
                {v}
                {vibe === v && (
                  <motion.div
                    layoutId="vibeIndicator"
                    className="absolute inset-0 bg-foreground rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Caption textarea */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <div className="relative flex-1 min-h-[200px]">
              <textarea
                value={caption}
                onChange={(e) => {
                  setCaption(e.target.value);
                  setIsTyping(false);
                }}
                className="w-full h-full bg-transparent border-0 text-foreground resize-none focus:outline-none text-lg md:text-xl leading-relaxed placeholder:text-foreground/20"
                placeholder="Start typing or select a vibe..."
                aria-label="Caption"
              />
              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between pt-4 border-t border-border/20 mt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShuffle}
                  className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                  aria-label="Shuffle"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors text-sm font-mono"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'copied!' : 'copy'}
                </button>
              </div>
              <span className={`font-mono text-xs ${isOverLimit ? 'text-red-400' : 'text-foreground/30'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />

        {/* Right Panel - Preview & Actions */}
        <div className="lg:w-[420px] p-4 md:p-8 lg:p-12 bg-foreground/[0.02] flex flex-col">
          {/* ASCII Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <CoffeeCupLogo vibe={vibe} />
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-3 h-3 text-foreground/40" />
              <span className="text-xs font-mono text-foreground/40 uppercase tracking-widest">Preview</span>
            </div>

            {/* Terminal-style preview */}
            <div className="relative bg-background border border-foreground/10 rounded-xl overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 bg-foreground/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                <span className="ml-2 text-[10px] font-mono text-foreground/30">your-post.txt</span>
              </div>
              
              {/* Content */}
              <div className="p-4 min-h-[200px] font-mono text-sm leading-relaxed">
                <span className="text-foreground/80">{displayedText}</span>
                <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} text-foreground transition-opacity`}>▋</span>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-foreground/10 bg-foreground/[0.02] flex items-center justify-between">
                <span className="text-[10px] font-mono text-foreground/30">
                  {vibeEmoji[vibe]} {vibe} mode
                </span>
                <span className="text-[10px] font-mono text-foreground/30">
                  {charCount} chars
                </span>
              </div>
            </div>
          </motion.div>

          {/* Share buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-3"
          >
            <p className="text-xs font-mono text-foreground/40 uppercase tracking-widest mb-4">Share</p>
            
            <button
              onClick={handleShareX}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-foreground text-background rounded-xl font-mono text-sm hover:bg-foreground/90 transition-colors group"
            >
              <Twitter className="w-4 h-4" />
              Post to X
              <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={handleShareLinkedIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-foreground/20 text-foreground rounded-xl font-mono text-sm hover:bg-foreground/5 hover:border-foreground/30 transition-all"
            >
              <Linkedin className="w-4 h-4" />
              Share on LinkedIn
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-4 border-t border-foreground/10"
          >
            <p className="text-[10px] font-mono text-foreground/20 text-center">
              brewed with ☕ at cafe cursor, colombo
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
