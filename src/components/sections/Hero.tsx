import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import globeColombo from '@/assets/globe-colombo.png';

export function Hero() {
  return (
    <section id="hero" className="min-h-screen snap-section flex items-center justify-center relative overflow-hidden">
      {/* Globe background - more visible */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <img
          src={globeColombo}
          alt="Globe showing Colombo, Sri Lanka as a beacon"
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay - less obscuring */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full mb-8"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary tracking-wide">Based in Colombo, Sri Lanka</span>
        </motion.div>

        {/* Main headline - much bigger */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground leading-none"
        >
          Welcome to
        </motion.h1>
        
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-primary leading-none mt-2"
        >
          Cafe Cursor
        </motion.h1>

        {/* Subtle tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
        >
          Small bites of AI for creators & communities
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-muted-foreground rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
