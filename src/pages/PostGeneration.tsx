import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Copy, Check, Twitter, Linkedin, Sparkles, 
  Shuffle, Users, Heart, PartyPopper, Coffee, Zap, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

type Tone = 'chill' | 'enthusiastic' | 'techie' | 'playful';

const toneConfig: Record<Tone, { label: string; icon: React.ReactNode; color: string }> = {
  chill: { label: 'Chill', icon: <Coffee className="w-3 h-3" />, color: 'text-foreground/70' },
  enthusiastic: { label: 'Enthusiastic', icon: <Zap className="w-3 h-3" />, color: 'text-foreground/70' },
  techie: { label: 'Techie', icon: <MessageSquare className="w-3 h-3" />, color: 'text-foreground/70' },
  playful: { label: 'Playful', icon: <PartyPopper className="w-3 h-3" />, color: 'text-foreground/70' },
};

const quickHelpers = [
  { label: 'Share attendance', icon: <Users className="w-3 h-3" /> },
  { label: 'Share experience', icon: <Heart className="w-3 h-3" /> },
  { label: 'Appreciate community', icon: <PartyPopper className="w-3 h-3" /> },
];

const suggestedCaptions = [
  "Just experienced the Cafe Cursor community event and it was absolutely incredible! The energy, the people, the ideas flowing — this is what tech community should feel like. Can't wait for the next one! #CafeCursor #Colombo #TechCommunity",
  "Grateful to be part of this amazing community at Cafe Cursor. The connections made today are invaluable. Here's to building the future together! 🚀 #Innovation #Community #SriLanka",
  "Shoutout to everyone who made the Cafe Cursor meetup possible! From the organizers to every attendee who brought their unique perspective. This is just the beginning! #CafeCursor #TechSriLanka",
];

const toneTemplates: Record<Tone, string> = {
  chill: "Had a chill time at Cafe Cursor today. Good vibes, great people, interesting conversations. That's what community is all about. #CafeCursor #Colombo #TechVibes",
  enthusiastic: "WOW! Just wrapped up the Cafe Cursor meetup and I'm BUZZING! The energy was absolutely electric! Amazing community, incredible conversations, and so many brilliant minds in one place! Can't contain my excitement! 🔥 #CafeCursor #Colombo #TechCommunity",
  techie: "Attended Cafe Cursor meetup — solid event. Discussed AI implementations, shared code patterns, and networked with fellow developers. ROI: high. Would recommend. #CafeCursor #DevCommunity #TechSriLanka",
  playful: "Plot twist: went to Cafe Cursor expecting coffee, left with a whole community of awesome humans! 10/10 would recommend, side effects include: inspiration overload and new friends 😄 #CafeCursor #Colombo #TechFam",
};

const MAX_CHARS = 280;

