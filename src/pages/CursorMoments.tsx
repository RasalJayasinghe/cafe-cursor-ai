import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ImagePlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  size: 'small' | 'medium' | 'large' | 'featured';
  aspectRatio: 'square' | 'portrait' | 'landscape';
}

// Generate 100 sample photos for demo using Unsplash
const UNSPLASH_PHOTOS = [
  'photo-1522071820081-009f0129c71c', 'photo-1515187029135-18ee286d815b', 'photo-1531482615713-2afd69097998',
  'photo-1517245386807-bb43f82c33c4', 'photo-1543269865-cbf427effbad', 'photo-1552664730-d307ca884978',
  'photo-1559136555-9303baea8ebd', 'photo-1556761175-5973dc0f32e7', 'photo-1542744173-8e7e53415bb0',
  'photo-1553877522-43269d4ea984', 'photo-1551434678-e076c223a692', 'photo-1519389950473-47ba0277781c',
  'photo-1522202176988-66273c2fd55f', 'photo-1517048676732-d65bc937f952', 'photo-1600880292203-757bb62b4baf',
  'photo-1573497019940-1c28c88b4f3e', 'photo-1560472355-536de3962603', 'photo-1531545514256-b1400bc00f31',
  'photo-1553484771-371a605b060b', 'photo-1529156069898-49953e39b3ac', 'photo-1511632765486-a01980e01a18',
  'photo-1517457373958-b7bdd4587205', 'photo-1528605248644-14dd04022da1', 'photo-1539635278303-d4002c07eae3',
  'photo-1496024840928-4c417adf211d', 'photo-1523240795612-9a054b0db644', 'photo-1556761175-b413da4baf72',
  'photo-1504384308090-c894fdcc538d', 'photo-1498758536662-35b82cd15e29', 'photo-1515169067868-5387ec356754',
  'photo-1521737604893-d14cc237f11d', 'photo-1522202757859-7472b0973dd4', 'photo-1532635241-17e820acc59f',
  'photo-1473691955023-da1c49c95c78', 'photo-1516321497487-e288fb19713f', 'photo-1525547719571-a2d4ac8945e2',
  'photo-1497032628192-86f99bcd76bc', 'photo-1557804506-669a67965ba0', 'photo-1542626991-cbc4e32524cc',
  'photo-1518770660439-4636190af475', 'photo-1461749280684-dccba630e2f6', 'photo-1484417894907-623942c8ee29',
  'photo-1516321318423-f06f85e504b3', 'photo-1573164713988-8665fc963095', 'photo-1486312338219-ce68d2c6f44d',
  'photo-1517694712202-14dd9538aa97', 'photo-1498050108023-c5249f4df085', 'photo-1504639725590-34d0984388bd',
  'photo-1555099962-4199c345e5dd', 'photo-1542831371-29b0f74f9713', 'photo-1544197150-b99a580bb7a8',
  'photo-1488590528505-98d2b5aba04b', 'photo-1518770660439-4636190af475', 'photo-1581091226825-a6a2a5aee158',
  'photo-1535303311164-664fc9ec6532', 'photo-1526628953301-3e589a6a8b74', 'photo-1551033406-611cf9a28f67',
  'photo-1523800503107-5bc3ba2a6f81', 'photo-1559028012-481c04fa702d', 'photo-1531297484001-80022131f5a1',
  'photo-1484807352052-23338990c6c6', 'photo-1536148935331-408321065b18', 'photo-1506905925346-21bda4d32df4',
  'photo-1511988617509-a57c8a288659', 'photo-1506126613408-eca07ce68773', 'photo-1521737711867-e3b97375f902',
  'photo-1517245386807-bb43f82c33c4', 'photo-1453738773917-9c3eff1db985', 'photo-1502945015378-0e284ca1a5be',
  'photo-1507003211169-0a1dd7228f2d', 'photo-1494790108377-be9c29b29330', 'photo-1438761681033-6461ffad8d80',
  'photo-1500648767791-00dcc994a43e', 'photo-1534528741775-53994a69daeb', 'photo-1506794778202-cad84cf45f1d',
  'photo-1507591064344-4c6ce005b128', 'photo-1531746020798-e6953c6e8e04', 'photo-1544005313-94ddf0286df2',
  'photo-1519085360753-af0119f7cbe7', 'photo-1472099645785-5658abf4ff4e', 'photo-1560250097-0b93528c311a',
  'photo-1573496359142-b8d87734a5a2', 'photo-1580489944761-15a19d654956', 'photo-1567532939604-b6b5b0db2604',
  'photo-1548142813-c348350df52b', 'photo-1547425260-76bcadfb4f2c', 'photo-1508214751196-bcfd4ca60f91',
  'photo-1499952127939-9bbf5af6c51c', 'photo-1501196354995-cbb51c65adc8', 'photo-1517841905240-472988babdf9',
  'photo-1539571696357-5a69c17a67c6', 'photo-1524504388940-b1c1722653e1', 'photo-1488426862026-3ee34a7d66df',
  'photo-1463453091185-61582044d556', 'photo-1507003211169-0a1dd7228f2d', 'photo-1506277886164-e25aa3f4ef7f',
];

const sizes: Photo['size'][] = ['small', 'medium', 'large', 'featured'];
const aspects: Photo['aspectRatio'][] = ['square', 'portrait', 'landscape'];

const SAMPLE_PHOTOS: Photo[] = UNSPLASH_PHOTOS.map((photoId, index) => ({
  id: String(index + 1),
  url: `https://images.unsplash.com/${photoId}?w=600&q=80`,
  size: index % 8 === 0 ? 'featured' : sizes[index % 3],
  aspectRatio: aspects[index % 3],
}));

