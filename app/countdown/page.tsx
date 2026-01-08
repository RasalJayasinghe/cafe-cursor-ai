"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, MapPin, Calendar, Clock, Sparkles, ExternalLink, MessageCircle } from "lucide-react";
import { CursorCubeLogo } from "@/src/components/ui/CursorCubeLogo";

// Dynamic import for Map (Leaflet needs client-side only)
const Map = dynamic(() => import("@/src/components/ui/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-900 animate-pulse flex items-center justify-center">
      <span className="text-white/30 text-sm">Loading map...</span>
    </div>
  ),
});

// Kai Colombo - Coffee Bar and Eatery, 74 Flower Rd, Colombo 00700
const KAI_COLOMBO = {
  lat: 6.907071375560723,
  lng: 79.85829729728204,
};

// Target date: January 24th, 2026, 10:00 AM Sri Lanka Time
const TARGET_DATE = new Date("2026-01-24T10:00:00+05:30").getTime();

// Cafe Cursor community images
const galleryImages = [
  "/community-cafe.jpg",
  "/cafe-ny-1.webp",
  "/cafe-sf-3.webp",
  "/community-campus-lead.webp",
  "/community-mexico-city.webp",
];

interface TimeUnit {
  value: number;
  label: string;
}

function CountdownUnit({ value, label, index }: TimeUnit & { index: number }) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        {/* Main number container */}
        <div className="relative overflow-hidden">
          <motion.div
            className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl md:rounded-3xl px-2 xs:px-3 sm:px-6 md:px-10 py-2 xs:py-3 sm:py-5 md:py-7"
            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
            transition={{ duration: 0.2 }}
          >
            {/* Flip animation container */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={value}
                initial={{ y: -20, opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: 20, opacity: 0, rotateX: 90 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tabular-nums tracking-tight"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>

            {/* Shine effect on flip */}
            {isFlipping && (
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}

            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
          </motion.div>

          {/* Reflection - hidden on mobile */}
          <div className="hidden sm:block absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-white/[0.02] blur-xl rounded-full" />
        </div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className="mt-2 sm:mt-3 md:mt-4 text-[8px] xs:text-[9px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/40 text-center"
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
}

function Separator() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 py-2 xs:py-3 sm:py-6 md:py-8"
    >
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-1 xs:w-1.5 sm:w-2 h-1 xs:h-1.5 sm:h-2 rounded-full bg-white/60"
      />
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        className="w-1 xs:w-1.5 sm:w-2 h-1 xs:h-1.5 sm:h-2 rounded-full bg-white/60"
      />
    </motion.div>
  );
}

export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-cycle through images
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 6000); // Change image every 6 seconds
    
    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CursorCubeLogo className="w-12 h-12 text-white/50" />
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Full-screen sliding image carousel background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-black">
        {/* Sliding images container */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-black"
          >
            <img
              src={galleryImages[currentImageIndex]}
              alt=""
              className="w-full h-full object-cover grayscale opacity-50"
            />
            {/* Ken Burns effect - subtle zoom */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 8, ease: "linear" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next image preloading (hidden) */}
        <div className="hidden">
          {galleryImages.map((img, i) => (
            <img key={i} src={img} alt="" />
          ))}
        </div>

        {/* Gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.5)_100%)]" />
        
        {/* Moving spotlight */}
        <motion.div
          className="absolute w-[1000px] h-[1000px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)",
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Image progress indicator */}
        
      </div>

      {/* Horizontal lines decoration */}
      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-[1px] bg-white/[0.02]"
            style={{ top: `${(i + 1) * 5}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1 + i * 0.05, duration: 1 }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 sm:p-8 md:p-12 flex items-center justify-between">
        
        </header>

        {/* Hero section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          {/* Cursor Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center mb-4 sm:mb-6"
          >
            <CursorCubeLogo className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center mb-3 sm:mb-4 md:mb-6"
          >
            <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-tight">
              Cafe Cursor
            </span>
            <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60">
                is coming
              </span>
            </span>
            <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white/40 leading-tight">
              To Sri Lanka
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs xs:text-sm sm:text-base md:text-lg text-white/50 text-center max-w-xl mb-6 sm:mb-10 md:mb-14 px-4"
          >
            The first Cafe Cursor gathering in Colombo. Where developers, builders, and creators come together over coffee.
          </motion.p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-3 md:gap-5 lg:gap-7 mb-6 sm:mb-10 md:mb-14 w-full px-2">
            <CountdownUnit value={timeLeft.days} label="Days" index={0} />
            <Separator />
            <CountdownUnit value={timeLeft.hours} label="Hours" index={1} />
            <Separator />
            <CountdownUnit value={timeLeft.minutes} label="Minutes" index={2} />
            <Separator />
            <CountdownUnit value={timeLeft.seconds} label="Seconds" index={3} />
          </div>

          {/* Event details pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-12 px-2"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white/50" />
              <span className="text-[10px] sm:text-xs md:text-sm text-white/70">24 Jan 2026</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white/50" />
              <span className="text-[10px] sm:text-xs md:text-sm text-white/70">10AM - 10PM</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white/50" />
              <span className="text-[10px] sm:text-xs md:text-sm text-white/70">Kai Colombo</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
          >
            <a
              href="https://lu.ma/01ken2xj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-5 sm:px-8 py-3 sm:py-4 bg-white text-black font-medium rounded-full overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 text-xs sm:text-sm md:text-base">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  See Details
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Hover shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
              </motion.button>
            </a>
            
            <a
              href="https://chat.whatsapp.com/CgIkBUB8t3jDIoLhT2qZJd"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-5 sm:px-8 py-3 sm:py-4 bg-white text-black font-medium rounded-full overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 text-xs sm:text-sm md:text-base">
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Join WhatsApp Community
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Hover shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
              </motion.button>
            </a>
          </motion.div>

          {/* Sponsors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-16 md:gap-24"
          >
            {/* Connectivity Partner */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
                Connectivity Partner
              </span>
              <div className="h-12 sm:h-16 md:h-20 w-40 sm:w-52 md:w-64 overflow-hidden flex items-center justify-center">
                <motion.img
                  src="/starlink.png"
                  alt="Starlink"
                  className="w-full h-auto scale-[2] opacity-90 hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 2.1 }}
                />
              </div>
            </div>
            
            {/* Venue Partner */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
                Venue Partner
              </span>
              <div className="h-12 sm:h-16 md:h-20 w-40 sm:w-52 md:w-64 overflow-hidden flex items-center justify-center">
                <motion.img
                  src="/kai.png"
                  alt="Kai Colombo"
                  className="w-full h-auto scale-[2] opacity-90 hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 2.1 }}
                />
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer accent */}
        <footer className="p-6 sm:p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center justify-center gap-4"
          >
            
          </motion.div>
        </footer>
      </div>

      {/* Map Section */}
      <section className="relative z-20 min-h-screen bg-black flex flex-col pb-8 sm:pb-16">
        {/* Section header */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="h-[1px] w-6 sm:w-8 bg-white/30" />
              <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50">
                The Venue
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white sm:mb-5">
              Kai Colombo
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4">
              74 Flower Rd, Colombo 00700
            </p>
            
            <p className="text-white/50 text-xs sm:text-sm md:text-base max-w-lg mb-4 sm:mb-6">
              Join us at Kai Colombo Coffee Bar and Eatery, a creative space in the heart of the city where 
              innovation meets inspiration.
            </p>

            <a
              href="https://www.google.com/maps/place/Kai+Colombo-+Coffee+Bar+and+Eatery/@6.9069439,79.8580735,21z/data=!4m14!1m7!3m6!1s0x3ae2590077592baf:0x27efcfbd6002c560!2sKai+Colombo-+Coffee+Bar+and+Eatery!8m2!3d6.9070594!4d79.8582979!16s%2Fg%2F11xssyxv05!3m5!1s0x3ae2590077592baf:0x27efcfbd6002c560!8m2!3d6.9070594!4d79.8582979!16s%2Fg%2F11xssyxv05"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/70 hover:text-white transition-colors group"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Get Directions</span>
              <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>
        </div>

        {/* Map container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative"
        >
          {/* Map glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-10 sm:h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-10 sm:h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
          
          {/* Border frame - hidden on mobile */}
          <div className="hidden sm:block absolute inset-4 sm:inset-8 border border-white/10 rounded-2xl z-10 pointer-events-none" />
          
          {/* Map */}
          <div className="h-[300px] xs:h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] mx-2 sm:mx-4 md:mx-8 rounded-xl sm:rounded-2xl overflow-hidden">
            <Map
              lat={KAI_COLOMBO.lat}
              lng={KAI_COLOMBO.lng}
              zoom={16}
              markerTitle="Kai Colombo"
              markerDescription="Cafe Cursor Colombo 2026"
              className="rounded-xl sm:rounded-2xl"
            />
          </div>
        </motion.div>

      </section>


      {/* Corner accents - hidden on mobile */}
      <div className="hidden sm:block fixed top-0 left-0 w-24 h-24 pointer-events-none z-30">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-6 left-6 w-12 h-[1px] bg-white/20 origin-left"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-6 left-6 w-[1px] h-12 bg-white/20 origin-top"
        />
      </div>
      <div className="hidden sm:block fixed top-0 right-0 w-24 h-24 pointer-events-none z-30">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-6 right-6 w-12 h-[1px] bg-white/20 origin-right"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-6 right-6 w-[1px] h-12 bg-white/20 origin-top"
        />
      </div>
      <div className="hidden sm:block fixed bottom-0 left-0 w-24 h-24 pointer-events-none z-30">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-6 left-6 w-12 h-[1px] bg-white/20 origin-left"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-6 left-6 w-[1px] h-12 bg-white/20 origin-bottom"
        />
      </div>
      <div className="hidden sm:block fixed bottom-0 right-0 w-24 h-24 pointer-events-none z-30">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-6 right-6 w-12 h-[1px] bg-white/20 origin-right"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-6 right-6 w-[1px] h-12 bg-white/20 origin-bottom"
        />
      </div>

      {/* Animated particles - only render on client to avoid hydration issues */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-white/20 rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

