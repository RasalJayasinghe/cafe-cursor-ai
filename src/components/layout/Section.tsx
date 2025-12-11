import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  background?: 'default' | 'surface';
}

export function Section({ id, children, className = '', background = 'default' }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const bgClass = background === 'surface' ? 'bg-surface' : 'bg-background';

  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen snap-section flex items-center ${bgClass} ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="container mx-auto px-6 py-24"
      >
        {children}
      </motion.div>
    </section>
  );
}
