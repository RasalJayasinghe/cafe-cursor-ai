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
  const [steamParticles, setSteamParticles] = useState<{ id: number; x: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteamParticles(prev => {
        const newParticle = {
          id: Date.now(),
          x: 35 + Math.random() * 30,
          size: 0.5 + Math.random() * 0.5
        };
        return [...prev.slice(-8), newParticle];
      });
    }, vibe === 'hype' ? 250 : 500);
    return () => clearInterval(interval);
  }, [vibe]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteamParticles(prev => prev.filter(p => Date.now() - p.id < 3500));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const vibeGlow = {
    chill: 'rgba(255,255,255,0.08)',
    hype: 'rgba(255,200,150,0.15)',
    dev: 'rgba(150,255,200,0.1)',
    poetic: 'rgba(200,150,255,0.1)',
  };

  return (
    <div className="relative flex flex-col items-center py-4">
      {/* Ambient glow */}
      <motion.div
        className="absolute w-40 h-40 rounded-full blur-3xl"
        style={{ background: vibeGlow[vibe] }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Steam */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-16 overflow-hidden">
        <AnimatePresence>
          {steamParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 50, x: `${particle.x - 50}%`, scale: particle.size }}
              animate={{ 
                opacity: [0, 0.6, 0], 
                y: -30, 
                x: `${particle.x - 50 + (Math.random() - 0.5) * 30}%`,
                scale: particle.size * 1.5
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="absolute w-3 h-3 rounded-full bg-foreground/20 blur-sm"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Coffee Cup - Realistic takeaway style */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="140" height="180" viewBox="0 0 140 180" fill="none">
          {/* Cup shadow */}
          <ellipse cx="70" cy="172" rx="35" ry="6" fill="currentColor" className="text-foreground/5" />
          
          {/* Cup body - tapered shape with gradient */}
          <defs>
            <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.08" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Cup body */}
          <path
            d="M30 55 L38 165 C38 168 50 172 70 172 C90 172 102 168 102 165 L110 55 Z"
            fill="url(#cupGradient)"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/30"
          />
          
          {/* Horizontal ridges on cup */}
          <path d="M32 80 L108 80" stroke="currentColor" strokeWidth="0.5" className="text-foreground/10" />
          <path d="M34 105 L106 105" stroke="currentColor" strokeWidth="0.5" className="text-foreground/10" />
          <path d="M36 130 L104 130" stroke="currentColor" strokeWidth="0.5" className="text-foreground/10" />
          
          {/* Cup sleeve */}
          <path
            d="M35 85 L37 135 C37 137 50 140 70 140 C90 140 103 137 103 135 L105 85 C105 83 92 80 70 80 C48 80 35 83 35 85 Z"
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground/20"
          />
          
          {/* Lid */}
          <ellipse cx="70" cy="55" rx="42" ry="10" fill="url(#lidGradient)" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30" />
          
          {/* Lid rim */}
          <path
            d="M25 50 C25 42 45 35 70 35 C95 35 115 42 115 50 L115 55 C115 60 95 65 70 65 C45 65 25 60 25 55 Z"
            fill="url(#lidGradient)"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/30"
          />
          
          {/* Lid top detail */}
          <ellipse cx="70" cy="42" rx="25" ry="6" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/20" />
          
          {/* Sip hole */}
          <ellipse cx="70" cy="42" rx="8" ry="3" fill="currentColor" className="text-foreground/15" />
        </svg>

        {/* Cursor Logo Image - positioned on the sleeve */}
        <motion.div
          className="absolute"
          style={{ top: '85px', left: '50%', transform: 'translateX(-50%)' }}
          animate={{ 
            filter: vibe === 'hype' ? ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] : 'brightness(1)'
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img 
            src={cursorLogo} 
            alt="Cursor Logo" 
            className="w-10 h-10 object-contain opacity-70"
            style={{ filter: 'grayscale(100%) brightness(1.5)' }}
          />
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 font-mono text-[10px] text-foreground/30 uppercase tracking-[0.3em]"
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
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-lg"
        >
          {vibeEmoji[vibe]}
        </motion.span>
        <span className="font-mono text-[10px] text-foreground/20">{vibe} mode</span>
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
