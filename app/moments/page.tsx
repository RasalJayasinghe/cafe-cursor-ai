"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  X,
  ImagePlus,
  Heart,
  RefreshCw,
  Upload,
  Loader2,
  Camera,
  User,
  MessageSquare,
  Check,
  CheckCircle,
  Clock,
  Sparkles,
  Grid3X3,
  Zap,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";

interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
  likes: number;
  status: "pending" | "approved" | "rejected";
}

// Pinterest-style image card component
function PinterestCard({ photo, index, onLike, onOpen }: { 
  photo: Photo; 
  index: number; 
  onLike: (id: string) => void;
  onOpen: (photo: Photo) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Random aspect ratios for Pinterest effect
  const heights = ["h-64", "h-80", "h-96", "h-72", "h-[22rem]", "h-56"];
  const heightClass = heights[index % heights.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{ 
        duration: 0.5, 
        delay: (index % 6) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="break-inside-avoid mb-4"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative group cursor-pointer overflow-hidden rounded-2xl bg-foreground/5 border border-foreground/10 shadow-lg"
        onClick={() => onOpen(photo)}
      >
        {/* Image container with dynamic height */}
        <div className={`relative ${heightClass} overflow-hidden`}>
          <motion.img
            src={photo.url}
            alt={photo.caption || `Moment by ${photo.uploadedBy}`}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Floating action button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              onLike(photo.id);
            }}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/80 hover:border-red-500/50"
          >
            <Heart className="w-4 h-4 text-white" />
          </motion.button>
          
          {/* Bottom info panel */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-end justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/20">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-white text-sm truncate">
                    {photo.uploadedBy}
                  </span>
                </div>
                {photo.caption && (
                  <p className="text-white/80 text-xs line-clamp-2">
                    {photo.caption}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-white/70 text-xs ml-2">
                <Heart className="w-3 h-3" />
                <span>{photo.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CursorMomentsPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    caption: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);

  // Fetch approved photos
  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.name.trim()) {
      toast.error("Please select an image and enter your name");
      return;
    }

    setUploading(true);
    try {
      // Step 1: Upload image to image hosting
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("uploadedBy", uploadForm.name);
      formData.append("caption", uploadForm.caption);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || uploadData.error || "Image upload failed");
      }

      if (!uploadData.url) {
        throw new Error("Upload succeeded but no image URL returned");
      }

      // Step 2: Save photo metadata to our API
      const photoRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: uploadData.url,
          publicId: uploadData.publicId,
          caption: uploadForm.caption,
          uploadedBy: uploadForm.name,
        }),
      });

      const photoData = await photoRes.json();

      if (!photoRes.ok) {
        throw new Error(photoData.error || "Failed to save photo");
      }

      toast.success("Photo uploaded!", {
        description: "It will appear after admin approval.",
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadForm({ name: "", caption: "" });
      setShowUploadModal(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed", { description: error.message || "Please try again" });
    } finally {
      setUploading(false);
    }
  };

  // Handle like
  const handleLike = async (photoId: string) => {
    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: "PATCH",
      });
      
      const data = await res.json();
      
      if (res.status === 400 && data.alreadyLiked) {
        toast.info("You already liked this! ❤️");
        return;
      }
      
      if (res.ok) {
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? data : p))
        );
        toast.success("Liked! ❤️");
        
        // Update lightbox photo if it's open
        if (lightboxPhoto && lightboxPhoto.id === photoId) {
          setLightboxPhoto(data);
        }
      }
    } catch (error) {
      console.error("Error liking photo:", error);
      toast.error("Failed to like photo");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-muted-foreground" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Subtle radial dot pattern background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, currentColor 0.5px, transparent 0.5px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Minimal floating accent lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-foreground/[0.015]"
            style={{
              left: `${15 + i * 12}%`,
              top: `${10 + (i % 3) * 30}%`,
              width: '1px',
              height: `${40 + Math.random() * 60}px`,
              transform: `rotate(${-20 + i * 10}deg)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Epic Header */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="relative overflow-hidden border-b border-foreground/10"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 via-transparent to-foreground/10" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-8">
          {/* Back button */}
          <Link href="/" className="inline-block mb-2 sm:mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-7 sm:h-8 px-2 sm:px-3"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-[10px] sm:text-xs">back to cafe</span>
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-6">
            <div className="w-full sm:w-auto">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-foreground/10 border border-foreground/20 mb-1.5 sm:mb-4"
              >
                <Camera className="w-2 h-2 sm:w-3 sm:h-3 text-foreground/70" />
                <span className="text-[9px] sm:text-xs text-foreground/70">live memories</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-3 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  cursor moments
                </span>
                <br />
                <span className="text-foreground/80 text-base sm:text-xl md:text-3xl">captured at the cafe</span>
              </motion.h1>

              {/* Stats */}
              <motion.div
                className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-muted-foreground">
                  <span className="text-foreground font-bold">{photos.length}</span> moments
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-bold">{photos.reduce((acc, p) => acc + p.likes, 0)}</span> likes
                </span>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div
              className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchPhotos}
                className="text-xs border border-foreground/10 h-7 sm:h-8 w-7 sm:w-8 p-0"
              >
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none text-[10px] sm:text-xs bg-foreground text-background hover:bg-foreground/90 border border-foreground shadow-lg shadow-foreground/25 h-7 sm:h-8 px-3 sm:px-4"
                onClick={() => setShowUploadModal(true)}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-2" />
                share a moment
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Pinterest-Style Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {photos.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {photos.map((photo, index) => (
              <PinterestCard
                key={photo.id}
                photo={photo}
                index={index}
                onLike={handleLike}
                onOpen={setLightboxPhoto}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-foreground/20 via-foreground/10 to-foreground/5 border border-foreground/10 flex items-center justify-center"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Camera className="w-12 h-12 text-foreground/50" />
            </motion.div>
            <h3 className="text-2xl text-foreground/80 mb-2">
              no vibes captured yet
            </h3>
            <p className="text-sm text-muted-foreground/50 mb-6 max-w-sm mx-auto">
              be the first to share a moment from cafe cursor and start the gallery!
            </p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-foreground text-background hover:bg-foreground/90 border border-foreground"
            >
              <Camera className="w-4 h-4 mr-2" />
              drop the first pic
            </Button>
          </motion.div>
        )}
      </div>

      {/* Epic Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setLightboxPhoto(null)}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 backdrop-blur-sm"
              onClick={() => setLightboxPhoto(null)}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image with glow */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl opacity-50" />
                <img
                  src={lightboxPhoto.url}
                  alt={lightboxPhoto.caption || "Full size"}
                  className="relative w-full h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Photo info panel */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-2xl"
              >
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center border-2 border-white/20">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">
                          {lightboxPhoto.uploadedBy}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(lightboxPhoto.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {lightboxPhoto.caption && (
                      <p className="text-sm text-white/80 max-w-md">
                        {lightboxPhoto.caption}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLike(lightboxPhoto.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-red-500/80 border border-white/20 hover:border-red-500/50 transition-all backdrop-blur-sm"
                  >
                    <Heart className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">{lightboxPhoto.likes}</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => !uploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Glow border */}
              <div className="absolute -inset-[2px] bg-gradient-to-r from-foreground/50 via-foreground/30 to-foreground/50 rounded-t-3xl sm:rounded-3xl blur-md opacity-60" />

              <div className="relative bg-background border border-foreground/10 rounded-t-3xl sm:rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10 bg-gradient-to-r from-foreground/10 via-foreground/5 to-foreground/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-foreground/30 to-foreground/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                    <h3 className="text-sm font-bold">share a moment</h3>
                      <p className="text-[10px] text-muted-foreground">capture the vibe</p>
                    </div>
                  </div>
                  <button
                    onClick={() => !uploading && setShowUploadModal(false)}
                    className="p-2 hover:bg-foreground/10 rounded-full transition-colors"
                    disabled={uploading}
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">
                  {/* Image upload area */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer ${
                      previewUrl
                        ? "border-foreground/50 bg-foreground/5"
                        : "border-foreground/20 hover:border-foreground/40 bg-foreground/5"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-52 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                          <p className="text-sm text-white">tap to change</p>
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-green-500/80 text-white text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          ready
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ImagePlus className="w-12 h-12 mx-auto text-foreground/50 mb-3" />
                        </motion.div>
                        <p className="text-sm text-foreground/70">
                          tap to add your pic
                        </p>
                        <p className="text-xs text-muted-foreground/50 mt-1">
                          max 10MB • jpg, png, gif
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* Name input */}
                  <div className="space-y-2">
                    <label className="text-xs text-foreground/70 uppercase tracking-wider">
                      who dis? <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={uploadForm.name}
                        onChange={(e) =>
                          setUploadForm({ ...uploadForm, name: e.target.value })
                        }
                        placeholder="your name"
                        className="bg-foreground/5 border-foreground/20 pl-10 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Caption input */}
                  <div className="space-y-2">
                    <label className="text-xs text-foreground/60 uppercase tracking-wider">
                      caption the moment
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <textarea
                        value={uploadForm.caption}
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            caption: e.target.value,
                          })
                        }
                        placeholder="what's the vibe?"
                        rows={2}
                        className="w-full text-sm bg-foreground/5 border border-foreground/20 rounded-xl pl-10 pr-3 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                        maxLength={200}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground/50 text-right">
                      {uploadForm.caption.length}/200
                    </p>
                  </div>

                  {/* Info box */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300/80">
                      heads up! your photo goes through a quick admin check before showing up in the gallery
                    </p>
                  </div>

                  {/* Submit button */}
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile || !uploadForm.name.trim()}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 border border-foreground rounded-xl h-12 text-sm"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        uploading the magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        share the moment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
