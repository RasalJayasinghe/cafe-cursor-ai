import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, FileText, Share2, MessageCircle, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import globeColombo from '@/assets/globe-colombo.png';
import { ClaimMealDialog } from '@/components/flows/ClaimMealDialog';

const flowTiles = [
  { icon: Utensils, label: 'Claim Meal', action: 'claim-meal' },
  { icon: FileText, label: 'Post Gen', action: 'post-gen' },
  { icon: Share2, label: 'Share Project', action: 'share-project' },
  { icon: MessageCircle, label: 'Ask Questions', action: 'ask-questions' },
];

export function Hero() {
  const navigate = useNavigate();
  const [claimMealOpen, setClaimMealOpen] = useState(false);

  const handleTileClick = (action: string) => {
    if (action === 'claim-meal') {
      setClaimMealOpen(true);
    } else if (action === 'share-project') {
      navigate('/projects');
    }
  };

  return (
    <>
      <ClaimMealDialog open={claimMealOpen} onOpenChange={setClaimMealOpen} />
      
      {/* Full-screen title section */}
      <section id="hero" className="h-screen snap-section flex items-center justify-center relative overflow-hidden">
        {/* Globe background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
        <img
          src={globeColombo}
          alt="Globe showing Colombo, Sri Lanka"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Sri Lanka beacon */}
        <div className="absolute top-[58%] left-[48%] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.3, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 rounded-full bg-foreground/60 blur-sm"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Based in Colombo, Sri Lanka</span>
          </motion.div>

          {/* Giant Heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light tracking-wide mb-4"
          >
            A place where
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold tracking-tighter text-foreground leading-none"
          >
            Cafe Cursor
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
          >
            Where creators connect, ideas brew, and communities gather around AI
          </motion.p>
        </div>

        {/* Scroll indicator - Gen-Z style - positioned outside text container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-0 right-0 z-20 flex justify-center"
        >
          <div 
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => document.getElementById('flows-preview')?.scrollIntoView({ behavior: 'smooth' })}
          >
          {/* Text with gradient and glow */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-foreground/70 group-hover:text-foreground transition-colors">
              Scroll
            </span>
          </motion.div>
          
          {/* Animated line with dot */}
          <div className="relative h-10 w-[2px] bg-gradient-to-b from-foreground/50 to-transparent mx-auto">
            <motion.div
              animate={{ y: [0, 32, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-foreground shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            />
          </div>
          
          {/* Bouncing chevrons */}
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <ChevronDown className="w-4 h-4 text-foreground/40" />
            <ChevronDown className="w-4 h-4 text-foreground/60 -mt-2.5" />
            <ChevronDown className="w-4 h-4 text-foreground/80 -mt-2.5" />
          </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Flow Cards Section */}
      <section id="flows-preview" className="min-h-screen snap-section flex items-center justify-center relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-medium">
              What We Offer
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Available Flows
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {flowTiles.map((tile, index) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                onClick={() => handleTileClick(tile.action)}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-foreground/20 to-foreground/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 cursor-pointer overflow-hidden group-hover:border-foreground/30 transition-all duration-300">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon container with ring */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-foreground/10 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-foreground/10 group-hover:border-foreground/20 transition-all duration-300">
                      <tile.icon className="w-7 h-7 md:w-8 md:h-8 text-foreground group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </motion.div>
                  
                  {/* Label */}
                  <span className="relative text-base md:text-lg font-semibold text-foreground transition-colors duration-300">
                    {tile.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
