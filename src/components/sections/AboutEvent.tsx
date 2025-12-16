import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';

const eventDetails = [
  {
    icon: Calendar,
    title: 'Date & Time',
    description: 'January 25, 2025 • 6:00 PM onwards',
  },
  {
    icon: MapPin,
    title: 'Venue',
    description: 'The Gallery Café, Colombo 03, Sri Lanka',
  },
  {
    icon: Users,
    title: 'Who\'s Invited',
    description: 'Creators, developers, designers, and AI enthusiasts from the community',
  },
  {
    icon: Sparkles,
    title: 'What to Expect',
    description: 'Live demos, networking, food & drinks, and conversations about the future of AI',
  },
];

export function AboutEvent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about-event" ref={ref} className="snap-section flex items-center bg-background py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-6"
          >
            The Event
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Gathering
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            An evening where creators connect, ideas brew, and communities gather around AI. 
            Join us for an intimate experience that brings together the brightest minds in the local tech scene.
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
