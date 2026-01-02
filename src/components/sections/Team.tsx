"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedTooltip, TooltipItem } from "@/src/components/ui/animated-tooltip";

// TechTalk360 team members - 12 people with placeholder images
const teamMembers: TooltipItem[] = [
  {
    id: 1,
    name: "Team Member 1",
    designation: "Role",
    image: "/team/member-1.jpg",
    fallback: "T1",
  },
  {
    id: 2,
    name: "Team Member 2",
    designation: "Role",
    image: "/team/member-2.jpg",
    fallback: "T2",
  },
  {
    id: 3,
    name: "Team Member 3",
    designation: "Role",
    image: "/team/member-3.jpg",
    fallback: "T3",
  },
  {
    id: 4,
    name: "Team Member 4",
    designation: "Role",
    image: "/team/member-4.jpg",
    fallback: "T4",
  },
  {
    id: 5,
    name: "Team Member 5",
    designation: "Role",
    image: "/team/member-5.jpg",
    fallback: "T5",
  },
  {
    id: 6,
    name: "Team Member 6",
    designation: "Role",
    image: "/team/member-6.jpg",
    fallback: "T6",
  },
  {
    id: 7,
    name: "Team Member 7",
    designation: "Role",
    image: "/team/member-7.jpg",
    fallback: "T7",
  },
  {
    id: 8,
    name: "Team Member 8",
    designation: "Role",
    image: "/team/member-8.jpg",
    fallback: "T8",
  },
  {
    id: 9,
    name: "Team Member 9",
    designation: "Role",
    image: "/team/member-9.jpg",
    fallback: "T9",
  },
  {
    id: 10,
    name: "Team Member 10",
    designation: "Role",
    image: "/team/member-10.jpg",
    fallback: "T10",
  },
  {
    id: 11,
    name: "Team Member 11",
    designation: "Role",
    image: "/team/member-11.jpg",
    fallback: "T11",
  },
  {
    id: 12,
    name: "Team Member 12",
    designation: "Role",
    image: "/team/member-12.jpg",
    fallback: "T12",
  },
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

