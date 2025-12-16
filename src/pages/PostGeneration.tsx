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

// Realistic Coffee Cup Component with animated coffee
function CoffeeCupLogo({ vibe }: { vibe: Vibe }) {
  const [cursorVisible, setCursorVisible] = useState(true);

  // Vibe-specific configurations
  const vibeConfig = {
    chill: {
      primary: '#6B9B8A',
      secondary: '#4A7A6A', 
      glow: 'rgba(107, 155, 138, 0.4)',
      coffeeColor: '#3D2314',
      coffeeHighlight: '#5C3A2A',
    },
    hype: {
      primary: '#FF6B35',
      secondary: '#FF4500',
      glow: 'rgba(255, 107, 53, 0.5)',
      coffeeColor: '#2A1810',
      coffeeHighlight: '#4A2820',
    },
    dev: {
      primary: '#00FF88',
      secondary: '#00CC66',
      glow: 'rgba(0, 255, 136, 0.4)',
      coffeeColor: '#1A2A1A',
      coffeeHighlight: '#2A4A2A',
    },
    poetic: {
      primary: '#C9A0DC',
      secondary: '#9B59B6',
      glow: 'rgba(201, 160, 220, 0.4)',
      coffeeColor: '#2A1A2A',
      coffeeHighlight: '#4A2A4A',
    },
  };

  const config = vibeConfig[vibe];

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center py-6">
      {/* Ambient glow */}
      <motion.div
        key={vibe}
        className="absolute w-48 h-48 rounded-full blur-3xl"
        style={{ background: config.glow }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [1, 1.15, 1], 
          opacity: vibe === 'hype' ? [0.5, 0.8, 0.5] : [0.25, 0.4, 0.25] 
        }}
        transition={{ duration: vibe === 'hype' ? 1.5 : 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Steam particles */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-16 overflow-hidden z-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-8 rounded-full opacity-30"
            style={{ 
              background: `linear-gradient(to top, ${config.primary}40, transparent)`,
              left: `${30 + i * 20}%`,
            }}
            animate={{
              y: [-10, -50],
              x: [0, (i - 1) * 8, 0],
              opacity: [0, 0.4, 0],
              scaleY: [0.5, 1.2, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Coffee Cup SVG */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4 }}
      >
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
          <defs>
            {/* Cup body gradient - paper texture */}
            <linearGradient id="cupBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5F0E8" />
              <stop offset="15%" stopColor="#FFFDF8" />
              <stop offset="85%" stopColor="#FFFDF8" />
              <stop offset="100%" stopColor="#E8E0D5" />
            </linearGradient>
            
            {/* Lid gradient */}
            <linearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A4540" />
              <stop offset="50%" stopColor="#3A3530" />
              <stop offset="100%" stopColor="#2A2520" />
            </linearGradient>
            
            {/* Coffee liquid gradient */}
            <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={config.coffeeHighlight} />
              <stop offset="100%" stopColor={config.coffeeColor} />
            </linearGradient>

            {/* Sleeve gradient with vibe color */}
            <linearGradient id="sleeveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={config.primary} stopOpacity="0.9" />
              <stop offset="50%" stopColor={config.secondary} stopOpacity="0.95" />
              <stop offset="100%" stopColor={config.primary} stopOpacity="0.9" />
            </linearGradient>

            {/* Shadow */}
            <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>

            {/* Clip path for coffee */}
            <clipPath id="cupClip">
              <path d="M30 45 L35 140 C35 145 45 150 60 150 C75 150 85 145 85 140 L90 45 Z" />
            </clipPath>
          </defs>

          {/* Shadow */}
          <ellipse cx="60" cy="155" rx="30" ry="4" fill="url(#shadow)" />

          {/* Cup body */}
          <path
            d="M28 40 L35 142 C35 148 45 152 60 152 C75 152 85 148 85 142 L92 40 Z"
            fill="url(#cupBody)"
            stroke="#D5CCC0"
            strokeWidth="1"
          />

          {/* Coffee liquid with wave animation */}
          <g clipPath="url(#cupClip)">
            <motion.ellipse
              cx="60"
              cy="55"
              rx="28"
              ry="6"
              fill="url(#coffeeGradient)"
              animate={{
                cy: [55, 53, 55, 57, 55],
                rx: [28, 29, 28, 27, 28],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Coffee surface highlight */}
            <motion.ellipse
              cx="55"
              cy="53"
              rx="8"
              ry="2"
              fill={config.coffeeHighlight}
              opacity="0.4"
              animate={{
                cx: [55, 65, 55],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </g>

          {/* Cup rim */}
          <ellipse cx="60" cy="40" rx="34" ry="8" fill="#FFFDF8" stroke="#D5CCC0" strokeWidth="1" />

          {/* Lid */}
          <ellipse cx="60" cy="38" rx="32" ry="7" fill="url(#lidGradient)" />
          <path
            d="M26 32 C26 24 40 18 60 18 C80 18 94 24 94 32 L94 38 C94 44 80 48 60 48 C40 48 26 44 26 38 Z"
            fill="url(#lidGradient)"
          />
          
          {/* Lid top detail */}
          <ellipse cx="60" cy="25" rx="22" ry="5" fill="#3A3530" />
          
          {/* Sip hole */}
          <ellipse cx="60" cy="25" rx="6" ry="2.5" fill="#1A1510" />
          
          {/* Lid ridge */}
          <ellipse cx="60" cy="35" rx="28" ry="4" fill="none" stroke="#5A5550" strokeWidth="0.5" />

          {/* Sleeve with vibe color */}
          <path
            d="M32 75 L34 125 C34 128 45 130 60 130 C75 130 86 128 86 125 L88 75 C88 72 75 70 60 70 C45 70 32 72 32 75 Z"
            fill="url(#sleeveGradient)"
            opacity="0.95"
          />
          
          {/* Sleeve texture lines */}
          <g stroke={config.primary} strokeWidth="0.3" strokeOpacity="0.3">
            <path d="M35 80 L35 120" />
            <path d="M45 78 L44 122" />
            <path d="M55 77 L54 123" />
            <path d="M65 77 L66 123" />
            <path d="M75 78 L76 122" />
            <path d="M85 80 L85 120" />
          </g>

          {/* Cursor Logo on sleeve */}
          <motion.g
            animate={{
              filter: vibe === 'hype' 
                ? ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
                : 'brightness(1)',
            }}
            transition={{ duration: vibe === 'hype' ? 0.8 : 2, repeat: Infinity }}
          >
            <rect
              x="42"
              y="88"
              width="36"
              height="36"
              rx="8"
              fill="rgba(0,0,0,0.3)"
            />
            <image
              href={cursorLogo}
              x="44"
              y="90"
              width="32"
              height="32"
              preserveAspectRatio="xMidYMid meet"
              style={{ filter: 'brightness(1.8) contrast(1.1)' }}
            />
          </motion.g>

          {/* Cup subtle shine */}
          <path
            d="M35 50 L37 135"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.15"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Blinking cursor text */}
      <motion.div 
        className="mt-4 flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: config.primary }}>
          cafe cursor
        </span>
        <motion.span 
          className="font-mono text-sm"
          style={{ color: config.primary }}
          animate={{ opacity: cursorVisible ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        >
          ▋
        </motion.span>
      </motion.div>

      {/* Vibe emoji */}
      <motion.span
        key={vibe}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="mt-2 text-lg"
      >
        {vibeEmoji[vibe]}
      </motion.span>
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

  // Screen-wide vibe colors
  const screenVibeConfig = {
    chill: { 
      accent: '#6B9B8A', 
      glow: 'rgba(107, 155, 138, 0.08)',
      border: 'rgba(107, 155, 138, 0.2)'
    },
    hype: { 
      accent: '#FF6B35', 
      glow: 'rgba(255, 107, 53, 0.1)',
      border: 'rgba(255, 107, 53, 0.25)'
    },
    dev: { 
      accent: '#00FF88', 
      glow: 'rgba(0, 255, 136, 0.08)',
      border: 'rgba(0, 255, 136, 0.2)'
    },
    poetic: { 
      accent: '#C9A0DC', 
      glow: 'rgba(201, 160, 220, 0.08)',
      border: 'rgba(201, 160, 220, 0.2)'
    },
  };

  const currentScreenVibe = screenVibeConfig[vibe];

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
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Vibe ambient glow - corners */}
      <motion.div
        key={vibe + '-glow'}
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `
            radial-gradient(ellipse at top left, ${currentScreenVibe.glow} 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, ${currentScreenVibe.glow} 0%, transparent 50%)
          `,
        }}
      />

      {/* Scanlines overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Header */}
      <motion.header 
        className="relative z-10 px-3 py-3 sm:p-4 md:p-6 flex items-center justify-between border-b transition-colors duration-500"
        style={{ borderColor: currentScreenVibe.border }}
      >
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono hidden sm:inline">~/cafe-cursor</span>
        </Link>
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-muted-foreground">
          <Terminal className="w-3 h-3" />
          <span className="hidden sm:inline">post-gen v1.0</span>
          <span className="sm:hidden">v1.0</span>
        </div>
      </motion.header>

      <main className="relative z-10 min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-73px)] flex flex-col lg:flex-row">
        {/* Left Panel - Editor */}
        <div className="flex-1 p-3 sm:p-4 md:p-8 lg:p-12 flex flex-col">
          {/* Title area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 sm:mb-8"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/60" />
              <span className="text-[10px] sm:text-xs font-mono text-foreground/40 uppercase tracking-widest">Brew your post</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              What's your <span className="text-foreground/60">vibe</span>?
            </h1>
          </motion.div>

          {/* Vibe selector - pill buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-8"
          >
            {(Object.keys(vibeTemplates) as Vibe[]).map((v) => (
              <button
                key={v}
                onClick={() => handleVibeChange(v)}
                className={`relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-xs sm:text-sm transition-all duration-300 ${
                  vibe === v
                    ? 'bg-foreground text-background'
                    : 'bg-transparent border border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                <span className="mr-1 sm:mr-2">{vibeEmoji[v]}</span>
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
            <div className="relative flex-1 min-h-[120px] sm:min-h-[200px]">
              <textarea
                value={caption}
                onChange={(e) => {
                  setCaption(e.target.value);
                  setIsTyping(false);
                }}
                className="w-full h-full bg-transparent border-0 text-foreground resize-none focus:outline-none text-base sm:text-lg md:text-xl leading-relaxed placeholder:text-foreground/20"
                placeholder="Start typing or select a vibe..."
                aria-label="Caption"
              />
              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/20 mt-3 sm:mt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleShuffle}
                  className="p-1.5 sm:p-2 text-foreground/40 hover:text-foreground transition-colors"
                  aria-label="Shuffle"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors text-xs sm:text-sm font-mono"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'copied!' : 'copy'}
                </button>
              </div>
              <span className={`font-mono text-[10px] sm:text-xs ${isOverLimit ? 'text-red-400' : 'text-foreground/30'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          className="hidden lg:block w-px"
          style={{ 
            background: `linear-gradient(to bottom, transparent, ${currentScreenVibe.border}, transparent)` 
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Horizontal divider for mobile/tablet */}
        <div className="lg:hidden h-px mx-3 sm:mx-4" style={{ background: currentScreenVibe.border }} />

        {/* Right Panel - Preview & Actions */}
        <div className="lg:w-[420px] p-3 sm:p-4 md:p-8 lg:p-12 bg-foreground/[0.02] flex flex-col">
          {/* Coffee Cup Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 sm:mb-8 flex justify-center scale-75 sm:scale-100"
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
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3" style={{ color: currentScreenVibe.accent, opacity: 0.6 }} />
              <span className="text-[10px] sm:text-xs font-mono text-foreground/40 uppercase tracking-widest">Preview</span>
            </div>

            {/* Terminal-style preview */}
            <motion.div 
              className="relative bg-background rounded-lg sm:rounded-xl overflow-hidden transition-colors duration-500"
              style={{ borderWidth: 1, borderStyle: 'solid', borderColor: currentScreenVibe.border }}
            >
              {/* Terminal header */}
              <div 
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-foreground/[0.02] transition-colors duration-500"
                style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: currentScreenVibe.border }}
              >
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full" style={{ backgroundColor: currentScreenVibe.accent, opacity: 0.4 }} />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-foreground/20" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-foreground/20" />
                <span className="ml-1 sm:ml-2 text-[8px] sm:text-[10px] font-mono text-foreground/30">your-post.txt</span>
              </div>
              
              {/* Content */}
              <div className="p-3 sm:p-4 min-h-[120px] sm:min-h-[200px] font-mono text-xs sm:text-sm leading-relaxed">
                <span className="text-foreground/80">{displayedText}</span>
                <span 
                  className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                  style={{ color: currentScreenVibe.accent }}
                >▋</span>
              </div>

              {/* Footer */}
              <div 
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-foreground/[0.02] flex items-center justify-between transition-colors duration-500"
                style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: currentScreenVibe.border }}
              >
                <span className="text-[8px] sm:text-[10px] font-mono" style={{ color: currentScreenVibe.accent, opacity: 0.6 }}>
                  {vibeEmoji[vibe]} {vibe}
                </span>
                <span className="text-[8px] sm:text-[10px] font-mono text-foreground/30">
                  {charCount} chars
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Share buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 sm:mt-8 space-y-2 sm:space-y-3"
          >
            <p className="text-[10px] sm:text-xs font-mono text-foreground/40 uppercase tracking-widest mb-2 sm:mb-4">Share</p>
            
            <div className="flex gap-2 sm:flex-col sm:gap-3">
              <button
                onClick={handleShareX}
                className="flex-1 sm:flex-none w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-foreground text-background rounded-lg sm:rounded-xl font-mono text-xs sm:text-sm hover:bg-foreground/90 transition-colors group"
              >
                <Twitter className="w-4 h-4" />
                <span className="hidden sm:inline">Post to X</span>
                <span className="sm:hidden">X</span>
                <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="flex-1 sm:flex-none w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-transparent border border-foreground/20 text-foreground rounded-lg sm:rounded-xl font-mono text-xs sm:text-sm hover:bg-foreground/5 hover:border-foreground/30 transition-all"
              >
                <Linkedin className="w-4 h-4" />
                <span className="hidden sm:inline">Share on LinkedIn</span>
                <span className="sm:hidden">LinkedIn</span>
              </button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 sm:mt-8 pt-3 sm:pt-4 border-t border-foreground/10"
          >
            <p className="text-[8px] sm:text-[10px] font-mono text-foreground/20 text-center">
              brewed with ☕ at cafe cursor, colombo
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
