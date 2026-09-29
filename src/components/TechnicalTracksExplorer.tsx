import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, Code2, Server, Sparkles, Shield, Cpu, ChevronLeft, 
  CheckCircle2, Clock, BookOpen, Award, User, Star, Video, 
  HelpCircle, Terminal, FileCode, Users, ArrowUpRight, Zap
} from 'lucide-react';
import { TRAINING_TRACKS, TRAINING_CATEGORIES, TrainingTrack, TrainingModule, TrainingLesson } from '../constants/trainingData';

interface TechnicalTracksExplorerProps {
  onSelectTrack?: (track: TrainingTrack) => void;
}

export default function TechnicalTracksExplorer({ onSelectTrack }: TechnicalTracksExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalTrack, setActiveModalTrack] = useState<TrainingTrack | null>(null);
  const [activeModuleTab, setActiveModuleTab] = useState<number>(0);

  const filteredTracks = TRAINING_TRACKS.filter(track => {
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

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              مسارات التدريب الاحترافية (Training Tracks)
            </span>
            <span className="text-xs font-bold text-gray-400">
              {filteredTracks.length} مسار معتمد
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 block mb-0.5">
                      {track.category}
                    </span>
                    <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors leading-snug">
                      {track.title}
                    </h3>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border shrink-0 ${track.badgeColor}`}>
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
                  <img
                    src={track.instructor.avatar}
                    alt={track.instructor.name}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-500/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[11px] font-black text-gray-900 dark:text-white block">
                      {track.instructor.name}
                    </span>
                    <span className="text-[9.5px] text-gray-400 font-medium block">
                      {track.instructor.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{track.rating}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {track.skills.slice(0, 4).map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-gray-50 dark:bg-[#0A102E]/60 border border-gray-150 dark:border-slate-800 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
                {track.skills.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800/40 rounded-lg text-[10px] font-bold text-gray-400">
                    +{track.skills.length - 4} مهارات
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400">
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
                className="px-3.5 py-1.5 bg-gray-100 dark:bg-slate-800/80 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
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
              ✕
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${activeModalTrack.badgeColor}`}>
                  {activeModalTrack.category} • {activeModalTrack.level}
                </span>
                <span className="text-[11px] font-bold text-gray-400">
                  {activeModalTrack.totalHours} ساعة تدريبية معتمدة
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {activeModalTrack.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                {activeModalTrack.description}
              </p>
            </div>

            {/* Instructor Highlight */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#111827] border border-gray-150 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeModalTrack.instructor.avatar}
                  alt={activeModalTrack.instructor.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-500/40 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white">
                      {activeModalTrack.instructor.name}
                    </h4>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
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
                  <span className="block text-xs font-black text-amber-500 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" /> {activeModalTrack.instructor.rating}
                  </span>
                  <span className="text-[9.5px] text-gray-400 font-medium">التقييم العام</span>
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />
                <div>
                  <span className="block text-xs font-black text-gray-900 dark:text-white">
                    {activeModalTrack.instructor.experienceYears}+ سنوات
                  </span>
                  <span className="text-[9.5px] text-gray-400 font-medium">خبرة مهنية</span>
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
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

            {/* Modules & Lessons Interactive Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                  <span>المنهج والوحدات التدريبية ({activeModalTrack.curriculum.length} وحدات):</span>
                </h4>
              </div>

              {/* Modules selection pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {activeModalTrack.curriculum.map((mod, idx) => (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleTab(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeModuleTab === idx
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-[#111827] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>الوحدة {idx + 1}</span>
                    <span className="text-[10px] opacity-75">({mod.estimatedHours} س)</span>
                  </button>
                ))}
              </div>

              {/* Active Module Details */}
              {activeModalTrack.curriculum[activeModuleTab] && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#111827] border border-gray-150 dark:border-slate-800 space-y-3">
                  <div>
                    <h5 className="text-xs font-black text-gray-900 dark:text-white">
                      {activeModalTrack.curriculum[activeModuleTab].title}
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {activeModalTrack.curriculum[activeModuleTab].description}
                    </p>
                  </div>

                  {/* Lessons list */}
                  <div className="space-y-1.5 pt-1">
                    {activeModalTrack.curriculum[activeModuleTab].lessons.map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#0D121F] border border-gray-200 dark:border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 text-[10px] font-bold text-gray-500 flex items-center justify-center">
                            {lIdx + 1}
                          </span>
                          {getLessonIcon(lesson.type)}
                          <span className="font-bold text-gray-800 dark:text-gray-200">
                            {lesson.title}
                          </span>
                          {lesson.isFreePreview && (
                            <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-500/10 text-emerald-500 rounded">
                              معاينة مجانية
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

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setActiveModalTrack(null)}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl text-xs font-black transition-colors cursor-pointer"
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
