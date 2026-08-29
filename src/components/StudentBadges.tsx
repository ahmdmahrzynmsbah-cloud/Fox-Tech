import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { User, Course } from '../types';
import { Award, Star, Medal, Trophy, Sparkles, CheckCircle2, Lock, Flame, Zap, Compass, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface StudentBadgesProps {
  userData: User;
  isStandalone?: boolean;
}

interface Badge {
  id: string;
  courseId?: string;
  courseTitle: string;
  dateEarned?: Date;
  type: 'gold' | 'silver' | 'bronze' | 'diamond';
  description?: string;
  icon?: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export default function StudentBadges({ userData, isStandalone = false }: StudentBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!userData?.id) {
      setLoading(false);
      return;
    }

    const fetchBadges = async () => {
      try {
        const qProg = query(collection(db, 'course_progress'), where('userId', '==', userData.id));
        const progSnap = await getDocs(qProg);
        
        const earnedBadges: Badge[] = [];
        let doneCourses = 0;
        
        for (const docSnap of progSnap.docs) {
          const data = docSnap.data();
          let isCompleted = false;
          
          if (data.progressPercent && data.progressPercent >= 100) {
            isCompleted = true;
          } else if (data.completedLessons && data.completedLessons.length > 0) {
            try {
              const courseDoc = await getDoc(doc(db, 'courses', data.courseId));
              if (courseDoc.exists()) {
                const courseData = courseDoc.data() as Course;
                if (data.completedLessons.length >= (courseData.lessonsCount || 1)) {
                  isCompleted = true;
                }
              }
            } catch (e) {
              console.error("Error fetching course for badge check", e);
            }
          }

          if (isCompleted) {
            doneCourses++;
            let cTitle = "كورس مكتمل";
            try {
              const cDoc = await getDoc(doc(db, 'courses', data.courseId));
              if (cDoc.exists()) {
                cTitle = cDoc.data().title;
              }
            } catch (e) {}

            earnedBadges.push({
              id: `badge-${data.courseId}`,
              courseId: data.courseId,
              courseTitle: cTitle,
              dateEarned: new Date(data.updatedAt || data.createdAt || Date.now()),
              type: 'gold',
              description: 'تم إتمام جميع دروس واختبارات الكورس بنجاح!',
              isUnlocked: true
            });
          }
        }
        
        setCompletedCount(doneCourses);
        setBadges(earnedBadges);
      } catch (err) {
        console.error("Error fetching badges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [userData?.id]);

  const handleBadgeClick = (badge: Badge) => {
    if (!badge.isUnlocked) return;
    
    // Fire celebratory confetti!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#00B4D8', '#FFD700', '#D4F800', '#FFFFFF']
    });

    setAnimatingId(null);
    setTimeout(() => {
      setAnimatingId(badge.id);
    }, 10);
  };

  // Milestone System Badges
  const milestoneBadges: Badge[] = [
    {
      id: 'm-starter',
      courseTitle: 'وسام البداية القوية',
      type: 'bronze',
      description: 'الانضمام لمنصة الأكاديمية وبدء أول رحلة تعليمية',
      isUnlocked: true,
      dateEarned: new Date(userData?.createdAt || Date.now()),
    },
    {
      id: 'm-first-course',
      courseTitle: 'وسام الإنجاز الأول',
      type: 'silver',
      description: 'إتمام أول كورس تعليمي بالكامل بنسبة 100%',
      isUnlocked: completedCount >= 1,
      progress: Math.min(completedCount, 1),
      maxProgress: 1
    },
    {
      id: 'm-course-master',
      courseTitle: 'وسام بطل الكورسات',
      type: 'gold',
      description: 'إتمام 3 كورسات تعليمية مختلفة بتفوق',
      isUnlocked: completedCount >= 3,
      progress: Math.min(completedCount, 3),
      maxProgress: 3
    },
    {
      id: 'm-points-collector',
      courseTitle: 'وسام جامع النقاط',
      type: 'gold',
      description: 'تجميع أكثر من 100 نقطة من الأنشطة والاختبارات',
      isUnlocked: (userData?.points || 0) >= 100,
      progress: Math.min(userData?.points || 0, 100),
      maxProgress: 100
    }
  ];

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-[#1E2433] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-200 dark:border-white/10 shadow-xs animate-pulse space-y-6 text-right">
        <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded-xl w-48"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-36 bg-gray-100 dark:bg-white/5 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 text-right w-full min-w-0" dir="rtl">
      
      {/* Top Banner Stats */}
      <div className="bg-gradient-to-r from-[#0A102E] via-[#10194E] to-[#152368] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-[#D4F800]/20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4F800]/10 rounded-full blur-3xl pointer-events-none -translate-x-12 -translate-y-12" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4F800]/5 rounded-full blur-3xl pointer-events-none translate-x-12 translate-y-12" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4F800]/15 text-[#D4F800] rounded-xl text-xs font-black border border-[#D4F800]/30">
              <Sparkles className="w-4 h-4" />
              <span>لوحة الشرف والإنجازات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              الأوسمة والإنجازات 🏆
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm font-bold max-w-xl leading-relaxed">
              احتفل بتقدمك واجمع الأوسمة التقديرية مع كل درس وكورس واختبار تنجزه في رحلتك التعليمية!
            </p>
          </div>

          {/* Quick counters */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 text-center border border-white/10 flex flex-col items-center justify-center">
              <Trophy className="w-5 h-5 text-[#D4F800] mb-1" />
              <span className="text-lg sm:text-xl font-black">{badges.length + milestoneBadges.filter(b => b.isUnlocked).length}</span>
              <span className="text-[10px] text-gray-300 font-bold">أوسمة مكتسبة</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 text-center border border-white/10 flex flex-col items-center justify-center">
              <Zap className="w-5 h-5 text-[#D4F800] mb-1" />
              <span className="text-lg sm:text-xl font-black">{userData?.points || 0}</span>
              <span className="text-[10px] text-gray-300 font-bold">نقاط الأنشطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Course Badges Section */}
      <div className="bg-white dark:bg-[#0A102E] rounded-3xl p-5 sm:p-7 border border-gray-200 dark:border-white/10 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F800] text-[#0A102E] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg">
                أوسمة إتمام الكورسات ({badges.length})
              </h3>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400">
                تمنح تلقائياً عند إتمام كافة دروس واختبارات الكورس
              </p>
            </div>
          </div>
        </div>

        {badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBadgeClick(badge)}
                className="bg-gray-50 dark:bg-[#10194E] p-4 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center text-center cursor-pointer group hover:border-[#D4F800] transition-all relative overflow-hidden"
              >
                <motion.div
                  animate={animatingId === badge.id ? {
                    scale: [1, 1.25, 0.9, 1.15, 1],
                    rotate: [0, 180, 360],
                  } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  onAnimationComplete={() => animatingId === badge.id && setAnimatingId(null)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-1 shadow-md shadow-amber-500/20 flex items-center justify-center my-2 relative"
                >
                  <div className="w-full h-full bg-[#0A102E] rounded-full flex items-center justify-center border-2 border-yellow-200">
                    <Medal className="w-8 h-8 sm:w-9 sm:h-9 text-[#D4F800]" />
                  </div>
                </motion.div>

                <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white line-clamp-2 mt-1">
                  {badge.courseTitle}
                </h4>
                
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 mt-1">
                  {badge.dateEarned?.toLocaleDateString('ar-EG')}
                </span>

                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg">
                  <CheckCircle2 className="w-3 h-3" /> مكتمل
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-gray-50 dark:bg-[#0F1117]/40 rounded-2xl border border-dashed border-gray-200 dark:border-blue-900/30 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <h4 className="font-black text-gray-900 dark:text-white text-sm sm:text-base">
              لم تحصل على أوسمة كورسات بعد
            </h4>
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              شاهد دروس كورساتك المفضلة واجتز اختباراتها بنجاح لتحصل على أوسمة الإتمام الذهبية هنا!
            </p>
          </div>
        )}
      </div>

      {/* Academy Milestone Badges */}
      <div className="bg-white dark:bg-[#1E2433] rounded-3xl p-5 sm:p-7 border border-gray-200 dark:border-slate-200 dark:border-white/10 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-blue-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg">
                أوسمة التحديات والمستويات
              </h3>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400">
                أوسمة خاصة تفتح تلقائياً عند تحقيق أهداف التعلم
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {milestoneBadges.map((badge) => {
            const isUnlocked = badge.isUnlocked;
            return (
              <div 
                key={badge.id}
                onClick={() => isUnlocked && handleBadgeClick(badge)}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked 
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/40 dark:border-emerald-800/40 cursor-pointer hover:shadow-md' 
                    : 'bg-gray-50/60 dark:bg-[#0F1117]/30 border-gray-200 dark:border-slate-200 dark:border-white/10 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm'
                      : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
                  }`}>
                    {isUnlocked ? (
                      <Medal className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs sm:text-sm font-black truncate ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>
                        {badge.courseTitle}
                      </h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                          مكتسب ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 mt-1 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar if not yet unlocked and has maxProgress */}
                {!isUnlocked && badge.maxProgress && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-blue-900/30">
                    <div className="flex items-center justify-between text-[10px] font-black text-gray-500 dark:text-slate-400 mb-1">
                      <span>التقدم</span>
                      <span>{badge.progress || 0} / {badge.maxProgress}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 dark:bg-cyan-400 rounded-full transition-all"
                        style={{ width: `${Math.round(((badge.progress || 0) / badge.maxProgress) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
