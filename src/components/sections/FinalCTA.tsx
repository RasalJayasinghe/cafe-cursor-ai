import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const scrollToFlows = () => {
    const element = document.querySelector('#flows');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="cta" ref={ref} className="min-h-screen snap-section flex items-center bg-surface">
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to try{' '}
            <span className="text-primary">Cafe Cursor</span>?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Experience quick AI tools designed for creators and communities.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10"
          >
            <Button
              size="lg"
              onClick={scrollToFlows}
              className="text-base px-8 h-14 rounded-xl gap-2"
            >
              Get started now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            No sign-up required. Everything runs in your browser.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
