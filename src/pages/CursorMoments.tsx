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

// Sample photos for demo
const SAMPLE_PHOTOS: Omit<Photo, 'x' | 'y' | 'scale' | 'rotation' | 'driftX' | 'driftY' | 'driftDuration'>[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80' },
  { id: '2', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80' },
  { id: '3', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80' },
  { id: '4', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80' },
  { id: '5', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80' },
  { id: '6', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80' },
  { id: '7', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80' },
  { id: '8', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80' },
];

function generatePhotoPosition(index: number, total: number): Omit<Photo, 'id' | 'url'> {
  // Create organic cloud positions
  const angle = (index / total) * Math.PI * 2 + Math.random() * 0.5;
  const radius = 20 + Math.random() * 25;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  
  return {
    x: Math.max(10, Math.min(90, x)),
    y: Math.max(15, Math.min(85, y)),
    scale: 0.7 + Math.random() * 0.5,
    rotation: (Math.random() - 0.5) * 15,
    driftX: (Math.random() - 0.5) * 30,
    driftY: (Math.random() - 0.5) * 20,
    driftDuration: 15 + Math.random() * 15,
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
      <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
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
              onClick={() => setLightboxPhoto(photo)}
              reducedMotion={prefersReducedMotion.current}
            />
          ))
        )}
      </div>

      {/* Empty state prompt */}
      {photos.length > 0 && photos.length < 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 px-4"
        >
          <p className="font-mono text-xs text-muted-foreground/40">
            Add more moments to fill the cloud ✨
          </p>
        </motion.div>
      )}

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
  onClick: () => void;
  reducedMotion: boolean;
}

function FloatingPhoto({ photo, index, onClick, reducedMotion }: FloatingPhotoProps) {
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
        transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      >
        {/* Glow effect on hover */}
        <div 
          className={`absolute -inset-2 bg-foreground/20 rounded-xl blur-xl transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        
        {/* Photo */}
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-2xl">
          <img
            src={photo.url}
            alt="Community moment"
            className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover transition-all duration-300 ${
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
