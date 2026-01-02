import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';

const eventDetails = [
  {
    icon: Calendar,
    title: 'Date & Time',
    description: 'Saturday, 24th January 2026 • 10am to 10pm',
  },
  {
    icon: MapPin,
    title: 'Venue',
    description: 'Kai Colombo',
  },
  {
    icon: Users,
    title: 'Who\'s Coming',
    description: 'Creators, Developers, AI enthusiasts, Founders, and Builders from the local tech community',
  },
  {
    icon: Sparkles,
    title: 'What to Expect',
    description: 'Networking, Comfortable co-working space, Cursor credits and Conversations on AI and building with Cursor',
  },
];

export function AboutEvent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about-event" ref={ref} className="snap-section flex items-center bg-background py-24 relative overflow-hidden">
      {/* Subtle diagonal lines pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 30px,
            hsl(var(--foreground)) 30px,
            hsl(var(--foreground)) 31px
          )`,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cafe Cursor Colombo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            This is not your normal, sit and listen experience. This is a cafe moment where the everyday coffee and snacks bring together local tech minds to brew even better builds, better stories, better networks and ship effectively with Cursor!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {eventDetails.map((detail, index) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <detail.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{detail.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{detail.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Limited spots available • RSVP required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
