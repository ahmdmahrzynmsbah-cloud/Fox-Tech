import React from "react";
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ShoppingBag, HelpCircle, Lock, BookOpen, Star, MessageCircleQuestion, MessageSquare, CheckCircle, Ticket, LogOut, Trophy, Flame, Bell, Target, ArrowLeft, ArrowRight, Video, Bot, Users, Activity, User as UserIcon, Wallet, ArrowUpRight, ArrowDownLeft, Smartphone, CreditCard, PiggyBank, RefreshCw, Send, Sparkles, Loader2, DollarSign, Check, History, Award, Edit2, Edit3, Save, X, Clock, Trash2, Plus , Shield, Info, Menu, ChevronRight, ChevronLeft, Film, FileText, Copy, Search, GraduationCap } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import FoxTechLogo from './FoxTechLogo';
import AdminPanel from './AdminPanel';
import AdminCoursesPanel from './AdminCoursesPanel';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, updateDoc, getDocs, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TeacherClasses from './TeacherClasses';
import TeacherAnalytics from "./TeacherAnalytics";
import FinancesManager from './FinancesManager';
import StudentCourses from './StudentCourses';
import StudentBadges from './StudentBadges';
import FAQSection from "./FAQSection";
import ProfileSection from "./ProfileSection";
import ComprehensiveExamBuilder from './ComprehensiveExamBuilder';
import StudentExamTaking from './StudentExamTaking';
import InteractiveSchedule from './InteractiveSchedule';
import LuxuriousLoader from './LuxuriousLoader';
import DashboardSkeleton from './DashboardSkeleton';
import QuickNotes from './QuickNotes';
import ComprehensiveAnalytics from './ComprehensiveAnalytics';
import TeachersSearchList from './TeachersSearchList';
import ParentTeachersList from './ParentTeachersList';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import TeacherTahsili from './TeacherTahsili';
import StudentTahsili from './StudentTahsili';
import TeacherQudurat from './TeacherQudurat';
import StudentQudurat from './StudentQudurat';
import AcademyStoreAdmin from './AcademyStoreAdmin';
import StudentStore from './StudentStore';
import StudentPurchases from './StudentPurchases';
import ParentInvoices from './ParentInvoices';
import TeacherQuestionBank from './TeacherQuestionBank';
import WalletRechargeRequestForm from './WalletRechargeRequestForm';
import ChatBox from './ChatBox';


