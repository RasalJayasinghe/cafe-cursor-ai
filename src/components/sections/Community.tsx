import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users } from 'lucide-react';
import { CursorCubeLogo } from '@/src/components/ui/CursorCubeLogo';

const stats = [
  { value: '20+', label: 'CITIES' },
  { value: '1K+', label: 'ATTENDEES' },
  { value: '∞', label: 'VIBES' },
];

export function Community() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="community"
      ref={ref}
      className="min-h-screen snap-section flex items-center justify-center bg-background py-24 relative overflow-hidden"
    >
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <CursorCubeLogo className="w-8 h-8 text-foreground" />
          <Users className="w-7 h-7 text-foreground/70" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-center mb-10"
        >
          The community
        </motion.h2>

        {/* Main description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
        >
          <span className="text-[#E85C2A] font-medium">Cafe Cursor</span> is a
          global series of coworking meetups for developers building with
          Cursor. We gather to build, share knowledge, and connect over coffee.
        </motion.p>

        {/* Secondary description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-center text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed mb-16"
        >
          What started as a small meetup has grown into a movement — inspiring
          editions across multiple cities. Not a conference, just a workspace
          where innovation happens side by side.
        </motion.p>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {/* Top border */}
          <div className="h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent mb-10" />

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="relative flex flex-col items-center py-4"
              >
                {/* Vertical dividers */}
                {index > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-muted-foreground/30" />
                )}

                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm tracking-[0.2em] text-muted-foreground font-medium">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Bottom border */}
          <div className="h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent mt-10" />
        </motion.div>
      </div>
    </section>
  );
}

