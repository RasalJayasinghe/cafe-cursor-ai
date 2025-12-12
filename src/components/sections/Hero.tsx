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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Based in Colombo, Sri Lanka</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight"
            >
              Welcome to{' '}
              <span className="text-primary">Cafe Cursor</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Small bites of AI for creators & communities — claim meals, generate posts, share projects, and ask questions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('#flows')}
                className="text-base px-8 h-12 rounded-xl"
              >
                Try interactive flows
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#dashboard')}
                className="text-base px-8 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm"
              >
                Open Dashboard
              </Button>
            </motion.div>
          </div>

          {/* Right: Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl">
              <p className="text-sm font-medium text-muted-foreground mb-6">Available Flows</p>
              <div className="grid grid-cols-2 gap-4">
                {flowTiles.map((tile, index) => (
                  <motion.div
                    key={tile.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-surface/80 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:bg-muted transition-colors"
                  >
                    <tile.icon className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">{tile.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
