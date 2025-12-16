import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Camera, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
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

const SAMPLE_PHOTOS: Omit<Photo, 'x' | 'y' | 'scale' | 'rotation' | 'driftX' | 'driftY' | 'driftDuration'>[] = 
  UNSPLASH_PHOTOS.map((photoId, index) => ({
    id: String(index + 1),
    url: `https://images.unsplash.com/${photoId}?w=300&q=70`,
  }));

function generatePhotoPosition(index: number, total: number): Omit<Photo, 'id' | 'url'> {
  // Create organic cloud positions distributed across the entire area
  const cols = Math.ceil(Math.sqrt(total * 1.5));
  const rows = Math.ceil(total / cols);
  
  const col = index % cols;
  const row = Math.floor(index / cols);
  
  // Base grid position with randomness
  const baseX = (col / cols) * 80 + 10;
  const baseY = (row / rows) * 70 + 15;
  
  // Add organic randomness
  const randomX = (Math.random() - 0.5) * 15;
  const randomY = (Math.random() - 0.5) * 12;
  
  return {
    x: Math.max(5, Math.min(95, baseX + randomX)),
    y: Math.max(10, Math.min(90, baseY + randomY)),
    scale: 0.4 + Math.random() * 0.35, // Smaller scale for more photos
    rotation: (Math.random() - 0.5) * 20,
    driftX: (Math.random() - 0.5) * 15,
    driftY: (Math.random() - 0.5) * 10,
    driftDuration: 20 + Math.random() * 20,
  };
}

export default function CursorMoments() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize with sample photos
    const initialPhotos = SAMPLE_PHOTOS.map((photo, index) => ({
      ...photo,
      ...generatePhotoPosition(index, SAMPLE_PHOTOS.length),
    }));
    setPhotos(initialPhotos);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    // Create object URL for preview
    const url = URL.createObjectURL(file);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    clearInterval(progressInterval);
    setUploadProgress(100);

    const newPhoto: Photo = {
      id: Date.now().toString(),
      url,
      ...generatePhotoPosition(photos.length, photos.length + 1),
    };

    setPhotos(prev => [...prev, newPhoto]);
    
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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 py-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-mono hidden sm:inline">~/cafe-cursor</span>
          </Link>
          
          {/* Upload Button */}
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
              className="font-mono text-xs sm:text-sm bg-foreground text-background hover:bg-foreground/90 gap-2"
            >
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
      </header>

      {/* Hero Section */}
      <div className="pt-20 sm:pt-24 pb-8 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3">
            Cursor Moments
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-mono">
            Moments captured by the Cafe Cursor community
          </p>
        </motion.div>
      </div>

      {/* Photo Cloud */}
      <div className="relative w-full h-[150vh] sm:h-[200vh] overflow-visible">
        {/* Ambient gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-foreground/5 via-transparent to-transparent opacity-50" />
        
        {photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <div className="w-20 h-20 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-mono text-muted-foreground/60 mb-2">No moments yet</p>
            <p className="font-mono text-xs text-muted-foreground/40">Be the first to share!</p>
          </motion.div>
        ) : (
          photos.map((photo, index) => (
            <FloatingPhoto
              key={photo.id}
              photo={photo}
              index={index}
              total={photos.length}
              onClick={() => setLightboxPhoto(photo)}
              reducedMotion={prefersReducedMotion.current}
            />
          ))
        )}
      </div>

      {/* Photo count indicator */}
      <div className="text-center py-8 px-4">
        <p className="font-mono text-xs text-muted-foreground/40">
          {photos.length} moments captured ✨
        </p>
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

interface FloatingPhotoProps {
  photo: Photo;
  index: number;
  total: number;
  onClick: () => void;
  reducedMotion: boolean;
}

function FloatingPhoto({ photo, index, total, onClick, reducedMotion }: FloatingPhotoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    left: `${photo.x}%`,
    top: `${photo.y}%`,
    transform: `translate(-50%, -50%) rotate(${photo.rotation}deg) scale(${photo.scale})`,
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={baseStyle}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isHovered ? 1 : 0.85,
        scale: isHovered ? photo.scale * 1.15 : photo.scale,
        x: reducedMotion || isHovered ? 0 : [0, photo.driftX, 0],
        y: reducedMotion || isHovered ? 0 : [0, photo.driftY, 0],
        zIndex: isHovered ? 30 : index,
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        x: {
          duration: photo.driftDuration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
        y: {
          duration: photo.driftDuration * 1.2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: photo.scale * 0.95 }}
    >
      <motion.div
        className="relative group"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: Math.min(index * 0.02, 1.5), duration: 0.4, type: 'spring' }}
      >
        {/* Glow effect on hover */}
        <div 
          className={`absolute -inset-2 bg-foreground/20 rounded-xl blur-xl transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        
        {/* Photo */}
        <div className="relative overflow-hidden rounded-lg shadow-xl">
          <img
            src={photo.url}
            alt="Community moment"
            className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover transition-all duration-300 ${
              isHovered ? 'brightness-110' : 'brightness-90'
            }`}
            loading="lazy"
          />
          
          {/* Subtle border */}
          <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-foreground/10" />
        </div>
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
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
      />
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>
      
      {/* Image */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative max-w-4xl max-h-[80vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt="Community moment"
          className="w-full h-full object-contain rounded-xl sm:rounded-2xl shadow-2xl"
        />
        
        {/* Subtle info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 left-4 right-4 text-center"
        >
          <p className="font-mono text-xs text-foreground/40">
            Captured at Cafe Cursor
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
