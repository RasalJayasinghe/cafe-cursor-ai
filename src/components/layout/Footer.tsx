import { motion } from 'framer-motion';

// Deterministic binary patterns (avoids hydration mismatch)
const binaryPatterns = [
  '10110010110100110101',
  '01101001011010110010',
  '11001010011011001101',
  '00110110100101100101',
  '10101100110010110011',
  '01010011001101001010',
  '11010100101011010110',
  '00101011010100101001',
];

export function Footer() {
  return (
    <footer className="relative py-8 border-t border-border/30 overflow-hidden bg-background">
      {/* Binary stream background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-10">
        {binaryPatterns.map((binary, i) => (
          <motion.div
            key={i}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.8,
            }}
            className="absolute whitespace-nowrap text-xs text-foreground/50"
            style={{ top: `${10 + i * 10}%` }}
          >
            {binary.repeat(10)}
          </motion.div>
        ))}
      </div>

      {/* Gradient overlays to fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground/40">&gt;</span>
              <span className="text-foreground/70">2026</span>
              <span className="text-foreground font-medium">Cafe Cursor</span>
              <span className="text-foreground/50">Colombo</span>
            </div>
            {/* Blinking cursor */}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-4 bg-foreground/60"
            />
          </motion.div>

          {/* Center decorative element */}
          <div className="hidden md:flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="w-1.5 h-1.5 rounded-full bg-foreground/50"
              />
            ))}
          </div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-sm flex items-center gap-2"
          >
            <span className="text-foreground/40">hosted_by:</span>
            <a 
              href="https://www.youtube.com/@theTechTalk360" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#4AAED9] hover:text-[#5DC1EC] transition-colors font-medium"
            >
              TechTalk360
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
