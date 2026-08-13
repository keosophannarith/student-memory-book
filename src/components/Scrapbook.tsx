import React, { useState } from 'react';
import { Users, GraduationCap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel } from './Carousel';
import { BookCover } from './BookCover';
import { useDriveFolders } from '../hooks/useDriveFolders';

const ROOT_FOLDER_ID = "1zzVwBsmvQidcaIN-vV1-uzwVwUTe6z9J";

export function Scrapbook() {
  const [isOpen, setIsOpen] = useState(false);
  const [classId, setClassId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');

  const { folders: classes, loading: classesLoading, error: classesError } = useDriveFolders(ROOT_FOLDER_ID);
  const { folders: students, loading: studentsLoading, error: studentsError } = useDriveFolders(classId);

  const today = new Date().toLocaleDateString('km-KH');

  return (
    <div className="min-h-screen w-full bg-[#eaeaeb] text-stone-800 font-sans flex flex-col items-center overflow-x-hidden relative">
      
      <div className="w-full flex-1 flex flex-col items-center max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl relative px-2 sm:px-6 lg:px-8">
        
        {/* Error banner removed */}

        {/* 3D BookWrapper */}
        <div className="flex-1 w-full relative my-2 sm:my-6 md:my-8 z-10 perspective-[2000px] min-h-[580px] sm:min-h-[660px] md:min-h-[740px] lg:min-h-[800px] h-[calc(100vh-2rem)] sm:h-auto max-h-[920px]">
          
          {/* Inner Book Content */}
          <div className="absolute inset-0 bg-[#fdfcfaf0] shadow-md sm:shadow-[0_20px_50px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(0,0,0,0.06)] rounded-xl sm:rounded-tl-md sm:rounded-tr-[2.5rem] flex flex-col border border-stone-200/80 overflow-hidden">
            
            {/* Binder rings edge (Tablet & Desktop) */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-stone-100 to-white/50 border-r border-stone-200/80 flex flex-col justify-evenly py-8 sm:py-10 z-20 shadow-[inset_-2px_0_6px_rgba(0,0,0,0.03)] hidden sm:flex pointer-events-none">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="relative w-3 h-5 sm:w-[16px] sm:h-[28px] mx-auto rounded-full bg-[#f0eee9] shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] border border-stone-300">
                  {/* Outer Ring */}
                  <div className="absolute w-[40px] sm:w-[50px] md:w-[60px] h-[30px] sm:h-[38px] rounded-l-[40px] rounded-r-none border-t-[4px] sm:border-t-[5px] border-b-[4px] sm:border-b-[5px] border-l-[5px] sm:border-l-[6px] border-stone-400 bg-transparent -left-[20px] sm:-left-[28px] md:-left-[34px] top-1/2 -translate-y-1/2 shadow-[-3px_3px_5px_rgba(0,0,0,0.2)] z-30 transform rotate-1">
                    <div className="absolute inset-0 rounded-l-[40px] border-l border-white/40 left-0"></div>
                  </div>
                </div>
              ))}
            </div>

             {/* Binder rings edge (Mobile Phone) */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-stone-100 to-white flex flex-col justify-evenly py-6 z-20 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.03)] sm:hidden border-r border-stone-200/60 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="relative w-2 h-3 mx-auto rounded-full bg-[#f0eee9] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] border border-stone-300">
                   {/* Outer Ring */}
                   <div className="absolute w-[22px] h-[20px] rounded-l-[20px] rounded-r-none border-t-[3px] border-b-[3px] border-l-[4px] border-stone-400 bg-transparent -left-[11px] top-1/2 -translate-y-1/2 shadow-[-2px_2px_3px_rgba(0,0,0,0.2)] z-30"></div>
                </div>
              ))}
            </div>
            
            {/* Page Content Viewport */}
            <div className="group pl-10 sm:pl-[85px] md:pl-[110px] pr-3 sm:pr-8 md:pr-12 lg:pr-16 py-4 sm:py-8 md:py-10 flex-1 w-full relative z-10 overflow-hidden bg-white/50 flex flex-col">
              
              {/* Subtle paper texture overlay */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none z-0" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}></div>

              <AnimatePresence>
                {isOpen && (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 sm:top-6 sm:right-6 z-50 bg-white/80 backdrop-blur p-2.5 rounded-full shadow-sm border border-stone-200 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-white hover:border-red-100 transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 active:opacity-100"
                    title="បិទសៀវភៅ (Close Book)"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="w-full flex-1 relative z-10 text-stone-800 flex flex-col min-h-0">
                {studentId ? (
                  <Carousel folderId={studentId} date={today} />
                ) : (
                  <div className="w-full flex-1 sm:min-h-[50vh] bg-stone-50/50 rounded-2xl flex flex-col items-center justify-center text-stone-400 p-8 text-center mt-4">
                    <Users className="w-16 h-16 mb-6 text-stone-300" />
                    <p className="text-xl sm:text-2xl font-serif text-stone-500 mb-3">សូមជ្រើសរើសទិន្នន័យពីខាងលើ</p>
                    <p className="text-sm font-medium opacity-80 max-w-sm">Please select a class and student from the dropdown menu to view their memories.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {!isOpen && (
              <BookCover 
                key="cover" 
                onOpen={() => setIsOpen(true)}
                classes={classes}
                classId={classId}
                setClassId={setClassId}
                students={students}
                studentId={studentId}
                setStudentId={setStudentId}
                classesLoading={classesLoading}
                studentsLoading={studentsLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
