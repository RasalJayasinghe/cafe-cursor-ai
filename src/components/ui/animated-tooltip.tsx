"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/utils";

export interface TooltipItem {
  id: number;
  name: string;
  designation?: string;
  image: string;
  fallback: string;
}

interface AnimatedTooltipProps {
  items: TooltipItem[];
  className?: string;
}

export function AnimatedTooltip({ items, className }: AnimatedTooltipProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    x.set(event.clientX - rect.left - halfWidth);
  };

  return (
    <div className={cn("flex flex-row items-center justify-center", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative -mr-3 transition-all duration-300 hover:z-50"
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={handleMouseMove}
        >
          {hoveredIndex === item.id && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 10,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{
                translateX: translateX,
                rotate: rotate,
                whiteSpace: "nowrap",
              }}
              className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-2 shadow-xl"
            >
              <div className="absolute -bottom-px left-1/2 h-px w-[40%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card" />
              <p className="text-sm font-bold text-foreground">{item.name}</p>
            </motion.div>
          )}
          <Avatar
            className={cn(
              "h-12 w-12 border-2 border-background ring-2 ring-border transition-all duration-300",
              "group-hover:scale-110 group-hover:ring-primary/50 group-hover:z-30"
            )}
          >
            <AvatarImage src={item.image} alt={item.name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              {item.fallback}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
}


