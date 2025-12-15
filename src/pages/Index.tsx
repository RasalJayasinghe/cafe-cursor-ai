import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { AboutEvent } from '@/components/sections/AboutEvent';
import { Flows } from '@/components/sections/Flows';
import { Dashboard } from '@/components/sections/Dashboard';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { AppProvider } from '@/context/AppContext';

const Index = () => {
  return (
    <AppProvider>
      <div className="scroll-snap-y h-screen overflow-y-auto">
        <Navbar />
        <Hero />
        <Features />
        <AboutEvent />
        <Flows />
        <Dashboard />
        <FinalCTA />
      </div>
    </AppProvider>
  );
};

export default Index;
