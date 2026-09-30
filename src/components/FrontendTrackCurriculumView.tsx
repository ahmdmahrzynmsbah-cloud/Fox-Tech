import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, ChevronUp, CheckCircle2, Lock, Unlock, BookOpen, 
  Code2, Copy, Check, Sparkles, Terminal, Award, Laptop, FileCode,
  Shield, Lightbulb, AlertTriangle, Play, HelpCircle, Layers, User,
  Sliders, Bell, RefreshCw, Send, Target, Compass, ListOrdered, CheckSquare, Eye, EyeOff,
  Download, ExternalLink, Video, Pause, RotateCcw, Maximize2, Monitor, Cpu, Flame, PlayCircle
} from 'lucide-react';
import { FRONTEND_CURRICULUM, DetailedModule, DetailedLesson } from '../constants/frontendDetailedCurriculum';
import { InteractiveCodePlayground } from './InteractiveCodePlayground';
import { INSTRUCTORS } from '../constants/trainingData';
import { toast } from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FrontendTrackCurriculumViewProps {
  userData?: any;
  onNavigateToExam?: () => void;
}

export default function FrontendTrackCurriculumView({ userData, onNavigateToExam }: FrontendTrackCurriculumViewProps) {
  const isTeacherOrAdmin = userData?.role === 'teacher' || userData?.role === 'admin' || userData?.name?.includes('محمد السيد');
  
  // States
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1-web-basics': true, // First module open by default
  });
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({
    'lesson-1-1': true, // First lesson open by default
  });

  const allCurriculumLessons = FRONTEND_CURRICULUM.flatMap(m => m.lessons);

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('frontend_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lockedLessons, setLockedLessons] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('frontend_locked_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [revealedChallenges, setRevealedChallenges] = useState<Record<string, boolean>>({});
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<string | null>(null);
  const [trainerAnnouncement, setTrainerAnnouncement] = useState<string>('مرحباً بكم يا شباب في المعسكر التدريبي! تم فتح الوحدات الأساسية للدراسة التطبيقية، ركزوا على كتابة كل كود بأيديكم.');
  const [showTrainerControls, setShowTrainerControls] = useState(isTeacherOrAdmin);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  const toggleChallengeSolution = (lessonId: string) => {
    setRevealedChallenges(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };



  // Load custom lock state from Firestore if available
  useEffect(() => {
    const fetchLockState = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'system_settings', 'frontend_track_state'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.lockedLessons) setLockedLessons(data.lockedLessons);
          if (data.announcement) setTrainerAnnouncement(data.announcement);
        }
      } catch (e) {
        // Fallback to local
      }
    };
    fetchLockState();
  }, []);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleLesson = (lessonId: string) => {
    const gIdx = allCurriculumLessons.findIndex(l => l.id === lessonId);
    
    // Enforce sequential progression for students
    if (!isTeacherOrAdmin && gIdx > 0) {
      const prevL = allCurriculumLessons[gIdx - 1];
      if (!completedLessons[prevL.id]) {
        toast.error(` تنبيه: يجب تحديد الدرس السابق (${prevL.title}) كمكتمل أولاً لفتح هذا الدرس!`, {
          duration: 3500,
          icon: ''
        });
        return;
      }
    }

    if (!isTeacherOrAdmin && lockedLessons[lessonId]) {
      toast.error('هذا الدرس مغلق حالياً بواسطة المدرب م. محمد السيد.');
      return;
    }

    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIdx(id);
    toast.success('تم نسخ الكود بنجاح!');
    setTimeout(() => {
      setCopiedSnippetIdx(null);
    }, 2000);
  };

  const toggleLessonCompletion = (lessonId: string) => {
    const gIdx = allCurriculumLessons.findIndex(l => l.id === lessonId);
    const wasCompleted = !!completedLessons[lessonId];
    const willBeCompleted = !wasCompleted;

    setCompletedLessons(prev => {
      const updated = { ...prev, [lessonId]: willBeCompleted };
      try {
        localStorage.setItem('frontend_completed_lessons', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (willBeCompleted) {
      const nextL = allCurriculumLessons[gIdx + 1];
      if (nextL) {
        setExpandedModules(prev => ({ ...prev, [nextL.moduleId]: true }));
        setExpandedLessons(prev => ({ ...prev, [nextL.id]: true }));
        toast.success(` أحسنت يا بطل! تم إتمام الدرس وفتح "${nextL.title}" بنجاح!`, {
          duration: 4000
        });
      } else {
        toast.success(' رائع جداً! لقد أتممت جميع دروس مسار الـ Frontend بالكامل!', {
          duration: 5000
        });
      }
    } else {
      toast('تم إلغاء تحديد إكمال الدرس', { icon: 'ℹ' });
    }
  };

  // Trainer control actions
  const toggleLessonLock = async (lessonId: string) => {
    const updated = { ...lockedLessons, [lessonId]: !lockedLessons[lessonId] };
    setLockedLessons(updated);
    try {
      localStorage.setItem('frontend_locked_lessons', JSON.stringify(updated));
      await setDoc(doc(db, 'system_settings', 'frontend_track_state'), {
        lockedLessons: updated,
        announcement: trainerAnnouncement,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch {}
    toast.success(updated[lessonId] ? 'تم قفل الدرس للطلاب' : 'تم فتح الدرس للطلاب');
  };

  const unlockAllModules = async () => {
    setLockedLessons({});
    try {
      localStorage.setItem('frontend_locked_lessons', JSON.stringify({}));
      await setDoc(doc(db, 'system_settings', 'frontend_track_state'), {
        lockedLessons: {},
        announcement: trainerAnnouncement,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch {}
    toast.success('تم فتح جميع الأجزاء والدروس لكافة المتدربين!');
  };

  const lockAdvancedModules = async () => {
    const locked: Record<string, boolean> = {};
    FRONTEND_CURRICULUM.forEach((mod, idx) => {
      if (idx >= 3) {
        mod.lessons.forEach(l => {
          locked[l.id] = true;
        });
      }
    });
    setLockedLessons(locked);
    try {
      localStorage.setItem('frontend_locked_lessons', JSON.stringify(locked));
      await setDoc(doc(db, 'system_settings', 'frontend_track_state'), {
        lockedLessons: locked,
        announcement: trainerAnnouncement,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch {}
    toast.success('تم قفل الوحدات المتقدمة حتى انتهاء تقييم المرحلة الأولى!');
  };

  const handleUpdateAnnouncement = async () => {
    if (!newAnnouncementText.trim()) return;
    setTrainerAnnouncement(newAnnouncementText.trim());
    try {
      await setDoc(doc(db, 'system_settings', 'frontend_track_state'), {
        announcement: newAnnouncementText.trim(),
        lockedLessons,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch {}
    setNewAnnouncementText('');
    toast.success('تم نشر التنبيه لجميع متدربي المسار!');
  };

  // Calculate statistics
  const totalLessonsCount = FRONTEND_CURRICULUM.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessonsCount) * 100));

  const instructor = INSTRUCTORS.frontendLead;

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'FileCode': return <FileCode className="w-5 h-5 text-emerald-400" />;
      case 'Layout': return <Layers className="w-5 h-5 text-blue-400" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-red-400" />;
      default: return <BookOpen className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Top Banner / Instructor Showcase */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0e1629] to-slate-950 border border-slate-800/80 p-5 sm:p-7 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                المسار التدريبي الشامل
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                من الصفر حتى الاحتراف
              </span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-normal leading-snug">
                مسار تطوير واجهات المستخدم المتقدمة{' '}
                <span className="text-cyan-400 font-bold text-sm sm:text-base font-mono inline-block px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 mt-1 sm:mt-0" dir="ltr">
                  Modern Frontend Engineering
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                تدريب كتابي وتطبيقي شامل ومفصل بالعامية المصرية مع أمثلة كود حقيقية وقابلة للنسخ، مقسم إلى وحدات منظمة بنظام القوائم الانزلاقية (Accordion) لسهولة المتابعة والتطبيق العملي.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="pt-1.5 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-cyan-400">نسبة إنجازك في المسار: {progressPercent}%</span>
                <span className="text-slate-400 text-[11px]">({completedCount} من {totalLessonsCount} درس مكتمل)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Instructor Card with Avatar Icon (No Photos) */}
          <div className="flex items-center gap-3.5 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-4.5 shrink-0 shadow-xl backdrop-blur-md">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-800 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
                <User className="w-7 h-7" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
                
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-cyan-400 block">مدرب ومسؤول المسار</span>
              <h3 className="text-base font-black text-white">{instructor.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium">{instructor.title}</p>
              <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-300">
                <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                   {instructor.rating}
                </span>
                <span>•</span>
                <span>{instructor.studentsCount} متدرب</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trainer Announcement Bar */}
        {trainerAnnouncement && (
          <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/25 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-black text-cyan-300">توجيه وإعلان من م. محمد السيد:</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {trainerAnnouncement}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Trainer Control Center (Visible for Trainer/Admin) */}
      {isTeacherOrAdmin && (
        <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">لوحة تحكم المدرب (م. محمد السيد)</h3>
                <p className="text-xs text-slate-400 font-medium">التحكم في فتح وقفل أجزاء المسار ونشر توجيهات المتدربين</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={unlockAllModules}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                فتح جميع الأجزاء
              </button>
              <button 
                onClick={lockAdvancedModules}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                قفل الأجزاء المتقدمة
              </button>
            </div>
          </div>

          {/* Post New Announcement */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <input 
              type="text"
              value={newAnnouncementText}
              onChange={(e) => setNewAnnouncementText(e.target.value)}
              placeholder="اكتب توجيهاً أو إعلاناً جديداً يظهر لجميع طلاب مسار الفرونت إند..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleUpdateAnnouncement}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              نشر التوجيه
            </button>
          </div>
        </div>
      )}

      {/* Curriculum Accordion Modules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>خطة المنهج التدريبي والشروحات التفصيلية</span>
          </h2>
          <span className="text-xs text-slate-400 font-bold">
            اضغط على أي جزء لفتحه أو إغلاقه
          </span>
        </div>

        {FRONTEND_CURRICULUM.map((moduleItem, modIdx) => {
          const isModExpanded = !!expandedModules[moduleItem.id];
          const moduleLessonsCount = moduleItem.lessons.length;
          const completedInModule = moduleItem.lessons.filter(l => completedLessons[l.id]).length;
          const isAllCompletedInModule = completedInModule === moduleLessonsCount;

          return (
            <div 
              key={moduleItem.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isModExpanded 
                  ? 'bg-slate-900/95 border-cyan-500/30 shadow-xl' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Module Accordion Header */}
              <button
                type="button"
                onClick={() => toggleModule(moduleItem.id)}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-right cursor-pointer select-none transition-colors hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    {getModuleIcon(moduleItem.iconName)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-cyan-400">
                        الوحدة {moduleItem.order}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {moduleItem.durationHours} ساعات
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {moduleItem.badge}
                      </span>
                      {isAllCompletedInModule && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> تم الإنجاز
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {moduleItem.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-normal line-clamp-1 mt-0.5">
                      {moduleItem.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                    {completedInModule} / {moduleLessonsCount} دروس
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                    isModExpanded ? 'bg-cyan-500/20 text-cyan-400 rotate-180' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Module Content / Nested Lessons Accordion */}
              <AnimatePresence initial={false}>
                {isModExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="border-t border-slate-800/80 bg-slate-950/40 p-4 sm:p-6 space-y-4"
                  >
                    {moduleItem.lessons.map((lesson, lIdx) => {
                      const isLessonOpen = !!expandedLessons[lesson.id];
                      const isCompleted = !!completedLessons[lesson.id];
                      const globalLessonIndex = allCurriculumLessons.findIndex(l => l.id === lesson.id);
                      const prevLesson = globalLessonIndex > 0 ? allCurriculumLessons[globalLessonIndex - 1] : null;
                      const isPrerequisiteMet = globalLessonIndex === 0 || (prevLesson ? !!completedLessons[prevLesson.id] : true);
                      const isManualLocked = !!lockedLessons[lesson.id];
                      const isLocked = !isTeacherOrAdmin && (!isPrerequisiteMet || isManualLocked);

                      return (
                        <div 
                          key={lesson.id}
                          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                            isLocked
                              ? 'bg-slate-900/30 border-slate-800/60 opacity-80'
                              : isLessonOpen
                              ? 'bg-slate-900 border-cyan-500/40 shadow-lg'
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Lesson Item Header */}
                          <div className="p-4 sm:p-5 flex items-center justify-between gap-3 select-none">
                            <button
                              type="button"
                              onClick={() => toggleLesson(lesson.id)}
                              className="flex-1 flex items-center gap-3 text-right cursor-pointer"
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                                isCompleted 
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : isLocked
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              }`}>
                                {isLocked ? (
                                  <Lock className="w-4 h-4" />
                                ) : isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Terminal className="w-4 h-4" />
                                )}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`text-xs font-black transition-colors ${
                                    isLocked ? 'text-slate-400' : 'text-white hover:text-cyan-400'
                                  }`}>
                                    {lesson.title}
                                  </span>
                                  {isLocked && !isPrerequisiteMet && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" /> يتطلب إكمال الدرس السابق
                                    </span>
                                  )}
                                  {isLocked && isPrerequisiteMet && isManualLocked && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" /> مغلق من المدرب
                                    </span>
                                  )}
                                  {isCompleted && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                       تم الإنجاز
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                                  مدة الشرح والتطبيق: {lesson.duration}
                                </span>
                              </div>
                            </button>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Trainer lock/unlock toggle button */}
                              {isTeacherOrAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLessonLock(lesson.id);
                                  }}
                                  title={isManualLocked ? 'فتح الدرس للطلاب' : 'قفل الدرس'}
                                  className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                                    isManualLocked 
                                      ? 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                  }`}
                                >
                                  {isManualLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                </button>
                              )}

                              {/* Trainee completion toggle */}
                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isLocked) {
                                    toggleLesson(lesson.id);
                                    return;
                                  }
                                  toggleLessonCompletion(lesson.id);
                                }}
                                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  isCompleted
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                                    : isLocked
                                    ? 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed'
                                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
                                }`}
                              >
                                {isCompleted ? ' مكتمل' : isLocked ? ' مقفل' : 'تحديد كمكتمل'}
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleLesson(lesson.id)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                                  isLessonOpen ? 'rotate-180 text-cyan-400 bg-cyan-500/10' : 'text-slate-500'
                                }`}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Lesson Deep Explanation Body (Accordion Dropdown) */}
                          <AnimatePresence initial={false}>
                            {isLessonOpen && !isLocked && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-slate-800 px-5 py-6 bg-slate-950/70 space-y-6"
                              >
                                {/* 1. Download Resources & Installation Center (مركز التحميلات وروابط البرامج) */}
                                {lesson.downloads && lesson.downloads.length > 0 && (
                                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a1224] to-cyan-950/40 border border-cyan-500/30 space-y-4">
                                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs sm:text-sm">
                                        <Download className="w-4 h-4 text-cyan-400" />
                                        <span> البرامج المطلوبة وروابط التحميل الرسمية ودليل التثبيت:</span>
                                      </div>
                                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                        روابط رسمية آمنة 100%
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                      {lesson.downloads.map((item, dIdx) => (
                                        <div key={dIdx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                              <div className="flex items-center gap-2">
                                                <Laptop className="w-4 h-4 text-cyan-400" />
                                                <h5 className="text-sm font-bold text-white">{item.title}</h5>
                                              </div>
                                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-[10px] text-slate-400 font-medium">الإصدار: {item.version}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">| الحجم: {item.size}</span>
                                                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">متوافق مع: {item.platform}</span>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                              <a
                                                href={item.directUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                                              >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>تحميل البرنامج الآن</span>
                                                <ExternalLink className="w-3 h-3 opacity-70" />
                                              </a>
                                            </div>
                                          </div>

                                          {/* Step by step install guide */}
                                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                                            <span className="text-[11px] font-bold text-amber-400 block">
                                               خطوات التثبيت والتشغيل بالتفصيل خطوة بخطوة:
                                            </span>
                                            <ul className="space-y-1">
                                              {item.guideSteps.map((gStep, gIdx) => (
                                                <li key={gIdx} className="text-xs text-slate-300 font-normal leading-relaxed pr-2">
                                                  {gStep}
                                                </li>
                                              ))}
                                            </ul>
                                            {item.installCommand && (
                                              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                                                <span className="text-[10px] text-slate-400 font-mono">أمر التحقق من التثبيت:</span>
                                                <div className="flex items-center gap-2">
                                                  <code className="px-2 py-1 rounded bg-slate-900 text-cyan-300 font-mono text-xs" dir="ltr">
                                                    {item.installCommand}
                                                  </code>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleCopyCode(item.installCommand!, `cmd-${dIdx}`)}
                                                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                                                    title="نسخ الأمر"
                                                  >
                                                    <Copy className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}


                                {/* 3. Interactive Live Code Playground (مختبر التجربة الحية للأكواد) */}
                                {lesson.playground && (
                                  <InteractiveCodePlayground
                                    lessonId={lesson.id}
                                    lessonTitle={lesson.title}
                                    initialHtml={lesson.playground.initialHtml}
                                    initialCss={lesson.playground.initialCss}
                                    initialJs={lesson.playground.initialJs}
                                    previewNote={lesson.playground.previewNote}
                                  />
                                )}

                                {/* 4. Real World Analogy Box */}
                                {lesson.realWorldAnalogy && (
                                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 space-y-1.5">
                                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                                      <Lightbulb className="w-4 h-4 text-amber-400" />
                                      <span> فكرة الدرس من الواقع المعاش (تبسيط المفاهيم):</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                                      {lesson.realWorldAnalogy}
                                    </p>
                                  </div>
                                )}

                                {/* 2. In-Depth Explanation Text in Egyptian Arabic */}
                                <div className="space-y-2">
                                  <h4 className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    الشرح المعماري والتطبيقي المفصل (م. محمد السيد):
                                  </h4>
                                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line bg-slate-900/80 p-5 rounded-2xl border border-slate-800/90 shadow-inner">
                                    {lesson.explanationAr}
                                  </div>
                                </div>

                                {/* 3. Step-by-Step Implementation Guide (مرتبة وواضحة خطوة بخطوة) */}
                                {lesson.steps && lesson.steps.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                                      <ListOrdered className="w-4 h-4" />
                                      خطوات التطبيق والتنفيذ العملي (خطوة بخطوة بالترتيب):
                                    </h4>
                                    <div className="space-y-2.5">
                                      {lesson.steps.map((step, sIdx) => (
                                        <div key={sIdx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                          <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-xs shrink-0">
                                              {step.stepNumber || sIdx + 1}
                                            </span>
                                            <h5 className="text-xs sm:text-sm font-bold text-white">
                                              {step.title}
                                            </h5>
                                          </div>
                                          <p className="text-xs text-slate-300 font-medium pr-10">
                                            <strong className="text-cyan-400">الإجراء المطلوب:</strong> {step.action}
                                          </p>
                                          {step.explanation && (
                                            <p className="text-[11px] text-slate-400 font-normal pr-10">
                                               <strong>التفسير والهدف:</strong> {step.explanation}
                                            </p>
                                          )}
                                          {step.codeSnippet && (
                                            <div className="mr-10 my-1.5 p-2 rounded-xl bg-[#080d1a] border border-slate-800 font-mono text-xs text-cyan-200" dir="ltr">
                                              <code>{step.codeSnippet}</code>
                                            </div>
                                          )}
                                          {step.expectedResult && (
                                            <div className="mr-10 flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                                              <CheckCircle2 className="w-3.5 h-3.5" />
                                              <span>النتيجة المتوقعة: {step.expectedResult}</span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 4. Key Points Golden Takeaways */}
                                {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                                      <CheckSquare className="w-4 h-4" />
                                      الخلاصة والنقاط الذهبية:
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {lesson.keyPoints.map((point, pIdx) => (
                                        <li key={pIdx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-medium flex items-start gap-2">
                                          <span className="text-cyan-400 font-bold shrink-0 mt-0.5">●</span>
                                          <span>{point}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* 5. Code Snippets with Live Copy Button */}
                                {lesson.codeSnippets && lesson.codeSnippets.map((snippet, sIdx) => {
                                  const snippetId = `${lesson.id}-s-${sIdx}`;
                                  const isCopied = copiedSnippetIdx === snippetId;

                                  return (
                                    <div key={sIdx} className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                                          {snippet.title}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopyCode(snippet.code, snippetId)}
                                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 shadow-sm"
                                        >
                                          {isCopied ? (
                                            <>
                                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                                              <span className="text-emerald-400">تم النسخ!</span>
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3.5 h-3.5" />
                                              <span>نسخ الكود</span>
                                            </>
                                          )}
                                        </button>
                                      </div>

                                      {/* Code Box */}
                                      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#070b14]">
                                        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400" dir="ltr">
                                          <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                          </div>
                                          <span className="text-cyan-400 font-bold uppercase">{snippet.language}</span>
                                        </div>
                                        <pre className="p-4 text-xs font-mono text-cyan-100 overflow-x-auto leading-relaxed" dir="ltr">
                                          <code>{snippet.code}</code>
                                        </pre>
                                      </div>
                                      <p className="text-[11px] text-slate-400 font-medium px-1">
                                         {snippet.explanation}
                                      </p>
                                    </div>
                                  );
                                })}

                                {/* 6. Hands-On Challenge & Interactive Solution Reveal */}
                                {lesson.challenge && (
                                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/30 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                                        <Target className="w-4 h-4 text-indigo-400" />
                                        <span> {lesson.challenge.title}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => toggleChallengeSolution(lesson.id)}
                                        className="px-3 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                      >
                                        {revealedChallenges[lesson.id] ? (
                                          <>
                                            <EyeOff className="w-3.5 h-3.5" />
                                            <span>إخفاء الحل</span>
                                          </>
                                        ) : (
                                          <>
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>عرض الحل النموذجي</span>
                                          </>
                                        )}
                                      </button>
                                    </div>

                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                      <strong>المطلوب:</strong> {lesson.challenge.goal}
                                    </p>

                                    {revealedChallenges[lesson.id] && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-2 pt-2 border-t border-indigo-500/20"
                                      >
                                        <div className="relative rounded-xl overflow-hidden border border-indigo-500/30 bg-[#070a14]">
                                          <pre className="p-3 text-xs font-mono text-indigo-200 overflow-x-auto" dir="ltr">
                                            <code>{lesson.challenge.solutionCode}</code>
                                          </pre>
                                        </div>
                                        <p className="text-[11px] text-slate-400 font-medium">
                                           <strong>تفسير الحل:</strong> {lesson.challenge.explanation}
                                        </p>
                                      </motion.div>
                                    )}
                                  </div>
                                )}

                                {/* 7. Interview Q&A Box */}
                                {lesson.interviewQA && lesson.interviewQA.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-black text-purple-400 flex items-center gap-1.5">
                                      <HelpCircle className="w-4 h-4" />
                                       أسئلة المقابلات الوظيفية وسوق العمل (Interview Prep):
                                    </h4>
                                    <div className="space-y-2">
                                      {lesson.interviewQA.map((qa, qIdx) => (
                                        <div key={qIdx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                          <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <span className="text-purple-400">س:</span> {qa.question}
                                          </p>
                                          <p className="text-xs text-slate-300 font-normal leading-relaxed pr-3 border-r-2 border-purple-500/40">
                                            <strong className="text-emerald-400">الإجابة النموذجية:</strong> {qa.answer}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 8. Pro Tip & Common Mistake Boxes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                  {lesson.proTip && (
                                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                                        <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>نصيحة سرية من سوق العمل:</span>
                                      </div>
                                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                        {lesson.proTip}
                                      </p>
                                    </div>
                                  )}

                                  {lesson.commonMistake && (
                                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                        <span>خطأ مشهور إياك تقع فيه:</span>
                                      </div>
                                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                        {lesson.commonMistake}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* 9. Finish Lesson Button */}
                                <div className="pt-3 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => toggleLessonCompletion(lesson.id)}
                                    className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                                      isCompleted
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                        : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-lg shadow-cyan-500/20'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {isCompleted 
                                      ? ' تم إنجاز هذا الدرس بنجاح (اضغط للإلغاء)' 
                                      : globalLessonIndex < allCurriculumLessons.length - 1 
                                      ? 'تحديد هذا الدرس كمكتمل وفتح الدرس التالي ' 
                                      : 'تحديد هذا الدرس كمكتمل وإنهاء المسار '
                                    }
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
