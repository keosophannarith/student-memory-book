import React from 'react';
import { motion } from 'framer-motion';
import { DriveFolder } from '../types';

interface BookCoverProps {
  onOpen: () => void;
  classes: DriveFolder[];
  classId: string;
  setClassId: (id: string) => void;
  students: DriveFolder[];
  studentId: string;
  setStudentId: (id: string) => void;
  classesLoading: boolean;
  studentsLoading: boolean;
}

export function BookCover({ 
  onOpen,
  classes,
  classId,
  setClassId,
  students,
  studentId,
  setStudentId,
  classesLoading,
  studentsLoading
}: BookCoverProps) {
  const handleOpen = () => {
    if (studentId) {
      onOpen();
    }
  };

  return (
    <motion.div 
      initial={{ rotateY: -110, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -110, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
      className={`absolute inset-0 z-50 bg-[#1e293b] shadow-[10px_20px_50px_rgba(0,0,0,0.5),_inset_4px_0_10px_rgba(255,255,255,0.1)] sm:rounded-tl-md sm:rounded-tr-[2rem] rounded-xl flex flex-col items-center justify-center ${studentId ? 'cursor-pointer' : 'cursor-default'} group border-l-[16px] border-[#0f172a] overflow-hidden`}
      onClick={handleOpen}
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leather.png')" }}></div>
      
      {/* Book spine aesthetic */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none"></div>

      {/* Gold foil borders */}
      <div className="absolute inset-4 sm:inset-8 border border-[#d4af37]/40 rounded-sm sm:rounded-r-[1.5rem] pointer-events-none"></div>
      <div className="absolute inset-6 sm:inset-10 border-2 border-[#d4af37]/70 rounded-sm sm:rounded-r-[1.2rem] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full grow py-12 sm:py-16 top-0 bottom-0">
        
        {/* Top spacer for logo */}
        <div className="flex-[1] min-h-[1rem]"></div>

        {/* Logo container */}
        <motion.div 
          className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center z-20 shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img 
            src={`https://www.googleapis.com/drive/v3/files/1Gx6xmt-xXf6EkgmXWkUp6r9eLnULAZWl?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY}`} 
            alt="School Logo" 
            className="w-full h-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>
        
        {/* Spacer between logo and text */}
        <div className="flex-[1] min-h-[1rem]"></div>

        {/* Book Title */}
        <h1 className="text-center text-3xl sm:text-5xl lg:text-5xl font-serif text-[#d4af37] leading-tight drop-shadow-md mb-6 sm:mb-8 uppercase tracking-[0.15em] px-4 max-w-2xl shrink-0">
          Student Learning
          <span className="block mt-3 text-[#f4d068]">Activities</span>
        </h1>
        
        {/* Subtitle */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12 shrink-0">
          <div className="w-6 sm:w-16 h-[1px] bg-[#d4af37]/50"></div>
          <span className="text-[#d4af37] font-serif text-lg sm:text-xl tracking-[0.2em] sm:tracking-[0.3em] uppercase">Annually</span>
          <div className="w-6 sm:w-16 h-[1px] bg-[#d4af37]/50"></div>
        </div>

        {/* Selectors Group */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 shrink-0 z-30 mb-8 sm:mb-12">
          {/* Class Selector */}
          <div className="w-fit relative" onClick={(e) => e.stopPropagation()}>
            <select
              className="bg-transparent text-[#d4af37] font-serif text-lg sm:text-2xl outline-none cursor-pointer appearance-none text-center hover:opacity-80 transition-all max-w-[90vw] tracking-wider"
              value={classId}
              onChange={(e) => { setClassId(e.target.value); setStudentId(''); }}
            >
              <option value="" className="bg-[#1e293b] text-[#d4af37]">SELECT CLASS</option>
              {classes.map(c => (
                <option key={c.id} value={c.id} className="bg-[#1e293b] text-[#d4af37]">{c.name}</option>
              ))}
            </select>
            {classesLoading && <p className="text-xs text-[#d4af37]/60 absolute w-full text-center animate-pulse">Loading...</p>}
          </div>

          {/* Student Selector */}
          <div className="w-fit relative mt-2" onClick={(e) => e.stopPropagation()}>
            <select
              className={`bg-transparent ${studentId ? '' : 'opacity-70'} text-[#d4af37] font-serif text-lg sm:text-2xl outline-none cursor-pointer appearance-none text-center min-w-[250px] sm:min-w-[320px] hover:opacity-100 transition-all max-w-[90vw] tracking-wider`}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={!classId}
            >
              <option value="" className="bg-[#1e293b] text-[#d4af37]">SELECT STUDENT</option>
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-[#1e293b] text-[#d4af37]">{s.name}</option>
              ))}
            </select>
            {studentsLoading && <p className="text-xs text-[#d4af37]/60 absolute w-full text-center animate-pulse">Loading...</p>}
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="flex-[0.5] min-h-[1rem]"></div>

        {/* Academic Year */}
        <div className="mt-auto shrink-0 pb-4">
          <p className="text-[#d4af37]/80 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] font-serif uppercase">
            ACADEMIC YEAR 2026-2027
          </p>
        </div>
      </div>
    </motion.div>
  );
}
