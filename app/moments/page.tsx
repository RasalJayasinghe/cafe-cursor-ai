"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle,
  Clock,
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

      if (!uploadRes.ok) {
        throw new Error("Image upload failed");
      }

      const uploadData = await uploadRes.json();

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

      if (!photoRes.ok) {
        throw new Error("Failed to save photo");
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
      toast.error("Upload failed", { description: error.message });
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
      if (res.ok) {
        const updated = await res.json();
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? updated : p))
        );
      }
    } catch (error) {
      console.error("Error liking photo:", error);
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-xs px-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="font-mono text-sm sm:text-lg font-bold">
                Cursor Moments
              </h1>
              <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                {photos.length} photos • Cafe Cursor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPhotos}
              className="font-mono text-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="font-mono text-xs bg-foreground text-background hover:bg-foreground/90"
              onClick={() => setShowUploadModal(true)}
            >
              <Camera className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Share Moment</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {photos.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid mb-3 sm:mb-4"
              >
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all"
                  onClick={() => setLightboxPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || `Moment by ${photo.uploadedBy}`}
                    className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-3 h-3" />
                          <span className="font-mono text-xs truncate">
                            {photo.uploadedBy}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(photo.id);
                          }}
                          className="flex items-center gap-1 text-xs hover:text-red-400 transition-colors"
                        >
                          <Heart className="w-3 h-3" />
                          <span>{photo.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              <Camera className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="font-mono text-lg text-muted-foreground/60">
              No moments captured yet
            </p>
            <p className="font-mono text-xs text-muted-foreground/40 mt-1 mb-4">
              Be the first to share a memory from Cafe Cursor!
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Camera className="w-4 h-4 mr-2" />
              Share First Moment
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors z-10"
              onClick={() => setLightboxPhoto(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption || "Full size"}
                className="w-full h-full object-contain rounded-lg"
              />
              {/* Photo info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4" />
                      <span className="font-mono font-medium">
                        {lightboxPhoto.uploadedBy}
                      </span>
                    </div>
                    {lightboxPhoto.caption && (
                      <p className="font-mono text-sm text-muted-foreground">
                        {lightboxPhoto.caption}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleLike(lightboxPhoto.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="font-mono">{lightboxPhoto.likes}</span>
                  </button>
                </div>
              </div>
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => !uploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Glow border */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-t-2xl sm:rounded-2xl blur-sm" />

              <div className="relative bg-background border border-foreground/10 rounded-t-2xl sm:rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-foreground/5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground ml-2">
                      ~/share-moment.sh
                    </span>
                  </div>
                  <button
                    onClick={() => !uploading && setShowUploadModal(false)}
                    className="p-1 hover:bg-foreground/10 rounded transition-colors"
                    disabled={uploading}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                  <div className="font-mono text-xs text-muted-foreground/60 mb-4">
                    # Share a moment from Cafe Cursor
                  </div>

                  {/* Image upload area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer ${
                      previewUrl
                        ? "border-green-500/50 bg-green-500/5"
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
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <p className="font-mono text-sm">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="font-mono text-sm text-muted-foreground">
                          Click to select an image
                        </p>
                        <p className="font-mono text-xs text-muted-foreground/50 mt-1">
                          Max 10MB • JPG, PNG, GIF
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Name input */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-cyan-400">
                      your_name<span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={uploadForm.name}
                        onChange={(e) =>
                          setUploadForm({ ...uploadForm, name: e.target.value })
                        }
                        placeholder="Your name"
                        className="font-mono bg-foreground/5 border-foreground/20 pl-10"
                      />
                    </div>
                  </div>

                  {/* Caption input */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-purple-400">
                      caption
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
                        placeholder="What's happening in this moment?"
                        rows={2}
                        className="w-full font-mono text-sm bg-foreground/5 border border-foreground/20 rounded-md pl-10 pr-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        maxLength={200}
                      />
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground/50 text-right">
                      {uploadForm.caption.length}/200
                    </p>
                  </div>

                  {/* Info box */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="font-mono text-xs text-amber-500/80">
                      Your photo will be reviewed by an admin before appearing
                      in the gallery.
                    </p>
                  </div>

                  {/* Submit button */}
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile || !uploadForm.name.trim()}
                    className="w-full font-mono bg-foreground text-background hover:bg-foreground/90"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Share Moment
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
