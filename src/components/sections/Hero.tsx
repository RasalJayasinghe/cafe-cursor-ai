import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Utensils, FileText, Share2, MessageCircle, MapPin } from 'lucide-react';
import globeColombo from '@/assets/globe-colombo.png';

const flowTiles = [
  { icon: Utensils, label: 'Claim Meal' },
  { icon: FileText, label: 'Post Gen' },
  { icon: Share2, label: 'Share Project' },
  { icon: MessageCircle, label: 'Ask Questions' },
];

export function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen snap-section flex items-center relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-6 py-24 pt-32 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Based in Colombo, Sri Lanka</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight"
          >
            Welcome to{' '}
            <span className="text-primary">Cafe Cursor</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Small bites of AI for creators & communities — claim meals, generate posts, share projects, and ask questions.
          </motion.p>

          {/* Expressive Flow Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 w-full"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8 font-medium"
            >
              Available Flows
            </motion.p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {flowTiles.map((tile, index) => (
                <motion.div
                  key={tile.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.7 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 cursor-pointer overflow-hidden group-hover:border-primary/50 transition-all duration-300">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon container with ring */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                        <tile.icon className="w-7 h-7 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </motion.div>
                    
                    {/* Label */}
                    <span className="relative text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {tile.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
