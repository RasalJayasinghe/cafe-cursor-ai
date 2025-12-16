import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { AboutEvent } from '@/components/sections/AboutEvent';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Index = () => {
  return (
    <div className="scroll-snap-y h-screen overflow-y-auto">
      <Navbar />
      <Hero />
      <AboutEvent />
      
      {/* Small worker dashboard link */}
      <Link
        to="/dashboard"
        className="fixed bottom-4 right-4 z-50 p-3 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 rounded-full transition-all font-mono text-xs flex items-center gap-2 backdrop-blur-sm"
        title="Workers Dashboard"
      >
        <LayoutDashboard className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default Index;