export default function PostGeneration() {
  const [caption, setCaption] = useState(toneTemplates.chill);
  const [tone, setTone] = useState<Tone>('chill');
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const charCount = caption.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleToneChange = (newTone: Tone) => {
    setTone(newTone);
    setCaption(toneTemplates[newTone]);
  };

  const handleShuffle = () => {
    const tones = Object.keys(toneTemplates) as Tone[];
    const randomTone = tones[Math.floor(Math.random() * tones.length)];
    handleToneChange(randomTone);
    toast.success('Shuffled to a new preset!');
  };

  const handleQuickHelper = (index: number) => {
    const helpers = [
      "Excited to announce I attended the Cafe Cursor community event! Great to be part of this growing tech community in Colombo. #CafeCursor #TechCommunity",
      "What an experience at Cafe Cursor! From insightful discussions to meaningful connections, this event had it all. Highly recommend checking out the next one! #CafeCursor #Colombo",
      "Huge thanks to the Cafe Cursor team and all the partners who made this event possible. Your dedication to building community is inspiring! #CafeCursor #Community #Gratitude",
    ];
    setCaption(helpers[index]);
    toast.success(`Applied "${quickHelpers[index].label}" template`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://cafecursor.com')}&summary=${encodeURIComponent(caption)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSuggestedCaption = (text: string) => {
    setCaption(text);
    toast.success('Caption applied!');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-border/30">
        <Link 
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-mono">Back</span>
        </Link>
        <span className="text-sm font-mono text-muted-foreground">Post Generator</span>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* 3D Flip Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-center"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            className="relative w-64 h-80 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card Front */}
            <div 
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent" />
              <div className="absolute inset-0 border border-foreground/20 rounded-2xl" />
              <div className="absolute inset-[1px] rounded-2xl bg-card/80 backdrop-blur-xl" />
              
              {/* Card content */}
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl font-bold tracking-tighter mb-2"
                >
                  Cafe
                </motion.div>
                <div className="px-3 py-1 bg-foreground text-background text-xs font-bold tracking-wider rounded">
                  CURSOR
                </div>
                <div className="mt-6 flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-foreground/40 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Glowing border animation */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Card Back */}
            <div 
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent" />
              <div className="absolute inset-0 border border-foreground/20 rounded-2xl" />
              <div className="absolute inset-[1px] rounded-2xl bg-card/80 backdrop-blur-xl" />
              
              {/* Back content */}
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="text-6xl mb-4">☕</div>
                <p className="text-sm text-muted-foreground font-mono">
                  Where creators<br />connect & brew ideas
                </p>
                <div className="mt-4 text-xs text-foreground/40">Colombo, Sri Lanka</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mb-8 font-mono">
          Tip: Click anywhere on the card to flip.
        </p>

        {/* Caption Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Glowing border container */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-foreground/20 via-foreground/10 to-foreground/20 blur-sm" />
          
          <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 overflow-hidden">
            {/* Animated border line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 font-mono">
              Create and share the cafe cursor vibe you just felt
            </h2>

            {/* Textarea */}
            <div className="relative mb-4">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full h-32 bg-background/50 border border-border/50 rounded-xl p-4 text-foreground resize-none focus:outline-none focus:border-foreground/30 transition-colors font-sans text-sm leading-relaxed"
                placeholder="Write your caption here..."
                aria-label="Caption text"
              />
              
              {/* Tone buttons inside textarea area */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                {(Object.keys(toneConfig) as Tone[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleToneChange(t)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      tone === t 
                        ? 'bg-foreground text-background' 
                        : 'bg-foreground/10 text-foreground/60 hover:bg-foreground/20 hover:text-foreground'
                    }`}
                    aria-pressed={tone === t}
                  >
                    {toneConfig[t].icon}
                    {toneConfig[t].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy button and character counter */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 rounded-lg transition-all font-mono text-sm"
                aria-label="Copy caption"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
              <span className={`font-mono text-sm ${isOverLimit ? 'text-red-400' : 'text-muted-foreground'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => toast.success('Caption generated!')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 rounded-xl transition-all font-mono text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </button>
              <button
                onClick={handleShuffle}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 rounded-xl transition-all font-mono text-sm"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle presets
              </button>
            </div>

            {/* Quick Helpers */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-mono">
                Quick helpers
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickHelpers.map((helper, index) => (
                  <button
                    key={helper.label}
                    onClick={() => handleQuickHelper(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 hover:border-foreground/20 rounded-full transition-all font-mono text-xs"
                  >
                    {helper.icon}
                    {helper.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Share */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-mono">
                Share on
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleShareX}
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all font-mono text-sm font-medium"
                  aria-label="Share to X (Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                  Share to X
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="flex items-center gap-2 px-6 py-3 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 rounded-xl transition-all font-mono text-sm"
                  aria-label="Share to LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                  Share to LinkedIn
                </button>
              </div>
            </div>

            {/* Suggested Captions */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 font-mono">
                Suggested captions
              </h3>
              <div className="space-y-3">
                {suggestedCaptions.map((text, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestedCaption(text)}
                    className="w-full text-left p-4 bg-background/30 hover:bg-background/50 border border-border/30 hover:border-foreground/20 rounded-xl transition-all group"
                    whileHover={{ x: 4 }}
                  >
                    <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors line-clamp-2">
                      {text}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Animated border line bottom */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent"
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-muted-foreground font-mono">
            Powered by <span className="text-foreground">Cafe Cursor</span> • Colombo, Sri Lanka
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
