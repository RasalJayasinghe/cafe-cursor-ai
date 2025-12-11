import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Utensils, FileText, Share2, MessageCircle } from 'lucide-react';

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
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-6 py-24 pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
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
              Taste quick AI tools — claim meals, generate posts, share projects, and ask questions.
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
                className="text-base px-8 h-12 rounded-xl"
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
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <p className="text-sm font-medium text-muted-foreground mb-6">Available Flows</p>
              <div className="grid grid-cols-2 gap-4">
                {flowTiles.map((tile, index) => (
                  <motion.div
                    key={tile.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-surface rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:bg-muted transition-colors"
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