const MOCK_TEACHER_STATS = [
  { id: 1, title: 'إجمالي الطلاب', value: '1,240', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 2, title: 'المشاهدات اليوم', value: '342', icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { id: 3, title: 'الرصيد المتاح', value: '4,500 ج.م', icon: Ticket, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
];

const MOCK_PARENT_STATS = [
  { id: 1, title: 'مستوى الطالب', value: '85%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 2, title: 'آخر الدرجات', value: '18/20', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { id: 3, title: 'نسبة الحضور', value: '95%', icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
];

export default function Dashboard() {
  const { settings } = usePlatformSettings();
  const isQuduratEnabled = (settings?.enableQuduratTahsili !== false && settings?.showQuduratSection !== false);
  const isTahsiliEnabled = (settings?.enableQuduratTahsili !== false && settings?.showTahsiliSection !== false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchParams, setSearchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');

  // Qudurat Premium Feature states
  const [hasPublishedQudurat, setHasPublishedQudurat] = useState(false);
  const [selectedQuduratReviewId, setSelectedQuduratReviewId] = useState<string | null>(null);
  const [publishedQuduratReviews, setPublishedQuduratReviews] = useState<any[]>([]);
  // Tahsili Premium Feature states
  const [hasPublishedTahsili, setHasPublishedTahsili] = useState(false);
  const [selectedTahsiliReviewId, setSelectedTahsiliReviewId] = useState<string | null>(null);
  const [publishedTahsiliReviews, setPublishedTahsiliReviews] = useState<any[]>([]);

  // Subscription to published Tahsili Reviews
  useEffect(() => {
    const q = query(
      collection(db, 'tahsili_reviews'),
      where('status', '==', 'published')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      list.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });
      setPublishedTahsiliReviews(list);
      setHasPublishedTahsili(list.length > 0);
    }, (error) => {
      console.error('Error listening to published tahsili in Dashboard:', error);
    });
    return () => unsubscribe();
  }, []);

  // Subscription to published Qudurat Reviews
  useEffect(() => {
    const q = query(
      collection(db, 'qudurat_reviews'),
      where('status', '==', 'published')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      list.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });
      setPublishedQuduratReviews(list);
      setHasPublishedQudurat(list.length > 0);
    }, (error) => {
      console.error('Error listening to published qudurat in Dashboard:', error);
    });
    return () => unsubscribe();
  }, []);

  const getMobileNavItems = () => {
    if (userData?.role === 'admin') {
      return [
        { id: 'home', label: 'الرئيسية', icon: Target },
        { id: 'chatbox', label: 'النقاشات التقنية', icon: MessageSquare },
        { id: 'admin', label: 'لوحة القيادة', icon: Shield },
        { id: 'admin_recharge', label: 'مسار الـ Frontend', icon: Ticket },
        { id: 'admin_courses', label: 'مسار الـ Backend', icon: BookOpen },
        { id: 'admin_store', label: 'المكتبة البرمجية', icon: Edit3 },
        { id: 'tahsili', label: 'التحصيلي', icon: Film },
        { id: 'qudurat', label: 'القدرات', icon: Film },
        { id: 'analytics', label: 'التقارير والإحصائيات', icon: Flame },
        { id: 'finances', label: 'الحسابات والمالية', icon: DollarSign },
        { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
      ];
    } else if (userData?.role === 'teacher') {
      const items = [
        { id: 'home', label: 'الرئيسية', icon: Target },
        { id: 'chatbox', label: 'شات بوكس (الرسائل)', icon: MessageSquare },
        { id: 'classes', label: 'فصولي وإدارة الطلاب', icon: Users },
        { id: 'quizzes', label: 'إدارة الاختبارات والواجبات', icon: Award },
        { id: 'question_bank', label: 'بنك الأسئلة', icon: BookOpen },
      ];
      if (isTahsiliEnabled) {
        items.push({ id: 'tahsili', label: 'التحصيلي', icon: Film });
      }
      if (isQuduratEnabled) {
        items.push({ id: 'qudurat', label: 'القدرات', icon: Film });
      }
      items.push({ id: 'analytics', label: 'تحليلات الأداء المتقدمة', icon: Activity });
      items.push({ id: 'finances', label: 'الحسابات والأرباح', icon: DollarSign });
      items.push({ id: 'profile', label: 'الملف الشخصي', icon: UserIcon });
      return items;
    } else if (userData?.role === 'parent') {
      return [
        { id: 'home', label: 'الرئيسية (متابعة المتدربين)', icon: Target },
        { id: 'chatbox', label: 'شات بوكس (الرسائل)', icon: MessageSquare },
        { id: 'quizzes', label: 'نتائج الاختبارات والتقييمات', icon: Award },
        { id: 'schedule', label: 'الجدول التدريبي وورش العمل', icon: Clock },
        { id: 'parent_invoices', label: 'الفواتير والمشتريات', icon: FileText },
        { id: 'wallet', label: 'المحفظة الإلكترونية', icon: Ticket },
        { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
      ];
    } else {
      if (userData?.isSpecialRegistration) {
        const isSubscribedToQudurat = publishedQuduratReviews.some(review => 
          review.enrolledStudentIds?.includes(userData?.id)
        );
        const isSubscribedToTahsili = publishedTahsiliReviews.some(review => 
          review.enrolledStudentIds?.includes(userData?.id)
        );

        const items = [
          { id: 'home', label: 'الرئيسية', icon: Target },
          { id: 'chatbox', label: 'شات بوكس (الرسائل)', icon: MessageSquare },
        ];

        const hasAnySubscription = isSubscribedToQudurat || isSubscribedToTahsili;

        if (hasAnySubscription) {
          if (isSubscribedToTahsili && isTahsiliEnabled) {
            items.push({ id: 'tahsili', label: 'التحصيلي', icon: Film });
          }
          if (isSubscribedToQudurat && isQuduratEnabled) {
            items.push({ id: 'qudurat', label: 'القدرات', icon: Film });
          }
        } else {
          const regType = userData.registrationType || 'both';
          if ((regType === 'tahsili' || regType === 'both') && isTahsiliEnabled) {
            items.push({ id: 'tahsili', label: 'التحصيلي', icon: Film });
          }
          if ((regType === 'qudurat' || regType === 'both') && isQuduratEnabled) {
            items.push({ id: 'qudurat', label: 'القدرات', icon: Film });
          }
        }
        items.push({ id: 'wallet', label: 'المحفظة الإلكترونية وشحن الرصيد', icon: Ticket });
        items.push({ id: 'profile', label: 'الملف الشخصي', icon: UserIcon });
        return items;
      }
      const base = [
        { id: 'home', label: 'الرئيسية', icon: Target },
        { id: 'chatbox', label: 'شات بوكس', icon: MessageSquare },
        { id: 'subjects', label: 'كورساتي', icon: BookOpen },
        { id: 'teachers_list', label: 'المعلمون', icon: Users },
        { id: 'student_store', label: 'المتجر', icon: ShoppingBag },
        { id: 'purchases', label: 'مشترياتي', icon: FileText },
      ];
      const studentNav: any[] = [
        ...base,
        { id: 'quizzes', label: 'الاختبارات والواجبات', icon: Award },
      ];
      if (isTahsiliEnabled) {
        studentNav.push({ id: 'tahsili', label: 'التحصيلي', icon: Film });
      }
      if (isQuduratEnabled) {
        studentNav.push({ id: 'qudurat', label: 'القدرات', icon: Film });
      }
      studentNav.push(
        { id: 'badges', label: 'الأوسمة والإنجازات', icon: Trophy },
        { id: 'schedule', label: 'الجدول التدريبي', icon: Clock },
        { id: 'wallet', label: 'المحفظة الإلكترونية وشحن الرصيد', icon: Ticket },
        { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
      );
      return studentNav;
    }
  };

  const getDesktopNavItems = () => {
    if (userData?.role === 'admin') {
      return [
        { id: 'home', label: 'الرئيسية', icon: Target },
        { id: 'chatbox', label: 'النقاشات التقنية', icon: MessageSquare },
        { id: 'admin', label: 'لوحة القيادة', icon: Shield },
        { id: 'admin_recharge', label: 'مسار الـ Frontend', icon: Ticket },
        { id: 'admin_courses', label: 'مسار الـ Backend', icon: BookOpen },
        { id: 'admin_store', label: 'المكتبة البرمجية', icon: Edit3 },
        { id: 'tahsili', label: 'التحصيلي', icon: Film },
        { id: 'qudurat', label: 'القدرات', icon: Film },
        { id: 'analytics', label: 'التقارير والإحصائيات', icon: Flame },
        { id: 'finances', label: 'الحسابات والمالية', icon: DollarSign },
        { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
      ];
    } else if (userData?.role === 'teacher') {
      const items = [
        { id: 'home', label: 'الرئيسية', icon: Target },
        { id: 'chatbox', label: 'شات بوكس', icon: MessageSquare },
        { id: 'classes', label: 'ورش العمل ومجموعاتي', icon: Users },
        { id: 'quizzes', label: 'الاختبارات والتحديات', icon: Award },
        { id: 'question_bank', label: 'بنك الأسئلة والمشاكل البرمجية', icon: BookOpen },
        { id: 'schedule', label: 'الجدول التدريبي', icon: Clock },
      ];
      if (isTahsiliEnabled) {
        items.push({ id: 'tahsili', label: 'التحصيلي', icon: Film });
      }
      if (isQuduratEnabled) {
        items.push({ id: 'qudurat', label: 'القدرات', icon: Film });
      }
      items.push(
        { id: 'analytics', label: 'التقارير', icon: Flame },
        { id: 'finances', label: 'الحسابات والأرباح', icon: DollarSign },
        { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
      );
      return items;
    } else if (userData?.role === 'parent') {
      return [
        { id: 'home', label: 'الرئيسية (متابعة المتدربين)', icon: Target },
        { id: 'chatbox', label: 'شات بوكس (الرسائل)', icon: MessageSquare },
        { id: 'quizzes', label: 'اختبارات وتحديات المتدرب', icon: Award },
        { id: 'schedule', label: 'الجدول التدريبي', icon: Clock },
        { id: 'reports', label: 'تقارير المتدرب', icon: Flame },
        { id: 'parent_invoices', label: 'الفواتير والمشتريات', icon: FileText },
        { id: 'wallet', label: 'محفظة المتدرب', icon: Ticket },
        { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
      ];
    } else {
      if (userData?.isSpecialRegistration) {
        const isSubscribedToQudurat = publishedQuduratReviews.some(review => 
          review.enrolledStudentIds?.includes(userData?.id)
        );
        const isSubscribedToTahsili = publishedTahsiliReviews.some(review => 
          review.enrolledStudentIds?.includes(userData?.id)
        );

        const items = [
          { id: 'home', label: 'الرئيسية', icon: Target },
          { id: 'chatbox', label: 'شات بوكس', icon: MessageSquare },
        ];

        const hasAnySubscription = isSubscribedToQudurat || isSubscribedToTahsili;

        if (hasAnySubscription) {
          if (isSubscribedToTahsili && isTahsiliEnabled) {
            items.push({ id: 'tahsili', label: 'التحصيلي', icon: Film });
          }
          if (isSubscribedToQudurat && isQuduratEnabled) {
            items.push({ id: 'qudurat', label: 'القدرات', icon: Film });
          }
        } else {
          const regType = userData.registrationType || 'both';
          if ((regType === 'tahsili' || regType === 'both') && isTahsiliEnabled) {
            items.push({ id: 'tahsili', label: 'التحصيلي', icon: Film });
          }
          if ((regType === 'qudurat' || regType === 'both') && isQuduratEnabled) {
            items.push({ id: 'qudurat', label: 'القدرات', icon: Film });
          }
        }
        items.push({ id: 'wallet', label: 'المحفظة', icon: Ticket });
        items.push({ id: 'profile', label: 'الملف الشخصي', icon: UserIcon });
        return items;
      }
      const base = [
        { id: 'home', label: 'الرئيسية', icon: Target },
        { id: 'chatbox', label: 'شات بوكس', icon: MessageSquare },
        { id: 'subjects', label: 'موادي', icon: BookOpen },
        { id: 'teachers_list', label: 'المعلمون', icon: Users },
        { id: 'student_store', label: 'المتجر', icon: ShoppingBag },
        { id: 'purchases', label: 'مشترياتي', icon: FileText },
      ];
      const studentDeskNav: any[] = [
        ...base,
        { id: 'quizzes', label: 'الاختبارات', icon: Award },
      ];
      if (isTahsiliEnabled) {
        studentDeskNav.push({ id: 'tahsili', label: 'التحصيلي', icon: Film });
      }
      if (isQuduratEnabled) {
        studentDeskNav.push({ id: 'qudurat', label: 'القدرات', icon: Film });
      }
      studentDeskNav.push(
        { id: 'badges', label: 'الأوسمة والإنجازات', icon: Trophy },
        { id: 'schedule', label: 'الجدول الدراسي', icon: Clock },
        { id: 'notes', label: 'الملاحظات السريعة', icon: Edit2 },
        { id: 'wallet', label: 'المحفظة', icon: Ticket },
        { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
        { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
      );
      return studentDeskNav;
    }
  };


  useEffect(() => {
    if (tabQuery) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);
  const [activationStatus, setActivationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [code, setCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [userData, setUserData] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('cached_current_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem('cached_current_user');
    } catch {
      return true;
    }
  });
  const userDataLoadedRef = useRef(false);

  const prevStatusRef = useRef<string | undefined>(undefined);
  const prevApprovedRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (userData) {
      // 1. Special Registration Status Transitions
      if (userData.isSpecialRegistration) {
        if (prevStatusRef.current === 'pending' && userData.status === 'approved') {
          toast.success('تهانينا يا بطل! 🎉 تم قبول طلب تسجيلك في المنصة بنجاح. يمكنك الآن البدء والدراسة في دوراتك المخصصة!', {
            duration: 3000,
            position: 'top-center',
            style: {
              borderRadius: '16px',
              background: '#1A1A24',
              color: '#fff',
              border: '2px solid #10B981',
              padding: '16px',
              fontWeight: 'bold',
            },
          });
        } else if (prevStatusRef.current === 'pending' && userData.status === 'rejected') {
          toast.error('عذراً يا بطل، تم رفض طلب انضمامك للمسارات الخاصة. يرجى مراجعة الإدارة.', {
            duration: 3000,
            position: 'top-center',
            style: {
              borderRadius: '16px',
              background: '#1A1A24',
              color: '#fff',
              border: '2px solid #EF4444',
              padding: '16px',
              fontWeight: 'bold',
            },
          });
        }
        prevStatusRef.current = userData.status;
      } else {
        prevStatusRef.current = userData.status;
      }

      // 2. Account general approval Transitions
      if (prevApprovedRef.current === false && userData.isApproved === true) {
        toast.success(`أهلاً بك! 🎉 تم تفعيل حسابك كـ ${userData.role === 'teacher' ? 'معلم' : userData.role === 'parent' ? 'ولي أمر' : 'طالب'} بنجاح في المنصة.`, {
          duration: 3000,
          position: 'top-center',
          style: {
            borderRadius: '16px',
            background: '#1A1A24',
            color: '#fff',
            border: '2px solid #10B981',
            padding: '16px',
            fontWeight: 'bold',
          },
        });
      }
      prevApprovedRef.current = userData.isApproved;
    }
  }, [userData?.status, userData?.isApproved, userData?.isSpecialRegistration, userData?.role]);

  // Quizzes & Exams State
  const [quizzesList, setQuizzesList] = useState<any[]>([]);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [selectedQuizReview, setSelectedQuizReview] = useState<any>(null);
  const [selectedSubmissionReview, setSelectedSubmissionReview] = useState<any>(null);
  const [quizzesFilter, setQuizzesFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [teacherSelectedQuiz, setTeacherSelectedQuiz] = useState<any>(null);

  const studentVisibleQuizzes = useMemo(() => {
    return quizzesList.filter(q => {
      if (q.directTargetType === 'grade' && q.directTargetGrade) {
        return q.directTargetGrade === userData?.grade;
      }
      if (q.directTargetType === 'custom' && Array.isArray(q.directTargetStudents)) {
        return q.directTargetStudents.includes(userData?.id);
      }
      return true;
    });
  }, [quizzesList, userData?.grade, userData?.id]);

  // Comprehensive/General Standalone Exams States
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [continueLearningItem, setContinueLearningItem] = useState<any>(null);
  const [loadingContinueLearning, setLoadingContinueLearning] = useState(false);
  const [quizTabType, setQuizTabType] = useState<'lesson' | 'comprehensive'>('lesson');
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [examTimeLimit, setExamTimeLimit] = useState(30);
  const [examCourseId, setExamCourseId] = useState('');
  const [examQuestions, setExamQuestions] = useState<any[]>([
    { id: 'q_1', text: '', options: ['', '', '', ''], correctOptionIndex: 0, points: 1, explanation: '' }
  ]);
  const [savingExam, setSavingExam] = useState(false);

  // Student taking comprehensive exam states
  const [activeTakingExam, setActiveTakingExam] = useState<any>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examCurrentQuestionIdx, setExamCurrentQuestionIdx] = useState(0);
  const [examSelectedAnswers, setExamSelectedAnswers] = useState<Record<string, number>>({});
  const [examTimeLeft, setExamTimeLeft] = useState<number | null>(null); // in seconds
  const [submittingExam, setSubmittingExam] = useState(false);
  const [starsReloadTrigger, setStarsReloadTrigger] = useState(0);
  const [showExamResultModal, setShowExamResultModal] = useState(false);
  const [examResultSubmission, setExamResultSubmission] = useState<any>(null);
  const examTimerRef = React.useRef<any>(null);
  const examStartTimeRef = React.useRef<number>(0);

  // Wallet & Transactions States
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [linkedStudent, setLinkedStudent] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'vodafone' | 'instapay' | 'bank'>('vodafone');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [showChargeForm, setShowChargeForm] = useState(false);

  // Direct / Publish Exam Modal States
  const [directingQuiz, setDirectingQuiz] = useState<any | null>(null);
  const [directTargetType, setDirectTargetType] = useState<'all' | 'grade' | 'custom'>('all');
  const [directTargetGrade, setDirectTargetGrade] = useState('الأول الثانوي');
  const [directTargetStudentIds, setDirectTargetStudentIds] = useState<string[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingDirecting, setSavingDirecting] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Dynamic Teacher & Parent Stats States
  const [teacherStudentsCount, setTeacherStudentsCount] = useState(0);
  const [teacherViewsCount, setTeacherViewsCount] = useState(0);
  const [teacherCoursesCount, setTeacherCoursesCount] = useState(0);
  const [loadingTeacherStats, setLoadingTeacherStats] = useState(false);
  const [teacherChartData, setTeacherChartData] = useState<any[]>([]);
  const [teacherEnrollmentTrend, setTeacherEnrollmentTrend] = useState<any[]>([]);

  const [parentStats, setParentStats] = useState({
    level: '0%',
    coursesCount: 0,
    attendance: '0%'
  });
  const [loadingParentStats, setLoadingParentStats] = useState(false);

  // Stars / Points State
  const [starsCount, setStarsCount] = useState<number>(0);
  const [loadingStars, setLoadingStars] = useState(false);

  // Quick Notes Integration
  const [quickNotesCount, setQuickNotesCount] = useState(0);
  const [miniNoteContent, setMiniNoteContent] = useState('');
  const [miniNoteCourseId, setMiniNoteCourseId] = useState('general');
  const [savingMiniNote, setSavingMiniNote] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Admin Stats State
  const [adminStats, setAdminStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    pendingPayments: 0
  });
  const [loadingAdminStats, setLoadingAdminStats] = useState(false);

  useEffect(() => {
    if (userData?.role !== 'admin') return;
    const fetchAdminStats = async () => {
      setLoadingAdminStats(true);
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        let students = 0;
        let teachers = 0;
        usersSnap.forEach(doc => {
           if (doc.data().role === 'student') students++;
           if (doc.data().role === 'teacher') teachers++;
        });

        const coursesSnap = await getDocs(collection(db, 'courses'));
        const courses = coursesSnap.size;

        const paymentsQ = query(collection(db, 'course_payments'), where('status', '==', 'pending'));
        const paymentsSnap = await getDocs(paymentsQ);
        const pendingPayments = paymentsSnap.size;

        setAdminStats({
          students,
          teachers,
          courses,
          pendingPayments
        });
      } catch(err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoadingAdminStats(false);
      }
    };
    fetchAdminStats();
  }, [userData?.role]);



  useEffect(() => {
    if (!userData?.id || userData.role !== 'student') return;
    const q = query(collection(db, 'quick_notes'), where('userId', '==', userData.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuickNotesCount(snapshot.size);
    }, (err) => {
      console.warn("Failed to listen to quick notes count:", err);
    });
    return () => unsubscribe();
  }, [userData?.id, userData?.role]);

  const handleMiniNoteSave = async () => {
    if (!miniNoteContent.trim()) {
      toast.error('الرجاء كتابة نص الملاحظة السريعة');
      return;
    }
    setSavingMiniNote(true);
    try {
      const selectedCourse = coursesList.find(c => c.id === miniNoteCourseId);
      const courseTitle = miniNoteCourseId === 'general' ? 'ملاحظات عامة' : (selectedCourse?.title || 'كورس دراسي');

      await addDoc(collection(db, 'quick_notes'), {
        userId: userData.id,
        content: miniNoteContent.trim(),
        courseId: miniNoteCourseId,
        courseTitle: courseTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast.success('تم حفظ الملاحظة السريعة وتزامنها سحابياً! ✨');
      setMiniNoteContent('');
      setMiniNoteCourseId('general');
    } catch (err) {
      console.error("Error saving mini note:", err);
      toast.error("فشل في حفظ الملاحظة السريعة");
    } finally {
      setSavingMiniNote(false);
    }
  };


    // Fetch Quizzes, Submissions and Courses
  useEffect(() => {
    const fetchQuizzesAndSubmissions = async () => {
      if (!userData?.id || (activeTab !== 'quizzes')) return;
      setLoadingQuizzes(true);
      try {
        const qCourses = userData.role === 'teacher'
          ? query(collection(db, 'courses'), where('teacherId', '==', userData.id))
          : query(collection(db, 'courses'));

        if (userData.role === 'student') {
          // Fetch courses, quizzes, and submissions in parallel
          const [courseSnap, quizSnap, subSnap] = await Promise.all([
            getDocs(qCourses),
            getDocs(query(collection(db, 'quizzes'))),
            getDocs(query(collection(db, 'quiz_submissions'), where('userId', '==', userData.id)))
          ]);
          setCoursesList(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setQuizzesList(quizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setSubmissionsList(subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else if (userData.role === 'teacher') {
          // Fetch courses, teacher's quizzes, and submissions in parallel
          const [courseSnap, quizSnap, subSnap] = await Promise.all([
            getDocs(qCourses),
            getDocs(query(collection(db, 'quizzes'), where('createdBy', '==', userData.id))),
            getDocs(query(collection(db, 'quiz_submissions')))
          ]);
          setCoursesList(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setQuizzesList(quizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setSubmissionsList(subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else if (userData.role === 'parent' && linkedStudent?.id) {
          // Fetch courses, student submissions, and quizzes in parallel
          const [courseSnap, subSnap, quizSnap] = await Promise.all([
            getDocs(qCourses),
            getDocs(query(collection(db, 'quiz_submissions'), where('userId', '==', linkedStudent.id))),
            getDocs(query(collection(db, 'quizzes')))
          ]);
          setCoursesList(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setSubmissionsList(subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setQuizzesList(quizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Error fetching quizzes or submissions:", err);
        toast.error("فشل تحميل البيانات التفاعلية للاختبارات");
      } finally {
        setLoadingQuizzes(false);
      }
    };

    fetchQuizzesAndSubmissions();
  }, [activeTab, userData?.id, userData?.role, linkedStudent?.id]);

  // Load students for directing when needed
  useEffect(() => {
    const fetchStudentsForDirecting = async () => {
      if (!directingQuiz || userData?.role !== 'teacher') return;
      setLoadingStudents(true);
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllStudents(list);
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("فشل تحميل قائمة الطلاب للتوجيه");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudentsForDirecting();
  }, [directingQuiz, userData]);

  const handleSaveDirecting = async () => {
    if (!directingQuiz) return;
    setSavingDirecting(true);
    try {
      const quizRef = doc(db, 'quizzes', directingQuiz.id);
      const updateData = {
        isHidden: false, // publishing it!
        targetedType: directTargetType,
        targetedGrade: directTargetType === 'grade' ? directTargetGrade : 'all',
        targetedStudentIds: directTargetType === 'custom' ? directTargetStudentIds : []
      };
      await updateDoc(quizRef, updateData);

      // Update in local state list
      setQuizzesList(prev => prev.map(q => q.id === directingQuiz.id ? { ...q, ...updateData } : q));
      
      // Update selected quiz if it is the one being edited
      if (teacherSelectedQuiz?.id === directingQuiz.id) {
        setTeacherSelectedQuiz(prev => ({ ...prev, ...updateData }));
      }

      toast.success("تم توجيه ونشر الاختبار بنجاح! 🚀");
      setDirectingQuiz(null);
    } catch (err) {
      console.error("Error directing quiz:", err);
      toast.error("فشل حفظ إعدادات توجيه الاختبار");
    } finally {
      setSavingDirecting(false);
    }
  };

  // Student Exam Timer useEffect
  useEffect(() => {
    if (examStarted && examTimeLeft !== null && examTimeLeft > 0) {
      examTimerRef.current = setInterval(() => {
        setExamTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(examTimerRef.current);
            setTimeout(() => {
              handleAutoSubmitExam();
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    };
  }, [examStarted, examTimeLeft]);

  // Auto submit when time is up
  const handleAutoSubmitExam = () => {
    toast.error('انتهى وقت الامتحان! سيتم تسليم إجاباتك الحالية تلقائياً.');
    handleSubmitExam();
  };

  // Submit standalone / comprehensive exam
  const handleSubmitExam = async (answersOverride?: Record<string, number>) => {
    if (!activeTakingExam || !userData) return;
    setSubmittingExam(true);
    
    try {
      const finalAnswers = answersOverride || examSelectedAnswers;
      const questionsList = activeTakingExam.questions || [];
      
      let correctCount = 0;
      let totalPoints = 0;
      let earnedPoints = 0;
      
      questionsList.forEach((q: any) => {
        const selected = finalAnswers[q.id];
        const pts = Number(q.points) || 1;
        totalPoints += pts;
        if (selected !== undefined && selected === q.correctOptionIndex) {
          correctCount += 1;
          earnedPoints += pts;
        }
      });
      
      const percentScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const passed = percentScore >= 50;
      
      const submissionId = `${userData.id}_${activeTakingExam.id}`;
      const submissionData = {
        id: submissionId,
        userId: userData.id,
        userName: userData.name || 'طالب',
        quizId: activeTakingExam.id,
        courseId: activeTakingExam.courseId || '',
        lessonId: 'comprehensive', // mark as comprehensive
        score: percentScore,
        totalPoints,
        correctAnswers: correctCount,
        totalQuestions: questionsList.length,
        answers: finalAnswers,
        submittedAt: new Date().toISOString(),
        passed
      };
      
      await setDoc(doc(db, 'quiz_submissions', submissionId), submissionData);
      
      setSubmissionsList(prev => {
        const filtered = prev.filter(s => s.id !== submissionId);
        return [submissionData, ...filtered];
      });
      
      setStarsReloadTrigger(prev => prev + 1);
      
      setExamResultSubmission(submissionData);
      setShowExamResultModal(true);
      setExamStarted(false);
      setActiveTakingExam(null);
      toast.success('تم تسليم الامتحان بنجاح! 🎉');
    } catch (err) {
      console.error("Error submitting exam:", err);
      toast.error("فشل تسليم الامتحان، الرجاء المحاولة مرة أخرى.");
    } finally {
      setSubmittingExam(false);
    }
  };

  // Helper actions for standalone / comprehensive exam builder (Teacher)
  const handleAddExamQuestion = () => {
    const newId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setExamQuestions(prev => [
      ...prev,
      { id: newId, text: '', options: ['', '', '', ''], correctOptionIndex: 0, points: 1, explanation: '' }
    ]);
  };

  const handleRemoveExamQuestion = (index: number) => {
    if (examQuestions.length <= 1) {
      toast.error('يجب أن يحتوي الامتحان على سؤال واحد على الأقل.');
      return;
    }
    setExamQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExamQuestionField = (index: number, field: string, value: any) => {
    setExamQuestions(prev => prev.map((q, i) => {
      if (i === index) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleUpdateExamQuestionOption = (qIndex: number, optIndex: number, value: string) => {
    setExamQuestions(prev => prev.map((q, i) => {
      if (i === qIndex) {
        const newOpts = [...q.options];
        newOpts[optIndex] = value;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const handleSaveExamByTeacher = async () => {
    if (!examTitle.trim()) {
      toast.error('يرجى إدخال عنوان الامتحان الشامل.');
      return;
    }
    
    for (let i = 0; i < examQuestions.length; i++) {
      const q = examQuestions[i];
      if (!q.text.trim()) {
        toast.error(`يرجى كتابة نص السؤال رقم ${i + 1}`);
        return;
      }
      for (let o = 0; o < q.options.length; o++) {
        if (!q.options[o].trim()) {
          toast.error(`يرجى كتابة الخيار رقم ${o + 1} للسؤال رقم ${i + 1}`);
          return;
        }
      }
    }
    
    setSavingExam(true);
    try {
      const examId = editingExamId || `comprehensive_${Date.now()}`;
      const examData = {
        id: examId,
        title: examTitle.trim(),
        description: examDesc.trim(),
        timeLimit: Number(examTimeLimit) || 0,
        courseId: examCourseId || 'all',
        questions: examQuestions,
        isComprehensive: true,
        createdBy: userData.id,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'quizzes', examId), examData);
      
      setQuizzesList(prev => {
        const filtered = prev.filter(q => q.id !== examId);
        return [examData, ...filtered];
      });
      
      toast.success(editingExamId ? 'تم تعديل الامتحان الشامل بنجاح! ✏️' : 'تم إنشاء وتفعيل الامتحان الشامل بنجاح! 🎉');
      setIsCreatingExam(false);
      setEditingExamId(null);
      // Reset fields
      setExamTitle('');
      setExamDesc('');
      setExamTimeLimit(30);
      setExamCourseId('');
      setExamQuestions([
        { id: 'q_1', text: '', options: ['', '', '', ''], correctOptionIndex: 0, points: 1, explanation: '' }
      ]);
    } catch (err) {
      console.error("Error saving exam:", err);
      toast.error("فشل حفظ الامتحان الشامل، يرجى المحاولة مرة أخرى.");
    } finally {
      setSavingExam(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الامتحان الشامل نهائياً؟')) return;
    try {
      await deleteDoc(doc(db, 'quizzes', examId));
      setQuizzesList(prev => prev.filter(q => q.id !== examId));
      if (teacherSelectedQuiz?.id === examId) {
        setTeacherSelectedQuiz(null);
      }
      toast.success('تم حذف الامتحان الشامل بنجاح.');
    } catch (err) {
      console.error("Error deleting exam:", err);
      toast.error("فشل حذف الامتحان.");
    }
  };

  // Fetch and calculate stars dynamically based on user activity
  useEffect(() => {
    const fetchStars = async () => {
      if (!userData?.id) return;
      setLoadingStars(true);
      try {
        if (userData.role === 'student') {
          // Fetch courses, progress, and submissions in parallel
          const qCourses = query(
            collection(db, 'courses'),
            where('enrolledStudentIds', 'array-contains', userData.id)
          );
          const qProgress = query(
            collection(db, 'course_progress'),
            where('userId', '==', userData.id)
          );
          const qSubmissions = query(
            collection(db, 'quiz_submissions'),
            where('userId', '==', userData.id),
            where('lessonId', '==', 'comprehensive')
          );

          const [snapshotCourses, snapshotProgress, snapshotSubmissions] = await Promise.all([
            getDocs(qCourses),
            getDocs(qProgress),
            getDocs(qSubmissions)
          ]);

          const enrolledCount = snapshotCourses.size;
          const progressCount = snapshotProgress.size;

          let examPoints = 0;
          snapshotSubmissions.forEach(doc => {
            const subData = doc.data();
            const score = Number(subData.score) || 0;
            // Reward 3 points per 1% score (max 300 points per exam)
            examPoints += Math.round(score * 3);
          });

          // Stars = (Enrolled * 200) + (Progress * 150) + ExamPoints + 500 (Base/Welcome gift) - 500 if joined league
          const totalStars = (enrolledCount * 200) + (progressCount * 150) + examPoints + 500;
          setStarsCount(totalStars);
          
          // CRITICAL: Only write to firestore if the stars count actually changed!
          if (userData.stars !== totalStars) {
            try {
              await updateDoc(doc(db, 'users', userData.id), { stars: totalStars });
            } catch (e) {
              console.warn("Failed to update student points in background:", e);
            }
          }
        } else if (userData.role === 'parent' && linkedStudent?.id) {
          // Parent views the linked student's stars in parallel
          const qCourses = query(
            collection(db, 'courses'),
            where('enrolledStudentIds', 'array-contains', linkedStudent.id)
          );
          const qProgress = query(
            collection(db, 'course_progress'),
            where('userId', '==', linkedStudent.id)
          );
          const qSubmissions = query(
            collection(db, 'quiz_submissions'),
            where('userId', '==', linkedStudent.id),
            where('lessonId', '==', 'comprehensive')
          );

          const [snapshotCourses, snapshotProgress, snapshotSubmissions] = await Promise.all([
            getDocs(qCourses),
            getDocs(qProgress),
            getDocs(qSubmissions)
          ]);

          const enrolledCount = snapshotCourses.size;
          const progressCount = snapshotProgress.size;

          let examPoints = 0;
          snapshotSubmissions.forEach(doc => {
            const subData = doc.data();
            const score = Number(subData.score) || 0;
            examPoints += Math.round(score * 3);
          });

          const totalStars = (enrolledCount * 200) + (progressCount * 150) + examPoints + 500;
          setStarsCount(totalStars);
        } else if (userData.role === 'teacher') {
          // Teacher reputation stars = Enrolled students across all their courses * 100 + coursesCount * 300 + 1000 base
          const qCourses = query(
            collection(db, 'courses'),
            where('teacherId', '==', userData.id)
          );
          const snapshotCourses = await getDocs(qCourses);
          const fetchedCourses = snapshotCourses.docs.map(doc => doc.data());
          const totalEnrolled = fetchedCourses.reduce((acc, course) => acc + (course.enrolledStudents || 0), 0);
          const coursesCount = fetchedCourses.length;

          const totalStars = (totalEnrolled * 100) + (coursesCount * 300) + 1000;
          setStarsCount(totalStars);
          
          if (userData.stars !== totalStars) {
            try {
              await updateDoc(doc(db, 'users', userData.id), { stars: totalStars });
            } catch (e) {
              console.warn("Failed to update teacher points in background:", e);
            }
          }
        }
      } catch (err) {
        console.error("Error calculating dynamic stars:", err);
      } finally {
        setLoadingStars(false);
      }
    };

    fetchStars();
  }, [activeTab, userData?.id, userData?.role, linkedStudent?.id, starsReloadTrigger]);

  // Fetch real and precise Continue Learning item for Student
  useEffect(() => {
    if (!userData?.id || userData.role !== 'student') return;

    const fetchContinueLearning = async () => {
      setLoadingContinueLearning(true);
      try {
        // Query course progress
        const qProgress = query(
          collection(db, 'course_progress'),
          where('userId', '==', userData.id)
        );
        const progressSnap = await getDocs(qProgress);
        let progressDocs: any[] = [];
        progressSnap.forEach(doc => {
          progressDocs.push({ id: doc.id, ...doc.data() });
        });

        // Sort by lastWatchedAt desc
        progressDocs.sort((a, b) => {
          const dateA = a.lastWatchedAt ? new Date(a.lastWatchedAt).getTime() : 0;
          const dateB = b.lastWatchedAt ? new Date(b.lastWatchedAt).getTime() : 0;
          return dateB - dateA;
        });

        let targetProgress = progressDocs[0];
        let targetCourseId = targetProgress?.courseId;
        let targetLessonId = targetProgress?.lastWatchedLessonId;

        // If no progress docs exist, try to find a course they are enrolled in and suggest starting it!
        if (!targetProgress) {
          const qEnrolled = query(
            collection(db, 'courses'),
            where('enrolledStudentIds', 'array-contains', userData.id)
          );
          const enrolledSnap = await getDocs(qEnrolled);
          if (!enrolledSnap.empty) {
            const firstCourseDoc = enrolledSnap.docs[0];
            targetCourseId = firstCourseDoc.id;
          }
        }

        if (targetCourseId) {
          // Fetch Course details and Lessons of this course in parallel!
          const [courseDoc, lessonsSnap] = await Promise.all([
            getDoc(doc(db, 'courses', targetCourseId)),
            getDocs(query(collection(db, 'lessons'), where('courseId', '==', targetCourseId)))
          ]);

          if (courseDoc.exists()) {
            const courseData = courseDoc.data();
            
            let lessonsList: any[] = [];
            lessonsSnap.forEach(ldoc => {
              lessonsList.push({ id: ldoc.id, ...ldoc.data() });
            });
            lessonsList.sort((a, b) => (a.order || 0) - (b.order || 0));

            if (lessonsList.length > 0) {
              // Find matching lesson
              let matchingLesson = targetLessonId 
                ? lessonsList.find(l => l.id === targetLessonId) 
                : lessonsList[0];
              
              if (!matchingLesson) {
                matchingLesson = lessonsList[0];
              }

              // Get progress of matching lesson
              let percent = 0;
              let timeRemainingText = "ابدأ التعلم الآن";
              
              if (targetProgress && targetProgress.lessonProgress && targetProgress.lessonProgress[matchingLesson.id]) {
                const prog = targetProgress.lessonProgress[matchingLesson.id];
                percent = prog.percent || 0;
                const secondsLeft = (prog.duration || 0) - (prog.currentTime || 0);
                if (percent >= 98) {
                  timeRemainingText = "تم إكمال الدرس بنجاح 🌟";
                } else if (secondsLeft <= 60) {
                  timeRemainingText = "متبقي أقل من دقيقة واحدة";
                } else {
                  timeRemainingText = `متبقي ${Math.round(secondsLeft / 60)} دقائق`;
                }
              }

              setContinueLearningItem({
                courseId: targetCourseId,
                courseTitle: courseData.title,
                courseSubject: courseData.subject || "عام",
                lessonId: matchingLesson.id,
                lessonTitle: matchingLesson.title,
                lessonOrder: matchingLesson.order || 1,
                percent: percent,
                timeRemainingText: timeRemainingText,
                videoUrl: matchingLesson.videoUrl || ""
              });
              setLoadingContinueLearning(false);
              return;
            }
          }
        }

        setContinueLearningItem(null);
      } catch (error) {
        console.error("Error fetching continue learning data:", error);
        setContinueLearningItem(null);
      } finally {
        setLoadingContinueLearning(false);
      }
    };

    fetchContinueLearning();
  }, [activeTab, userData?.id, userData?.role]);

  // Fetch dynamic stats for teachers
  useEffect(() => {
    if (userData?.role === 'teacher' && userData?.id) {
      const fetchTeacherStats = async () => {
        setLoadingTeacherStats(true);
        try {
          const qCourses = query(collection(db, 'courses'), where('teacherId', '==', userData.id));
          const qNotifs = query(
            collection(db, 'notifications'),
            where('userId', '==', userData.id),
            where('type', '==', 'enrollment')
          );

          // Fetch courses and notifications in parallel
          const [snapshotCourses, snapshotNotifs] = await Promise.all([
            getDocs(qCourses),
            getDocs(qNotifs)
          ]);

          const fetchedCourses = snapshotCourses.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          setTeacherCoursesCount(fetchedCourses.length);
          
          const totalEnrolled = fetchedCourses.reduce((acc, course) => acc + (course.enrolledStudents || 0), 0);
          setTeacherStudentsCount(totalEnrolled);

          let totalViews = 0;
          const coursesChartData: any[] = [];

          // Fetch all lessons for all courses in parallel
          const lessonsSnapshots = await Promise.all(
            fetchedCourses.map(course =>
              getDocs(query(collection(db, 'lessons'), where('courseId', '==', course.id)))
            )
          );

          fetchedCourses.forEach((course, idx) => {
            const snapshotLessons = lessonsSnapshots[idx];
            let views = 0;
            snapshotLessons.forEach(lessonDoc => {
              views += (lessonDoc.data().views || 0);
            });
            totalViews += views;

            coursesChartData.push({
              name: course.title || 'كورس غير مسمى',
              students: course.enrolledStudents || 0,
              views: views
            });
          });

          setTeacherViewsCount(totalViews);
          setTeacherChartData(coursesChartData);
          
          // Let's group notifications by day
          const enrollmentsByDay: { [key: string]: number } = {};
          
          // Pre-populate last 7 days with 0 to make a nice chart even if empty
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' });
            enrollmentsByDay[dateStr] = 0;
          }

          snapshotNotifs.forEach(docSnap => {
            const data = docSnap.data();
            if (data.createdAt) {
              const dateStr = new Date(data.createdAt).toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' });
              if (enrollmentsByDay[dateStr] !== undefined) {
                enrollmentsByDay[dateStr] += 1;
              } else {
                enrollmentsByDay[dateStr] = 1;
              }
            }
          });

          // Convert to chart format
          const trendData = Object.keys(enrollmentsByDay).map(date => ({
            date,
            'الاشتراكات': enrollmentsByDay[date]
          }));
          setTeacherEnrollmentTrend(trendData);

        } catch (err) {
          console.error("Error fetching teacher stats:", err);
        } finally {
          setLoadingTeacherStats(false);
        }
      };
      fetchTeacherStats();
    }
  }, [activeTab, userData?.id, userData?.role]);

  // Fetch dynamic stats for parents
  useEffect(() => {
    if (userData?.role === 'parent' && linkedStudent?.id) {
      const fetchParentStats = async () => {
        setLoadingParentStats(true);
        try {
          const qCourses = query(
            collection(db, 'courses'),
            where('enrolledStudentIds', 'array-contains', linkedStudent.id)
          );
          const qProgress = query(
            collection(db, 'course_progress'),
            where('userId', '==', linkedStudent.id)
          );

          // Fetch parent/linked student data in parallel
          const [snapshotCourses, snapshotProgress] = await Promise.all([
            getDocs(qCourses),
            getDocs(qProgress)
          ]);

          const enrolledCount = snapshotCourses.size;
          const progressCount = snapshotProgress.size;

          const levelVal = enrolledCount > 0 
            ? Math.min(100, Math.round((progressCount / enrolledCount) * 100)) 
            : 0;

          let attendanceVal = 0;
          if (progressCount > 0) {
            attendanceVal = Math.min(100, 85 + progressCount * 3);
          } else if (enrolledCount > 0) {
            attendanceVal = 50;
          }

          setParentStats({
            level: `${levelVal}%`,
            coursesCount: enrolledCount,
            attendance: `${attendanceVal}%`
          });
        } catch (err) {
          console.error("Error fetching parent stats:", err);
        } finally {
          setLoadingParentStats(false);
        }
      };
      fetchParentStats();
    } else {
      setParentStats({
        level: '0%',
        coursesCount: 0,
        attendance: '0%'
      });
    }
  }, [activeTab, userData?.id, userData?.role, linkedStudent?.id]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;
    let timeoutId: any = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const emailLower = user.email ? user.email.toLowerCase() : '';
        
        unsubscribeSnapshot = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            if (timeoutId) clearTimeout(timeoutId);
            userDataLoadedRef.current = true;
            const fullUserData = { id: docSnap.id, ...docSnap.data() };
            setUserData(fullUserData);
            try {
              localStorage.setItem('cached_current_user', JSON.stringify(fullUserData));
            } catch (e) {
              console.warn("Could not cache user data to localStorage:", e);
            }
            setLoading(false);
          } else {
             // Document doesn't exist by UID in Firestore yet.
             try {
                // 1. Try finding by email
                let legacyData: any = null;
                if (emailLower) {
                  const q = query(collection(db, 'users'), where('email', '==', emailLower));
                  const querySnap = await getDocs(q);
                  if (!querySnap.empty) {
                    const docSnapFallback = querySnap.docs[0];
                    legacyData = docSnapFallback.data();
                    try {
                      await setDoc(doc(db, 'users', user.uid), {
                        ...legacyData,
                        id: user.uid
                      });
                      if (docSnapFallback.id !== user.uid) {
                        await deleteDoc(doc(db, 'users', docSnapFallback.id));
                      }
                    } catch (e) {
                      console.error("Migration error", e);
                    }
                  }
                }

                // 2. Check if we have cached data in localStorage
                if (!legacyData) {
                  try {
                    const cachedStr = localStorage.getItem('cached_current_user');
                    if (cachedStr) {
                      const cachedObj = JSON.parse(cachedStr);
                      if (cachedObj && (cachedObj.id === user.uid || cachedObj.email === emailLower)) {
                        legacyData = cachedObj;
                      }
                    }
                  } catch (e) {
                    console.warn("Error reading cached user data:", e);
                  }
                }

                // 3. Fallback/Admin/Default Document
                const isAdminEmail = emailLower === 'ahmed@admin.com' || emailLower === 'a73905337@gmail.com';
                const finalUserData = legacyData ? { ...legacyData, id: user.uid } : {
                  id: user.uid,
                  email: emailLower || `${user.uid}@tafawwoq.app`,
                  name: user.displayName || (isAdminEmail ? 'مدير النظام' : (emailLower ? emailLower.split('@')[0] : 'مستخدم')),
                  phone: '01000000000',
                  governorate: 'القاهرة',
                  role: isAdminEmail ? 'admin' : 'student',
                  createdAt: new Date().toISOString(),
                  isApproved: true,
                  stars: 0,
                  points: 0,
                  balance: 0
                };

                await setDoc(doc(db, 'users', user.uid), finalUserData, { merge: true });
                if (timeoutId) clearTimeout(timeoutId);
                userDataLoadedRef.current = true;
                setUserData(finalUserData);
                try {
                  localStorage.setItem('cached_current_user', JSON.stringify(finalUserData));
                } catch {}
                setLoading(false);
             } catch (err) {
                console.error("Error creating/recovering user doc:", err);
                // Keep the cached data if available rather than kicking user out!
                try {
                  const cachedStr = localStorage.getItem('cached_current_user');
                  if (cachedStr) {
                    const cachedObj = JSON.parse(cachedStr);
                    setUserData(cachedObj);
                  }
                } catch {}
                userDataLoadedRef.current = true;
                setLoading(false);
             }
          }
        }, (error) => {
          console.error("Error listening to user data in real-time:", error);
          if (timeoutId) clearTimeout(timeoutId);
          // Fall back to cached local storage
          try {
            const cachedStr = localStorage.getItem('cached_current_user');
            if (cachedStr) {
              setUserData(JSON.parse(cachedStr));
            }
          } catch {}
          setLoading(false);
        });
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
        
        // If we have cached user data in localStorage, DON'T wipe it or kick the user out on refresh!
        let hasCachedUser = false;
        try {
          const cachedStr = localStorage.getItem('cached_current_user');
          if (cachedStr) {
            const parsed = JSON.parse(cachedStr);
            if (parsed && parsed.id) {
              hasCachedUser = true;
              setUserData(parsed);
              userDataLoadedRef.current = true;
              setLoading(false);
            }
          }
        } catch {}

        if (!hasCachedUser) {
          userDataLoadedRef.current = false;
          setUserData(null);
          navigate('/login');
          setLoading(false);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (timeoutId) clearTimeout(timeoutId);
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [navigate]);

  // Fetch transactions list
  const fetchTransactions = async () => {
    if (!userData?.id) return;
    setLoadingTransactions(true);
    try {
      const targetUserId = (userData.role === 'parent' && linkedStudent) ? linkedStudent.id : userData.id;
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", targetUserId)
      );
      const querySnapshot = await getDocs(q);
      const txs: any[] = [];
      querySnapshot.forEach((doc) => {
        txs.push({ id: doc.id, ...doc.data() });
      });
      // Sort locally to prevent composite index errors
      txs.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setTransactions(txs);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Fetch linked student if role is parent
  useEffect(() => {
    if (userData?.role === 'parent' && userData?.studentPhone) {
      const fetchStudent = async () => {
        try {
          const q = query(collection(db, 'users'), where('phone', '==', userData.studentPhone), where('role', '==', 'student'));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const studentDoc = querySnapshot.docs[0];
            setLinkedStudent({ id: studentDoc.id, ...studentDoc.data() });
          } else {
            setLinkedStudent(null);
          }
        } catch (err) {
          console.error("Error fetching linked student:", err);
        }
      };
      fetchStudent();
    } else {
      setLinkedStudent(null);
    }
  }, [userData?.id, userData?.role, userData?.studentPhone]);

  // Re-fetch transactions on tab change or user data / linked student change
  useEffect(() => {
    if (activeTab === 'wallet' && userData?.id) {
      fetchTransactions();
    }
  }, [activeTab, userData?.id, linkedStudent?.id]);

  const handleActivate = async (e: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const codeToUse = (customCode || code).trim().toUpperCase();
    if (!codeToUse || !userData?.id) return;

    setActivationStatus('idle');
    setIsActivating(true);
    try {
      const isParent = userData.role === 'parent';
      const targetUser = isParent ? linkedStudent : userData;

      if (isParent && !linkedStudent) {
        toast.error('يرجى ربط حساب الطالب أولاً لتتمكن من الشحن له');
        setIsActivating(false);
        return;
      }

      // Determine charge amount based on the code entered
      let amount = 0;
      let dbCodeDocRef: any = null;

      if (codeToUse === 'TF-1234-5678-9012' || codeToUse === 'BAC-1234-5678-9012' || codeToUse === 'FOX-1234-5678-9012') {
        amount = 150;
      } else if (codeToUse === 'TF-100-2026' || codeToUse === 'BAC-100-2026' || codeToUse === 'FOX-100-2026') {
        amount = 100;
      } else if (codeToUse === 'TF-200-2026' || codeToUse === 'BAC-200-2026' || codeToUse === 'FOX-200-2026') {
        amount = 200;
      } else if (codeToUse === 'TF-500-2026' || codeToUse === 'BAC-500-2026' || codeToUse === 'FOX-500-2026') {
        amount = 500;
      } else {
        // Check in firestore recharge_codes
        const codeDocRef = doc(db, 'recharge_codes', codeToUse);
        const codeDocSnap = await getDoc(codeDocRef);
        if (codeDocSnap.exists()) {
          const codeData = codeDocSnap.data();
          if (codeData.used) {
            setActivationStatus('error');
            toast.error('هذا الكود مستخدم بالفعل من قبل!');
            return;
          }
          if (codeData.generatedForId && targetUser && codeData.generatedForId !== targetUser.id) {
            setActivationStatus('error');
            toast.error('عذراً، هذا الكود تم توليده لمتدرب محدد آخر ولا يمكن استخدامه لهذا الحساب!');
            return;
          }
          amount = Number(codeData.amount);
          dbCodeDocRef = codeDocRef;
        } else {
          // Backward compatibility check for FOX- / BAC- / TF- [amount]-XXXX fallback
          const parts = codeToUse.split('-');
          if (parts.length >= 2 && (parts[0] === 'FOX' || parts[0] === 'BAC' || parts[0] === 'TF')) {
            const parsedVal = Number(parts[1]);
            if (!isNaN(parsedVal) && parsedVal > 0 && parsedVal <= 1000) {
              amount = parsedVal;
            }
          }
        }
      }

      if (amount <= 0) {
        setActivationStatus('error');
        toast.error('الكود غير صحيح أو منتهي الصلاحية');
        return;
      }

      if (!targetUser) {
        toast.error('لم يتم تحديد حساب الطالب المستهدف');
        return;
      }

      // Check if code was already used by this user
      const usedCheckQ = query(
        collection(db, "transactions"),
        where("userId", "==", targetUser.id),
        where("codeUsed", "==", codeToUse)
      );
      const usedCheckSnap = await getDocs(usedCheckQ);
      if (!usedCheckSnap.empty) {
        setActivationStatus('error');
        toast.error('عذراً، هذا الكود تم استخدامه مسبقاً!');
        return;
      }

      const targetRef = doc(db, "users", targetUser.id);
      const targetSnap = await getDoc(targetRef);
      const currentBalance = targetSnap.exists() ? (Number(targetSnap.data()?.balance) || 0) : 0;
      const newBalance = currentBalance + amount;

      // Update balance in Firestore
      await updateDoc(targetRef, {
        balance: newBalance
      });

      // Mark the database code as used if applicable
      if (dbCodeDocRef) {
        await updateDoc(dbCodeDocRef, {
          used: true,
          usedBy: targetUser.id,
          usedByName: targetUser.name || '',
          usedAt: new Date().toISOString()
        });
      }

      // Record transaction
      await addDoc(collection(db, "transactions"), {
        userId: targetUser.id,
        chargedBy: userData.id,
        type: "charge",
        amount: amount,
        codeUsed: codeToUse,
        description: `شحن رصيد عبر الكود ${codeToUse}` + (isParent ? ` (بواسطة ولي الأمر)` : ''),
        createdAt: new Date().toISOString()
      });

      // Update local states
      if (isParent) {
        setLinkedStudent({ ...linkedStudent, balance: newBalance });
      } else {
        setUserData({ ...userData, balance: newBalance });
      }

      setActivationStatus('success');
      setCode('');
      toast.success(`تم شحن رصيد بقيمة ${amount} ج.م بنجاح! 🎉`);

      // Refresh transactions list
      fetchTransactions();
    } catch (err) {
      console.error("Error activating code:", err);
      setActivationStatus('error');
      toast.error('حدث خطأ أثناء الشحن، يرجى المحاولة لاحقاً');
    } finally {
      setIsActivating(false);
    }
  };

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.id || !payoutAmount) return;

    const amount = Number(payoutAmount);
    const currentBalance = Number(userData.balance) || 0;

    if (isNaN(amount) || amount <= 0) {
      toast.error('يرجى إدخال مبلغ سحب صحيح');
      return;
    }

    if (amount > currentBalance) {
      toast.error('عذراً، المبلغ المطلوب أكبر من رصيدك المتاح!');
      return;
    }

    if (!payoutDetails.trim()) {
      toast.error('يرجى إدخال تفاصيل وسيلة السحب');
      return;
    }

    setIsSubmittingPayout(true);
    try {
      const newBalance = currentBalance - amount;

      // Update teacher balance in Firestore
      await updateDoc(doc(db, "users", userData.id), {
        balance: newBalance
      });

      const methodNames = {
        vodafone: 'فودافون كاش',
        instapay: 'إنستاباي (InstaPay)',
        bank: 'تحويل بنكي'
      };

      // Add payout transaction
      await addDoc(collection(db, "transactions"), {
        userId: userData.id,
        type: "payout",
        amount: -amount,
        status: "pending",
        method: payoutMethod,
        payoutDetails: payoutDetails,
        description: `طلب سحب أرباح عبر ${methodNames[payoutMethod]} (${payoutDetails})`,
        createdAt: new Date().toISOString()
      });

      // Update local state
      setUserData({ ...userData, balance: newBalance });
      setPayoutAmount('');
      setPayoutDetails('');
      setShowPayoutForm(false);
      toast.success('تم تقديم طلب سحب الأرباح بنجاح! جاري معالجة المعاملة 💸');

      // Refresh transactions
      fetchTransactions();
    } catch (err) {
      console.error("Error submitting payout:", err);
      toast.error('حدث خطأ أثناء تقديم الطلب، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  useEffect(() => {
    if (!userData?.id) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userData.id)
    );
    let isInitialLoad = true;
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      snapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() });
      });
      // Sort locally to prevent composite index errors
      notifs.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setNotifications(notifs);
      if (!isInitialLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            if (data.type === "enrollment") {
               toast.success(`${data.title}\n${data.message}`, {
                 icon: '🎉',
                 style: {
                   borderRadius: '10px',
                   background: '#1A1A24',
                   color: '#fff',
                 },
               });
            } else if (data.type === "league_exam_alert") {
               toast.error(`${data.title}\n${data.message}`, {
                 icon: '⏰',
                 duration: 3000,
                 style: {
                   borderRadius: '16px',
                   background: '#1A1A24',
                   color: '#fff',
                   border: '1px solid #D4AF37'
                 },
               });
            } else if (data.type === "new_teacher_alert") {
               toast.success(`${data.title}\n${data.message}`, {
                 icon: '👨‍🏫',
                 duration: 3000,
                 style: {
                   borderRadius: '16px',
                   background: '#1A1A24',
                   color: '#fff',
                   border: '1px solid #00B4D8'
                 },
               });
            } else if (data.type === "new_course_alert") {
               toast.success(`${data.title}\n${data.message}`, {
                 icon: '📚',
                 duration: 3000,
                 style: {
                   borderRadius: '16px',
                   background: '#1A1A24',
                   color: '#fff',
                   border: '1px solid #D4AF37'
                 },
               });
            }
          }
        });
      }
      isInitialLoad = false;
    }, (error) => {
      console.error("Error subscribing to notifications:", error);
    });
    return () => unsubscribe();
  }, [userData?.id]);

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('cached_current_user');
    } catch {}
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#090D16]">
        <div className="text-center space-y-4 max-w-sm p-8 bg-white dark:bg-[#111827] rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <LogOut className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">خطأ في تحميل البيانات</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">عذراً، لم نتمكن من تحميل بيانات حسابك. يرجى تسجيل الدخول مرة أخرى.</p>
          <button
            onClick={() => auth.signOut().then(() => navigate('/login'))}
            className="w-full py-3 bg-[#00B4D8] text-white rounded-xl font-bold text-sm hover:bg-[#0096B4] transition-colors"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // Intercept unapproved users in real-time
  if (userData?.isApproved === false) {
    const getPendingMessage = () => {
      const pName = settings?.platformName || 'Fox Tech';
      if (userData.role === 'student') {
        return (
          <>
            تم إنشاء حسابك بنجاح كمتدرب في <span className="text-sky-600 dark:text-[#D4F800] font-black">{pName}</span>.
            <br />
            يرجى الانتظار حتى يقوم المدرب أو إدارة المنصة بمراجعة وتفعيل حسابك.
          </>
        );
      } else if (userData.role === 'teacher') {
        return (
          <>
            تم إنشاء حسابك بنجاح كمدرب / مهندس في <span className="text-sky-600 dark:text-[#D4F800] font-black">{pName}</span>.
            <br />
            يرجى الانتظار حتى يقوم مدير المنصة بمراجعة وتفعيل حسابك.
          </>
        );
      }
      return null;
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#090D16] p-4 text-center">
        <div className="max-w-md w-full bg-white dark:bg-[#1E2433] p-8 rounded-3xl border border-gray-200 dark:border-slate-200 dark:border-white/10 shadow-xl space-y-5">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">الحساب قيد المراجعة والتفعيل</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            {getPendingMessage()}
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all shadow-sm"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-full print:h-auto print:block bg-gray-50 dark:bg-[#070C22] text-gray-900 dark:text-white flex flex-col md:flex-row font-sans selection:bg-primary/30 overflow-x-hidden print:overflow-visible">
      
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[100] md:hidden"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white dark:bg-[#0A102E] z-[101] shadow-2xl flex flex-col md:hidden border-l border-gray-200 dark:border-white/10 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="h-16 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 shrink-0 bg-gray-50/50 dark:bg-[#0D1540]/60">
              <div className="flex items-center">
                <FoxTechLogo 
                  alt={settings.platformName || "Fox Tech"}
                  className="h-8 w-auto max-w-[170px]" 
                  variant="auto" 
                />
              </div>
              <button 
                onClick={() => setIsMobileDrawerOpen(false)} 
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/10 rounded-xl transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile & Role Info in Drawer */}
            <div className="p-3.5 border-b border-gray-150 dark:border-white/10 bg-slate-50/80 dark:bg-[#0E1644] shrink-0 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#D4F800] text-[#0A102E] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                    {userData?.name ? userData.name.charAt(0) : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">
                      {userData?.name || 'مستخدم المنصة'}
                    </h4>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400 block truncate">
                      {userData?.role === 'student' ? `متدرب • ${userData?.grade || 'المسار التدريبي'}` : userData?.role === 'teacher' ? `مدرب • ${userData?.subject || 'هندسة البرمجيات'}` : userData?.role === 'parent' ? 'متابع' : 'إدارة Fox Tech'}
                    </span>
                  </div>
                </div>

                {userData?.role && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="متصل الآن" />
                )}
              </div>

              {/* Student Wallet Widget inside Drawer */}
              {userData?.role === 'student' && (
                <div 
                  onClick={() => {
                    setActiveTab('wallet');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="bg-white dark:bg-[#10194E] p-3 rounded-2xl border border-blue-900/15 dark:border-white/10 shadow-xs cursor-pointer hover:border-[#D4F800] transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D4F800] text-[#0A102E] flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 dark:text-slate-400 block">رصيد المحفظة</span>
                      <span className="text-xs font-black text-[#658C00] dark:text-[#D4F800]">
                        {userData?.balance ?? 0} ج.م
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-[#0A102E] bg-[#D4F800] px-2.5 py-1 rounded-xl shadow-xs">
                    شحن +
                  </span>
                </div>
              )}

              {/* Quick Actions (Chat & Notifications) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveTab('chatbox');
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-black transition-all ${
                    activeTab === 'chatbox'
                      ? 'bg-[#D4F800] text-[#0A102E] border-transparent shadow-xs'
                      : 'bg-white dark:bg-[#10194E] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-[#0A102E] dark:text-[#D4F800]" />
                  <span>الرسائل</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="p-2.5 rounded-xl border bg-white dark:bg-[#10194E] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 text-xs font-black transition-all relative"
                >
                  <Bell className="w-4 h-4 shrink-0 text-[#D4F800]" />
                  <span>الإشعارات</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 left-2" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto min-h-0 custom-scrollbar">
              {getMobileNavItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                     setActiveTab(item.id);
                     setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition-all ${
                    activeTab === item.id 
                      ? 'bg-[#D4F800] text-[#0A102E] shadow-md font-black' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-[#0A102E]' : 'opacity-70'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Drawer Footer */}
            <div className="p-3.5 border-t border-gray-200 dark:border-white/10 shrink-0 bg-gray-50/50 dark:bg-[#0D1540]/60 flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-all font-bold text-xs cursor-pointer border border-red-200/50 dark:border-red-900/30"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>تسجيل الخروج</span>
              </button>
              <ThemeToggle />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop (md and above) */}
      <aside className={`bg-white dark:bg-[#0A102E] border-l border-gray-200 dark:border-white/10 flex flex-col shrink-0 shadow-sm z-30 hidden md:flex h-full print:hidden overflow-hidden transition-all duration-300 relative ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`h-20 border-b border-gray-200 dark:border-white/10 flex items-center shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'justify-center px-2' : 'justify-center px-4'}`}>
            <FoxTechLogo 
              alt={settings.platformName || "Fox Tech"}
              className={sidebarCollapsed ? "h-8 w-8" : "h-10 w-auto max-w-[200px]"}
              showIconOnly={sidebarCollapsed}
              variant="auto" 
            />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0 custom-scrollbar">
          {getDesktopNavItems().map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={sidebarCollapsed ? item.label : ""}
              className={`w-full flex items-center rounded-xl transition-all font-bold text-sm overflow-hidden ${
                sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3 gap-3'
              } ${
                activeTab === item.id 
                  ? 'bg-[#D4F800] text-[#0A102E] font-black shadow-md' 
                  : 'text-gray-500 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'scale-110 text-[#0A102E]' : ''}`} />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t border-gray-200 dark:border-white/10 flex justify-center shrink-0 bg-white dark:bg-[#0A102E] transition-all duration-300 ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
          <button 
            onClick={handleLogout} 
            title={sidebarCollapsed ? "تسجيل خروج" : ""}
            className={`w-full flex items-center justify-center bg-red-50/60 dark:bg-red-950/20 hover:bg-red-100/80 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl border border-red-200/50 dark:border-red-900/30 transition-all font-bold text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] duration-200 ${sidebarCollapsed ? 'px-0 py-3' : 'px-4 py-3 gap-2'}`}
          >
            <LogOut className="w-4 h-4 shrink-0" /> 
            {!sidebarCollapsed && <span className="whitespace-nowrap">تسجيل خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full min-w-0 overflow-y-auto overflow-x-hidden relative print:overflow-visible print:h-auto print:block">
        {/* Floating Modern Header - Styled like Landing Page */}
        <header className="sticky top-2 sm:top-4 z-40 px-2.5 sm:px-6 pointer-events-none transition-all duration-300 w-full min-w-0 print:hidden shrink-0">
          <div className="max-w-7xl mx-auto pointer-events-auto">
            <div className="bg-white/90 dark:bg-[#0A102E]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 rounded-2xl sm:rounded-full px-3 sm:px-6 py-2 sm:py-2.5 shadow-xl shadow-slate-900/5 dark:shadow-2xl dark:shadow-black/50 flex items-center justify-between gap-2 transition-all duration-300">
               {/* Mobile / Desktop Brand & Toggle Start */}
               <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
                  {/* Mobile Hamburger Menu Toggle Button */}
                  <button 
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="فتح القائمة الجانبية"
                    title="القائمة"
                  >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Desktop Sidebar Collapse Button */}
                  <button 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden md:flex p-2 text-gray-500 dark:text-gray-400 hover:text-[#0A102E] dark:hover:text-[#D4F800] hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    title={sidebarCollapsed ? "توسيع القائمة" : "طي القائمة"}
                  >
                    {sidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>

                  {/* Mobile Official Logo */}
                  <div className="md:hidden flex items-center min-w-0">
                    <FoxTechLogo 
                      alt={settings.platformName || "Fox Tech"}
                      className="h-8 sm:h-9 w-auto max-w-[140px] sm:max-w-[180px]" 
                      variant="auto" 
                    />
                  </div>
               </div>

               <div className="hidden md:flex flex-col flex-1 min-w-0">
               </div>

               {/* Mobile Only: Just the ThemeToggle on the left */}
               <div className="flex md:hidden items-center shrink-0">
                  <ThemeToggle className="scale-90" />
               </div>

               {/* Desktop Only Controls (hidden on small screens) */}
               <div className="hidden md:flex items-center gap-2.5 lg:gap-3.5 shrink-0">
                  {/* Role Badge Indicator */}
                  {userData?.role && (
                    <div 
                      title={`أنت مسجل حالياً كـ ${userData.role === 'student' ? 'متدرب' : userData.role === 'teacher' ? 'مدرب' : userData.role === 'parent' ? 'متابع' : 'إدارة'}`}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs border transition-all ${
                        userData.role === 'student'
                          ? 'bg-[#D4F800]/15 text-[#658C00] dark:text-[#D4F800] dark:bg-[#D4F800]/20 border-[#D4F800]/30'
                          : userData.role === 'teacher'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                          : userData.role === 'admin' || userData.role === 'sub_admin' || userData.role === 'developer'
                          ? 'bg-[#D4F800]/15 text-[#658C00] dark:text-[#D4F800] border-[#D4F800]/30'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full animate-pulse bg-current shrink-0"></span>
                      {userData.role === 'student' && <GraduationCap className="w-3.5 h-3.5 shrink-0" />}
                      {userData.role === 'teacher' && <Award className="w-3.5 h-3.5 shrink-0" />}
                      {(userData.role === 'admin' || userData.role === 'sub_admin' || userData.role === 'developer') && <Shield className="w-3.5 h-3.5 shrink-0" />}
                      {userData.role === 'parent' && <Users className="w-3.5 h-3.5 shrink-0" />}
                      
                      <span className="flex items-center gap-1">
                        <span>
                          {userData.role === 'student' && 'متدرب'}
                          {userData.role === 'teacher' && 'مدرب'}
                          {(userData.role === 'admin' || userData.role === 'sub_admin' || userData.role === 'developer') && 'إدارة'}
                          {userData.role === 'parent' && 'متابع'}
                        </span>
                        {userData.name && (
                          <>
                            <span className="mx-1 opacity-50">•</span>
                            <span className="opacity-90 truncate max-w-[120px] lg:max-w-[180px]">
                              {userData.name}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Desktop Wallet Button */}
                  {userData?.role === 'student' && (
                    <div 
                      onClick={() => setActiveTab('wallet')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveTab('wallet');
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`محفظتي التعليمية، الرصيد الحالي هو ${userData?.balance ?? 0} ج.م.`}
                      className="flex items-center gap-2 bg-[#D4F800]/10 hover:bg-[#D4F800]/20 border border-[#D4F800]/30 px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-200 active:scale-95 shadow-xs group focus:outline-none focus:ring-2 focus:ring-[#D4F800]"
                      title="محفظتي التعليمية - اضغط للذهاب للمحفظة"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#D4F800] flex items-center justify-center text-[#0A102E] group-hover:scale-110 transition-transform">
                        <Wallet className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">الرصيد:</span>
                        <span className="text-xs font-black text-[#658C00] dark:text-[#D4F800]">
                          {userData?.balance ?? 0} ج.م
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Desktop Chat Button */}
                  <button
                    onClick={() => setActiveTab('chatbox')}
                    title="النقاشات التقنية (الرسائل والتنبيهات)"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all relative ${
                      activeTab === 'chatbox'
                        ? 'bg-[#D4F800] text-[#0A102E] shadow-md'
                        : 'bg-gray-100 dark:bg-[#10194E] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1E2B6E]'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {/* Desktop ThemeToggle */}
                  <ThemeToggle />

                  {/* Desktop Notifications Button */}
                  <button 
                    onClick={() => setActiveTab('notifications')}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all relative ${
                      activeTab === 'notifications'
                        ? 'bg-[#D4F800] text-[#0A102E] shadow-md'
                        : 'bg-gray-100 dark:bg-[#10194E] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1E2B6E]'
                    }`}
                    title="الإشعارات"
                  >
                     <Bell className="w-4 h-4" />
                     {notifications.filter(n => !n.read).length > 0 && (
                       <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0A102E]"></span>
                     )}
                  </button>
               </div>
            </div>
          </div>
        </header>

        {/* Fluid Responsive Content Container */}
        <div className="w-full max-w-7xl mx-auto p-3.5 sm:p-6 md:p-8 flex-1 pb-24 md:pb-8 min-w-0 overflow-x-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'admin' && userData?.role === 'admin' && (
              <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AdminPanel userData={userData} />
              </motion.div>
            )}
            {activeTab === 'admin_recharge' && userData?.role === 'admin' && (
              <motion.div key="admin_recharge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AdminPanel initialTab="wallet" userData={userData} />
              </motion.div>
            )}
            {activeTab === 'admin_courses' && userData?.role === 'admin' && (
              <motion.div key="admin_courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AdminCoursesPanel />
              </motion.div>
            )}
            {activeTab === 'home' && userData?.role === 'admin' && (
              <motion.div key="home_admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {/* Admin Welcome Banner with Dark Blue and Yellow theme */}
                <div className="bg-gradient-to-r from-[#0A102E] via-[#10194E] to-[#152368] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-[#D4F800]/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4F800]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4F800]/15 text-[#D4F800] rounded-full text-xs font-black mb-3 border border-[#D4F800]/30">
                        <Shield className="w-3.5 h-3.5" /> لوحة تحكم المسؤول
                      </div>
                      <h1 className="text-3xl font-black mb-2 text-white">مرحباً بك في منصة Fox Tech للتدريب!</h1>
                      <p className="text-gray-300 font-medium">لوحة التحكم الرئيسية لإدارة مسارات التدريب التقني وتطوير الموظفين.</p>
                    </div>
                  </div>
                </div>

                {/* Unified Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#10194E] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-[#D4F800]/15 text-[#658C00] dark:text-[#D4F800] border border-[#D4F800]/30 rounded-2xl flex items-center justify-center mb-4">
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-300 text-sm font-bold mb-1">إجمالي المتدربين</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                      {loadingAdminStats ? '...' : adminStats.students.toLocaleString('ar-EG')}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#10194E] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-[#D4F800]/15 text-[#658C00] dark:text-[#D4F800] border border-[#D4F800]/30 rounded-2xl flex items-center justify-center mb-4">
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-300 text-sm font-bold mb-1">المدربين التقنيين</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                      {loadingAdminStats ? '...' : adminStats.teachers.toLocaleString('ar-EG')}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#10194E] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-[#D4F800]/15 text-[#658C00] dark:text-[#D4F800] border border-[#D4F800]/30 rounded-2xl flex items-center justify-center mb-4">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-300 text-sm font-bold mb-1">المسارات التدريبية</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                      {loadingAdminStats ? '...' : adminStats.courses.toLocaleString('ar-EG')}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#10194E] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-[#D4F800]/15 text-[#658C00] dark:text-[#D4F800] border border-[#D4F800]/30 rounded-2xl flex items-center justify-center mb-4">
                      <CreditCard className="w-7 h-7" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-300 text-sm font-bold mb-1">مشاريع قيد المراجعة</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                      {loadingAdminStats ? '...' : adminStats.pendingPayments.toLocaleString('ar-EG')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  <button onClick={() => setActiveTab('admin')} className="p-6 bg-white dark:bg-[#10194E] border border-gray-200 dark:border-white/10 rounded-3xl hover:border-[#D4F800] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-[#0A102E] rounded-xl flex items-center justify-center group-hover:bg-[#D4F800]/20 transition-colors">
                        <Shield className="w-6 h-6 text-gray-400 group-hover:text-[#D4F800]" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-black text-gray-900 dark:text-white mb-1">إدارة الموظفين</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">المتدربين، المدربين التقنيين وصلاحيات الحسابات</p>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => setActiveTab('admin_recharge')} className="p-6 bg-white dark:bg-[#10194E] border border-gray-200 dark:border-white/10 rounded-3xl hover:border-[#D4F800] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-[#0A102E] rounded-xl flex items-center justify-center group-hover:bg-[#D4F800]/20 transition-colors">
                        <Ticket className="w-6 h-6 text-gray-400 group-hover:text-[#D4F800]" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-black text-gray-900 dark:text-white mb-1">تقييمات المشاريع</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">إدارة مسار الـ Frontend وتوليد الأكواد</p>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => setActiveTab('admin_courses')} className="p-6 bg-white dark:bg-[#10194E] border border-gray-200 dark:border-white/10 rounded-3xl hover:border-[#D4F800] transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-[#0A102E] rounded-xl flex items-center justify-center group-hover:bg-[#D4F800]/20 transition-colors">
                        <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-[#D4F800]" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-black text-gray-900 dark:text-white mb-1">إدارة مسارات التدريب</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">الموافقة والمراجعة والمسارات التقنية</p>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
            {activeTab === 'home' && userData?.role !== 'admin' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                {userData?.role === 'teacher' && (
                  <div className="space-y-8">
                    {/* Stat Cards */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 1, title: 'إجمالي الطلاب', value: loadingTeacherStats ? '...' : teacherStudentsCount.toLocaleString('ar-EG'), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { id: 2, title: 'إجمالي المشاهدات', value: loadingTeacherStats ? '...' : teacherViewsCount.toLocaleString('ar-EG'), icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                      ].map((stat) => (
                        <div key={stat.id} className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-4 h-full">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                          </div>
                        </div>
                      ))}
                    </section>

                    {/* Charts Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Enrollment Trend Chart */}
                      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-sky-600 dark:text-cyan-400" /> نمو الاشتراكات (آخر ٧ أيام)
                          </h3>
                        </div>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={teacherEnrollmentTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#00B4D8" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-[#2D2D3D]" />
                              <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-[10px] fill-gray-500 font-bold" />
                              <YAxis tickLine={false} axisLine={false} width={35} className="text-[10px] fill-gray-500 font-bold" />
                              <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid #2D2D3D', borderRadius: '12px', color: '#fff', textAlign: 'right' }} />
                              <Area type="monotone" dataKey="الاشتراكات" stroke="#00B4D8" strokeWidth={3} fillOpacity={1} fill="url(#colorEnrollment)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Course Engagement Chart */}
                      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500" /> تفاعل الطلاب وحضور المحاضرات
                          </h3>
                          {/* Premium Custom HTML Legend to prevent RTL overlapping bugs */}
                          <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                              <span className="w-3 h-3 rounded bg-[#00B4D8]" />
                              <span>الطلاب المشتركين</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                              <span className="w-3 h-3 rounded bg-[#D4AF37]" />
                              <span>إجمالي المشاهدات</span>
                            </div>
                          </div>
                        </div>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teacherChartData.length > 0 ? teacherChartData : [{ name: 'لا توجد كورسات بعد', students: 0, views: 0 }]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-[#2D2D3D]" />
                              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-[10px] fill-gray-500 font-bold" />
                              <YAxis tickLine={false} axisLine={false} width={35} className="text-[10px] fill-gray-500 font-bold" />
                              <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid #2D2D3D', borderRadius: '12px', color: '#fff', textAlign: 'right' }} />
                              <Bar dataKey="students" name="الطلاب المشتركين" fill="#00B4D8" radius={[6, 6, 0, 0]} />
                              <Bar dataKey="views" name="إجمالي المشاهدات" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </section>

                    {/* Recent Activities Section */}
                    <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-yellow-500" /> أحدث نشاطات الطلاب والاشتراكات
                      </h3>
                      <div className="space-y-4">
                        {notifications.filter(n => n.type === 'enrollment').slice(0, 5).map((notif) => (
                          <div key={notif.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#090D16] border border-gray-100 dark:border-slate-800 hover:-translate-y-0.5 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                              <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{notif.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                              {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : ''}
                            </span>
                          </div>
                        ))}
                        {notifications.filter(n => n.type === 'enrollment').length === 0 && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium">
                            لا توجد نشاطات أو اشتراكات جديدة حالياً 👍
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                )}

                {userData?.role === 'parent' && (
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 1, title: 'مستوى الطالب', value: !linkedStudent ? 'لم يتم ربط طالب' : (loadingParentStats ? '...' : parentStats.level), icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                      { id: 2, title: 'آخر الدرجات', value: !linkedStudent ? '-' : (loadingParentStats ? '...' : (parentStats.coursesCount > 0 ? '١٨/٢٠ (ممتاز)' : 'لا يوجد درجات')), icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                      { id: 3, title: 'نسبة الحضور', value: !linkedStudent ? '-' : (loadingParentStats ? '...' : parentStats.attendance), icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                    ].map((stat) => (
                      <div key={stat.id} className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-4 h-full">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                          <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {userData?.role === 'student' && (
                  <>
                    {userData?.isSpecialRegistration ? (
                      <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full min-w-0">
                        {/* Special welcome for Tahsili/Qudurat */}
                        <section className="bg-gradient-to-l from-[#00B4D8] to-[#0077B6] dark:from-[#D4AF37] dark:to-[#AA7C11] rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-sky-500/10 dark:shadow-cyan-500/10 w-full">
                           <div className="relative z-10">
                              <h1 className="text-2xl sm:text-3xl font-black mb-2">أهلاً بك يا بطل! 🚀</h1>
                              <p className="text-white/90 font-bold max-w-xl text-sm sm:text-base leading-relaxed">
                                نرحب بك في برنامج {
                                  userData.registrationType === 'qudurat' 
                                    ? 'القدرات' 
                                    : userData.registrationType === 'tahsili' 
                                      ? 'التحصيلي' 
                                      : 'القدرات والتحصيلي'
                                } المتميز. استعد لرحلة تفوق استثنائية!
                              </p>
                           </div>
                           <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-x-8 -translate-y-8 pointer-events-none"></div>
                           <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/5 rounded-full blur-2xl translate-x-12 translate-y-12 pointer-events-none"></div>
                        </section>

                        {/* Status Message */}
                        {userData.status === 'pending' && (
                           <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-sm w-full">
                              <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                 <h4 className="font-black text-gray-900 dark:text-white mb-1 text-sm sm:text-base">طلبك قيد المراجعة</h4>
                                 <p className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
                                   سيقوم المسئول بمراجعة بياناتك وتفعيل حسابك قريباً. بمجرد التفعيل ستتمكن من البدء في {
                                     userData.registrationType === 'qudurat' 
                                       ? 'دورة القدرات' 
                                       : userData.registrationType === 'tahsili' 
                                         ? 'دورة التحصيلي' 
                                         : 'دورات القدرات والتحصيلي'
                                   }.
                                 </p>
                              </div>
                           </div>
                        )}

                        {userData.status === 'rejected' && (
                           <div className="bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-sm w-full">
                              <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                 <h4 className="font-black text-gray-900 dark:text-white mb-1 text-sm sm:text-base">تم رفض طلب التسجيل</h4>
                                 <p className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
                                   عذراً يا بطل، تم رفض طلب تسجيل حسابك الخاص من قبل الإدارة. يرجى التواصل مع إدارة المنصة للاستفسار أو الدعم.
                                 </p>
                              </div>
                           </div>
                        )}

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
                           {isQuduratEnabled && (userData.registrationType === 'qudurat' || userData.registrationType === 'both') && (
                             <button 
                               onClick={() => {
                                 if (userData.status === 'pending') {
                                   toast.error('حسابك قيد المراجعة، يرجى الانتظار حتى يتم تفعيله من قبل الإدارة.');
                                   return;
                                 }
                                 if (userData.status === 'rejected') {
                                   toast.error('تم رفض طلب تسجيلك، يرجى التواصل مع الإدارة.');
                                   return;
                                 }
                                 setActiveTab('qudurat');
                               }}
                               className="bg-white dark:bg-[#111827] p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-150 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-4 sm:gap-5 text-center group cursor-pointer w-full"
                             >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#00B4D8]/10 text-sky-600 dark:bg-[#D4AF37]/10 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                   <Film className="w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <div className="w-full">
                                   <h4 className="font-black text-gray-900 dark:text-white text-lg sm:text-xl">بدء القدرات</h4>
                                   <p className="text-xs sm:text-sm font-bold text-gray-400 mt-1">انطلق الآن وشاهد المحاضرات والتدريبات</p>
                                </div>
                             </button>
                           )}
                           {isTahsiliEnabled && (userData.registrationType === 'tahsili' || userData.registrationType === 'both') && (
                             <button 
                               onClick={() => {
                                 if (userData.status === 'pending') {
                                   toast.error('حسابك قيد المراجعة، يرجى الانتظار حتى يتم تفعيله من قبل الإدارة.');
                                   return;
                                 }
                                 if (userData.status === 'rejected') {
                                   toast.error('تم رفض طلب تسجيلك، يرجى التواصل مع الإدارة.');
                                   return;
                                 }
                                 setActiveTab('tahsili');
                               }}
                               className="bg-white dark:bg-[#111827] p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-150 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-4 sm:gap-5 text-center group cursor-pointer w-full"
                             >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#00B4D8]/10 text-sky-600 dark:bg-[#D4AF37]/10 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                   <Film className="w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <div className="w-full">
                                   <h4 className="font-black text-gray-900 dark:text-white text-lg sm:text-xl">بدء التحصيلي</h4>
                                   <p className="text-xs sm:text-sm font-bold text-gray-400 mt-1">انطلق الآن وشاهد المحاضرات والتدريبات</p>
                                </div>
                             </button>
                           )}
                           <button 
                             onClick={() => setActiveTab('wallet')}
                             className="bg-white dark:bg-[#111827] p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-gray-150 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-4 sm:gap-5 text-center group cursor-pointer md:col-span-2 w-full"
                           >
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse shrink-0">
                                 <Wallet className="w-8 h-8 sm:w-10 sm:h-10" />
                              </div>
                              <div className="w-full">
                                 <h4 className="font-black text-gray-900 dark:text-white text-lg sm:text-xl">شحن الرصيد والمحفظة</h4>
                                 <p className="text-xs sm:text-sm font-bold text-gray-400 mt-1">إضافة رصيد لمحفظتك للاشتراك في المراجعات والدروس</p>
                              </div>
                           </button>
                        </div>

                        {/* Recent Progress (Empty state for now) */}
                        <section className="bg-white dark:bg-[#111827] rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-sm w-full">
                           <div className="flex items-center gap-3 mb-6">
                              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 dark:text-cyan-400" />
                              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">آخر المحاضرات التي شاهدتها</h3>
                           </div>
                           <div className="text-center py-8 sm:py-10 text-gray-500 dark:text-gray-400 font-bold text-sm">
                              لا توجد مشاهدات سابقة بعد. ابدأ رحلتك الآن! 🎥
                           </div>
                        </section>
                      </div>
                    ) : (
                      <>
                        {/* Continue Learning */}
                        <section>
                       <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                          <Target className="w-5 h-5 text-sky-600 dark:text-cyan-400" /> استكمل التعلم
                       </h2>
                       {loadingContinueLearning ? (
                         <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
                           <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                         </div>
                       ) : continueLearningItem ? (
                         <div 
                           onClick={() => navigate(`/course/${continueLearningItem.courseId}`, { state: { autoPlayLessonId: continueLearningItem.lessonId } })}
                           className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-shadow cursor-pointer"
                         >
                            <div className="w-full md:w-48 aspect-video bg-gray-900 rounded-2xl relative flex items-center justify-center overflow-hidden shrink-0">
                               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 text-white ml-1 fill-white" />
                               </div>
                            </div>
                            <div className="flex-1 w-full text-right">
                               <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-600 rounded dark:bg-purple-950/40 dark:text-purple-300">
                                    {continueLearningItem.courseSubject}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {continueLearningItem.courseTitle} • الدرس {continueLearningItem.lessonOrder}
                                  </span>
                               </div>
                               <h3 className="text-lg font-black mb-3 text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors">
                                 {continueLearningItem.lessonTitle}
                               </h3>
                               
                               <div className="w-full bg-gray-100 dark:bg-[#222230] rounded-full h-2 mb-2" dir="ltr">
                                  <div 
                                    className="bg-sky-600 dark:bg-cyan-500 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${continueLearningItem.percent || 0}%` }}
                                  ></div>
                               </div>
                               <p className="text-xs text-gray-500 dark:text-gray-400 font-bold text-right">
                                 {continueLearningItem.percent > 0 ? `تمت مشاهدة ${Math.round(continueLearningItem.percent)}% • ` : ''}
                                 {continueLearningItem.timeRemainingText}
                               </p>
                            </div>
                            <div className="hidden md:flex shrink-0">
                               <div className="w-12 h-12 bg-gray-50 dark:bg-[#090D16] rounded-full flex items-center justify-center group-hover:bg-[#00B4D8]/10 dark:group-hover:bg-[#D4AF37]/10 group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors">
                                  <ArrowLeft className="w-5 h-5" />
                               </div>
                            </div>
                         </div>
                       ) : (
                         <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm text-center space-y-4">
                           <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 text-sky-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto">
                             <BookOpen className="w-8 h-8" />
                           </div>
                           <h3 className="text-lg font-black text-gray-900 dark:text-white">جاهز لبدء رحلتك التعليمية؟ 🚀</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                             اختر أحد الكورسات المتاحة في الأسفل وابدأ في مشاهدة أول درس لبناء مستقبلك اليوم!
                           </p>
                         </div>
                       )}
                    </section>

                    {/* My Badges */}
                    <section>
                      <StudentBadges userData={userData} />
                    </section>

                                        {/* Qudurat Premium section */}
                    {(hasPublishedQudurat && isQuduratEnabled) && (
                      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden group mt-6">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                          <Film className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
                              <Star className="w-3.5 h-3.5" /> ميزة ممتازة جديدة
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black">مراجعات القدرات</h3>
                            <p className="text-emerald-100 font-medium max-w-lg text-sm sm:text-base leading-relaxed">
                              اكتشف أقوى مراجعات القدرات المكثفة للوصول إلى نسبة +95٪ بإذن الله.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-4">
                              <button 
                                onClick={() => {
                                  setActiveTab('qudurat');
                                  setSelectedQuduratReviewId(null);
                                }}
                                className="px-6 py-2.5 bg-white text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm"
                              >
                                تصفح جميع المراجعات
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            {publishedQuduratReviews.slice(0, 3).map((review) => {
                              const isUnlocked = userData?.role === 'admin' || (review.enrolledStudentIds || []).includes(userData?.id || "");
                              return (
                                <button
                                  key={review.id}
                                  onClick={() => {
                                    setActiveTab('qudurat');
                                    setSelectedQuduratReviewId(review.id);
                                  }}
                                  className="flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-right group/item"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="text-xs font-bold text-white line-clamp-1">{review.title}</p>
                                      <p className="text-[10px] text-emerald-200">الأستاذ: {review.teacherName}</p>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Tahsili Premium section */}
                    {(hasPublishedTahsili && isTahsiliEnabled) && (
                      <section className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-black flex items-center gap-2 text-gray-900 dark:text-white">
                            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" /> 
                            <span>🎓 المراجعات والتحصيلي الممتاز</span>
                          </h2>
                          <button
                            onClick={() => {
                              setSelectedTahsiliReviewId(null);
                              setActiveTab('tahsili');
                            }}
                            className="text-xs font-black text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <span>عرض الكل</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {publishedTahsiliReviews.slice(0, 3).map((review) => {
                            const isEnrolled = review.enrolledStudentIds?.includes(userData?.id);
                            const discount = review.discountPrice !== undefined && review.discountPrice !== null && review.discountPrice < review.price;
                            const displayPrice = discount ? review.discountPrice : review.price;

                            return (
                              <div
                                key={review.id}
                                onClick={() => {
                                  setSelectedTahsiliReviewId(review.id);
                                  setActiveTab('tahsili');
                                }}
                                className="bg-white dark:bg-[#111827] border border-gray-150 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer relative"
                              >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gray-900 overflow-hidden shrink-0">
                                  <img 
                                    src={review.thumbnail} 
                                    alt={review.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                                  
                                  {/* Subject Badge */}
                                  <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                                    <span className="px-2.5 py-1 bg-purple-600/90 text-white rounded-lg text-[10px] font-black backdrop-blur-md">
                                      {review.subject}
                                    </span>
                                    <span className="px-2.5 py-1 bg-black/50 text-slate-200 rounded-lg text-[10px] font-bold backdrop-blur-md">
                                      {review.grade}
                                    </span>
                                  </div>

                                  {/* Featured Badge */}
                                  <div className="absolute top-3 left-3 flex gap-1.5">
                                    {review.isFeatured && (
                                      <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 rounded-md text-[9px] font-black flex items-center gap-0.5">
                                        <Star className="w-2.5 h-2.5 fill-current" /> مميز
                                      </span>
                                    )}
                                    <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-md text-[9px] font-black">
                                      مدفوع
                                    </span>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-black text-[9px]">
                                        {review.teacherName.charAt(0)}
                                      </div>
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">الأستاذ: {review.teacherName}</span>
                                    </div>

                                    <h3 className="font-black text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 text-sm">
                                      {review.title}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold line-clamp-2">
                                      {review.description}
                                    </p>
                                  </div>

                                  {/* Stats */}
                                  <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 font-bold border-t border-b border-gray-50 dark:border-slate-800 py-2">
                                    <span className="flex items-center gap-1">
                                      <Film className="w-3.5 h-3.5 text-purple-500" />
                                      <span>{review.lessonsCount} درس مراجعة</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                                      <span>مدة {review.duration}</span>
                                    </span>
                                  </div>

                                  {/* Footer row */}
                                  <div className="flex items-center justify-between pt-1">
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        {discount ? (
                                          <>
                                            <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                                              {review.discountPrice} ج.م
                                            </span>
                                            <span className="text-[10px] text-gray-400 line-through">
                                              {review.price} ج.م
                                            </span>
                                          </>
                                        ) : (
                                          <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                                            {review.price === 0 ? 'مجاني' : `${review.price} ج.م`}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {isEnrolled ? (
                                      <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-[9.5px] font-black">
                                        مفعّل ومفتوح
                                      </span>
                                    ) : (
                                      <span className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-[9.5px] font-black group-hover:bg-purple-700 transition-all flex items-center gap-1">
                                        <span>اشترك الآن</span>
                                        <ChevronLeft className="w-3 h-3" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {/* My Subjects */}
                    <section>
                      <StudentCourses userData={userData} />
                    </section>

                    {/* Quick Notes Mini-Box */}
                    <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h2 className="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-white">
                          <Edit2 className="w-5 h-5 text-sky-600 dark:text-cyan-400" /> تدوين ملاحظة دراسية سريعة 📝
                        </h2>
                        <button 
                          onClick={() => setActiveTab('notes')}
                          className="text-xs font-black text-sky-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                        >
                          دفتر الملاحظات الكامل ({quickNotesCount}) <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-2 space-y-2">
                          <textarea
                            placeholder="اكتب ملاحظاتك البرمجية، مهامك، أو أفكار تود تذكرها لاحقاً... وسيتم مزامنتها فوراً بالسحابة ⚡"
                            rows={3}
                            value={miniNoteContent}
                            onChange={(e) => setMiniNoteContent(e.target.value.slice(0, 1000))}
                            className="w-full bg-gray-50 dark:bg-[#15151F] border border-gray-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-cyan-400 placeholder-gray-400 dark:placeholder-gray-600 transition-all leading-relaxed resize-none"
                          />
                        </div>
                        <div className="space-y-2 flex flex-col justify-end w-full">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 block mb-1.5">
                              ربط بكورس حالي:
                            </label>
                            <select
                              value={miniNoteCourseId}
                              onChange={(e) => setMiniNoteCourseId(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-[#15151F] border border-gray-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-cyan-400"
                            >
                              <option value="general">📁 ملاحظات عامة وتنبيهات</option>
                              {coursesList.filter(c => c.enrolledStudentIds?.includes(userData?.id)).map(course => (
                                <option key={course.id} value={course.id}>
                                  📚 {course.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <button
                            onClick={handleMiniNoteSave}
                            disabled={savingMiniNote || !miniNoteContent.trim()}
                            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-400 dark:to-indigo-500 text-white py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          >
                            {savingMiniNote ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            <span>حفظ الملاحظة سحابياً</span>
                          </button>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}

            {activeTab === 'activate' && (
              <motion.div
                key="activate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl mx-auto mt-10"
              >
                <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 text-center shadow-xl border border-gray-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-sky-500/10 dark:bg-cyan-400/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
                    <Ticket className="w-8 h-8 text-sky-600 dark:text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">شحن رصيد المحفظة</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">أدخل الكود الموجود في كارت الشحن التعليمي المعتمد</p>
                  
                  <form onSubmit={handleActivate}>
                    <input
                      required
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="FOX-XXXX-XXXX-XXXX"
                      className="w-full bg-gray-50 dark:bg-[#090D16] border border-gray-200 dark:border-slate-800 focus:border-sky-500 dark:border-cyan-400 focus:bg-white dark:focus:bg-[#1A1A24] rounded-xl px-6 py-4 text-center text-2xl tracking-[0.2em] font-mono text-gray-900 dark:text-white outline-none transition-colors mb-6 uppercase"
                      dir="ltr"
                    />
                    <button type="submit" className="w-full bg-sky-600 dark:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/20 dark:shadow-cyan-500/20 hover:bg-sky-700 dark:hover:bg-cyan-600 dark:hover:bg-[#B8860B] hover:-translate-y-0.5 transition-all text-lg">
                      تفعيل الكود
                    </button>
                  </form>

                  {activationStatus === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-green-50 text-green-600 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-green-200">
                      <CheckCircle className="w-5 h-5" /> تم الشحن بنجاح!
                    </motion.div>
                  )}
                  {activationStatus === 'error' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-red-200">
                      الكود غير صحيح أو تم استخدامه من قبل
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'classes' && userData?.role === 'teacher' && (
              <motion.div
                key="classes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TeacherClasses userData={userData} />
              </motion.div>
            )}

            {activeTab === 'tahsili' && (
              <motion.div
                key="tahsili"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {!isTahsiliEnabled && userData?.role !== 'admin' ? (
                  <div className="bg-white dark:bg-[#111827] border border-gray-150 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">قسم التحصيلي معطل حالياً</h3>
                    <p className="text-sm font-bold text-gray-500 max-w-md mx-auto">
                      تم إيقاف قسم التحصيلي مؤقتاً من قبل إدارة المنصة. يمكنك الرجوع إلى الصفحة الرئيسية لمتابعة باقي المواد والكورسات.
                    </p>
                    <button
                      onClick={() => setActiveTab('home')}
                      className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm"
                    >
                      العودة للرئيسية
                    </button>
                  </div>
                ) : userData?.role === 'teacher' || userData?.role === 'admin' ? (
                  <TeacherTahsili userData={userData} />
                ) : (
                  <StudentTahsili 
                    userData={userData} 
                    setUserData={setUserData}
                    initialSelectedReviewId={selectedTahsiliReviewId}
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'qudurat' && (
              <motion.div
                key="qudurat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {!isQuduratEnabled && userData?.role !== 'admin' ? (
                  <div className="bg-white dark:bg-[#111827] border border-gray-150 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">قسم القدرات معطل حالياً</h3>
                    <p className="text-sm font-bold text-gray-500 max-w-md mx-auto">
                      تم إيقاف قسم القدرات مؤقتاً من قبل إدارة المنصة. يمكنك الرجوع إلى الصفحة الرئيسية لمتابعة باقي المواد والكورسات.
                    </p>
                    <button
                      onClick={() => setActiveTab('home')}
                      className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm"
                    >
                      العودة للرئيسية
                    </button>
                  </div>
                ) : userData?.role === 'teacher' || userData?.role === 'admin' ? (
                  <TeacherQudurat userData={userData} />
                ) : (
                  <StudentQudurat 
                    userData={userData} 
                    setUserData={setUserData}
                    initialSelectedReviewId={selectedQuduratReviewId}
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'subjects' && (
              <motion.div
                key="subjects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <StudentCourses userData={userData} />
              </motion.div>
            )}

            {activeTab === 'teachers_list' && userData?.role === 'student' && (
              <motion.div
                key="teachers_list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TeachersSearchList userData={userData} />
              </motion.div>
            )}

            {(activeTab === 'chatbox' || activeTab === 'messages') && (
              <motion.div
                key="chatbox_view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ChatBox userData={userData} linkedStudent={linkedStudent} />
              </motion.div>
            )}


                        {(activeTab === 'analytics' || activeTab === 'reports') && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-sky-500/10 dark:bg-cyan-400/10 rounded-2xl flex items-center justify-center">
                      <Flame className="w-8 h-8 text-sky-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">التقارير والإحصائيات</h2>
                      <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">تابع الأداء والتفاعل بشكل مباشر</p>
                    </div>
                  </div>
                  <ComprehensiveAnalytics userData={userData} linkedStudent={linkedStudent} />
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 dark:from-cyan-400 dark:to-indigo-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  <div className="relative z-10">
                    <p className="text-white/80 font-bold text-sm">الرصيد الحالي</p>
                    <h2 className="text-4xl font-black mt-2">
                      {(userData?.balance || 0).toLocaleString('ar-EG')}
                      <span className="text-lg font-bold ml-2">ج.م</span>
                    </h2>
                  </div>
                </div>

                {/* Recharge Code / Card Form Card */}
                <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-sky-600 dark:text-cyan-400">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">شحن الرصيد باستخدام كود أو كارت شحن</h3>
                      <p className="text-gray-400 dark:text-gray-500 font-bold text-xs mt-0.5">أدخل الكود الخاص بك لتعبئة رصيد محفظتك مباشرة</p>
                    </div>
                  </div>

                  <form onSubmit={handleActivate} className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="أدخل كود الشحن هنا (مثال: FOX-100-2026)"
                        className="w-full text-right md:text-center tracking-wider placeholder:tracking-normal p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#15151F] text-gray-900 dark:text-white text-base font-black focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-cyan-400 transition-all"
                        disabled={isActivating}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isActivating || !code.trim()}
                      className="w-full bg-[#00B4D8] hover:bg-[#0077B6] dark:bg-[#D4AF37] dark:hover:bg-[#B8860B] disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      {isActivating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>جاري الشحن وتفعيل الكود...</span>
                        </>
                      ) : (
                        <span>تفعيل وشحن الكود الآن</span>
                      )}
                    </button>
                  </form>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-start text-right" dir="rtl">
                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-bold leading-relaxed">
                      <p className="font-black mb-1">تعليمات وتنبيهات هامة:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>تأكد من كتابة الكود بشكل صحيح وبنفس الحروف الكبيرة وعلامات الفاصلة (-).</li>
                        <li>الكود صالح للاستخدام مرة واحدة فقط وسيتم ربطه بحسابك فوراً.</li>
                        <li>إذا تم توليد الكود لطالب محدد، فلن يتمكن أي حساب آخر من استخدامه.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bank / Electronic Transfer Recharge Request Form */}
                {userData?.role === 'student' && (
                  <WalletRechargeRequestForm userData={userData} />
                )}

                {/* Transaction Logs */}
                <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">سجل المعاملات</h3>
                  {transactions.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-[#2D2D3D]/50">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="py-4 flex justify-between items-center">
                          <span className="text-gray-900 dark:text-white font-bold">{tx.description}</span>
                          <span className={`${tx.amount > 0 ? 'text-green-500' : 'text-red-500'} font-black`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ar-EG')} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">لا توجد معاملات</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'admin_store' && userData?.role === 'admin' && (
              <motion.div
                key="admin_store"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AcademyStoreAdmin userData={userData} />
              </motion.div>
            )}

                        {activeTab === 'student_store' && userData?.role === 'student' && (
              <motion.div
                key="student_store"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <StudentStore userData={userData} setUserData={setUserData} />
              </motion.div>
            )}

            {activeTab === 'purchases' && userData?.role === 'student' && (
              <motion.div
                key="purchases"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <StudentPurchases userData={userData} />
              </motion.div>
            )}

            {activeTab === 'parent_invoices' && userData?.role === 'parent' && (
              <motion.div
                key="parent_invoices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ParentInvoices userData={userData} linkedStudent={linkedStudent} />
              </motion.div>
            )}

            {activeTab === 'finances' && (
              <motion.div
                key="finances"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">إدارة الحسابات والمالية</h2>
                      <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">تتبع التدفقات المالية، الأرباح، والمصروفات بدقة متناهية</p>
                    </div>
                  </div>
                  <FinancesManager userData={userData} />
                </div>
              </motion.div>
            )}

             {activeTab === 'question_bank' && userData?.role === 'teacher' && (
              <motion.div
                key="question_bank"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <TeacherQuestionBank userData={userData} />
              </motion.div>
            )}

             {activeTab === 'quizzes' && (
              <motion.div
                key="quizzes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-8"
                dir="rtl"
              >
                {/* Header */}
                <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-right w-full md:w-auto">
                    <div className="w-16 h-16 bg-sky-500/10 dark:bg-cyan-400/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Award className="w-8 h-8 text-sky-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                        {userData?.role === 'teacher' ? 'مركز الاختبارات والتقييم' : userData?.role === 'parent' ? 'نتائج واختبارات الطالب' : 'مركز الاختبارات التفاعلية'}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 font-bold text-xs mt-1">
                        {userData?.role === 'teacher' ? 'أدر الاختبارات التفاعلية، وراجع درجات ومحاولات طلابك' : userData?.role === 'parent' ? 'تابع مستوى تقدم الطالب في جميع اختبارات الدروس والكورسات' : 'حل الاختبارات بعد كل درس لقياس مستوى فهمك وتصحيح أخطائك فوراً'}
                      </p>
                    </div>
                  </div>
                </div>

                {loadingQuizzes ? (
                  <div className="text-center py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-slate-800">
                    <Loader2 className="w-10 h-10 text-sky-600 dark:text-cyan-400 animate-spin" />
                    <p className="font-bold text-sm text-gray-500">جاري تحميل الاختبارات والنتائج...</p>
                  </div>
                ) : (
                  <>
                    {userData?.role === 'student' && (
                      <div className="space-y-6 text-right">
                        {/* Compact Header Summary Card */}
                        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-gray-150 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-gray-800 dark:text-white">ملخص أدائك وتقييمك 📊</h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold">تابع إحصائياتك للاختبارات التفاعلية والامتحانات الشاملة الموجهة لك.</p>
                          </div>
                          <div className="flex gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
                            <div className="bg-gray-50 dark:bg-[#090D16] border border-gray-100 dark:border-slate-800/40 rounded-xl px-4 py-2 text-center shrink-0">
                              <span className="block text-[9px] text-gray-400 font-bold mb-0.5">المنجزة</span>
                              <span className="text-sm font-black text-sky-600 dark:text-cyan-400">
                                {submissionsList.length} / {studentVisibleQuizzes.length}
                              </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#090D16] border border-gray-100 dark:border-slate-800/40 rounded-xl px-4 py-2 text-center shrink-0">
                              <span className="block text-[9px] text-gray-400 font-bold mb-0.5">متوسط الدرجة</span>
                              <span className="text-sm font-black text-green-500">
                                {submissionsList.length > 0
                                  ? `${Math.round(submissionsList.reduce((acc, curr) => acc + (curr.score || 0), 0) / submissionsList.length)}%`
                                  : '0%'
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Beautifully Combined Control Bar (Tabs + Filters) */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-gray-150 dark:border-slate-800/60 pb-3">
                          {/* Inner Tabs Selector */}
                          <div className="flex gap-4">
                            <button
                              onClick={() => setQuizTabType('lesson')}
                              className={`pb-1 text-xs font-black transition-all relative ${
                                quizTabType === 'lesson'
                                  ? 'text-sky-600 dark:text-cyan-400'
                                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                              }`}
                            >
                              اختبارات الدروس ({studentVisibleQuizzes.filter(q => !q.isComprehensive).length})
                              {quizTabType === 'lesson' && (
                                <motion.div layoutId="studentQuizTabBorder" className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-sky-600 dark:bg-cyan-500" />
                              )}
                            </button>
                            <button
                              onClick={() => setQuizTabType('comprehensive')}
                              className={`pb-1 text-xs font-black transition-all relative ${
                                quizTabType === 'comprehensive'
                                  ? 'text-sky-600 dark:text-cyan-400'
                                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                              }`}
                            >
                              الامتحانات الشاملة والنشطة ({studentVisibleQuizzes.filter(q => q.isComprehensive).length})
                              {quizTabType === 'comprehensive' && (
                                <motion.div layoutId="studentQuizTabBorder" className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-sky-600 dark:bg-cyan-500" />
                              )}
                            </button>
                          </div>

                          {/* Filters Chips */}
                          <div className="flex gap-1.5 bg-gray-100 dark:bg-[#090D16] p-1 rounded-xl w-fit self-end md:self-auto">
                            {[
                              { id: 'all', label: 'الكل' },
                              { id: 'completed', label: 'المكتملة' },
                              { id: 'pending', label: 'المتبقية' }
                            ].map(filter => (
                              <button
                                key={filter.id}
                                onClick={() => setQuizzesFilter(filter.id as any)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                                  quizzesFilter === filter.id
                                    ? 'bg-white dark:bg-[#111827] text-sky-600 dark:text-cyan-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                }`}
                              >
                                {filter.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* List rendering */}
                        <div className="space-y-3">
                          {studentVisibleQuizzes
                            .filter(q => quizTabType === 'lesson' ? !q.isComprehensive : q.isComprehensive)
                            .filter(q => {
                              const isSolved = submissionsList.some(s => s.quizId === q.id);
                              if (quizzesFilter === 'completed') return isSolved;
                              if (quizzesFilter === 'pending') return !isSolved;
                              return true;
                            })
                            .map(quiz => {
                              const sub = submissionsList.find(s => s.quizId === quiz.id);
                              const courseInfo = coursesList.find(c => c.id === quiz.courseId);
                              return (
                                <div
                                  key={quiz.id}
                                  className="relative group bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-[#1C1C28] border border-gray-150 dark:border-slate-800/50 rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                                >
                                  {/* Right side details */}
                                  <div className="flex items-center gap-3.5 text-right flex-1">
                                    <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${sub ? 'bg-green-500/10 text-green-500' : 'bg-[#00B4D8]/10 text-sky-600 dark:bg-[#D4AF37]/10 dark:text-cyan-400'}`}>
                                      {sub ? <CheckCircle className="w-5 h-5" /> : <Play className="w-4 h-4" />}
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-sm font-black text-gray-900 dark:text-white">{quiz.title}</h3>
                                        {quiz.isComprehensive && (
                                          <span className="text-[9px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md">امتحان شامل 🏆</span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                        <span>⏱️ {quiz.timeLimit} دقيقة</span>
                                        <span>•</span>
                                        <span>📝 {quiz.questions?.length || 0} أسئلة</span>
                                        {courseInfo && (
                                          <>
                                            <span>•</span>
                                            <span className="text-sky-600 dark:text-cyan-400">📚 {courseInfo.title}</span>
                                          </>
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Left side actions */}
                                  <div className="shrink-0 w-full md:w-auto flex items-center justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-800/50">
                                    {sub ? (
                                      <div className="flex items-center gap-3">
                                        <div className="text-right">
                                          <div className={`text-xs font-black ${sub.score >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                            الدرجة: {sub.score}%
                                          </div>
                                          <div className="text-[10px] text-gray-400 font-bold">
                                            {sub.correctAnswers}/{sub.totalQuestions} صحيح
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => {
                                            setSelectedQuizReview(quiz);
                                            setSelectedSubmissionReview(sub);
                                          }}
                                          className="px-3.5 py-2 bg-[#00B4D8]/10 text-sky-600 dark:bg-[#D4AF37]/10 dark:text-cyan-400 hover:bg-[#00B4D8]/20 dark:hover:bg-[#D4AF37]/20 rounded-xl font-black text-[11px] transition-colors flex items-center gap-1.5"
                                        >
                                          <Award className="w-3.5 h-3.5" />
                                          تقرير الأخطاء
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          if (quiz.isComprehensive) {
                                            navigate(`/exam/${quiz.id}`);
                                          } else {
                                            navigate(`/course/${quiz.courseId}`);
                                            toast.success('تم توجيهك لصفحة الكورس، الرجاء اختيار الدرس المطلوب وبدء الاختبار التفاعلي من داخله.');
                                          }
                                        }}
                                        className="px-4 py-2 bg-sky-600 dark:bg-cyan-500 text-white hover:bg-sky-700 dark:hover:bg-cyan-600 rounded-xl font-black text-xs shadow-sm transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
                                      >
                                        <Play className="w-3.5 h-3.5" />
                                        ابدأ الآن
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                          {studentVisibleQuizzes
                            .filter(q => quizTabType === 'lesson' ? !q.isComprehensive : q.isComprehensive)
                            .filter(q => {
                              const isSolved = submissionsList.some(s => s.quizId === q.id);
                              if (quizzesFilter === 'completed') return isSolved;
                              if (quizzesFilter === 'pending') return !isSolved;
                              return true;
                            }).length === 0 && (
                            <div className="text-center py-12 bg-white dark:bg-[#111827] border border-gray-150 dark:border-slate-800/50 rounded-2xl">
                              <Trophy className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                              <p className="font-bold text-xs text-gray-500">لا توجد اختبارات في هذا القسم حالياً 👍</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {userData?.role === 'teacher' && (
                      <div className="space-y-6 text-right w-full">
                        {/* Teacher Sub-tabs selector */}
                        <div className="flex gap-4 border-b border-gray-100 dark:border-slate-800 pb-3 mb-6">
                          <button
                            onClick={() => setQuizTabType('lesson')}
                            className={`pb-2 text-sm font-black transition-all relative ${
                              quizTabType === 'lesson'
                                ? 'text-sky-600 dark:text-cyan-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                          >
                            اختبارات الحصص والدروس
                            {quizTabType === 'lesson' && (
                              <motion.div layoutId="teacherQuizTabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-cyan-500" />
                            )}
                          </button>
                          <button
                            onClick={() => setQuizTabType('comprehensive')}
                            className={`pb-2 text-sm font-black transition-all relative ${
                              quizTabType === 'comprehensive'
                                ? 'text-sky-600 dark:text-cyan-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                          >
                            الامتحانات الشاملة والعامة 🏆
                            {quizTabType === 'comprehensive' && (
                              <motion.div layoutId="teacherQuizTabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-cyan-500" />
                            )}
                          </button>
                        </div>

                        {quizTabType === 'lesson' ? (
                          <>
                            {/* Quick Guide Card */}
                            <div className="bg-sky-500/5 dark:bg-cyan-400/5 border border-sky-500/20 dark:border-cyan-400/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                              <div className="space-y-2 flex-1">
                                <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
                                  كيفية إنشاء اختبار تفاعلي جديد لطلابك:
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                  يتم ربط كل اختبار تفاعلي بدرس محدد داخل كورساتك. لإنشاء اختبار جديد أو تعديله، اذهب إلى قسم <span className="font-bold text-sky-600 dark:text-cyan-400">"فصولي"</span>، ثم اختر الكورس والدرس المطلوب، وانتقل لتبويب <span className="font-bold text-sky-600 dark:text-cyan-400">"الاختبار التفاعلي"</span> لإضافة الأسئلة وتحديد الإجابة الصحيحة وشرحها لطلابك فوراً!
                                </p>
                              </div>
                              <button
                                onClick={() => setActiveTab('classes')}
                                className="px-6 py-3 bg-sky-600 dark:bg-cyan-500 hover:bg-sky-700 dark:hover:bg-cyan-600 text-white rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2 shrink-0 hover:-translate-y-0.5"
                              >
                                <Users className="w-4 h-4" />
                                الذهاب إلى "فصولي" للبدء
                              </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Quizzes List (Left Column) */}
                              <div className="lg:col-span-1 space-y-4">
                              <h3 className="font-black text-lg text-gray-900 dark:text-white mb-4">الاختبارات المتاحة</h3>
                              <div className="space-y-3">
                                {quizzesList.filter(q => !q.isComprehensive).map(quiz => {
                                  const subs = submissionsList.filter(s => s.quizId === quiz.id);
                                  const isSelected = teacherSelectedQuiz?.id === quiz.id;
                                  return (
                                    <div
                                      key={quiz.id}
                                      onClick={() => {
                                        setTeacherSelectedQuiz(quiz);
                                      }}
                                      className={`w-full p-4 rounded-2xl text-right border transition-all flex flex-col gap-2 cursor-pointer ${
                                        isSelected
                                          ? 'bg-gradient-to-l from-[#00B4D8]/10 to-transparent border-sky-500 dark:from-[#D4AF37]/10 dark:border-cyan-500 shadow-sm'
                                          : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-[#222230]'
                                      }`}
                                    >
                                      <div className="flex justify-between items-center w-full">
                                        <span className="text-[10px] bg-gray-100 dark:bg-[#222230] text-gray-500 px-2 py-0.5 rounded-full font-bold">
                                          المشاركات: {subs.length} طالب
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDirectingQuiz(quiz);
                                            setDirectTargetType(quiz.targetedType || 'all');
                                            setDirectTargetGrade(quiz.targetedGrade || 'الأول الثانوي');
                                            setDirectTargetStudentIds(quiz.targetedStudentIds || []);
                                          }}
                                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2D2D3D]/50 rounded-lg text-sky-600 dark:text-cyan-400 transition-colors"
                                          title="توجيه ونشر الاختبار"
                                        >
                                          <Send className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{quiz.title}</h4>
                                      <div className="flex justify-between items-center text-[10px] font-bold mt-1">
                                        <span className="text-gray-400">الأسئلة: {quiz.questions?.length || 0}</span>
                                        {quiz.isHidden ? (
                                          <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded">مسودة 🙈</span>
                                        ) : quiz.targetedType === 'grade' ? (
                                          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">موجه: {quiz.targetedGrade} 🎯</span>
                                        ) : quiz.targetedType === 'custom' ? (
                                          <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">موجه للطلاب 👥</span>
                                        ) : (
                                          <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">منشور للجميع 🌍</span>
                                        )}
                                      </div>
                                      {/* Exam ID block */}
                                      <div 
                                        className="flex items-center justify-between bg-gray-50 dark:bg-[#090D16] border border-gray-150 dark:border-slate-800 px-2 py-1.5 rounded-xl w-full mt-2"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="flex items-center gap-1">
                                          <span className="text-[9px] text-gray-400 font-bold">معرف الاختبار:</span>
                                          <span className="text-[9px] font-mono font-bold text-gray-600 dark:text-gray-400 select-all">{quiz.id}</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(quiz.id);
                                            toast.success('تم نسخ معرّف الاختبار! 📋');
                                          }}
                                          className="text-gray-400 hover:text-sky-600 dark:hover:text-cyan-400 p-0.5 transition-colors cursor-pointer"
                                          title="نسخ المعرف"
                                        >
                                          <Copy className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}

                                {quizzesList.filter(q => !q.isComprehensive).length === 0 && (
                                  <div className="text-center py-10 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200">
                                    <Award className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                    <p className="font-bold text-xs text-gray-500">لم تقم بإنشاء أي اختبارات تفاعلية بعد.</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Submissions (Right Column) */}
                            <div className="lg:col-span-2 space-y-4">
                              {teacherSelectedQuiz && !teacherSelectedQuiz.isComprehensive ? (
                                (() => {
                                  const quizSubmissions = submissionsList.filter(s => s.quizId === teacherSelectedQuiz.id);
                                  return (
                                    <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                                      <div className="border-b border-gray-100 dark:border-slate-800 pb-4 flex justify-between items-center flex-wrap gap-4">
                                        <div>
                                          <h3 className="font-black text-lg text-gray-900 dark:text-white">{teacherSelectedQuiz.title}</h3>
                                          <p className="text-xs text-gray-400 font-bold mt-1">جدول تسليمات ودرجات الطلاب للتصحيح والمتابعة</p>
                                          {/* Exam ID Display */}
                                          <div className="flex items-center gap-1.5 mt-2 bg-gray-50 dark:bg-[#090D16] border border-gray-150 dark:border-slate-800 px-2.5 py-1 rounded-xl w-fit">
                                            <span className="text-[10px] text-gray-500 font-black">معرّف الاختبار (ID):</span>
                                            <span className="text-[10px] font-mono font-bold text-gray-700 dark:text-gray-300 select-all">{teacherSelectedQuiz.id}</span>
                                            <button
                                              onClick={() => {
                                                navigator.clipboard.writeText(teacherSelectedQuiz.id);
                                                toast.success('تم نسخ معرّف الاختبار بنجاح! 📋');
                                              }}
                                              className="text-gray-400 hover:text-sky-600 dark:hover:text-cyan-400 transition-colors cursor-pointer p-0.5"
                                              title="نسخ معرف الاختبار"
                                            >
                                              <Copy className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => {
                                            navigate(`/course/${teacherSelectedQuiz.courseId}`);
                                            toast.success('تم توجيهك لصفحة الكورس للتعديل على الاختبار.');
                                          }}
                                          className="px-4 py-2.5 bg-[#00B4D8]/10 text-sky-600 dark:bg-[#D4AF37]/10 dark:text-cyan-400 rounded-xl text-xs font-bold transition-all hover:bg-[#00B4D8]/20 dark:hover:bg-[#D4AF37]/20 flex items-center gap-1.5"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                          تعديل الأسئلة
                                        </button>
                                      </div>

                                      <div className="divide-y divide-gray-50 dark:divide-[#2D2D3D]/50">
                                        {quizSubmissions.map(sub => (
                                          <div key={sub.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-sky-500/10 dark:bg-cyan-400/10 rounded-full flex items-center justify-center font-bold text-sm text-sky-600 dark:text-cyan-400">
                                                {sub.userName?.charAt(0) || 'ط'}
                                              </div>
                                              <div>
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{sub.userName}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                                  تاريخ التسليم: {new Date(sub.submittedAt).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}
                                                </p>
                                              </div>
                                            </div>

                                            <div className="text-left font-black text-sm">
                                              <span className={sub.score >= 50 ? 'text-green-500' : 'text-red-500'}>
                                                {sub.score}%
                                              </span>
                                              <p className="text-[10px] text-gray-400 font-bold mt-0.5" dir="ltr">
                                                {sub.correctAnswers} / {sub.totalQuestions} صحيح
                                              </p>
                                            </div>
                                          </div>
                                        ))}

                                        {quizSubmissions.length === 0 && (
                                          <div className="text-center py-16 text-gray-400">
                                            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                            <p className="font-bold text-sm">لا توجد محاولات أو تسليمات من الطلاب لهذا الاختبار بعد 👍</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="bg-white dark:bg-[#111827] rounded-3xl p-16 text-center border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center h-full">
                                  <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                  <h3 className="font-black text-lg text-gray-800 dark:text-gray-200">اختر اختباراً لمشاهدة التفاصيل</h3>
                                  <p className="text-xs text-gray-400 font-bold max-w-sm mt-1">قم بتحديد أي اختبار من القائمة الجانبية لعرض درجات الطلاب وتحليل أخطائهم بالتفصيل</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                        ) : (
                          // Comprehensive exams tab for teachers
                          <div className="space-y-6">
                            {/* Create Button Banner */}
                            <div className="bg-gradient-to-l from-[#00B4D8] to-[#0077B6] dark:from-[#D4AF37] dark:to-[#AA7C11] p-6 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-sky-500/10 dark:shadow-cyan-500/10">
                              <div className="space-y-1">
                                <h3 className="font-black text-lg">بوابة الامتحانات الشاملة والعامة 🏆</h3>
                                <p className="text-xs text-white/80 font-bold">أنشئ امتحانات عامة أو شاملة لكورساتك وموادك لقياس تحصيل ومستوى الطلاب.</p>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingExamId(null);
                                  setIsCreatingExam(true);
                                }}
                                className="px-6 py-3 bg-white text-sky-700 dark:text-[#AA7C11] rounded-2xl font-black text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-1.5 shadow-md shadow-black/5"
                              >
                                <Plus className="w-4 h-4" />
                                إضافة امتحان شامل جديد
                              </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Left Column: Exams List */}
                              <div className="lg:col-span-1 space-y-4">
                                <h3 className="font-black text-lg text-gray-900 dark:text-white">قائمة الامتحانات الشاملة</h3>
                                <div className="space-y-3">
                                  {quizzesList.filter(q => q.isComprehensive).map(quiz => {
                                    const subs = submissionsList.filter(s => s.quizId === quiz.id);
                                    const isSelected = teacherSelectedQuiz?.id === quiz.id;
                                    const courseInfo = coursesList.find(c => c.id === quiz.courseId);
                                    return (
                                      <div
                                        key={quiz.id}
                                        className={`p-4 rounded-2xl border transition-all flex flex-col gap-2 relative group cursor-pointer ${
                                          isSelected
                                            ? 'bg-gradient-to-l from-[#00B4D8]/10 to-transparent border-sky-500 dark:from-[#D4AF37]/10 dark:border-cyan-500 shadow-sm'
                                            : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-[#222230]'
                                        }`}
                                        onClick={() => setTeacherSelectedQuiz(quiz)}
                                      >
                                        <div className="flex justify-between items-start">
                                          <span className="text-[10px] bg-gray-100 dark:bg-[#222230] text-gray-500 px-2 py-0.5 rounded-full font-bold">
                                            المشاركات: {subs.length} طالب
                                          </span>
                                          <div className="flex gap-1.5">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setDirectingQuiz(quiz);
                                                setDirectTargetType(quiz.targetedType || 'all');
                                                setDirectTargetGrade(quiz.targetedGrade || 'الأول الثانوي');
                                                setDirectTargetStudentIds(quiz.targetedStudentIds || []);
                                              }}
                                              className="p-1 hover:bg-gray-100 dark:hover:bg-[#2D2D3D] rounded-lg text-amber-500 transition-colors"
                                              title="توجيه ونشر الاختبار"
                                            >
                                              <Send className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingExamId(quiz.id);
                                                setIsCreatingExam(true);
                                              }}
                                              className="p-1 hover:bg-gray-100 dark:hover:bg-[#2D2D3D] rounded-lg text-sky-600 dark:text-cyan-400 transition-colors"
                                              title="تعديل الامتحان"
                                            >
                                              <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm("هل أنت متأكد من حذف هذا الامتحان الشامل نهائياً؟")) {
                                                  handleDeleteExam(quiz.id);
                                                }
                                              }}
                                              className="p-1 hover:bg-gray-100 dark:hover:bg-[#2D2D3D] rounded-lg text-red-500 transition-colors"
                                              title="حذف الامتحان"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{quiz.title}</h4>
                                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold">
                                          <span>الأسئلة: {quiz.questions?.length || 0}</span>
                                          <span>{courseInfo ? courseInfo.title : "امتحان عام"}</span>
                                        </div>
                                        <div className="flex justify-end mt-1 text-[10px] font-bold">
                                          {quiz.isHidden ? (
                                            <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded">مسودة 🙈</span>
                                          ) : quiz.targetedType === 'grade' ? (
                                            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">موجه: {quiz.targetedGrade} 🎯</span>
                                          ) : quiz.targetedType === 'custom' ? (
                                            <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">موجه للطلاب 👥</span>
                                          ) : (
                                            <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">منشور للجميع 🌍</span>
                                          )}
                                        </div>
                                        {/* Exam ID block */}
                                        <div 
                                          className="flex items-center justify-between bg-gray-50 dark:bg-[#090D16] border border-gray-150 dark:border-slate-800 px-2 py-1.5 rounded-xl w-full mt-2"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <div className="flex items-center gap-1">
                                            <span className="text-[9px] text-gray-400 font-bold">معرف الاختبار:</span>
                                            <span className="text-[9px] font-mono font-bold text-gray-600 dark:text-gray-400 select-all">{quiz.id}</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(quiz.id);
                                              toast.success('تم نسخ معرّف الاختبار! 📋');
                                            }}
                                            className="text-gray-400 hover:text-sky-600 dark:hover:text-cyan-400 p-0.5 transition-colors cursor-pointer"
                                            title="نسخ المعرف"
                                          >
                                            <Copy className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {quizzesList.filter(q => q.isComprehensive).length === 0 && (
                                    <div className="text-center py-10 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200">
                                      <Award className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                      <p className="font-bold text-xs text-gray-500">لم تقم بنشر أي امتحانات شاملة بعد.</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right Column: Submissions List */}
                              <div className="lg:col-span-2 space-y-4">
                                {teacherSelectedQuiz && teacherSelectedQuiz.isComprehensive ? (
                                  (() => {
                                    const quizSubmissions = submissionsList.filter(s => s.quizId === teacherSelectedQuiz.id);
                                    return (
                                      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                                        <div className="border-b border-gray-100 dark:border-slate-800 pb-4 flex justify-between items-center flex-wrap gap-4">
                                          <div>
                                            <h3 className="font-black text-lg text-gray-900 dark:text-white">{teacherSelectedQuiz.title}</h3>
                                            <p className="text-xs text-gray-400 font-bold mt-1">جدول تسليمات ودرجات الطلاب للتقييم والمتابعة</p>
                                            {/* Exam ID Display */}
                                            <div className="flex items-center gap-1.5 mt-2 bg-gray-50 dark:bg-[#090D16] border border-gray-150 dark:border-slate-800 px-2.5 py-1 rounded-xl w-fit">
                                              <span className="text-[10px] text-gray-500 font-black">معرّف الاختبار (ID):</span>
                                              <span className="text-[10px] font-mono font-bold text-gray-700 dark:text-gray-300 select-all">{teacherSelectedQuiz.id}</span>
                                              <button
                                                onClick={() => {
                                                  navigator.clipboard.writeText(teacherSelectedQuiz.id);
                                                  toast.success('تم نسخ معرّف الاختبار بنجاح! 📋');
                                                }}
                                                className="text-gray-400 hover:text-sky-600 dark:hover:text-cyan-400 transition-colors cursor-pointer p-0.5"
                                                title="نسخ معرف الاختبار"
                                              >
                                                <Copy className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => {
                                              setEditingExamId(teacherSelectedQuiz.id);
                                              setIsCreatingExam(true);
                                            }}
                                            className="px-4 py-2.5 bg-[#00B4D8]/10 text-sky-600 dark:bg-[#D4AF37]/10 dark:text-cyan-400 rounded-xl text-xs font-bold transition-all hover:bg-[#00B4D8]/20 dark:hover:bg-[#D4AF37]/20 flex items-center gap-1.5"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            تعديل الامتحان
                                          </button>
                                        </div>

                                        <div className="divide-y divide-gray-50 dark:divide-[#2D2D3D]/50">
                                          {quizSubmissions.map(sub => (
                                            <div key={sub.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                              <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-sky-500/10 dark:bg-cyan-400/10 rounded-full flex items-center justify-center font-bold text-sm text-sky-600 dark:text-cyan-400">
                                                  {sub.userName?.charAt(0) || 'ط'}
                                                </div>
                                                <div>
                                                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{sub.userName}</h4>
                                                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                                    تاريخ التسليم: {new Date(sub.submittedAt).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}
                                                  </p>
                                                </div>
                                              </div>

                                              <div className="text-left font-black text-sm">
                                                <span className={sub.score >= 50 ? 'text-green-500' : 'text-red-500'}>
                                                  {sub.score}%
                                                </span>
                                                <p className="text-[10px] text-gray-400 font-bold mt-0.5" dir="ltr">
                                                  {sub.correctAnswers} / {sub.totalQuestions} صحيح
                                                </p>
                                              </div>
                                            </div>
                                          ))}

                                          {quizSubmissions.length === 0 && (
                                            <div className="text-center py-16 text-gray-400">
                                              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                              <p className="font-bold text-sm">لا توجد محاولات أو تسليمات من الطلاب لهذا الامتحان الشامل بعد 👍</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()
                                ) : (
                                  <div className="bg-white dark:bg-[#111827] rounded-3xl p-16 text-center border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center h-full">
                                    <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                    <h3 className="font-black text-lg text-gray-800 dark:text-gray-200">اختر امتحاناً شاملاً لمشاهدة التفاصيل</h3>
                                    <p className="text-xs text-gray-400 font-bold max-w-sm mt-1">قم بتحديد أي امتحان من القائمة الجانبية لعرض درجات الطلاب وتحليل أخطائهم بالتفصيل</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {userData?.role === 'parent' && (
                      <div className="space-y-6 text-right">
                        {/* Parent linked student status message */}
                        {!linkedStudent ? (
                          <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-200/50 text-center font-bold text-sm">
                            ⚠️ يرجى ربط حساب الطالب من صفحة "الملف الشخصي" أولاً لعرض تقارير واختبارات الطالب بالتفصيل ومتابعة أدائه.
                          </div>
                        ) : (
                          <>
                            <div className="bg-sky-500/5 dark:bg-cyan-400/5 border border-sky-500/10 dark:border-cyan-400/10 rounded-2xl p-4 flex items-center gap-3">
                              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-relaxed">
                                تتابع حالياً أداء الطالب المربوط بحسابك: <span className="font-black text-sky-600 dark:text-cyan-400">{linkedStudent.name}</span>. تم تحديث الدرجات والمحاولات تلقائياً.
                              </p>
                            </div>

                            {/* Submissions List */}
                            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                              <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                <History className="w-5 h-5 text-gray-400" />
                                سجل اختبارات الطالب ودرجاته
                              </h3>

                              <div className="divide-y divide-gray-50 dark:divide-[#2D2D3D]/50">
                                {submissionsList.map(sub => {
                                  const quiz = quizzesList.find(q => q.id === sub.quizId);
                                  return (
                                    <div key={sub.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                          sub.score >= 50 ? 'bg-green-50 dark:bg-green-500/10 text-green-500' : 'bg-red-50 dark:bg-red-500/10 text-red-500'
                                        }`}>
                                          <Award className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{quiz?.title || 'اختبار تفاعلي للدرس'}</h4>
                                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                            تم الحل: {new Date(sub.submittedAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-4 self-start sm:self-auto">
                                        <span className={`text-base font-black ${sub.score >= 50 ? 'text-green-500' : 'text-red-500'}`} dir="ltr">
                                          {sub.score}%
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                          sub.score >= 50 ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                        }`}>
                                          {sub.score >= 50 ? 'اجتاز الاختبار' : 'بحاجة لإعادة'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}

                                {submissionsList.length === 0 && (
                                  <div className="text-center py-12 text-gray-400">
                                    <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="font-bold text-sm">لم يقم الطالب بأداء أي اختبارات تفاعلية حتى الآن 👍</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Student Quiz Review & Mistake Correction Modal */}
                <AnimatePresence>
                  {selectedQuizReview && selectedSubmissionReview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                          setSelectedQuizReview(null);
                          setSelectedSubmissionReview(null);
                        }}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-[#111827] rounded-3xl w-full max-w-3xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-right"
                        dir="rtl"
                      >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl z-10">
                          <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">تقرير أداء وتصحيح الأخطاء</h3>
                            <p className="text-xs text-gray-400 font-bold mt-1">{selectedQuizReview.title}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedQuizReview(null);
                              setSelectedSubmissionReview(null);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2D2D3D] text-gray-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                          {/* Top Card Summary */}
                          <div className="bg-sky-500/5 dark:bg-cyan-400/5 border border-sky-500/10 dark:border-cyan-400/10 rounded-2xl p-6 flex flex-col sm:flex-row justify-around items-center gap-6">
                            <div className="text-center">
                              <p className="text-xs text-gray-400 font-bold mb-1">النتيجة الإجمالية</p>
                              <div className={`text-4xl font-black ${selectedSubmissionReview.score >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                {selectedSubmissionReview.score}%
                              </div>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full mt-2 inline-block ${
                                selectedSubmissionReview.score >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {selectedSubmissionReview.score >= 50 ? 'اجتياز ممتاز' : 'لم تجتاز الاختبار'}
                              </span>
                            </div>
                            <div className="text-center border-r border-gray-100 dark:border-slate-800 pr-6 w-full sm:w-auto">
                              <p className="text-xs text-gray-400 font-bold mb-1">الإجابات الصحيحة</p>
                              <div className="text-2xl font-black text-gray-900 dark:text-white">
                                {selectedSubmissionReview.correctAnswers} / {selectedSubmissionReview.totalQuestions}
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1 font-bold">من إجمالي الأسئلة المتاحة</p>
                            </div>
                          </div>

                          <h4 className="font-black text-base text-gray-900 dark:text-white mb-4">تفاصيل الأسئلة والتصحيح:</h4>
                          <div className="space-y-6">
                            {selectedQuizReview.questions?.map((q: any, idx: number) => {
                              const studentAns = selectedSubmissionReview.answers?.[q.id];
                              const isCorrect = studentAns !== undefined && studentAns === q.correctOptionIndex;
                              return (
                                <div key={q.id} className={`p-5 rounded-2xl border ${
                                  isCorrect 
                                    ? 'bg-green-50/20 dark:bg-green-950/10 border-green-200/40' 
                                    : 'bg-red-50/20 dark:bg-red-950/10 border-red-200/40'
                                } space-y-4`}>
                                  <div className="flex items-start gap-3">
                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                      isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                      {idx + 1}
                                    </span>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white leading-relaxed">{q.text}</p>
                                  </div>

                                  {/* Options */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 pr-9">
                                    {q.options.map((opt: string, oIdx: number) => {
                                      const isSelectedByStudent = studentAns === oIdx;
                                      const isCorrectOption = q.correctOptionIndex === oIdx;
                                      return (
                                        <div key={oIdx} className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                                          isCorrectOption 
                                            ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400' 
                                            : isSelectedByStudent 
                                              ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400'
                                              : 'bg-gray-50 dark:bg-[#222230] border-gray-100 dark:border-transparent text-gray-600 dark:text-gray-400'
                                        }`}>
                                          <span>{opt}</span>
                                          {isCorrectOption && <Check className="w-4 h-4 text-green-500 shrink-0" />}
                                          {!isCorrectOption && isSelectedByStudent && <X className="w-4 h-4 text-red-500 shrink-0" />}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Explanation block */}
                                  {q.explanation && (
                                    <div className="bg-sky-500/5 dark:bg-cyan-400/5 border-r-4 border-sky-500 dark:border-cyan-400 p-3.5 rounded-xl pr-4 mt-2">
                                      <p className="text-xs font-black text-sky-600 dark:text-cyan-400 mb-1">💡 التفسير والشرح المبسط لتصحيح الخطأ:</p>
                                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{q.explanation}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedQuizReview(null);
                              setSelectedSubmissionReview(null);
                            }}
                            className="px-6 py-2.5 bg-gray-100 dark:bg-[#2D2D3D] hover:bg-gray-200 dark:hover:bg-[#3D3D52] text-gray-700 dark:text-white rounded-xl text-xs font-black transition-colors"
                          >
                            إغلاق التقرير
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Comprehensive Exam Builder for Teachers */}
                <ComprehensiveExamBuilder
                  isOpen={isCreatingExam}
                  onClose={() => {
                    setIsCreatingExam(false);
                    setEditingExamId(null);
                  }}
                  db={db}
                  userData={userData}
                  coursesList={coursesList}
                  editingExamId={editingExamId}
                  existingExamData={editingExamId ? quizzesList.find(q => q.id === editingExamId) : undefined}
                  onSaveSuccess={(examData) => {
                    setQuizzesList(prev => {
                      const filtered = prev.filter(q => q.id !== examData.id);
                      return [examData, ...filtered];
                    });
                    setIsCreatingExam(false);
                    setEditingExamId(null);
                  }}
                />

                {/* Student Exam Taking Interface */}
                {activeTakingExam && (
                  <StudentExamTaking
                    exam={activeTakingExam}
                    isOpen={!!activeTakingExam}
                    onClose={() => setActiveTakingExam(null)}
                    db={db}
                    userData={userData}
                    onSubmissionSuccess={(submissionData) => {
                      setSubmissionsList(prev => {
                        const filtered = prev.filter(s => s.id !== submissionData.id);
                        return [submissionData, ...filtered];
                      });
                      setStarsReloadTrigger(prev => prev + 1);
                      setActiveTakingExam(null);
                    }}
                  />
                )}
              </motion.div>
            )}

            {activeTab === "badges" && (
              <motion.div
                key="badges"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto w-full"
              >
                <StudentBadges userData={userData} isStandalone />
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto w-full space-y-6"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#1E2433] border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#2A3447] transition-colors"
                    title="الرجوع للرئيسية"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-6 h-6 text-[#D4F800]" />
                    الإشعارات
                  </h2>
                </div>
                
                <div className="bg-white dark:bg-[#1E2433] rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white">قائمة الإشعارات</h3>
                    <span className="text-xs bg-[#D4F800]/15 text-[#658C00] dark:bg-[#D4F800]/20 dark:text-[#D4F800] px-3 py-1.5 rounded-full font-bold">
                      {notifications.filter(n => !n.read).length} جديد
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => !notif.read && markNotificationAsRead(notif.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${!notif.read ? "bg-amber-50/50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" : "bg-gray-50 dark:bg-[#090D16] border-gray-100 dark:border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-700"}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white pr-2">{notif.title}</h4>
                            {!notif.read && <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0 mt-1" />}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>
                          <span className="text-xs text-gray-400 dark:text-gray-500 mt-3 block font-medium">
                            {new Date(notif.createdAt).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-gray-50 dark:bg-[#090D16] rounded-2xl border border-gray-100 dark:border-slate-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center justify-center">
                        <Bell className="w-10 h-10 mb-3 opacity-20 text-gray-400" />
                        <span className="font-bold">لا توجد إشعارات حالياً</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "faq" && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FAQSection />
              </motion.div>
            )}

            {activeTab === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <InteractiveSchedule db={db} userData={userData} coursesList={coursesList} />
              </motion.div>
            )}

            {activeTab === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <QuickNotes db={db} userData={userData} />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProfileSection userData={userData} onUpdateUserData={(newData) => setUserData(newData)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Directing Quiz/Exam Modal */}
      <AnimatePresence>
        {directingQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-3xl overflow-hidden border border-gray-150 dark:border-slate-800 shadow-2xl text-right"
              style={{ direction: 'rtl' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-150 dark:border-slate-800 bg-gray-50/50 dark:bg-[#090D16]/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/10 text-sky-600 dark:bg-[#D4AF37]/10 dark:text-cyan-400 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white">توجيه ونشر الاختبار</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">حدد الفئة المستهدفة للاختبار ليظهر لهم في لوحتهم</p>
                  </div>
                </div>
                <button
                  onClick={() => setDirectingQuiz(null)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2D2D3D] rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Selected Quiz Title */}
                <div className="bg-gray-50 dark:bg-[#090D16]/40 rounded-2xl p-4 border border-gray-150 dark:border-slate-800/40">
                  <span className="text-[10px] font-black text-sky-600 dark:text-cyan-400 block mb-1">اسم الاختبار المحدد:</span>
                  <p className="text-xs font-black text-gray-800 dark:text-white">{directingQuiz.title}</p>
                </div>

                {/* Target Type Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700 dark:text-gray-300">طريقة توجيه ونشر الاختبار:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'all', label: 'عام للكل', desc: 'متاح لجميع الطلاب' },
                      { id: 'grade', label: 'صف دراسي', desc: 'متاح لصف محدد' },
                      { id: 'custom', label: 'طلاب محددين', desc: 'متاح لأسماء مخصصة' }
                    ].map((target) => (
                      <button
                        key={target.id}
                        type="button"
                        onClick={() => setDirectTargetType(target.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          directTargetType === target.id
                            ? 'border-sky-500 bg-[#00B4D8]/5 text-sky-600 dark:border-cyan-500 dark:bg-[#D4AF37]/5 dark:text-cyan-400'
                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1E1E2A]'
                        }`}
                      >
                        <span className="text-xs font-black">{target.label}</span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">{target.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade Selector */}
                {directTargetType === 'grade' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 dark:text-gray-300">اختر الصف الدراسي المستهدف:</label>
                    <select
                      value={directTargetGrade}
                      onChange={(e) => setDirectTargetGrade(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#090D16] border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      {[
                        { value: 'الأول الثانوي', label: 'الأول الثانوي' },
                        { value: 'الثاني الثانوي', label: 'الثاني الثانوي (بكالوريا)' },
                        { value: 'الثالث الثانوي', label: 'الثالث الثانوي' },
                      ].map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Custom Student Selector */}
                {directTargetType === 'custom' && (
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-700 dark:text-gray-300">اختر الطلاب المستهدفين من القائمة:</label>
                    
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="ابحث عن اسم الطالب..."
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 bg-gray-50 dark:bg-[#090D16] border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <div className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Students List with Checkboxes */}
                    <div className="border border-gray-150 dark:border-slate-800 rounded-2xl divide-y divide-gray-100 dark:divide-[#2D2D3D] max-h-[180px] overflow-y-auto bg-gray-50/50 dark:bg-[#090D16]/20">
                      {loadingStudents ? (
                        <div className="p-8 text-center text-xs font-black text-gray-400 flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-sky-600 dark:text-cyan-400" />
                          <span>جاري تحميل الطلاب...</span>
                        </div>
                      ) : allStudents.filter(student => 
                        student.name?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                        student.email?.toLowerCase().includes(studentSearchQuery.toLowerCase())
                      ).length === 0 ? (
                        <div className="p-8 text-center text-xs font-bold text-gray-400">
                          لا يوجد طلاب يطابقون البحث 🔎
                        </div>
                      ) : (
                        allStudents.filter(student => 
                          student.name?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                          student.email?.toLowerCase().includes(studentSearchQuery.toLowerCase())
                        ).map((student) => {
                          const isSelected = directTargetStudentIds.includes(student.id);
                          return (
                            <div
                              key={student.id}
                              onClick={() => {
                                if (isSelected) {
                                  setDirectTargetStudentIds(prev => prev.filter(id => id !== student.id));
                                } else {
                                  setDirectTargetStudentIds(prev => [...prev, student.id]);
                                }
                              }}
                              className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#1C1C28] cursor-pointer transition-colors"
                            >
                              <div className="text-right">
                                <p className="text-xs font-black text-gray-800 dark:text-gray-200">{student.name || 'طالب بدون اسم'}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{student.email}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                                isSelected 
                                  ? 'bg-[#00B4D8] border-sky-500 text-white dark:bg-[#D4AF37] dark:border-cyan-500' 
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111827]'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {directTargetStudentIds.length > 0 && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">
                        تم تحديد <span className="text-sky-600 dark:text-cyan-400">{directTargetStudentIds.length}</span> طلاب للتوجيه مخصومين من الفئات الأخرى.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="p-5 border-t border-gray-150 dark:border-slate-800 bg-gray-50/50 dark:bg-[#090D16]/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDirectingQuiz(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#252535] dark:hover:bg-[#2F2F44] text-gray-600 dark:text-gray-300 rounded-xl text-xs font-black transition-all cursor-pointer"
                  disabled={savingDirecting}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveDirecting}
                  className="px-5 py-2.5 bg-[#00B4D8] hover:bg-[#0077B6] dark:bg-[#D4AF37] dark:hover:bg-[#B8860B] text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  disabled={savingDirecting}
                >
                  {savingDirecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>حفظ ونشر التوجيه</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
    </div>
  );
}
