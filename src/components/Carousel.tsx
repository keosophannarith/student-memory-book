import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useDriveImages } from '../hooks/useDriveImages';
import { useDriveFolderDocs } from '../hooks/useDriveFolderDocs';
import { isKhmer } from '../lib/utils';

interface CarouselProps {
  folderId?: string;
  date?: string;
}

export function Carousel({ folderId, date }: CarouselProps) {
  const { images, loading, error } = useDriveImages(folderId);
  const { docText } = useDriveFolderDocs(folderId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToNext = () => {
    if (images.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    if (images.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      goToNext();
    } else if (info.offset.x > swipeThreshold) {
      goToPrev();
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-1 bg-stone-50 rounded-xl flex items-center justify-center animate-pulse min-h-[400px]">
        <div className="flex flex-col items-center text-stone-400">
          <ImageIcon className="w-10 h-10 mb-3" />
          <p className="text-base font-serif">កំពុងទាញយកទិន្នន័យ (Loading memories...)</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-1 bg-red-50 rounded-xl flex items-center justify-center p-6 text-center min-h-[400px]">
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!folderId || images.length === 0) {
    return (
      <div className="w-full flex-1 bg-stone-50 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-stone-400 text-center px-4 min-h-[400px]">
        <ImageIcon className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-xl font-serif font-medium mb-1 text-stone-500">គ្មានរូបថតទេ</p>
        <p className="text-sm">There are no photos in this folder</p>
      </div>
    );
  }

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.98,
      zIndex: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.98,
      zIndex: 0,
    })
  };

  const effectiveIndex = images.length > 0 ? currentIndex % images.length : 0;
  const currentImage = images[effectiveIndex];
  const currentImageId = currentImage?.id;
  
  let imageUrl = '';
  if (currentImage) {
    if (currentImage.thumbnailLink) {
      imageUrl = currentImage.thumbnailLink.replace(/=s\d+/, '=s1000');
    } else {
      imageUrl = `https://www.googleapis.com/drive/v3/files/${currentImageId}?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
    }
  }

  return (
    <div className="relative w-full flex-1 flex flex-col group min-h-0" style={{ perspective: 1200 }}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentImageId}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.6, ease: "easeInOut"
          }}
          style={{ transformOrigin: "left center" }}
          drag={isZoomed ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={handleDragEnd}
          className="w-full h-full flex flex-col cursor-grab active:cursor-grabbing pb-8 sm:pb-0"
        >
          {/* Photo Section */}
          <div 
            className="w-full h-[40vh] sm:h-auto sm:flex-1 sm:min-h-0 bg-[#fdfcfaf0] p-3 rounded-lg shadow-sm border border-stone-200/50 mb-6 relative overflow-hidden flex flex-col items-center justify-center pointer-events-auto"
            onPointerDown={(e) => { 
                if (isZoomed) { e.stopPropagation(); }
            }}
          >
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
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={imageUrl}
                  alt="Memory"
                  className="w-full h-full max-h-full object-contain rounded shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] touch-none"
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>

          {/* Caption / Journal Section */}
          <div className="w-full flex-shrink-0 flex flex-col pointer-events-auto sm:mb-4 bg-white">
            <div className="flex items-center justify-between text-stone-500 mb-4 border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2 text-sm font-medium tracking-wide">
                <CalendarIcon className="w-4 h-4" />
                <span>{date || new Date().toLocaleDateString('km-KH')}</span>
              </div>
              <BookOpen className="w-4 h-4" />
            </div>

            {(() => {
              const textContent = currentImage?.description || docText || "មិនមានការបរិយាយ (No description...)";
              const textIsKhmer = isKhmer(textContent);
              return (
                <p 
                  className={`w-full leading-[2.5rem] text-stone-800 text-lg md:text-xl ${textIsKhmer ? 'font-khmer' : 'font-serif'}`}
                  style={{
                    backgroundImage: 'linear-gradient(transparent, transparent 39px, #f4f0e6 39px, #f4f0e6 40px)',
                    backgroundSize: '100% 40px',
                    lineHeight: '40px',
                    minHeight: '120px'
                  }}
                >
                  {textContent}
                </p>
              );
            })()}

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe Overlay Controls */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 -translate-y-1/2 pointer-events-none opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 hidden sm:flex">
         <button onClick={(e) => { e.preventDefault(); goToPrev(); }} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-white pointer-events-auto hover:scale-105 transition-all">
           <ChevronLeft className="w-6 h-6" />
         </button>
         <button onClick={(e) => { e.preventDefault(); goToNext(); }} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-white pointer-events-auto hover:scale-105 transition-all">
           <ChevronRight className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
}
