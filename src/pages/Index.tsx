import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { AboutEvent } from '@/components/sections/AboutEvent';

const Index = () => {
  return (
    <div className="scroll-snap-y h-screen overflow-y-auto">
      <Navbar />
      <Hero />
      <AboutEvent />
    </div>
  );
};

export default Index;
