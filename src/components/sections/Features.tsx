import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Layers, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Fast Feedback',
    description: 'All processing happens locally in your browser. No server delays, instant results.',
  },
  {
    icon: Layers,
    title: 'Modular Components',
    description: 'Mix and match flows as needed. Each tool works independently and together.',
  },
  {
    icon: Sparkles,
    title: 'Smooth Animations',
    description: 'Delightful micro-interactions that make every action feel responsive and polished.',
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" ref={ref} className="min-h-screen snap-section flex items-center bg-surface">
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Built for speed & simplicity
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything runs client-side. Your data stays on your device.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Privacy note: CSV lookup is processed entirely in your browser. No data is uploaded to any server.
        </motion.p>
      </div>
    </section>
  );
}