export default function CursorMoments() {
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    const url = URL.createObjectURL(file);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    clearInterval(progressInterval);
    setUploadProgress(100);

    const newPhoto: Photo = {
      id: Date.now().toString(),
      url,
      size: 'featured',
      aspectRatio: 'square',
    };

    setPhotos(prev => [newPhoto, ...prev]);
    
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      toast.success('Moment captured!');
    }, 300);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-foreground/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-40 px-3 py-3 sm:p-4 md:p-6 bg-background/60 backdrop-blur-xl border-b border-foreground/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-mono hidden sm:inline">~/cafe-cursor</span>
          </Link>
          
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="font-mono text-xs sm:text-sm bg-foreground text-background hover:bg-foreground/90 gap-2 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              {isUploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                  />
                  <span className="hidden sm:inline">{uploadProgress}%</span>
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload a Moment</span>
                  <span className="sm:hidden">Upload</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with parallax */}
      <motion.div 
        className="pt-28 sm:pt-32 pb-12 text-center px-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-foreground/40" />
            <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">Community Gallery</span>
            <Sparkles className="w-5 h-5 text-foreground/40" />
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-b from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent">
            Cursor Moments
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-mono max-w-md mx-auto">
            A living tapestry of memories from the Cafe Cursor community
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div 
          className="mt-10 flex items-center justify-center gap-3"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-foreground/20" />
          <div className="w-2 h-2 rounded-full bg-foreground/20" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-foreground/20" />
        </motion.div>
      </motion.div>

      {/* Bento-style Grid */}
      <div className="px-3 sm:px-6 md:px-8 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px]">
          {photos.map((photo, index) => (
            <BentoPhoto
              key={photo.id}
              photo={photo}
              index={index}
              onClick={() => setLightboxPhoto(photo)}
            />
          ))}
        </div>
        
        {/* Photo count */}
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground/5 border border-foreground/10">
            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-pulse" />
            <p className="font-mono text-xs text-muted-foreground">
              {photos.length} moments and counting
            </p>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

interface BentoPhotoProps {
  photo: Photo;
  index: number;
  onClick: () => void;
}

function BentoPhoto({ photo, index, onClick }: BentoPhotoProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine grid span based on size
  const getSpanClasses = () => {
    switch (photo.size) {
      case 'featured':
        return 'col-span-2 row-span-2';
      case 'large':
        return photo.aspectRatio === 'landscape' ? 'col-span-2 row-span-1' : 'col-span-1 row-span-2';
      case 'medium':
        return 'col-span-1 row-span-2';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.5, ease: "easeOut" }}
      className={`${getSpanClasses()} relative`}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl group"
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated border glow */}
        <motion.div 
          className="absolute -inset-[1px] rounded-xl sm:rounded-2xl bg-gradient-to-br from-foreground/30 via-foreground/10 to-foreground/30 opacity-0 z-10"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Inner glow */}
        <motion.div 
          className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-foreground/10 via-transparent to-foreground/10 opacity-0 z-20"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Image */}
        <div className="absolute inset-[1px] rounded-xl sm:rounded-2xl overflow-hidden bg-background">
          <motion.img
            src={photo.url}
            alt="Community moment"
            className="w-full h-full object-cover"
            loading="lazy"
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? 'brightness(1.1)' : 'brightness(0.9)'
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Corner accents */}
        <motion.div 
          className="absolute top-3 right-3 w-6 h-6 z-30"
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-3 h-px bg-foreground/50" />
          <div className="absolute top-0 right-0 w-px h-3 bg-foreground/50" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-3 left-3 w-6 h-6 z-30"
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <div className="absolute bottom-0 left-0 w-3 h-px bg-foreground/50" />
          <div className="absolute bottom-0 left-0 w-px h-3 bg-foreground/50" />
        </motion.div>

        {/* Featured badge */}
        {photo.size === 'featured' && (
          <motion.div 
            className="absolute top-3 left-3 z-30"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/10">
              <Sparkles className="w-3 h-3 text-foreground/60" />
              <span className="text-[10px] font-mono text-foreground/60 uppercase">Featured</span>
            </div>
          </motion.div>
        )}

        {/* Subtle border */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-foreground/10 z-20 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
}

function Lightbox({ photo, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/98 backdrop-blur-xl"
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-foreground/3 rounded-full blur-3xl" />
      </div>
      
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors border border-foreground/10 group"
      >
        <X className="w-5 h-5 text-foreground group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>
      
      {/* Image container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative max-w-5xl max-h-[85vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer glow */}
        <div className="absolute -inset-4 bg-foreground/5 rounded-3xl blur-2xl" />
        
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-foreground/10 bg-background">
          <img
            src={photo.url}
            alt="Community moment"
            className="w-full h-full object-contain max-h-[80vh]"
          />
          
          {/* Corner decorations */}
          <div className="absolute top-4 left-4">
            <div className="w-4 h-px bg-foreground/30" />
            <div className="w-px h-4 bg-foreground/30" />
          </div>
          <div className="absolute top-4 right-4">
            <div className="w-4 h-px bg-foreground/30 ml-auto" />
            <div className="w-px h-4 bg-foreground/30 ml-auto" />
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-px h-4 bg-foreground/30" />
            <div className="w-4 h-px bg-foreground/30" />
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="w-px h-4 bg-foreground/30 ml-auto" />
            <div className="w-4 h-px bg-foreground/30 ml-auto" />
          </div>
        </div>
        
        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-12 left-0 right-0 text-center"
        >
          <div className="inline-flex items-center gap-2">
            <div className="h-px w-8 bg-foreground/20" />
            <p className="font-mono text-xs text-foreground/30">
              Captured at Cafe Cursor
            </p>
            <div className="h-px w-8 bg-foreground/20" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}