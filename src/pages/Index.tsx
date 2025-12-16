import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { AboutEvent } from '@/components/sections/AboutEvent';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderGit2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="scroll-snap-y h-screen overflow-y-auto">
      <Navbar />
      <Hero />
      <AboutEvent />
      
      {/* Small navigation buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <Link
          to="/projects"
          className="p-3 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 rounded-full transition-all font-mono text-xs flex items-center gap-2 backdrop-blur-sm"
          title="Project Gallery"
        >
          <FolderGit2 className="w-4 h-4" />
        </Link>
        <Link
          to="/dashboard"
          className="p-3 bg-foreground/10 hover:bg-foreground/20 border border-foreground/20 rounded-full transition-all font-mono text-xs flex items-center gap-2 backdrop-blur-sm"
          title="Workers Dashboard"
        >
          <LayoutDashboard className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Index;
