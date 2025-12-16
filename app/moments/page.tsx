"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, X, ImagePlus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

interface Photo {
  id: string;
  url: string;
}

// Sample photos using Unsplash
const SAMPLE_PHOTOS_IDS = [
  "photo-1522071820081-009f0129c71c",
  "photo-1515187029135-18ee286d815b",
  "photo-1531482615713-2afd69097998",
  "photo-1517245386807-bb43f82c33c4",
  "photo-1543269865-cbf427effbad",
  "photo-1552664730-d307ca884978",
  "photo-1559136555-9303baea8ebd",
  "photo-1556761175-5973dc0f32e7",
  "photo-1542744173-8e7e53415bb0",
  "photo-1553877522-43269d4ea984",
  "photo-1551434678-e076c223a692",
  "photo-1519389950473-47ba0277781c",
];

const SAMPLE_PHOTOS: Photo[] = SAMPLE_PHOTOS_IDS.map((photoId, index) => ({
  id: String(index + 1),
  url: `https://images.unsplash.com/${photoId}?w=600&q=80`,
}));

export default function CursorMomentsPage() {
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-sm">
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
                Cafe Cursor • Colombo
              </p>
            </div>
          </div>

          <Button
            size="sm"
            className="font-mono text-xs bg-foreground text-background hover:bg-foreground/90"
            onClick={() => toast.info("Upload feature coming soon!")}
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </div>
      </header>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
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
                className="relative group cursor-pointer overflow-hidden rounded-lg bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all"
                onClick={() => setLightboxPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={`Cursor Moment ${photo.id}`}
                  className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
              <ImagePlus className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-mono text-muted-foreground/60">
              No moments captured yet
            </p>
            <p className="font-mono text-xs text-muted-foreground/40 mt-1">
              Be the first to share!
            </p>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
              onClick={() => setLightboxPhoto(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.url}
                alt="Full size"
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
