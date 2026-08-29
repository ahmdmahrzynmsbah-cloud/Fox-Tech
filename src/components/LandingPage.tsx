import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, BookOpen, GraduationCap, Play, Star, Users, Trophy, Award, ChevronDown, CheckCircle2, 
  Sparkles, Mail, Send, CheckCircle, ArrowUpRight, Shield, Heart, Zap, Phone, MapPin, MessageSquare,
  Calculator, FlaskConical, Dna, Languages, BookOpenText, Scroll, Globe, X, TrendingUp, Menu, Film, Download,
  Laptop, Cpu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import FoxTechLogo from './FoxTechLogo';
import PremiumFeaturesSection from './PremiumFeaturesSection';
import StudentTahsili from './StudentTahsili';
import StudentQudurat from './StudentQudurat';
import BunnyVideoPlayer from './BunnyVideoPlayer';
import TikTokPlayer from './TikTokPlayer';
import CleanYoutubePlayer from './CleanYoutubePlayer';
import LatestCoursesSection from './LatestCoursesSection';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import * as LucideIcons from 'lucide-react';

const IconMap: Record<string, any> = {
  Calculator: LucideIcons.Calculator,
  Zap: LucideIcons.Zap,
  FlaskConical: LucideIcons.FlaskConical,
  Dna: LucideIcons.Dna,
  Languages: LucideIcons.Languages,
  BookOpenText: LucideIcons.BookOpenText,
  Scroll: LucideIcons.Scroll,
  Globe: LucideIcons.Globe,
  BookOpen: LucideIcons.BookOpen,
  Trophy: LucideIcons.Trophy,
  Award: LucideIcons.Award,
  GraduationCap: LucideIcons.GraduationCap,
  Star: LucideIcons.Star,
  Users: LucideIcons.Users,
  Shield: LucideIcons.Shield,
  Heart: LucideIcons.Heart,
  MessageSquare: LucideIcons.MessageSquare,
  Phone: LucideIcons.Phone,
  Mail: LucideIcons.Mail,
  MapPin: LucideIcons.MapPin,
  Facebook: LucideIcons.Facebook,
  Twitter: LucideIcons.Twitter,
  Youtube: LucideIcons.Youtube,
  Instagram: LucideIcons.Instagram
};

