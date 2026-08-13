import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Maximize2, 
  X, 
  Sparkles,
  Layers,
  ZoomIn,
  RotateCw
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useDriveImages } from '../hooks/useDriveImages';
import { useDriveFolderDocs } from '../hooks/useDriveFolderDocs';
import { isKhmer } from '../lib/utils';
import { DriveImage } from '../types';

interface CarouselProps {
  folderId?: string;
  date?: string;
}

type FrameStyle = 'classic' | 'polaroid' | 'gallery' | 'film';

interface PageSlide {
  id: string;
  type: 'portrait' | 'landscape';
  images: DriveImage[];
}

export function Carousel({ folderId, date }: CarouselProps) {
  const { images, loading, error } = useDriveImages(folderId);
  const { docText } = useDriveFolderDocs(folderId);
  
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('classic');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [orientations, setOrientations] = useState<Record<string, 'portrait' | 'landscape'>>({});

  // Detect image orientations (height > width => portrait)
  useEffect(() => {
    if (!images || images.length === 0) return;

    const detected: Record<string, 'portrait' | 'landscape'> = {};

    images.forEach((img) => {
      if (img.imageMediaMetadata?.width && img.imageMediaMetadata?.height) {
        detected[img.id] = img.imageMediaMetadata.height > img.imageMediaMetadata.width ? 'portrait' : 'landscape';
      } else {
        // Fallback: Load image natural dimensions dynamically
        const url = img.thumbnailLink 
          ? img.thumbnailLink.replace(/=s\d+/, '=s500') 
          : `https://www.googleapis.com/drive/v3/files/${img.id}?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyB4E2PM8ueMmkfTaptHkr2VOT4UqoMpyjU'}`;
        
        const tempImg = new Image();
        tempImg.src = url;
        tempImg.onload = () => {
          const isPort = tempImg.naturalHeight > tempImg.naturalWidth;
          setOrientations((prev) => ({ ...prev, [img.id]: isPort ? 'portrait' : 'landscape' }));
        };
      }
    });

    setOrientations((prev) => ({ ...detected, ...prev }));
  }, [images]);

  // Display each image one by one per slide
  const pages: PageSlide[] = useMemo(() => {
    if (!images || images.length === 0) return [];

    return images.map((img) => {
      const orient = orientations[img.id] || (img.imageMediaMetadata && img.imageMediaMetadata.height > img.imageMediaMetadata.width ? 'portrait' : 'landscape');
      return {
        id: img.id,
        type: orient,
        images: [img]
      };
    });
  }, [images, orientations]);

  // Adjust page index if pages change
  useEffect(() => {
    if (pages.length > 0 && currentPageIndex >= pages.length) {
      setCurrentPageIndex(0);
    }
  }, [pages, currentPageIndex]);

  const goToNext = () => {
    if (pages.length <= 1) return;
    setDirection(1);
    setCurrentPageIndex((prev) => (prev + 1) % pages.length);
  };

  const goToPrev = () => {
    if (pages.length <= 1) return;
    setDirection(-1);
    setCurrentPageIndex((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      goToNext();
    } else if (info.offset.x > swipeThreshold) {
      goToPrev();
    }
  };

  const getImageUrl = (img?: DriveImage, size = 1200) => {
    if (!img) return '';
    if (img.thumbnailLink) {
      return img.thumbnailLink.replace(/=s\d+/, `=s${size}`);
    }
    return `https://www.googleapis.com/drive/v3/files/${img.id}?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyB4E2PM8ueMmkfTaptHkr2VOT4UqoMpyjU'}`;
  };

  if (loading) {
    return (
      <div className="w-full flex-1 bg-stone-50 rounded-2xl flex flex-col items-center justify-center animate-pulse min-h-[420px] p-8 border border-stone-200/60">
        <div className="flex flex-col items-center text-stone-400">
          <div className="relative mb-4">
            <ImageIcon className="w-12 h-12 text-[#d4af37]/60" />
            <Sparkles className="w-5 h-5 text-[#d4af37] absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <p className="text-lg font-serif text-stone-600 mb-1">កំពុងរៀបចំរូបថត...</p>
          <p className="text-xs text-stone-400 font-sans tracking-wide">Loading student memories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-1 bg-red-50/80 rounded-2xl flex flex-col items-center justify-center p-6 text-center min-h-[400px] border border-red-100">
        <p className="text-red-500 text-sm font-medium mb-1">{error}</p>
        <p className="text-xs text-red-400">Please verify your connection or select another folder.</p>
      </div>
    );
  }

  if (!folderId || images.length === 0) {
    return (
      <div className="w-full flex-1 bg-stone-50/60 rounded-2xl border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 text-center px-4 min-h-[400px]">
        <ImageIcon className="w-14 h-14 mb-4 opacity-30 text-[#d4af37]" />
        <p className="text-xl font-serif font-medium mb-1 text-stone-600">គ្មានរូបថតទេ</p>
        <p className="text-xs text-stone-400">There are no photos in this memory folder</p>
      </div>
    );
  }

  // Animation variants per frame style
  const getVariants = () => {
    switch (frameStyle) {
      case 'polaroid':
        return {
          enter: (dir: number) => ({
            rotate: dir > 0 ? 12 : -12,
            scale: 0.85,
            opacity: 0,
            y: 30,
          }),
          center: {
            rotate: 0,
            scale: 1,
            opacity: 1,
            y: 0,
          },
          exit: (dir: number) => ({
            rotate: dir < 0 ? 12 : -12,
            scale: 0.85,
            opacity: 0,
            y: -30,
          }),
        };
      case 'gallery':
        return {
          enter: (dir: number) => ({
            scale: 1.15,
            opacity: 0,
            filter: 'blur(8px)',
          }),
          center: {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
          },
          exit: (dir: number) => ({
            scale: 0.88,
            opacity: 0,
            filter: 'blur(6px)',
          }),
        };
      case 'film':
        return {
          enter: (dir: number) => ({
            x: dir > 0 ? '100%' : '-100%',
            opacity: 0,
          }),
          center: {
            x: '0%',
            opacity: 1,
          },
          exit: (dir: number) => ({
            x: dir < 0 ? '100%' : '-100%',
            opacity: 0,
          }),
        };
      case 'classic':
      default:
        return {
          enter: (dir: number) => ({
            rotateY: dir > 0 ? 80 : -80,
            opacity: 0,
            scale: 0.95,
            transformOrigin: dir > 0 ? 'left center' : 'right center',
          }),
          center: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            transformOrigin: 'center center',
          },
          exit: (dir: number) => ({
            rotateY: dir < 0 ? 80 : -80,
            opacity: 0,
            scale: 0.95,
            transformOrigin: dir < 0 ? 'left center' : 'right center',
          }),
        };
    }
  };

  const effectivePageIndex = pages.length > 0 ? currentPageIndex % pages.length : 0;
  const currentPage = pages[effectivePageIndex] || { id: 'empty', type: 'landscape', images: [] };

  // Frame styling classes
  const getFrameContainerClass = () => {
    switch (frameStyle) {
      case 'polaroid':
        return 'bg-white p-3 sm:p-5 pb-8 sm:pb-10 shadow-[0_15px_35px_rgba(0,0,0,0.18)] border-2 border-stone-200/90 rounded-sm transform rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300';
      case 'gallery':
        return 'bg-gradient-to-b from-stone-900 via-stone-850 to-slate-900 p-2 sm:p-4 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-2 border-[#d4af37]/60';
      case 'film':
        return 'bg-stone-900 p-3 sm:p-4 rounded-md shadow-lg border-y-8 border-stone-950 relative';
      case 'classic':
      default:
        return 'bg-[#fdfcfaf0] p-2.5 sm:p-4 rounded-xl shadow-md border border-stone-200/80';
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col group min-h-0" style={{ perspective: 1400 }}>
      
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between mb-2 shrink-0 z-30 px-1 pointer-events-auto">
        {/* Style Selector Icons (No Background, Icons Only) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFrameStyle('classic')}
            className={`p-1.5 transition-all cursor-pointer ${
              frameStyle === 'classic'
                ? 'text-[#d4af37] scale-110 opacity-100'
                : 'text-stone-400 hover:text-stone-600 opacity-70 hover:opacity-100'
            }`}
            title="3D Book Page Style"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFrameStyle('polaroid')}
            className={`p-1.5 transition-all cursor-pointer ${
              frameStyle === 'polaroid'
                ? 'text-amber-500 scale-110 opacity-100'
                : 'text-stone-400 hover:text-stone-600 opacity-70 hover:opacity-100'
            }`}
            title="Polaroid Photo Style"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFrameStyle('gallery')}
            className={`p-1.5 transition-all cursor-pointer ${
              frameStyle === 'gallery'
                ? 'text-[#d4af37] scale-110 opacity-100'
                : 'text-stone-400 hover:text-stone-600 opacity-70 hover:opacity-100'
            }`}
            title="Gold Gallery Frame"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>

        {/* Page Controls & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFullscreenImageIndex(effectivePageIndex);
              setIsFullscreen(true);
            }}
            className="p-1.5 text-stone-400 hover:text-[#d4af37] transition-all cursor-pointer active:scale-95 opacity-70 hover:opacity-100"
            title="View Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Animated Carousel Content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={`${currentPage.id}-${frameStyle}`}
          custom={direction}
          variants={getVariants()}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.55,
            ease: [0.25, 1, 0.5, 1],
          }}
          drag={isZoomed ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
          className="w-full flex-1 flex flex-col cursor-grab active:cursor-grabbing pb-2 carousel-item-container min-h-0 relative"
        >
          {/* Photo & Sidebar Container: 3/4 Photo on Left/Center, 1/4 Date & Caption on Right */}
          <div className="w-full flex-1 flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch min-h-0">
            
            {/* Photo Frame Container (Occupying 3/4 / 75% width on desktop) */}
            <div 
              className={`w-full md:w-[75%] md:flex-[3] h-[52vh] sm:h-[60vh] md:h-auto min-h-[350px] sm:min-h-[460px] md:min-h-[520px] relative overflow-hidden flex flex-col items-center justify-center pointer-events-auto transition-all duration-300 carousel-photo-section ${getFrameContainerClass()}`}
              onPointerDown={(e) => { 
                if (isZoomed) { e.stopPropagation(); }
              }}
            >
              {/* Corner Decorative Photo Tape (Polaroid style) */}
              {frameStyle === 'polaroid' && (
                <>
                  <div className="absolute -top-2 left-1/2 -translate-x-12 w-14 h-5 bg-amber-100/80 border border-amber-200/60 transform -rotate-6 z-20 shadow-xs backdrop-blur-[1px]"></div>
                  <div className="absolute -top-2 left-1/2 translate-x-2 w-14 h-5 bg-amber-100/80 border border-amber-200/60 transform rotate-6 z-20 shadow-xs backdrop-blur-[1px]"></div>
                </>
              )}

              {/* Film perforations top */}
              {frameStyle === 'film' && (
                <div className="absolute top-1 left-0 right-0 flex justify-between px-2 z-20">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2 bg-stone-950 rounded-sm"></div>
                  ))}
                </div>
              )}

              {/* Single Image View (Centered in the 3/4 frame area) */}
              <div className="relative w-full h-full flex items-center justify-center p-1 sm:p-2">
                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={4}
                  centerZoomedOut={true}
                  wheel={{ step: 0.1 }}
                  onTransformed={(ref) => {
                    setIsZoomed(ref.state.scale > 1.05);
                  }}
                >
                  <TransformComponent 
                    wrapperStyle={{ width: "100%", height: "100%", flex: 1 }} 
                    contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <motion.img
                      src={getImageUrl(currentPage.images[0], 1400)}
                      alt="Student Memory"
                      className="w-full h-full max-h-full object-contain rounded-md shadow-sm touch-none select-none mx-auto"
                      draggable={false}
                      initial={{ scale: 0.98, opacity: 0.9 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </TransformComponent>
                </TransformWrapper>

                {/* Expand Overlay Hint */}
                <div 
                  onClick={() => {
                    setFullscreenImageIndex(effectivePageIndex);
                    setIsFullscreen(true);
                  }}
                  className="absolute top-3 right-3 z-30 bg-black/50 hover:bg-black/75 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg border border-white/20"
                  title="Click to expand full screen"
                >
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Film perforations bottom */}
              {frameStyle === 'film' && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 z-20">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2 bg-stone-950 rounded-sm"></div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar: Date & Caption Box (1/4 / 25% width on desktop) */}
            <div className="w-full md:w-[25%] md:flex-[1] flex flex-col pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl p-3.5 sm:p-4 border border-stone-200/80 shadow-sm shrink-0 carousel-caption-section justify-start min-h-[160px] md:min-h-0">
              {/* Date Header */}
              <div className="flex flex-col gap-2 border-b border-stone-200/80 pb-3 mb-3 text-stone-600">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-700">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#d4af37]" />
                    <span>{date || new Date().toLocaleDateString('km-KH')}</span>
                  </div>
                  <BookOpen className="w-4 h-4 text-[#d4af37]" />
                </div>

                {pages.length > 1 && (
                  <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span className="bg-stone-100 border border-stone-200/80 px-2.5 py-0.5 rounded-full text-stone-700 font-sans text-xs font-semibold">
                      Photo {effectivePageIndex + 1} of {pages.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Description Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                {(() => {
                  const currentImg = currentPage.images[0];
                  const textContent = currentImg?.name || currentImg?.description || docText || "មិនមានឈ្មោះរូបថត";
                  const textIsKhmer = isKhmer(textContent);
                  return (
                    <p 
                      className={`w-full leading-[1.8rem] sm:leading-[2.1rem] text-stone-800 text-xs sm:text-sm md:text-base carousel-caption-text font-roboto ${textIsKhmer ? 'font-khmer' : ''}`}
                      style={{
                        backgroundImage: 'linear-gradient(transparent, transparent 28px, #f4f0e6 28px, #f4f0e6 29px)',
                        backgroundSize: '100% 29px',
                        lineHeight: '29px',
                        minHeight: '100px'
                      }}
                    >
                      {textContent}
                    </p>
                  );
                })()}
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Thumbnails Navigation Strip */}
      {images.length > 1 && (
        <div className="mt-2 w-full flex items-center justify-center gap-1.5 overflow-x-auto py-1 custom-scrollbar shrink-0 pointer-events-auto">
          {images.map((img, idx) => {
            const isSelected = idx === effectivePageIndex;
            const isPortrait = orientations[img.id] === 'portrait';

            let thumbUrl = img.thumbnailLink ? img.thumbnailLink.replace(/=s\d+/, '=s150') : '';
            if (!thumbUrl && img.id) {
              thumbUrl = `https://www.googleapis.com/drive/v3/files/${img.id}?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyB4E2PM8ueMmkfTaptHkr2VOT4UqoMpyjU'}`;
            }

            return (
              <button
                key={img.id || idx}
                onClick={() => {
                  setDirection(idx > effectivePageIndex ? 1 : -1);
                  setCurrentPageIndex(idx);
                }}
                className={`relative h-10 w-12 sm:h-12 sm:w-16 rounded-md overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  isSelected 
                    ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-105 shadow-md' 
                    : 'border-stone-300 opacity-60 hover:opacity-100 hover:border-stone-400'
                }`}
                title={isPortrait ? 'Portrait photo' : 'Landscape photo'}
              >
                <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                {isPortrait && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#d4af37] rounded-full border border-white" title="Portrait"></span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Navigation Overlay Controls (Prev / Next Page) */}
      {pages.length > 1 && (
        <div className="absolute top-[35%] sm:top-1/2 left-0 right-0 flex justify-between px-1 sm:px-2 -translate-y-1/2 pointer-events-none transition-opacity z-30">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPrev(); }} 
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-stone-200/90 flex items-center justify-center text-stone-700 hover:text-black hover:bg-white pointer-events-auto hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNext(); }} 
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-stone-200/90 flex items-center justify-center text-stone-700 hover:text-black hover:bg-white pointer-events-auto hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none">
            {/* Header Controls */}
            <div className="w-full flex items-center justify-between z-20">
              <div className="text-white/90 font-serif text-sm sm:text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span>
                  Photo View ({fullscreenImageIndex + 1} of {images.length})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRotationDegree((prev) => (prev + 90) % 360)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Rotate photo"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setIsFullscreen(false); setRotationDegree(0); }}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Close Fullscreen"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Lightbox Center Image View */}
            <div className="relative w-full flex-1 my-4 flex items-center justify-center overflow-hidden">
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={5}
                centerZoomedOut={true}
              >
                <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <motion.img
                    src={getImageUrl(images[fullscreenImageIndex], 1600)}
                    alt="Memory Fullscreen"
                    style={{ transform: `rotate(${rotationDegree}deg)` }}
                    className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg border border-white/10 transition-transform duration-300"
                  />
                </TransformComponent>
              </TransformWrapper>

              {/* Lightbox Prev/Next */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setFullscreenImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => setFullscreenImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-2 sm:left-auto sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Footer Caption */}
            <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 text-white/90 text-center border border-white/10 z-20">
              <p className="text-sm sm:text-base font-roboto leading-relaxed">
                {images[fullscreenImageIndex]?.name || images[fullscreenImageIndex]?.description || docText || "Student Memory Activity"}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
