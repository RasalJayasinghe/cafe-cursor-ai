"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedTooltip, TooltipItem } from "@/src/components/ui/animated-tooltip";

// TechTalk360 team members
const teamMembers: TooltipItem[] = [
  { id: 1, name: "Rasal", image: "/team/Rasal.JPG", fallback: "RA" },
  { id: 2, name: "Wishmi", image: "/team/wishmi.jpg", fallback: "WI" },
  { id: 3, name: "Lithira", image: "/team/lithira.jpeg", fallback: "LI" },
  { id: 4, name: "Gaurav", image: "/team/gaurav.jpeg", fallback: "GA" },
  { id: 5, name: "Bushra", image: "/team/Bushra.JPG", fallback: "BU" },
  { id: 6, name: "Dehami", image: "/team/dehami.png", fallback: "DE" },
  { id: 7, name: "Veenavi", image: "/team/Veenavi.jpg", fallback: "VE" },
  { id: 8, name: "Minodya", image: "/team/Minodya.png", fallback: "MI" },
  { id: 9, name: "Sanindee", image: "/team/Sanindee.jpeg", fallback: "SA" },
  { id: 10, name: "Sithumi", image: "/team/Sithumi.png", fallback: "SI" },
  { id: 11, name: "Thinara", image: "/team/Thinara.jpg", fallback: "TH" },
  { id: 12, name: "Kavina", image: "/team/kavina.png", fallback: "KA" },
];

export function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Split into two rows for better display on mobile
  const firstRow = teamMembers.slice(0, 6);
  const secondRow = teamMembers.slice(6, 12);

  return (
    <section
      id="team"
      ref={ref}
      className="min-h-screen snap-section flex items-center justify-center bg-background py-24 relative overflow-hidden"
    >
      {/* Subtle plus pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px',
          backgroundPosition: 'center center',
        }}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-medium">
            The People Behind
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Done by the team
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-primary">
            TechTalk360
          </p>
        </motion.div>

        {/* Team avatars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          {/* First row - 6 members */}
          <AnimatedTooltip items={firstRow} />

          {/* Second row - 6 members */}
          <AnimatedTooltip items={secondRow} />
        </motion.div>

      
      </div>
    </section>
  );
}