export default function LandingPage() {
  const { settings } = usePlatformSettings();
  const { user: authUser, userData: authUserData } = useAuth();
  const navigate = useNavigate();

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        const videoId = url.includes('youtu.be/') 
          ? url.split('youtu.be/')[1].split('?')[0] 
          : new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3`;
      }
      if (url.includes('youtube.com/embed/')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}modestbranding=1&rel=0&iv_load_policy=3`;
      }
      return url;
    } catch {
      return url;
    }
  };
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(() => auth.currentUser);
  const [userData, setUserData] = useState<any | null>(() => {
    try {
      const cached = localStorage.getItem('cached_current_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeroVideoModalOpen, setIsHeroVideoModalOpen] = useState(false);
  const [isHeroVideoPlayingInline, setIsHeroVideoPlayingInline] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const renderHeroVideo = (url: string, provider?: string, title?: string, poster?: string) => {
    if (!url) return null;

    if (provider === 'bunny' || (!url.includes('http') && !url.includes('youtube') && !url.includes('tiktok'))) {
      return <BunnyVideoPlayer videoId={url} />;
    }

    if (provider === 'tiktok' || url.includes('tiktok.com')) {
      return <TikTokPlayer videoUrl={url} />;
    }

    if (provider === 'direct' || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.m3u8')) {
      return (
        <video
          src={url}
          poster={poster}
          controls
          autoPlay
          className="w-full h-full object-cover rounded-xl"
        >
          متصفحك لا يدعم تشغيل الفيديو المباشر.
        </video>
      );
    }

    return (
      <CleanYoutubePlayer
        videoUrl={url}
        title={title}
        poster={poster}
      />
    );
  };
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // Subject Browser States (Removed)

  // Legal and Help Modals State
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'copyright' | 'support' | null>(null);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportSubmitting, setSupportSubmitting] = useState(false);

  const handleSupportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supportName.trim() || !supportEmail.trim() || !supportMessage.trim()) return;
    setSupportSubmitting(true);
    
    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      await addDoc(collection(db, 'support_requests'), {
        name: supportName,
        emailOrPhone: supportEmail,
        message: supportMessage,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSupportSubmitting(false);
      setSupportSubmitted(true);
      setSupportMessage('');
    } catch (error) {
      console.error('Error submitting support request:', error);
      setSupportSubmitting(false);
      // fallback if error, still show success or maybe a toast?
      setSupportSubmitted(true);
      setSupportMessage('');
    }
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
      setEmailInput('');
    }, 1000);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'student')
        );
        const snapshot = await getDocs(q);
        const studentsList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'طالب مجهول',
            stars: Number(data.stars) || 50,
            current: auth.currentUser?.uid === doc.id
          };
    });

        // Sort descending by stars
        studentsList.sort((a, b) => b.stars - a.stars);

        setLeaderboard(studentsList);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }, [user]);

  useEffect(() => {
    let unsubscribeUserDoc: () => void = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        unsubscribeUserDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({ id: docSnap.id, ...docSnap.data() });
          }
        });
      } else {
        setUserData(null);
      }
    });
    return () => {
      unsubscribeAuth();
      unsubscribeUserDoc();
    };
  }, []);

  const defaultFaqsList = [
    {
      q: 'ما هي طبيعة التدريب في منصة Fox Tech؟',
      a: 'نقدم تدريباً تقنياً عملياً مكثفاً يركز على التطبيق البرمجي والمشاريع الواقعية في مجالات Frontend وBackend والأنظمة السحابية والـ AI تحت إشراف مهندسين محترفين.'
    },
    {
      q: 'هل المسارات التدريبية مناسبة للمبتدئين والمتوسطين؟',
      a: 'نعم، المسارات تبدأ من المفاهيم الأساسية وتتدرج خطوة بخطوة وصولاً إلى بناء وتصميم الأنظمة المؤسسية الضخمة (Enterprise Systems) مع ورش عمل تطبيقية.'
    },
    {
      q: 'كيف تتم متابعة الأداء ومراجعة المشاريع البرمجية؟',
      a: 'يقوم المدربون التقنيون بعمل مراجعات دورية للأكواد (Code Reviews) وتقديم تقارير توجيهية دقيقة لمساعدة المتدرب على اتباع أعلى معايير الجودة والأمان.'
    },
    {
      q: 'هل أحصل على ملفات التوثيق والأكواد المصدرية؟',
      a: 'نعم، يحصل المتدرب على كود المصدر (Source Code) لكل مشروع، بجانب ملفات التوثيق والشروحات الهندسية الكاملة لمراجعتها في أي وقت.'
    }
  ];

  const defaultHeroContentItems = [
    'تطوير واجهات المستخدم التفاعلية (Frontend: React, TypeScript, Tailwind)',
    'بناء الأنظمة والواجهات الخلفية (Backend: Node.js, Express, REST APIs)',
    'قواعد البيانات وإدارة البيانات السحابية (SQL, PostgreSQL, Firestore)',
    'هندسة التطبيقات المتكاملة (Full-Stack Architecture)',
    'الأمن السيبراني وحماية التطبيقات والشبكات (Cybersecurity & Auth)',
    'دمج نماذج الذكاء الاصطناعي وتطبيقات الـ AI الحديثة'
  ];

  const faqs = settings.customFaqs && settings.customFaqs.length > 0 ? settings.customFaqs : defaultFaqsList;
  const heroContentList = settings.heroContentItems && settings.heroContentItems.length > 0 ? settings.heroContentItems : defaultHeroContentItems;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1117] text-gray-900 dark:text-white font-sans selection:bg-primary/30">
      {/* Floating Modern Responsive Header */}
      <header className="fixed top-2.5 sm:top-5 left-0 right-0 z-50 px-2.5 sm:px-6 pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <div className="bg-white/90 dark:bg-[#161B26]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 rounded-2xl sm:rounded-full px-3 sm:px-6 py-2 sm:py-2.5 shadow-xl shadow-slate-900/5 dark:shadow-2xl dark:shadow-black/50 flex items-center justify-between gap-2 transition-all duration-300">
            
            {/* Official Fox Tech Logo (Transparent without background) */}
            <div 
              className="flex items-center hover:opacity-95 transition-opacity cursor-pointer shrink-0" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title={settings.platformName || "Fox Tech"}
            >
              <FoxTechLogo 
                alt={settings.platformName || "Fox Tech"}
                className="h-10 sm:h-11 md:h-12 w-auto object-contain" 
                variant="auto" 
              />
            </div>

            {/* Actions & CTA */}
            <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
              <ThemeToggle />
              
              {(user || authUser || userData || authUserData) ? (
                <div className="flex items-center gap-1.5 sm:gap-3">
                  {(userData?.role || authUserData?.role) && (
                    <div 
                      title={`أنت مسجل حالياً كـ ${(userData?.role || authUserData?.role) === 'student' ? 'طالب' : (userData?.role || authUserData?.role) === 'teacher' ? 'معلم' : (userData?.role || authUserData?.role) === 'parent' ? 'ولي أمر' : 'إدارة'}`}
                      className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs border bg-slate-100 dark:bg-[#101744] text-slate-800 dark:text-white border-slate-200 dark:border-white/10"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                      {(userData?.role || authUserData?.role) === 'student' && <GraduationCap className="w-3.5 h-3.5 shrink-0 text-emerald-500" />}
                      {(userData?.role || authUserData?.role) === 'teacher' && <Award className="w-3.5 h-3.5 shrink-0 text-purple-500" />}
                      {((userData?.role || authUserData?.role) === 'admin' || (userData?.role || authUserData?.role) === 'sub_admin' || (userData?.role || authUserData?.role) === 'developer') && <Shield className="w-3.5 h-3.5 shrink-0 text-[#D4F800]" />}
                      {(userData?.role || authUserData?.role) === 'parent' && <Users className="w-3.5 h-3.5 shrink-0 text-blue-500" />}
                      
                      <span>
                        {(userData?.role || authUserData?.role) === 'student' && 'طالب'}
                        {(userData?.role || authUserData?.role) === 'teacher' && 'معلم'}
                        {((userData?.role || authUserData?.role) === 'admin' || (userData?.role || authUserData?.role) === 'sub_admin' || (userData?.role || authUserData?.role) === 'developer') && 'إدارة'}
                        {(userData?.role || authUserData?.role) === 'parent' && 'ولي أمر'}
                      </span>
                    </div>
                  )}
                  
                  <Link 
                    to="/dashboard" 
                    title={(userData?.name || userData?.fullName || authUserData?.name) ? `لوحة التحكم: ${userData?.name || userData?.fullName || authUserData?.name}` : "لوحة التحكم"}
                    className="bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] w-8 h-8 sm:w-auto sm:h-auto sm:px-6 sm:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-lg shadow-[#D4F800]/25 hover:shadow-[#D4F800]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap"
                  >
                    {/* Mobile profile avatar / user icon */}
                    <span className="sm:hidden flex items-center justify-center">
                      {(userData?.photoURL || authUserData?.photoURL) ? (
                        <img src={userData?.photoURL || authUserData?.photoURL} alt="الملف الشخصي" className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <LucideIcons.User className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </span>

                    {/* Desktop full text button */}
                    <span className="hidden sm:inline">لوحة التحكم</span>
                    <ArrowLeft className="hidden sm:inline w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-3">
                  {/* Mobile Single Compact Login/Register Profile Button */}
                  <Link 
                    to="/login" 
                    title="تسجيل الدخول / حساب جديد"
                    className="sm:hidden bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] w-8 h-8 rounded-full shadow-md flex items-center justify-center shrink-0"
                  >
                    <LucideIcons.User className="w-4 h-4 stroke-[2.5]" />
                  </Link>

                  {/* Desktop Full Navigation Actions */}
                  <Link 
                    to="/login" 
                    className="hidden sm:inline-flex text-xs sm:text-sm font-black text-slate-700 dark:text-gray-200 hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-[#D4F800]/10 dark:hover:bg-white/5 whitespace-nowrap"
                  >
                    دخول
                  </Link>
                  <Link 
                    to="/register" 
                    className="hidden sm:inline-flex bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-lg shadow-[#D4F800]/25 hover:shadow-[#D4F800]/40 hover:-translate-y-0.5 transition-all items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap"
                  >
                    <span>حساب جديد</span>
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Luxury Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 bg-[#F4F7FE] dark:bg-[#0A102E] text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        {/* Background Decorative Tech Lines & Glows */}
        <div className="absolute top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-blue-600/15 dark:bg-[#182672]/35 rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#D4F800]/10 dark:bg-[#D4F800]/10 rounded-full blur-[160px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        {/* Subtle geometric circuit waves background */}
        <div className="absolute inset-0 opacity-15 dark:opacity-10 pointer-events-none bg-[radial-gradient(#D4F800_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Top Pill Card: Tracks Indicator */}
          <div className="flex justify-center sm:justify-start mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-white dark:bg-[#101744] text-[#182672] dark:text-[#D4F800] px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-xl shadow-slate-900/5 dark:shadow-black/40 border border-slate-200/80 dark:border-[#D4F800]/20 select-none"
            >
              <span className="flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-[#D4F800]" /> مسار الـ Frontend</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-[#D4F800]" /> مسار الـ Backend</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#D4F800]" /> الأنظمة السحابية والـ Full Stack</span>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Right Column: Hero Titles & Main Information */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 flex flex-col items-start text-right"
            >
              {/* Main Course Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight sm:leading-tight mb-4 text-[#182672] dark:text-white drop-shadow-sm tracking-tight">
                {settings.heroTitle || 'برامج التدريب والتطوير التقني'}
              </h1>
              
              {/* Subtitle */}
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#182672] dark:text-[#D4F800] mb-6">
                <span>{settings.heroAudienceTitle || 'لتأهيل وتطوير مهندسي البرمجيات (Frontend & Backend)'}</span>
              </div>

              {/* Start Date & Time Glass Card */}
              <div className="w-full max-w-xl bg-white/90 dark:bg-[#101744]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#D4F800]/20 shadow-xl dark:shadow-2xl mb-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-[#D4F800]/20 text-[#182672] dark:text-[#D4F800] flex items-center justify-center font-black shrink-0 shadow-sm">
                      <LucideIcons.Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-300 font-medium">موعد الانطلاق</div>
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{settings.heroLaunchTitle || 'دفعات تدريبية مستمرة ومشروعات واقعية'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200/80 dark:border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-[#D4F800]/20 text-[#182672] dark:text-[#D4F800] flex items-center justify-center font-black shrink-0 shadow-sm">
                      <LucideIcons.Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-300 font-medium">توقيت الورش واللقاءات</div>
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{settings.heroLaunchTime || 'محاضرات تدريبية وCode Reviews أسبوعية'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-6">
                {(user || userData) ? (
                  <Link to="/dashboard" className="bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] px-8 py-4 rounded-full font-black text-sm sm:text-base shadow-xl shadow-[#D4F800]/25 hover:shadow-[#D4F800]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <span>الذهاب للوحة التحكم</span>
                    <ArrowRight className="w-5 h-5 -rotate-180" />
                  </Link>
                ) : (
                  <Link to="/register" className="bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] px-8 py-4 rounded-full font-black text-sm sm:text-base shadow-xl shadow-[#D4F800]/25 hover:shadow-[#D4F800]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <span>انضم للمسار التدريبي الآن</span>
                    <Sparkles className="w-5 h-5" />
                  </Link>
                )}
                
                {/* Contact phone button */}
                <a 
                  href={`tel:${settings.contactPhone || '01034859313'}`}
                  className="px-6 py-4 rounded-full font-black text-sm sm:text-base border-2 border-slate-300 dark:border-[#D4F800]/30 text-slate-800 dark:text-white bg-white dark:bg-white/10 hover:border-[#D4F800] hover:text-[#182672] dark:hover:text-[#D4F800] hover:bg-slate-50 dark:hover:bg-white/15 transition-all flex items-center justify-center gap-2.5 backdrop-blur-md cursor-pointer shadow-md"
                >
                  <Phone className="w-4 h-4 text-[#D4F800]" /> 
                  <span dir="ltr" className="font-mono tracking-wider">{settings.contactPhone || '01034859313'}</span>
                </a>
              </div>
              
              {(settings.heroCurriculumNote !== undefined ? settings.heroCurriculumNote : 'تدريب تطبيقي مكثف + مشاريع إنتاجية حقيقية + مراجعة أكواد بإشراف كبار المهندسين') && (
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-600 dark:text-gray-300">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#D4F800] animate-ping" />
                   <span>{settings.heroCurriculumNote !== undefined ? settings.heroCurriculumNote : 'تدريب تطبيقي مكثف + مشاريع إنتاجية حقيقية + مراجعة أكواد بإشراف كبار المهندسين'}</span>
                </div>
              )}
            </motion.div>

            {/* Left Column: Curriculum Card Inspired by Poster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
              id="curriculum"
            >
              {/* Highlight Poster Badge */}
              <div className="bg-white dark:bg-[#101744] rounded-3xl border-2 border-slate-200 dark:border-[#D4F800]/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-right text-slate-900 dark:text-white transition-colors">
                
                {/* Decorative corner glow */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4F800]/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Header: Content Title */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {settings.heroContentTitle || 'المحتوى'}
                    </span>
                    <Zap className="w-5 h-5 text-[#D4F800]" />
                  </div>
                  <div className="bg-[#D4F800]/15 text-[#182672] dark:text-[#D4F800] border border-[#D4F800]/30 px-3 py-1 rounded-full text-xs font-black">
                    {settings.heroContentBadge || 'Tech Tracks 2026'}
                  </div>
                </div>

                {/* Curriculum Bullet Points */}
                <div className="space-y-3.5 mb-6">
                  {heroContentList.map((topic, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-100 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors p-2.5 rounded-xl border border-slate-200/70 dark:border-white/5">
                      <div className="w-5 h-5 rounded-full bg-[#D4F800] text-[#0A102E] flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-sm shadow-[#D4F800]/20">
                        ✓
                      </div>
                      <span className="leading-snug">{topic}</span>
                    </div>
                  ))}
                </div>

                {/* Date Highlight Pill Card */}
                <div className="bg-gradient-to-r from-[#182672] to-[#2338A0] dark:from-[#0D1540] dark:to-[#182672] border border-[#D4F800]/30 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-[#D4F800]/10">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-black leading-none font-mono text-[#D4F800]">
                      {settings.heroDateDay || '30'}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black leading-none uppercase text-white/90">
                        {settings.heroDateMonthYear || 'AUG 2026'}
                      </div>
                      <div className="text-[11px] font-bold text-white/80">
                        {settings.heroDateTime || 'يوم الأحد 6 مساءً'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-black bg-white/15 text-[#D4F800] px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/20">
                    {settings.heroDateTag || 'شامل الشرح والتطبيق'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grades / Tech Tracks Section */}
      <section id="grades" className="py-20 sm:py-28 bg-[#F6F8FF] dark:bg-[#0A102E] border-b border-slate-200 dark:border-white/10 relative overflow-hidden">
        {/* Decorative ambient background lights */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 dark:bg-[#182672]/30 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#D4F800]/10 dark:bg-[#D4F800]/10 rounded-full blur-[140px] pointer-events-none translate-y-1/2" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-[#D4F800]/15 text-[#182672] dark:text-[#D4F800] border border-[#D4F800]/30 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4F800]" />
              <span>المسارات البرمجية والهندسية المعتمدة</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {settings.gradesTitle || 'مسارات التدريب التقني المعتمدة'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg font-medium max-w-2xl mx-auto">
              {settings.gradesSubtitle || 'اختر مسارك البرمجي وانطلق في تجربة تدريبية عملية تركز على المهارات المطلوبة في كبرى شركات التقنية.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                id: 'track-frontend',
                title: 'مسار تطوير الواجهات الأمامية (Frontend Engineer)',
                desc: 'إتقان بناء واجهات مستخدم سريعة ومتجاوبة وتطبيقات Single Page باستخدام React وTypeScript وTailwind CSS مع إدارة الحالة والربط مع الـ APIs.',
                icon: Laptop,
                badgeBg: 'bg-[#D4F800]/15 text-[#182672] dark:text-[#D4F800] border border-[#D4F800]/30',
                isSpecial: false,
                features: ['React & TypeScript', 'Tailwind & UI/UX', 'State Management', 'مشاريع عملية']
              },
              {
                id: 'track-backend',
                title: 'مسار هندسة النظم الخلفية (Backend & Cloud Architect)',
                desc: 'بناء خوادم مستقرة وآمنة، وتصميم قواعد بيانات علائقية وسحابية، وتطوير Microservices وواجهات برمجة التطبيقات (APIs) الاحترافية.',
                icon: Cpu,
                badgeBg: 'bg-gradient-to-r from-[#182672] to-[#2338A0] text-[#D4F800] border border-[#D4F800]/30 shadow-sm',
                isSpecial: true,
                specialText: 'المسار الأكثر طلباً',
                features: ['Node.js & Express', 'PostgreSQL & MongoDB', 'RESTful & GraphQL', 'الأمان والتشفير']
              },
              {
                id: 'track-fullstack',
                title: 'مسار التطبيقات المتكاملة والذكاء الاصطناعي (Full-Stack & AI)',
                desc: 'الدمج الاحترافي بين الواجهات والخوادم والخدمات السحابية مع دمج نماذج وتطبيقات الذكاء الاصطناعي الحديثة في بيئات العمل.',
                icon: Globe,
                badgeBg: 'bg-[#D4F800]/15 text-[#182672] dark:text-[#D4F800] border border-[#D4F800]/30',
                isSpecial: true,
                specialText: 'جاهزية لسوق العمل',
                features: ['Full-Stack Systems', 'Cloud & CI/CD', 'AI Integration', 'Code Reviews']
              }
            ].map((grade, i) => {
              const IconComponent = grade.icon;
              return (
                <motion.div
                  key={grade.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.1 }}
                  className="relative bg-white dark:bg-[#101744] rounded-[2rem] border border-slate-200/80 dark:border-[#D4F800]/15 hover:border-[#D4F800] dark:hover:border-[#D4F800] transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between h-full group overflow-hidden shadow-xl shadow-slate-900/5 dark:shadow-black/40 hover:-translate-y-1.5 text-right"
                >
                  {/* Glowing accent on hover */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#D4F800]/10 rounded-full blur-xl pointer-events-none" />

                  {/* Main Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Icon and special badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-[#D4F800]/15 dark:bg-[#D4F800]/15 text-[#182672] dark:text-[#D4F800] border border-[#D4F800]/30 flex items-center justify-center shadow-md shadow-[#D4F800]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D4F800] group-hover:text-[#0A102E]">
                        <IconComponent className="w-7 h-7 stroke-[2.2] shrink-0" />
                      </div>
                      
                      {grade.isSpecial && (
                        <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${grade.badgeBg}`}>
                          {grade.specialText}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="pt-2">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-[#182672] dark:group-hover:text-[#D4F800]">
                        {grade.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 font-medium text-xs sm:text-sm leading-relaxed min-h-[3rem]">
                      {grade.desc}
                    </p>

                    {/* Features list tags */}
                    <div className="flex flex-wrap gap-1.5 justify-start pt-2">
                      {grade.features.map((feat, fIdx) => (
                        <span 
                          key={fIdx}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0A102E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div className="mt-6 sm:mt-8 relative z-10">
                    <Link 
                      to={user ? "/dashboard" : "/register"} 
                      className="w-full bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] font-black text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#D4F800]/25 hover:shadow-[#D4F800]/40"
                    >
                      <span>استكشف تفاصيل المسار</span>
                      <ArrowRight className="w-4 h-4 -rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0A102E] border-b border-slate-200 dark:border-white/10 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 dark:bg-[#182672]/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#D4F800]/10 dark:bg-[#D4F800]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{settings.subjectsTitle || 'استكشف المواد والمسارات الدراسية'}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg font-medium">{settings.subjectsSubtitle || 'اختر المادة وابدأ التعلم بطريقة عملية ومبسطة مع أفضل الأساتذة.'}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {(settings.subjects || []).filter((subject) => {
              const isQudurat = subject.title?.includes('القدرات');
              const isTahsili = subject.title?.includes('التحصيلي');
              if (settings.enableQuduratTahsili === false && (isQudurat || isTahsili)) return false;
              if (isQudurat && settings.showQuduratSection === false) return false;
              if (isTahsili && settings.showTahsiliSection === false) return false;
              return true;
            }).map((subject, i) => {
              const IconComponent = IconMap[subject.iconName] || LucideIcons.BookOpen;
              const isQuduratTahsili = subject.title?.includes('القدرات') || subject.title?.includes('التحصيلي');
              const subType = subject.title?.includes('القدرات') ? 'qudurat' : 'tahsili';

              return (
                <motion.div
                  key={subject.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => {
                    if (!user) {
                      if (isQuduratTahsili) {
                        navigate(`/special-register?type=${subType}`);
                      } else {
                        navigate('/register');
                      }
                    } else {
                      navigate('/dashboard?tab=subjects&subject=' + encodeURIComponent(subject.title));
                    }
                  }}
                  className="group cursor-pointer bg-white dark:bg-[#101744] backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 hover:border-[#D4F800] dark:hover:border-[#D4F800] shadow-lg shadow-slate-900/5 dark:shadow-black/40 hover:shadow-xl transition-all text-center flex flex-col items-center justify-center h-full"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 ${subject.color || 'bg-[#D4F800]/15 text-[#182672] dark:text-[#D4F800]'} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#182672] dark:group-hover:text-[#D4F800] transition-colors">{subject.title}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Qudurat Section */}
      {(settings.enableQuduratTahsili !== false && settings.showQuduratSection !== false) && (
        <section id="qudurat" className="py-20 sm:py-28 bg-[#F6F8FF] dark:bg-[#0F1117] border-b border-slate-200 dark:border-white/10 dark:border-white/10 text-gray-900 dark:text-white relative overflow-hidden">
        {/* Decorative background light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold border border-emerald-500/20">
              <Star className="w-4 h-4" />
              ميزة ممتازة
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              قسم مراجعات القدرات المتميزة
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base font-medium max-w-2xl mx-auto">
              مستقبلك يبدأ من هنا. مراجعات فيديو مكثفة ومصممة بدقة متناهية بأحدث تجميعات القدرات، يقدمها نخبة من أفضل المعلمين لمساعدتك على تأمين نسبة +95٪ بإذن الله.
            </p>
          </div>

          {/* Qudurat Intro Video Showcase */}
          {settings.quduratVideoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 max-w-5xl mx-auto bg-white dark:bg-[#10194E]/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Left Column: Video Player Container */}
              <div className="lg:col-span-7 xl:col-span-8 relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg border border-slate-200 dark:border-slate-800 group">
                {settings.quduratVideoProvider === 'youtube' && (
                  <CleanYoutubePlayer 
                    videoUrl={settings.quduratVideoUrl} 
                    title={settings.quduratVideoTitle} 
                    poster={settings.quduratVideoPoster}
                  />
                )}
                {settings.quduratVideoProvider === 'tiktok' && (
                  <TikTokPlayer videoUrl={settings.quduratVideoUrl} />
                )}
                {settings.quduratVideoProvider === 'bunny' && (
                  <BunnyVideoPlayer videoId={settings.quduratVideoUrl} />
                )}
                {settings.quduratVideoProvider === 'direct' && (
                  <video 
                    src={settings.quduratVideoUrl} 
                    poster={settings.quduratVideoPoster}
                    controls 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Right Column: Dynamic Content & Call to Action */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center space-y-5">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>مقدمة المسار التعريفي</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight">
                    {settings.quduratVideoTitle || 'شاهد الفيديو التعريفي لمسار Frontend'}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  شاهد الشرح التعريفي الحصري لتتعرف على طريقتنا المبتكرة في تبسيط القدرات وحل أعقد المسائل في ثوانٍ معدودة وبأسهل الطرق الذكية.
                </p>

                <div className="space-y-3 pt-1">
                  {[
                    "شرح تكتيكات الحل السريع للكمي واللفظي",
                    "أحدث التجميعات المحوسبة والورقية لعام 1447هـ",
                    "نماذج محاكاة للاختبار الحقيقي بدقة متناهية"
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/25 hover:-translate-y-0.5 transition-all text-center cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('qudurat-reviews-list') || document.getElementById('qudurat');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollBy({ top: 400, behavior: 'smooth' });
                      }
                    }}
                  >
                    <span>عرض باقات ومراجعات القدرات</span>
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <StudentQudurat userData={userData} setUserData={setUserData} />
        </div>
      </section>
      )}

      {/* Latest Courses Section */}
      <LatestCoursesSection userData={userData} />

      {/* Tahsili Section */}
      {(settings.enableQuduratTahsili !== false && settings.showTahsiliSection !== false) && (
        <section id="tahsili" className="py-20 sm:py-28 bg-[#F6F8FF] dark:bg-[#0F1117] border-b border-slate-200 dark:border-white/10 dark:border-white/10 text-gray-900 dark:text-white relative overflow-hidden">
        {/* Decorative background light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 tracking-wide uppercase">
              <Film className="w-3.5 h-3.5 animate-pulse text-purple-500" />
              <span>أقوى مراجعات التحصيلي الممتازة</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 dark:from-purple-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
              قسم مراجعات التحصيلي المتميزة
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base font-medium max-w-2xl mx-auto">
              مستقبلك يبدأ من هنا. مراجعات فيديو مكثفة ومصممة بدقة متناهية بأحدث تجميعات التحصيلي، يقدمها نخبة من أفضل المعلمين لمساعدتك على تأمين نسبة +95٪ بإذن الله.
            </p>
          </div>

          {/* Tahsili Intro Video Showcase */}
          {settings.tahsiliVideoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 max-w-5xl mx-auto bg-white dark:bg-[#10194E]/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Left Column: Video Player Container */}
              <div className="lg:col-span-7 xl:col-span-8 relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg border border-slate-200 dark:border-slate-800 group">
                {settings.tahsiliVideoProvider === 'youtube' && (
                  <CleanYoutubePlayer 
                    videoUrl={settings.tahsiliVideoUrl} 
                    title={settings.tahsiliVideoTitle} 
                    poster={settings.tahsiliVideoPoster}
                  />
                )}
                {settings.tahsiliVideoProvider === 'tiktok' && (
                  <TikTokPlayer videoUrl={settings.tahsiliVideoUrl} />
                )}
                {settings.tahsiliVideoProvider === 'bunny' && (
                  <BunnyVideoPlayer videoId={settings.tahsiliVideoUrl} />
                )}
                {settings.tahsiliVideoProvider === 'direct' && (
                  <video 
                    src={settings.tahsiliVideoUrl} 
                    poster={settings.tahsiliVideoPoster}
                    controls 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Right Column: Dynamic Content & Call to Action */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center space-y-5">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>مقدمة المسار التعريفي</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight">
                    {settings.tahsiliVideoTitle || 'شاهد الفيديو التعريفي لمسار Backend'}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  شاهد الشرح التعريفي لتتعرف على خريطة الطريق الذهبية لاجتياز اختبار التحصيلي والوصول للقبول الجامعي المباشر بكل سهولة ويسر.
                </p>

                <div className="space-y-3 pt-1">
                  {[
                    "تغطية شاملة لكل من الرياضيات، الفيزياء، الكيمياء، والأحياء",
                    "ربط ذكي ومبتكر للمفاهيم يمنع النسيان تماماً",
                    "حلول ومناقشة التجميعات التاريخية والأحدث تفصيلياً"
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm px-6 py-3 rounded-xl shadow-lg shadow-purple-600/15 hover:shadow-purple-600/25 hover:-translate-y-0.5 transition-all text-center cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('tahsili-reviews-list') || document.getElementById('tahsili');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollBy({ top: 400, behavior: 'smooth' });
                      }
                    }}
                  >
                    <span>عرض باقات ومراجعات التحصيلي</span>
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <StudentTahsili userData={userData} setUserData={setUserData} />
        </div>
      </section>
      )}

      {/* How it works / Premium Features */}
      {settings.showFeaturesSection && <PremiumFeaturesSection />}

      {/* FAQ Section */}
      {settings.showFaqSection && (
        <section id="faq" className="py-24 bg-[#F6F8FF] dark:bg-[#0A102E] border-b border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-3xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">{settings.faqTitle || 'الأسئلة الشائعة'}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{settings.faqSubtitle || 'كل اللي محتاج تعرفه عن منصتنا'}</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${openFaqIndex === i ? 'bg-white dark:bg-[#101744] border-[#D4F800] dark:border-[#D4F800] shadow-md' : 'bg-white dark:bg-[#101744]/70 border-slate-200 dark:border-[#D4F800]/20 hover:border-[#D4F800] dark:hover:border-[#D4F800]'}`}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-right outline-none cursor-pointer"
                  >
                    <span className={`font-bold text-base sm:text-lg transition-colors duration-300 ${openFaqIndex === i ? 'text-[#182672] dark:text-[#D4F800]' : 'text-slate-900 dark:text-white'}`}>{faq.q}</span>
                    <div
                      className={`p-1.5 rounded-full transition-all duration-300 ${openFaqIndex === i ? 'bg-[#D4F800]/15 dark:bg-[#D4F800]/20 text-[#182672] dark:text-[#D4F800] rotate-180' : 'text-gray-500 hover:bg-gray-200/50 dark:hover:bg-slate-800'}`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaqIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ultra-Premium Footer */}
      <footer className="bg-white dark:bg-[#070B20] pt-16 pb-8 border-t border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-right">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <FoxTechLogo 
                  alt={settings.platformName || "Fox Tech"}
                  className="h-10 md:h-12 w-auto max-w-[220px]" 
                  variant="auto" 
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                منصة {settings.platformName} تقدم منظومة تدريب وتطوير تقني متكاملة لتأهيل مهندسي البرمجيات في مسارات Frontend وBackend وهندسة النظم والذكاء الاصطناعي، مع التركيز على بناء مشاريع واقعية ومراجعة الأكواد.
              </p>
              <div className="pt-2 flex items-center gap-3">
                {settings.socialLinks?.facebook && (
                  <a href={settings.socialLinks.facebook} className="w-8 h-8 rounded-full bg-white dark:bg-[#101744] border border-gray-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#182672] dark:hover:text-[#D4F800] hover:scale-110 transition-all">
                    <LucideIcons.Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.twitter && (
                  <a href={settings.socialLinks.twitter} className="w-8 h-8 rounded-full bg-white dark:bg-[#101744] border border-gray-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#182672] dark:hover:text-[#D4F800] hover:scale-110 transition-all">
                    <LucideIcons.Twitter className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.youtube && (
                  <a href={settings.socialLinks.youtube} className="w-8 h-8 rounded-full bg-white dark:bg-[#101744] border border-gray-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#182672] dark:hover:text-[#D4F800] hover:scale-110 transition-all">
                    <LucideIcons.Youtube className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.instagram && (
                  <a href={settings.socialLinks.instagram} className="w-8 h-8 rounded-full bg-white dark:bg-[#101744] border border-gray-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#182672] dark:hover:text-[#D4F800] hover:scale-110 transition-all">
                    <LucideIcons.Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-slate-900 dark:text-white font-black text-sm mb-4 pb-1 border-b-2 border-[#D4F800]/30 w-fit">
                تصفح المنصة
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm font-bold">
                <li><a href="#grades" className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3 rotate-45 text-[#D4F800]" /> مسارات التدريب التقني</a></li>
                <li><a href="#subjects" className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3 rotate-45 text-[#D4F800]" /> المجالات والتخصصات البرمجية</a></li>
                {(settings.enableQuduratTahsili !== false && settings.showQuduratSection !== false) && (
                  <li><a href="#qudurat" className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3 rotate-45 text-[#D4F800]" /> مسار Frontend</a></li>
                )}
                {(settings.enableQuduratTahsili !== false && settings.showTahsiliSection !== false) && (
                  <li><a href="#tahsili" className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3 rotate-45 text-[#D4F800]" /> مسار Backend</a></li>
                )}
                <li><a href="#how-it-works" className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3 rotate-45 text-[#D4F800]" /> مميزات المنظومة التدريبية</a></li>
                
                <li><a href="#faq" className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3 rotate-45 text-[#D4F800]" /> الأسئلة الأكثر شيوعاً</a></li>
              </ul>
            </div>

            {/* Column 3: Legal & Support */}
            <div>
              <h3 className="text-slate-900 dark:text-white font-black text-sm mb-4 pb-1 border-b-2 border-[#D4F800]/30 w-fit">
                المساعدة والقانونية
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm font-bold">
                <li>
                  <button 
                    onClick={() => { setActiveModal('privacy'); setSupportSubmitted(false); }}
                    className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5 cursor-pointer text-right w-full"
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0 text-[#D4F800]" /> 
                    <span>سياسة الخصوصية والأمان</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveModal('terms'); setSupportSubmitted(false); }}
                    className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5 cursor-pointer text-right w-full"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#D4F800]" /> 
                    <span>الشروط والأحكام العامة</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveModal('copyright'); setSupportSubmitted(false); }}
                    className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5 cursor-pointer text-right w-full"
                  >
                    <Heart className="w-3.5 h-3.5 shrink-0 text-[#D4F800]" /> 
                    <span>حقوق الملكية الفكرية</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveModal('support'); setSupportSubmitted(false); }}
                    className="hover:text-[#182672] dark:hover:text-[#D4F800] transition-colors flex items-center gap-1.5 cursor-pointer text-right w-full"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#D4F800]" /> 
                    <span>تواصل مع الدعم الفني</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div className="space-y-4">
              <h3 className="text-slate-900 dark:text-white font-black text-sm mb-4 pb-1 border-b-2 border-[#D4F800]/30 w-fit">
                تواصل معنا
              </h3>
              <div className="space-y-3 text-xs sm:text-sm font-medium">
                {settings.contactPhone && (
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#D4F800] shrink-0 mt-0.5" />
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px]">الخط الساخن والواتساب</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200" dir="ltr">{settings.contactPhone}</p>
                    </div>
                  </div>
                )}
                {settings.contactEmail && (
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#D4F800] shrink-0 mt-0.5" />
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px]">الدعم والمبيعات</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{settings.contactEmail}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4F800] shrink-0 mt-0.5" />
                  <div className="text-right text-slate-500 dark:text-slate-400 font-bold">
                    {settings.contactAddress || 'أكاديمية Fox Tech للبرمجة وهندسة البرمجيات'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-col md:flex-row items-center justify-center gap-4 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 text-center">
            <div 
              onClick={(e) => {
                const count = (Number(e.currentTarget.getAttribute('data-clicks') || 0)) + 1;
                e.currentTarget.setAttribute('data-clicks', String(count));
                if (count >= 3) {
                  window.dispatchEvent(new CustomEvent('open-dev-modal'));
                  e.currentTarget.setAttribute('data-clicks', '0');
                }
                setTimeout(() => e.currentTarget.setAttribute('data-clicks', '0'), 2000);
              }}
              className="cursor-default select-none"
            >
              جميع الحقوق محفوظة لـ <span className="font-black text-slate-900 dark:text-white">منصة {settings.platformName}</span> © ٢٠٢٦
            </div>
          </div>
        </div>
      </footer>

      {/* Legal & Support Modals */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <div
              className="relative bg-white dark:bg-[#101744] max-w-2xl w-full rounded-3xl border border-slate-200 dark:border-[#D4F800]/20 shadow-2xl overflow-hidden z-10 text-right font-sans"
              dir="rtl"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-[#0A102E]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4F800]/15 dark:bg-[#D4F800]/20 flex items-center justify-center text-[#182672] dark:text-[#D4F800]">
                    {activeModal === 'privacy' && <Shield className="w-5 h-5" />}
                    {activeModal === 'terms' && <CheckCircle2 className="w-5 h-5" />}
                    {activeModal === 'copyright' && <Heart className="w-5 h-5" />}
                    {activeModal === 'support' && <MessageSquare className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {activeModal === 'privacy' && 'سياسة الخصوصية والأمان'}
                      {activeModal === 'terms' && 'الشروط والأحكام العامة'}
                      {activeModal === 'copyright' && 'حقوق الملكية الفكرية'}
                      {activeModal === 'support' && 'الدعم الفني المباشر'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      منصة {settings.platformName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#182672] hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                {activeModal === 'privacy' && (
                  <div className="space-y-4">
                    {settings.privacyPolicyText ? (
                      <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                        {settings.privacyPolicyText}
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-900 dark:text-white font-extrabold text-base">
                          مرحباً بك في سياسة الخصوصية الخاصة بـ منصة {settings.platformName}. خصوصيتك وأمان بياناتك هي أهم أولوياتنا.
                        </p>
                        
                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ١. البيانات التي نقوم بجمعها
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            نقوم بجمع البيانات الأساسية اللازمة لإنشاء حسابك الدراسي، وتشمل: الاسم الكامل، رقم الهاتف (للطالب وولي الأمر لتلقي تقارير الدرجات)، البريد الإلكتروني، والمرحلة الدراسية الثانوية (الصف الأول، الثاني، الثالث الثانوي).
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ٢. كيف نستخدم بياناتك ونحميها؟
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            تُستخدم البيانات فقط لتقديم تجربة تعليمية مخصصة، ومتابعة تقدمك في المواد،  جميع كلمات المرور وبياناتك مشفرة بالكامل عبر خوادم مأمنة ومحمية ببروتوكولات حماية متطورة تمنع أي وصول غير مصرح به.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ٣. سرية المعلومات والجهات الخارجية
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            نلتزم التزاماً تاماً بعدم بيع أو مشاركة أو تأجير أي من بياناتك الشخصية لأي جهة تجارية أو إعلانية خارجية. بياناتك ملكك وحدك وتُستخدم حصرياً داخل بيئة "{settings.platformName}" التعليمية.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ٤. أمان العمليات والمدفوعات
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            تتم جميع العمليات المالية وشحن المحافظ عبر قنوات معتمدة وموفرين معتمدين لخدمات الدفع الإلكتروني في مصر (مثل فوري والمحافظ الإلكترونية) وتخضع لأقصى معايير الأمان المصرفي الرقمي.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeModal === 'terms' && (
                  <div className="space-y-4">
                    {settings.termsConditionsText ? (
                      <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                        {settings.termsConditionsText}
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-900 dark:text-white font-extrabold text-base">
                          باستخدامك لمنصة {settings.platformName}، فإنك توافق على الالتزام الكامل بالشروط والأحكام التالية المبرمة لضمان بيئة تعليمية عادلة ومثمرة لجميع الطلاب.
                        </p>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ١. شروط الاستخدام والحسابات
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            المنصة مخصصة للاستخدام الشخصي لطلاب المرحلة الثانوية فقط. يحق لكل طالب تسجيل حساب واحد فقط. يمنع منعاً باتاً مشاركة بيانات تسجيل الدخول مع أي شخص آخر، ويحتفظ النظام بالحق في إيقاف أي حساب يسجل دخول من أجهزة متعددة بشكل يثير الشبهة.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ٢. المحتوى التعليمي والاشتراكات
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            توفر المنصة محتوى مجاني وآخر مدفوع (بنظام الاشتراك الشهري أو شراء الكورسات الفردية). بمجرد إتمام الشراء، يصبح المحتوى متاحاً للطالب طوال فترة العام الدراسي الجاري ولا يحق استرداد الرسوم بعد تفعيل الكورس وبدء المشاهدة.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ٣. قواعد السلوك العام والتعليقات
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            نحن فخورون ببيئتنا التعليمية الراقية. يُمنع منعاً باتاً نشر أي تعليقات مسيئة، سياسية، أو غير لائقة في أقسام الأسئلة والتعليقات تحت المحاضرات. سيؤدي ارتكاب أي من ذلك إلى حظر فوري للحساب دون إنذار ودون استرداد للمستحقات.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ٤. النزاهة في الاختبارات
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            تحتفظ إدارة المنصة بالحق في مراجعة تقدم الطلاب الحاصلين على المراكز الأولى في الدوري الأسبوعي لضمان عدم وجود تلاعب أو غش في حل الواجبات والاختبارات الإلكترونية.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeModal === 'copyright' && (
                  <div className="space-y-4">
                    {settings.intellectualPropertyText ? (
                      <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                        {settings.intellectualPropertyText}
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-900 dark:text-white font-extrabold text-base">
                          الملكية الفكرية لـ منصة {settings.platformName} محمية بموجب القوانين المصرية والدولية لحماية حقوق المؤلف والملكية الفكرية.
                        </p>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ١. حقوق المؤلف الحصرية للمواد العلمية
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            جميع المحاضرات المرئية، الفيديوهات التوضيحية، بنوك الأسئلة، الاختبارات، المذكرات الرقمية والملخصات المعروضة على المنصة هي ملكية فكرية حصرية لـ "منصة {settings.platformName}" ونخبة المدرسين المتعاقد معهم.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            ٢. الحظر القانوني وعقوبة تسريب المحتوى
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            يُحظر تماماً وبشكل قاطع: تسجيل شاشة المحاضرات، إعادة رفع مقاطع الفيديو على يوتيوب أو فيسبوك أو تليجرام، أو طبع وتوزيع مذكرات المنصة خارج إطار الاستخدام الشخصي المباشر.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F800]"></span>
                            ٣. العلامة المائية الرقمية المدمجة
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            تستخدم المنصة تقنيات مائية رقمية متطورة تدمج اسم الطالب ورقم هاتفه وبيانات حسابه بشكل غير مرئي ومرئي على الشاشة وأوراق العمل لسهولة تعقب وتحديد أي شخص يقوم بتسريب المحتوى.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            ٤. الملاحقة القانونية الصارمة
                          </h4>
                          <p className="pr-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            سيتم ملاحقة أي محاولة للتعدي على حقوق الملكية الفكرية قضائياً وجنائياً بالتنسيق مع مباحث الإنترنت بوزارة الداخلية المصرية وتطبيق العقوبات والغرامات المقررة بموجب قانون مكافحة جرائم تقنية المعلومات المصري.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeModal === 'support' && (
                  <div className="space-y-4">
                    {supportSubmitted ? (
                      <div 
                        className="text-center py-8 space-y-4"
                      >
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                          <CheckCircle className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white">تم إرسال طلبك بنجاح!</h4>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto">
                            شكراً لتواصلك معنا يا {supportName}! سيتواصل معك أحد ممثلي الدعم الفني عبر البريد الإلكتروني أو واتساب خلال أقل من ٢٤ ساعة لحل مشكلتك.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSupportSubmitted(false);
                            setSupportName('');
                            setSupportEmail('');
                          }}
                          className="px-6 py-2 rounded-2xl bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] font-black text-xs sm:text-sm transition-all"
                        >
                          إرسال رسالة أخرى
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSupportSubmit} className="space-y-4">
                        <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                          يسعدنا مساعدتك في أي وقت! يرجى ملء التفاصيل التالية وسيتم تزويدك بالدعم الفوري والمساعدة التقنية.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-right">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300">الاسم بالكامل</label>
                            <input
                              type="text"
                              required
                              value={supportName}
                              onChange={(e) => setSupportName(e.target.value)}
                              placeholder="مثال: أحمد محمد علي"
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0A102E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F800] transition-all"
                            />
                          </div>

                          <div className="space-y-1.5 text-right">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300">البريد الإلكتروني أو رقم الهاتف</label>
                            <input
                              type="text"
                              required
                              value={supportEmail}
                              onChange={(e) => setSupportEmail(e.target.value)}
                              placeholder="مثال: +201001234567"
                              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0A102E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F800] transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 text-right">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300">تفاصيل المشكلة أو الاستفسار</label>
                          <textarea
                            rows={4}
                            required
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                            placeholder="اكتب رسالتك أو استفسارك بالتفصيل هنا..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0A102E] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F800] transition-all resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={supportSubmitting}
                          className="w-full py-3.5 px-6 rounded-2xl bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] font-black text-xs sm:text-sm shadow-lg shadow-[#D4F800]/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                        >
                          {supportSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#0A102E]/30 border-t-[#0A102E] rounded-full animate-spin"></div>
                              <span>جاري إرسال طلبك...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>إرسال الطلب الآن</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Panel */}
              <div className="p-4 bg-slate-50 dark:bg-[#0A102E]/40 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#182672] hover:bg-slate-200 dark:hover:bg-[#2338A0] text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Hero Video Modal */}
      {isHeroVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#181822] border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[85vh]">
            <div className="px-4 py-3 bg-gray-50 dark:bg-[#0D121F] border-b border-gray-200 dark:border-[#222230] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <div className="w-8 h-8 bg-sky-500/10 dark:bg-cyan-400/10 text-sky-600 dark:text-cyan-400 rounded-lg flex items-center justify-center shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                    {settings.heroVideoTitle || 'الفيديو التعريفي للمنصة'}
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold truncate">تعرّف على منصة {settings.platformName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsHeroVideoModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-[#252533] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-video bg-black relative flex items-center justify-center overflow-hidden">
              {settings.heroVideoUrl ? (
                renderHeroVideo(settings.heroVideoUrl, settings.heroVideoProvider, settings.heroVideoTitle)
              ) : (
                <div className="p-6 text-center space-y-2">
                  <Film className="w-10 h-10 text-gray-500 dark:text-gray-600 mx-auto" />
                  <p className="text-xs font-bold text-gray-300 dark:text-gray-400">لم يتم إضافة فيديو تعريفي بعد من إعدادات المنصة عند الأدمن.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
