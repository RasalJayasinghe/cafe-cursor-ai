import { motion } from 'framer-motion';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Flows', href: '#flows' },
  { label: 'Dashboard', href: '#dashboard' },
];

export function Navbar() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollToSection('#hero')}
          className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          Cafe Cursor
        </button>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
