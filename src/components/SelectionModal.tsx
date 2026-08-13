import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, GraduationCap, Users, School, Sparkles } from 'lucide-react';
import { DriveFolder } from '../types';
import { isKhmer } from '../lib/utils';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: DriveFolder[];
  classId: string;
  setClassId: (id: string) => void;
  students: DriveFolder[];
  studentId: string;
  setStudentId: (id: string) => void;
  classesLoading: boolean;
  studentsLoading: boolean;
  initialTab?: 'class' | 'student';
}

export function SelectionModal({
  isOpen,
  onClose,
  classes,
  classId,
  setClassId,
  students,
  studentId,
  setStudentId,
  classesLoading,
  studentsLoading,
  initialTab = 'class'
}: SelectionModalProps) {
  const [activeTab, setActiveTab] = useState<'class' | 'student'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync tab when opened or classId changed
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const selectedClass = useMemo(() => classes.find(c => c.id === classId), [classes, classId]);
  const selectedStudent = useMemo(() => students.find(s => s.id === studentId), [students, studentId]);

  const filteredClasses = useMemo(() => {
    if (!searchTerm.trim()) return classes;
    return classes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [classes, searchTerm]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    return students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [students, searchTerm]);

  const handleSelectClass = (cId: string) => {
    setClassId(cId);
    setStudentId('');
    setSearchTerm('');
    // Smooth transition to student selection
    setActiveTab('student');
  };

  const handleSelectStudent = (sId: string) => {
    setStudentId(sId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#1e293b] border-2 border-[#d4af37]/60 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.25)] overflow-hidden flex flex-col max-h-[85vh] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Texture background */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leather.png')" }}></div>

            {/* Header */}
            <div className="relative z-10 p-5 sm:p-6 pb-3 border-b border-[#d4af37]/20 bg-slate-900/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#d4af37] font-semibold tracking-wide">
                    ជ្រើសរើសព័ត៌មានសិស្ស
                  </h3>
                  <p className="text-xs text-[#d4af37]/70 font-sans tracking-wider uppercase">
                    Select Class & Student
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-800/80 border border-[#d4af37]/30 text-[#d4af37]/80 hover:text-[#d4af37] hover:bg-slate-700/80 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="relative z-10 p-4 pb-2 bg-slate-900/20 shrink-0">
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-[#d4af37]/30">
                <button
                  onClick={() => { setActiveTab('class'); setSearchTerm(''); }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer ${
                    activeTab === 'class'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#f4d068] text-slate-950 shadow-md font-semibold'
                      : 'text-[#d4af37]/80 hover:text-[#d4af37] hover:bg-white/5'
                  }`}
                >
                  <School className="w-4 h-4 shrink-0" />
                  <span className={selectedClass && isKhmer(selectedClass.name) ? 'font-moul text-xs' : ''}>
                    {selectedClass ? selectedClass.name : 'ថ្នាក់ (Class)'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (classId) {
                      setActiveTab('student');
                      setSearchTerm('');
                    }
                  }}
                  disabled={!classId}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                    !classId ? 'opacity-40 cursor-not-allowed text-slate-500' : 'cursor-pointer'
                  } ${
                    activeTab === 'student'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#f4d068] text-slate-950 shadow-md font-semibold'
                      : classId ? 'text-[#d4af37]/80 hover:text-[#d4af37] hover:bg-white/5' : ''
                  }`}
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span className={selectedStudent && isKhmer(selectedStudent.name) ? 'font-moul text-xs' : ''}>
                    {selectedStudent ? selectedStudent.name : 'សិស្ស (Student)'}
                  </span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mt-3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]/60 pointer-events-none" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'class'
                      ? 'ស្វែងរកថ្នាក់ / Search Class...'
                      : 'ស្វែងរកឈ្មោះសិស្ស / Search Student...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950/50 border border-[#d4af37]/30 focus:border-[#d4af37] text-[#d4af37] placeholder-[#d4af37]/40 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#d4af37]/60 hover:text-[#d4af37]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* List Body */}
            <div className="relative z-10 p-4 sm:p-5 overflow-y-auto grow min-h-[260px] custom-scrollbar">
              {activeTab === 'class' ? (
                /* Classes View */
                <div>
                  {classesLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#d4af37]/70 gap-3">
                      <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-sans animate-pulse">កំពុងទាញយកទិន្នន័យថ្នាក់...</p>
                    </div>
                  ) : filteredClasses.length === 0 ? (
                    <div className="text-center py-12 text-[#d4af37]/60">
                      <p className="text-base font-sans">មិនមានទិន្នន័យថ្នាក់ឡើយ</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredClasses.map((c) => {
                        const isSelected = c.id === classId;
                        const isKhmerName = isKhmer(c.name);

                        return (
                          <motion.button
                            key={c.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectClass(c.id)}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f4d068] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                : 'bg-slate-900/50 border-[#d4af37]/20 text-[#d4af37]/90 hover:border-[#d4af37]/60 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#d4af37] text-slate-950' : 'bg-slate-800 text-[#d4af37]'
                              }`}>
                                <School className="w-4 h-4" />
                              </div>
                              <span className={`text-base truncate ${isKhmerName ? 'font-moul text-sm text-[#f4d068]' : 'font-serif'}`}>
                                {c.name}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center shrink-0 ml-2">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Students View */
                <div>
                  {studentsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#d4af37]/70 gap-3">
                      <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-sans animate-pulse">កំពុងទាញយកឈ្មោះសិស្ស...</p>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-12 text-[#d4af37]/60">
                      <p className="text-base font-sans">មិនមានឈ្មោះសិស្សក្នុងថ្នាក់នេះឡើយ</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {filteredStudents.map((s) => {
                        const isSelected = s.id === studentId;
                        const isKhmerName = isKhmer(s.name);

                        return (
                          <motion.button
                            key={s.id}
                            whileHover={{ scale: 1.01, x: 3 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelectStudent(s.id)}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f4d068] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                : 'bg-slate-900/50 border-[#d4af37]/20 text-[#d4af37]/90 hover:border-[#d4af37]/60 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#d4af37] text-slate-950' : 'bg-slate-800 text-[#d4af37]/80'
                              }`}>
                                <Users className="w-4 h-4" />
                              </div>
                              <span className={`text-lg truncate ${isKhmerName ? 'font-moul text-base text-[#f4d068] leading-relaxed' : 'font-serif'}`}>
                                {s.name}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center shrink-0 ml-2">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative z-10 p-4 border-t border-[#d4af37]/20 bg-slate-900/60 flex items-center justify-between shrink-0">
              <div className="text-xs text-[#d4af37]/60 font-sans">
                {classId && (
                  <span>
                    ថ្នាក់: <strong className="text-[#d4af37]">{selectedClass?.name || 'Selected'}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#d4af37]/30 text-[#d4af37] hover:bg-white/5 text-sm font-medium transition-all cursor-pointer"
                >
                  បិទ (Close)
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
