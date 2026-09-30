import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, Code2, Server, Sparkles, Shield, Cpu, ChevronLeft, 
  CheckCircle2, Clock, BookOpen, Award, User, Star, Video, 
  HelpCircle, Terminal, FileCode, Users, ArrowUpRight, Zap, Play
} from 'lucide-react';
import { TRAINING_TRACKS, TRAINING_CATEGORIES, TrainingTrack, TrainingModule, TrainingLesson } from '../constants/trainingData';
import FrontendTrackCurriculumView from './FrontendTrackCurriculumView';

interface TechnicalTracksExplorerProps {
  userData?: any;
  onSelectTrack?: (track: TrainingTrack) => void;
}

export default function TechnicalTracksExplorer({ userData, onSelectTrack }: TechnicalTracksExplorerProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalTrack, setActiveModalTrack] = useState<TrainingTrack | null>(null);
  const [activeModuleTab, setActiveModuleTab] = useState<number>(0);

  // Check if current user is a registered student with a dedicated track
  const userTrackRaw = ((userData?.track || '') + ' ' + (userData?.grade || '') + ' ' + (userData?.branch || '')).toLowerCase();
  const isAhmedNabil = userData?.name?.includes('أحمد نبيل');
  const isEnrolledInFrontend = isAhmedNabil || userTrackRaw.includes('front') || userTrackRaw.includes('واجهات');
  const isEnrolledInBackend = !isEnrolledInFrontend && (userTrackRaw.includes('back') || userTrackRaw.includes('خوادم'));
  const isEnrolledInAi = !isEnrolledInFrontend && !isEnrolledInBackend && (userTrackRaw.includes('ai') || userTrackRaw.includes('ذكاء'));
  const isEnrolledInDevOps = !isEnrolledInFrontend && !isEnrolledInBackend && !isEnrolledInAi && (userTrackRaw.includes('devops') || userTrackRaw.includes('أمان'));

  const studentEnrolledTrack: TrainingTrack | null = (userData?.role === 'student' || isAhmedNabil)
    ? (isEnrolledInFrontend
        ? (TRAINING_TRACKS.find(t => t.id === 'frontend-track-pro') || TRAINING_TRACKS[0])
        : isEnrolledInBackend
        ? (TRAINING_TRACKS.find(t => t.id === 'backend-track-pro') || null)
        : isEnrolledInAi
        ? (TRAINING_TRACKS.find(t => t.id === 'ai-gemini-track') || null)
        : isEnrolledInDevOps
        ? (TRAINING_TRACKS.find(t => t.id === 'cybersecurity-devops-track') || null)
        : null)
    : null;

  const filteredTracks = studentEnrolledTrack
    ? [studentEnrolledTrack]
    : TRAINING_TRACKS.filter(track => {
        const matchesCategory = selectedCategory === 'الكل' || track.category === selectedCategory;
        const matchesSearch = !searchQuery.trim() || 
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Code2 className="w-6 h-6" />;
      case 'Server':
        return <Server className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Shield':
        return <Shield className="w-6 h-6" />;
      default:
        return <Cpu className="w-6 h-6" />;
    }
  };

  const getLessonIcon = (type: TrainingLesson['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-3.5 h-3.5 text-blue-500" />;
      case 'interactive_lab':
        return <Terminal className="w-3.5 h-3.5 text-emerald-500" />;
      case 'quiz':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-500" />;
      case 'project':
        return <FileCode className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Video className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  // If student has an enrolled track, display the specialized dedicated single track view
  if (studentEnrolledTrack) {
    if (studentEnrolledTrack.id === 'frontend-track-pro') {
      return (
        <FrontendTrackCurriculumView 
          userData={userData}
          onNavigateToExam={() => navigate('/exam/python-fundamentals-frontend-exam')}
        />
      );
    }

    return (
      <section className="space-y-6 text-right" dir="rtl">
        {/* Enrolled Track Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                مسارك التدريبي المعتمد (Enrolled Track)
              </span>
              <span className="text-xs font-medium text-gray-400">
                مسار نشط ومخصص لك
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-500" />
              <span>{studentEnrolledTrack.title}</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              مرحباً بك يا {userData?.name || 'متدربنا العزيز'}، تم تخصيص وتثبيت واجهتك لعرض مسار الواجهات الأمامية الخاص بك فقط.
            </p>
          </div>
        </div>

        {/* Dedicated Track Showcase Card */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          {/* Top Info Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-gray-100 dark:border-slate-800/80 pb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                {getTrackIcon(studentEnrolledTrack.icon)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">
                    {studentEnrolledTrack.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    مُسجل وفعّال
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${studentEnrolledTrack.badgeColor}`}>
                    {studentEnrolledTrack.level}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                  {studentEnrolledTrack.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
                  {studentEnrolledTrack.summary}
                </p>
              </div>
            </div>

            {/* Instructor snippet */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0D121F] border border-gray-100 dark:border-slate-800 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  {studentEnrolledTrack.instructor.name}
                </span>
                <span className="text-[10.5px] text-gray-400 font-medium block">
                  {studentEnrolledTrack.instructor.title}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>تقييم المدرب: {studentEnrolledTrack.instructor.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Skills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            <div className="p-3.5 bg-gray-50 dark:bg-[#0D121F] border border-gray-100 dark:border-slate-800 rounded-2xl text-center space-y-1">
              <BookOpen className="w-4 h-4 text-cyan-500 mx-auto" />
              <p className="text-[10px] text-gray-400 font-medium">الوحدات التدريبية</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{studentEnrolledTrack.totalModules} وحدات</p>
            </div>
            <div className="p-3.5 bg-gray-50 dark:bg-[#0D121F] border border-gray-100 dark:border-slate-800 rounded-2xl text-center space-y-1">
              <Award className="w-4 h-4 text-purple-500 mx-auto" />
              <p className="text-[10px] text-gray-400 font-medium">المشاريع العملية</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{studentEnrolledTrack.projectsCount} مشاريع</p>
            </div>
            <div className="p-3.5 bg-gray-50 dark:bg-[#0D121F] border border-gray-100 dark:border-slate-800 rounded-2xl text-center space-y-1">
              <Clock className="w-4 h-4 text-emerald-500 mx-auto" />
              <p className="text-[10px] text-gray-400 font-medium">الساعات المعتمدة</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{studentEnrolledTrack.totalHours} ساعة</p>
            </div>
            <div className="p-3.5 bg-gray-50 dark:bg-[#0D121F] border border-gray-100 dark:border-slate-800 rounded-2xl text-center space-y-1">
              <Zap className="w-4 h-4 text-amber-500 mx-auto" />
              <p className="text-[10px] text-gray-400 font-medium">مدة البرنامج</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{studentEnrolledTrack.durationWeeks} أسابيع</p>
            </div>
          </div>

          {/* Action Row: Python Exam Button & Details Button */}
          <div className="p-5 rounded-2xl bg-gradient-to-l from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-right">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  اختبار أساسيات بايثون المعتمد (Python Fundamentals Exam)
                </h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                اختبار تقني رسمي مكون من 20 سؤالاً معتمدين مع تصحيح تلقائي وتفسير تفصيلي للإجابات (مسموح بمحاولة واحدة فقط).
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                onClick={() => navigate('/exam/python-fundamentals-frontend-exam')}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>بدء الاختبار الآن</span>
              </button>
              <button
                onClick={() => {
                  setActiveModalTrack(studentEnrolledTrack);
                  setActiveModuleTab(0);
                }}
                className="w-full sm:w-auto px-4 py-3 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>المنهج الكامل</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Embedded Curriculum Preview */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span>الوحدات التدريبية المعتمدة للمسار ({studentEnrolledTrack.curriculum.length} وحدات):</span>
            </h4>

            {/* Modules Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {studentEnrolledTrack.curriculum.map((mod, idx) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleTab(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeModuleTab === idx
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-[#0D121F] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800 border border-gray-200/60 dark:border-slate-800'
                  }`}
                >
                  <span>الوحدة {idx + 1}</span>
                  <span className="text-[10px] opacity-75">({mod.estimatedHours} س)</span>
                </button>
              ))}
            </div>

            {/* Active Module Details Card */}
            {studentEnrolledTrack.curriculum[activeModuleTab] && (
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#0D121F] border border-gray-100 dark:border-slate-800 space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                    {studentEnrolledTrack.curriculum[activeModuleTab].title}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    {studentEnrolledTrack.curriculum[activeModuleTab].description}
                  </p>
                </div>

                {/* Lessons list */}
                <div className="space-y-2 pt-1">
                  {studentEnrolledTrack.curriculum[activeModuleTab].lessons.map((lesson, lIdx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#111827] border border-gray-200/70 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 text-[10px] font-semibold text-gray-500 flex items-center justify-center">
                          {lIdx + 1}
                        </span>
                        {getLessonIcon(lesson.type)}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {lesson.title}
                        </span>
                        {lesson.isFreePreview && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/10 text-emerald-500 rounded">
                            متاح
                          </span>
                        )}
                      </div>

                      <span className="text-[10.5px] font-medium text-gray-400 font-mono">
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Track Curriculum Details Modal */}
        {activeModalTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
            <div className="bg-white dark:bg-[#0D121F] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
              <button
                onClick={() => setActiveModalTrack(null)}
                className="absolute top-5 left-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold cursor-pointer"
              >
                
              </button>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${activeModalTrack.badgeColor}`}>
                    {activeModalTrack.category} • {activeModalTrack.level}
                  </span>
                  <span className="text-[11px] font-medium text-gray-400">
                    {activeModalTrack.totalHours} ساعة تدريبية معتمدة
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {activeModalTrack.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                  {activeModalTrack.description}
                </p>
              </div>

              {/* Learning Outcomes */}
              <div className="bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> مخرجات التعلم والمهارات المكتسبة:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {activeModalTrack.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    setActiveModalTrack(null);
                    navigate('/exam/python-fundamentals-frontend-exam');
                  }}
                  className="w-full py-3 bg-gradient-to-l from-emerald-500 to-teal-600 hover:opacity-95 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  بدء اختبار أساسيات بايثون المعتمد (20 سؤال - محاولة واحدة)
                </button>
                <button
                  onClick={() => setActiveModalTrack(null)}
                  className="w-full py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  إغلاق تفاصيل المسار
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // Fallback for general overview or non-enrolled users
  return (
    <section className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              مسارات التدريب الاحترافية (Training Tracks)
            </span>
            <span className="text-xs font-medium text-gray-400">
              {filteredTracks.length} مسار معتمد
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            <span>مسارات التدريب والتخصصات التقنية</span>
          </h2>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {TRAINING_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
                  : 'bg-gray-100 dark:bg-[#111827] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTracks.map(track => (
          <div
            key={track.id}
            className="bg-white dark:bg-[#111827] border border-gray-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top row */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    {getTrackIcon(track.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                      {track.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors leading-snug">
                      {track.title}
                    </h3>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold border shrink-0 ${track.badgeColor}`}>
                  {track.level}
                </span>
              </div>

              {/* Summary */}
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {track.summary}
              </p>

              {/* Instructor snippet */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#0D121F] border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-900 dark:text-white block">
                      {track.instructor.name}
                    </span>
                    <span className="text-[9.5px] text-gray-400 font-medium block">
                      {track.instructor.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{track.rating}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {track.skills.slice(0, 4).map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-gray-50 dark:bg-[#0A102E]/60 border border-gray-150 dark:border-slate-800 rounded-lg text-[10px] font-semibold text-gray-600 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
                {track.skills.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800/40 rounded-lg text-[10px] font-medium text-gray-400">
                    +{track.skills.length - 4} مهارات
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{track.totalModules} وحدات</span>
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{track.projectsCount} مشاريع</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{track.durationWeeks} أسابيع</span>
                </span>
              </div>

              <button
                onClick={() => {
                  setActiveModalTrack(track);
                  setActiveModuleTab(0);
                  if (onSelectTrack) onSelectTrack(track);
                }}
                className="px-3.5 py-1.5 bg-gray-100 dark:bg-slate-800/80 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>تفاصيل المسار</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Curriculum Details Modal */}
      {activeModalTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white dark:bg-[#0D121F] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModalTrack(null)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold cursor-pointer"
            >
              
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${activeModalTrack.badgeColor}`}>
                  {activeModalTrack.category} • {activeModalTrack.level}
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  {activeModalTrack.totalHours} ساعة تدريبية معتمدة
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {activeModalTrack.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                {activeModalTrack.description}
              </p>
            </div>

            {/* Instructor Highlight */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#111827] border border-gray-150 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {activeModalTrack.instructor.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                      مدرب المسار
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {activeModalTrack.instructor.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {activeModalTrack.instructor.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-center shrink-0 self-end sm:self-center">
                <div>
                  <span className="block text-xs font-semibold text-amber-500 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" /> {activeModalTrack.instructor.rating}
                  </span>
                  <span className="text-[9.5px] text-gray-400 font-medium">التقييم العام</span>
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />
                <div>
                  <span className="block text-xs font-semibold text-gray-900 dark:text-white">
                    {activeModalTrack.instructor.experienceYears}+ سنوات
                  </span>
                  <span className="text-[9.5px] text-gray-400 font-medium">خبرة مهنية</span>
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> مخرجات التعلم والمهارات المكتسبة:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                {activeModalTrack.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              {activeModalTrack.id === 'frontend-track-pro' && (
                <button
                  onClick={() => {
                    setActiveModalTrack(null);
                    navigate('/exam/python-fundamentals-frontend-exam');
                  }}
                  className="w-full py-3 bg-gradient-to-l from-emerald-500 to-teal-600 hover:opacity-95 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  بدء اختبار أساسيات بايثون المعتمد (20 سؤال - محاولة واحدة)
                </button>
              )}
              <button
                onClick={() => setActiveModalTrack(null)}
                className="w-full py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                إغلاق تفاصيل المسار
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
