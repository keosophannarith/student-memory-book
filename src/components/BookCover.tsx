import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, School, GraduationCap } from 'lucide-react';
import { DriveFolder } from '../types';
import { SelectionModal } from './SelectionModal';
import { isKhmer } from '../lib/utils';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'class' | 'student'>('class');

  const selectedClass = classes.find(c => c.id === classId);
  const selectedStudent = students.find(s => s.id === studentId);

  const handleOpenCover = () => {
    if (studentId) {
      onOpen();
    } else {
      // If no student selected yet, open selection modal
      setModalTab(classId ? 'student' : 'class');
      setIsModalOpen(true);
    }
  };

  const openClassModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalTab('class');
    setIsModalOpen(true);
  };

  const openStudentModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalTab(classId ? 'student' : 'class');
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div 
        initial={{ rotateY: -110, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -110, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
        className={`absolute inset-0 z-50 bg-[#1e293b] shadow-[10px_20px_50px_rgba(0,0,0,0.5),_inset_4px_0_10px_rgba(255,255,255,0.1)] sm:rounded-tl-md sm:rounded-tr-[2rem] rounded-xl flex flex-col items-center justify-center ${studentId ? 'cursor-pointer' : 'cursor-default'} group border-l-[16px] border-[#0f172a] overflow-hidden`}
        onClick={handleOpenCover}
      >
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leather.png')" }}></div>
        
        {/* Book spine aesthetic */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none"></div>

        {/* Gold foil borders */}
        <div className="absolute inset-4 sm:inset-8 border border-[#d4af37]/40 rounded-sm sm:rounded-r-[1.5rem] pointer-events-none"></div>
        <div className="absolute inset-6 sm:inset-10 border-2 border-[#d4af37]/70 rounded-sm sm:rounded-r-[1.2rem] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center w-full grow py-10 sm:py-14 top-0 bottom-0 cover-inner">
          
          {/* Top spacer for logo */}
          <div className="flex-[1] min-h-[0.25rem]"></div>

          {/* Logo container */}
          <motion.div 
            className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center z-20 shrink-0 cover-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img 
              src="https://lh3.googleusercontent.com/d/1Gx6xmt-xXf6EkgmXWkUp6r9eLnULAZWl" 
              alt="School Logo" 
              className="w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
          </motion.div>
          
          {/* Spacer between logo and text */}
          <div className="flex-[1] min-h-[0.25rem]"></div>

          {/* Book Title */}
          <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-serif text-[#d4af37] leading-tight drop-shadow-md mb-4 sm:mb-6 uppercase tracking-[0.15em] px-4 max-w-2xl shrink-0 cover-title">
            Student Learning
            <span className="block mt-2 text-[#f4d068] cover-title-sub">Activities</span>
          </h1>
          
          {/* Subtitle */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8 shrink-0 cover-annually">
            <div className="w-6 sm:w-16 h-[1px] bg-[#d4af37]/50"></div>
            <span className="text-[#d4af37] font-serif text-base sm:text-xl tracking-[0.2em] sm:tracking-[0.3em] uppercase">Annually</span>
            <div className="w-6 sm:w-16 h-[1px] bg-[#d4af37]/50"></div>
          </div>

          {/* Selectors Group - Clean Text Triggers */}
          <div className="flex flex-col items-center gap-3 shrink-0 z-30 mb-6 sm:mb-8 w-full max-w-md px-4 cover-selectors">
            
            {/* Class Selector Trigger */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={openClassModal}
              className="text-[#d4af37] hover:text-[#f4d068] transition-colors cursor-pointer text-center max-w-full py-1 px-3"
            >
              <span className={`text-lg sm:text-2xl tracking-wider block cover-trigger-text ${
                selectedClass && isKhmer(selectedClass.name) ? 'font-moul text-base sm:text-xl text-[#f4d068]' : 'font-serif'
              }`}>
                {selectedClass ? selectedClass.name : 'SELECT CLASS'}
              </span>
            </motion.button>

            {/* Student Selector Trigger */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={openStudentModal}
              className={`text-[#d4af37] hover:text-[#f4d068] transition-colors cursor-pointer text-center max-w-full py-1 px-3 ${
                selectedStudent ? 'opacity-100' : 'opacity-80'
              }`}
            >
              <span className={`text-lg sm:text-2xl tracking-wider block cover-trigger-text ${
                selectedStudent && isKhmer(selectedStudent.name) ? 'font-moul text-base sm:text-xl text-[#f4d068]' : 'font-serif'
              }`}>
                {selectedStudent ? selectedStudent.name : 'SELECT STUDENT'}
              </span>
            </motion.button>
          </div>

          {/* Bottom spacer */}
          <div className="flex-[0.5] min-h-[0.25rem]"></div>

          {/* Academic Year */}
          <div className="mt-auto shrink-0 pb-2">
            <p className="text-[#d4af37]/80 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] font-serif uppercase cover-year">
              ACADEMIC YEAR 2026-2027
            </p>
          </div>
        </div>
      </motion.div>

      {/* Modern Popup Modal */}
      <SelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classes={classes}
        classId={classId}
        setClassId={setClassId}
        students={students}
        studentId={studentId}
        setStudentId={setStudentId}
        classesLoading={classesLoading}
        studentsLoading={studentsLoading}
        initialTab={modalTab}
      />
    </>
  );
}

