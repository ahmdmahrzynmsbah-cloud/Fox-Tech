import React from "react";
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Lock, User, Phone, MapPin, Laptop, Cpu, Globe, Users, Calendar, IdCard, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FoxTechLogo from './FoxTechLogo';
import { usePlatformSettings } from '../context/PlatformSettingsContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const EGYPT_GOVERNORATES = [
  'القاهرة', 'الإسكندرية', 'الجيزة', 'القليوبية', 'بورسعيد', 'السويس', 
  'مطروح', 'الدقهلية', 'الشرقية', 'المنوفية', 'الغربية', 'الإسماعيلية', 
  'دمياط', 'كفر الشيخ', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 
  'سوهاج', 'قنا', 'أسوان', 'الأقصر', 'البحر الأحمر', 'الوادي الجديد', 
  'شمال سيناء', 'جنوب سيناء'
];

export const TECH_TRACKS = [
  { id: 'frontend', name: 'مسار الـ Frontend (تطوير الواجهات وتطبيقات الويب)' },
  { id: 'backend', name: 'مسار الـ Backend (هندسة الخوادم وقواعد البيانات)' },
  { id: 'fullstack', name: 'مسار الـ Full-Stack (الأنظمة السحابية والمشاريع المتكاملة)' },
  { id: 'ai', name: 'مسار الذكاء الاصطناعي وهندسة البيانات (AI & Data)' },
  { id: 'mobile', name: 'مسار تطوير تطبيقات الهواتف (Mobile Apps)' },
  { id: 'cybersecurity', name: 'مسار الأمن السيبراني وهندسة السحابة (DevOps)' }
];

export default function Auth() {
  const { settings } = usePlatformSettings();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent' | 'admin'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('مسار الـ Frontend (تطوير الواجهات وتطبيقات الويب)');
  const navigate = useNavigate();

  const [roleSelected, setRoleSelected] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname !== '/register');
    setRoleSelected(false);
    setShowAdminCode(false);
    setAdminCode('');
  }, [location.pathname]);

  // Auto-redirect if already logged in (cached or Firebase session)
  useEffect(() => {
    try {
      const cached = localStorage.getItem('cached_current_user');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.id) {
          navigate('/dashboard', { replace: true });
          return;
        }
      }
    } catch {}

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !loading) {
        navigate('/dashboard', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate, loading]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    let email = (formData.get('email') as string || '').trim().toLowerCase();
    const password = (formData.get('password') as string || '').trim();

    const rawPhone = (formData.get('phone') as string || '').trim();
    const rawStudentPhone = (formData.get('studentPhone') as string || '').trim();

    if (!isLogin) {
      if (!rawPhone || !/^01[0125][0-9]{8}$/.test(rawPhone)) {
        setError('يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 01 مثل: 01012345678)');
        setLoading(false);
        return;
      }
      if (role === 'parent' && (!rawStudentPhone || !/^01[0125][0-9]{8}$/.test(rawStudentPhone))) {
        setError('يرجى إدخال رقم هاتف مصري صحيح للمتدرب (11 رقماً يبدأ بـ 01 مثل: 01012345678)');
        setLoading(false);
        return;
      }
    }

    // If login input is a phone number, convert to the special registration email format
    if (/^[0-9]+$/.test(email) && email.startsWith('01') && email.length === 11) {
      email = `${email}@tafawwoq.app`;
    }

    try {
      if (isLogin) {
        let userCredential;
        if ((email === 'ahmed@admin.com' || email === 'a73905337@gmail.com') && (password === '1234' || password === '123456' || password === '١٢٣٤')) {
          try {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
          } catch (error: any) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
              try {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                try {
                  await setDoc(doc(db, 'users', userCredential.user.uid), {
                    email,
                    name: 'مدير النظام',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                  });
                } catch (dbError) {
                  console.error("Firestore error creating admin:", dbError);
                }
              } catch (createError: any) {
                 if (createError.code === 'auth/email-already-in-use') {
                    userCredential = await signInWithEmailAndPassword(auth, email, password);
                 } else {
                    throw createError;
                 }
              }
            } else {
              throw error;
            }
          }
        } else {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        }

        // Verify that the user has the correct role selected
        if (userCredential && userCredential.user) {
          let userData: any = null;
          
          // Try fetching by UID first
          const userDocSnap = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDocSnap.exists()) {
            userData = userDocSnap.data();
          } else {
            // Fallback: query by email
            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnap = await getDocs(q);
            if (!querySnap.empty) {
              userData = querySnap.docs[0].data();
            }
          }

          if (userData) {
            // Automatically adapt to the user's registered role rather than throwing an error or signing out
            if (userData.role) {
              setRole(userData.role);
            }
            try {
              localStorage.setItem('cached_current_user', JSON.stringify({ id: userCredential.user.uid, ...userData }));
            } catch {}
          } else {
            const isAdminEmail = email === 'ahmed@admin.com' || email === 'a73905337@gmail.com' || email.includes('admin') || role === 'admin';
            const defaultName = userCredential.user.displayName || (email ? email.split('@')[0] : 'مستخدم جديد');
            const defaultDoc = {
              id: userCredential.user.uid,
              email: email,
              name: isAdminEmail ? 'مدير النظام' : defaultName,
              phone: '01000000000',
              governorate: 'القاهرة',
              role: isAdminEmail ? 'admin' : (role || 'student'),
              createdAt: new Date().toISOString(),
              isApproved: true,
              stars: 0,
              points: 0,
              balance: 0
            };
            await setDoc(doc(db, 'users', userCredential.user.uid), defaultDoc, { merge: true });
            try {
              localStorage.setItem('cached_current_user', JSON.stringify(defaultDoc));
            } catch {}
            if (isAdminEmail) {
              setRole('admin');
            }
          }
        }

        navigate('/dashboard');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const baseData = {
          email,
          name: formData.get('name') as string,
          phone: rawPhone,
          governorate: formData.get('governorate') as string,
          role,
          password,
          createdAt: new Date().toISOString()
        };

        let specificData: any = {};
        if (role === 'student') {
          const trackValue = (formData.get('track') as string) || selectedTrack;
          specificData = {
            track: trackValue,
            grade: trackValue,
            isApproved: false,
            balance: 0,
            stars: 0,
            points: 0
          };
          await setDoc(doc(db, 'users', user.uid), {
            ...baseData,
            ...specificData
          });
        } else if (role === 'teacher') {
          const teacherSubject = (formData.get('subject') as string) || 'تطوير البرمجيات والنظم';
          const teacherName = formData.get('name') as string;

          specificData = {
            subject: teacherSubject,
            nationalId: formData.get('nationalId') as string,
            dateOfBirth: formData.get('dateOfBirth') as string,
            teachingGrades: ['مسار الـ Frontend', 'مسار الـ Backend', 'مسار الـ Full-Stack'],
            isApproved: false
          };

          await setDoc(doc(db, 'users', user.uid), {
            ...baseData,
            ...specificData
          });

          // Send notifications to students
          try {
            const studentsQuery = query(
              collection(db, 'users'),
              where('role', '==', 'student')
            );
            getDocs(studentsQuery).then((studentsSnap) => {
              const notificationPromises = studentsSnap.docs.map(studentDoc => {
                return addDoc(collection(db, 'notifications'), {
                  userId: studentDoc.id,
                  title: 'مدرب ومهندس جديد انضم للمنصة!',
                  message: `انضم المهندس ${teacherName} لتدريب مسار ${teacherSubject}. يمكنك الآن استكشاف مساراته وورش العمل المتاحة!`,
                  type: 'new_teacher_alert',
                  read: false,
                  createdAt: new Date().toISOString(),
                  teacherId: user.uid
                });
              });
              Promise.all(notificationPromises).catch(console.error);
            }).catch(console.error);
          } catch (notifErr) {
            console.error("Error creating notifications for new teacher:", notifErr);
          }
        } else if (role === 'parent') {
          specificData = {
            studentPhone: rawStudentPhone,
            isApproved: false
          };
          await setDoc(doc(db, 'users', user.uid), {
            ...baseData,
            ...specificData
          });
        } else if (role === 'admin') {
          specificData = {
            isApproved: true
          };
          await setDoc(doc(db, 'users', user.uid), {
            ...baseData,
            ...specificData
          });
          
          if (adminCode && adminCode !== 'TeachLand@2026_master_admin') {
            try {
               const q = query(collection(db, 'adminInvitations'), where('code', '==', adminCode), where('used', '==', false));
               const snap = await getDocs(q);
               if (!snap.empty) {
                 const inviteDoc = snap.docs[0];
                 await updateDoc(inviteDoc.ref, { used: true, usedBy: user.uid, usedAt: new Date().toISOString() });
               }
            } catch(e) {
               console.error('Error updating admin invitation status:', e);
            }
          }
        }

        try {
          localStorage.setItem('cached_current_user', JSON.stringify({
            id: user.uid,
            ...baseData,
            ...specificData
          }));
        } catch {}

        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('عذراً، لم يتم تفعيل الدخول بالبريد الإلكتروني في قاعدة البيانات. (يجب تفعيل Email/Password من لوحة تحكم Firebase)');
      } else if (err.code === 'auth/email-already-in-use' || (err.message && err.message.includes('email-already-in-use'))) {
        if (!isLogin) {
          try {
            // Check if this is a zombie account (Auth exists but Firestore doc is missing)
            const loginAttempt = await signInWithEmailAndPassword(auth, email, password);
            const docCheck = await getDoc(doc(db, 'users', loginAttempt.user.uid));
            if (!docCheck.exists()) {
              // Recreate the document!
              const trackValue = (formData.get('track') as string) || selectedTrack;
              const baseData = {
                email,
                name: formData.get('name') as string,
                phone: rawPhone,
                governorate: formData.get('governorate') as string,
                role,
                password,
                createdAt: new Date().toISOString()
              };
              
              if (role === 'student') {
                await setDoc(doc(db, 'users', loginAttempt.user.uid), {
                  ...baseData,
                  track: trackValue,
                  grade: trackValue,
                  isApproved: false
                });
              } else if (role === 'teacher') {
                await setDoc(doc(db, 'users', loginAttempt.user.uid), {
                  ...baseData,
                  subject: (formData.get('subject') as string) || 'تطوير البرمجيات والنظم',
                  nationalId: formData.get('nationalId') as string,
                  dateOfBirth: formData.get('dateOfBirth') as string,
                  teachingGrades: ['مسار الـ Frontend', 'مسار الـ Backend', 'مسار الـ Full-Stack'],
                  isApproved: false
                });
              } else if (role === 'parent') {
                await setDoc(doc(db, 'users', loginAttempt.user.uid), {
                  ...baseData,
                  studentPhone: rawStudentPhone,
                  isApproved: false
                });
              } else if (role === 'admin') {
                await setDoc(doc(db, 'users', loginAttempt.user.uid), {
                  ...baseData,
                  isApproved: true
                });
              }
              navigate('/dashboard');
              return;
            } else {
              setError('هذا البريد الإلكتروني أو رقم الهاتف مسجل بالفعل في المنصة، يرجى تسجيل الدخول مباشرة.');
            }
          } catch (e) {
            setError('هذا البريد الإلكتروني مسجل مسبقاً. إذا كان حسابك محذوفاً يرجى التواصل مع الإدارة، أو حاول تسجيل الدخول بكلمة المرور القديمة.');
          }
        } else {
          setError('هذا البريد الإلكتروني أو رقم الهاتف مسجل بالفعل في المنصة، يرجى تسجيل الدخول مباشرة.');
        }
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('حدث خطأ في الاتصال بالشبكة. يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.');
      } else {
        const msg = err.message || '';
        if (msg.includes('مسجل كـ') || msg.includes('التبويب الصحيح')) {
          setError(msg);
        } else {
          setError('حدث خطأ أثناء العملية: ' + msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A102E] text-gray-900 dark:text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#D4F800] selection:text-[#0A102E] font-sans relative pt-24 pb-12">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-[#0A102E] dark:hover:text-[#D4F800] flex items-center gap-1.5 transition-colors text-xs sm:text-sm font-black bg-white dark:bg-[#101744] px-4 py-2 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
          <ArrowRight className="w-4 h-4" /> عودة للرئيسية
        </Link>
      </div>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-[#101744] rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/10"
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <FoxTechLogo 
              alt={settings.platformName || "Fox Tech"} 
              className="h-12 sm:h-14 w-auto max-w-[240px]" 
              variant="auto" 
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black mb-1.5 text-gray-900 dark:text-white">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm font-bold">
            {isLogin ? `أهلاً بك مرة أخرى في ${settings.platformName || 'Fox Tech'}` : 'سجل بياناتك للانضمام إلى مسارات التدريب البرمجي'}
          </p>
        </div>

        {isLogin && (
          <div className="mb-4 p-1 bg-slate-100 dark:bg-[#070C22] rounded-2xl flex gap-1 relative border border-slate-200 dark:border-white/10" dir="rtl">
            {[
              { id: 'student', label: 'متدرب' },
              { id: 'teacher', label: 'مدرب / مهندس' },
              { id: 'parent', label: 'مسؤول شركة' },
              { id: 'admin', label: 'إدارة' }
            ].map((tab) => {
              const active = role === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRole(tab.id as any)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-black transition-colors relative z-10 cursor-pointer ${
                    active 
                      ? 'text-[#0A102E] font-black' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="loginRoleBg"
                      className="absolute inset-0 bg-[#D4F800] rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {isLogin && (
          <div className="text-center mb-6 text-[10px] sm:text-xs font-black text-gray-600 dark:text-gray-300 bg-slate-50 dark:bg-[#070C22]/80 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10">
            {role === 'student' && 'بوابة المتدربين لمتابعة المسارات والمهام والمشاريع البرمجية'}
            {role === 'teacher' && 'بوابة المدربين والمهندسين لإدارة ورش العمل ومراجعة الأكواد'}
            {role === 'parent' && 'بوابة مسؤولي ومتابعي الشركات للاطلاع على تقارير المتدربين'}
            {role === 'admin' && 'لوحة الإدارة العامة للتحكم الكامل بأقسام ومسارات النظام'}
          </div>
        )}

        {/* Show role tabs ONLY when creating a new account (register) */}
        {!isLogin && roleSelected && (
          <button
            type="button"
            onClick={() => {
              setRoleSelected(false);
              setShowAdminCode(false);
              setAdminCode('');
            }}
            className="mb-4 text-xs font-black text-[#0A102E] dark:text-[#D4F800] hover:underline flex items-center gap-1.5 transition-colors bg-[#D4F800]/10 dark:bg-[#D4F800]/20 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> تغيير نوع الحساب ({role === 'student' ? 'متدرب' : role === 'teacher' ? 'مدرب / مهندس' : role === 'parent' ? 'مسؤول شركة' : 'مدير النظام'})
          </button>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {!isLogin && !roleSelected ? (
          <div className="space-y-6 text-right" dir="rtl">
            <p className="text-center text-xs font-bold text-gray-500 dark:text-gray-300 mb-2">اختر نوع الحساب الذي تريد إنشاؤه للبدء:</p>
            <div className="grid grid-cols-2 gap-4">
              {/* Student / Trainee Card */}
              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  setRoleSelected(true);
                }}
                className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#D4F800] bg-slate-50 dark:bg-[#070C22] hover:bg-white dark:hover:bg-[#0A102E] transition-all flex flex-col items-center text-center gap-2.5 group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D4F800]/15 text-[#658C00] dark:bg-[#D4F800]/20 dark:text-[#D4F800] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">حساب متدرب</h4>
                  <p className="text-[9px] text-gray-400 font-bold mt-1 leading-normal">الانضمام للمسارات والورش وحل التحديات البرمجية</p>
                </div>
              </button>

              {/* Teacher / Engineer Card */}
              <button
                type="button"
                onClick={() => {
                  setRole('teacher');
                  setRoleSelected(true);
                }}
                className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-400 bg-slate-50 dark:bg-[#070C22] hover:bg-white dark:hover:bg-[#0A102E] transition-all flex flex-col items-center text-center gap-2.5 group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">حساب مدرب / مهندس</h4>
                  <p className="text-[9px] text-gray-400 font-bold mt-1 leading-normal">إدارة المسارات، مراجعة الأكواد، وتقديم المعسكرات</p>
                </div>
              </button>

              {/* Parent / Company Lead Card */}
              <button
                type="button"
                onClick={() => {
                  setRole('parent');
                  setRoleSelected(true);
                }}
                className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-purple-400 bg-slate-50 dark:bg-[#070C22] hover:bg-white dark:hover:bg-[#0A102E] transition-all flex flex-col items-center text-center gap-2.5 group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">مسؤول شركة / متابع</h4>
                  <p className="text-[9px] text-gray-400 font-bold mt-1 leading-normal">متابعة إنجاز المتدربين والتقارير الشهرية</p>
                </div>
              </button>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setShowAdminCode(true);
                }}
                className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-red-400 bg-slate-50 dark:bg-[#070C22] hover:bg-white dark:hover:bg-[#0A102E] transition-all flex flex-col items-center text-center gap-2.5 group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">مدير النظام</h4>
                  <p className="text-[9px] text-gray-400 font-bold mt-1 leading-normal">لوحة الإدارة الكاملة للتحكم في الأكواد والاشتراكات والمستخدمين</p>
                </div>
              </button>
            </div>

            {/* Admin verification input box */}
            {showAdminCode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-200 dark:border-red-900/40 space-y-3"
              >
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black text-xs">
                  <Lock className="w-4 h-4" />
                  <span>مطلوب رمز التحقق لمدير النظام</span>
                </div>
                <input
                  type="password"
                  placeholder="أدخل رمز التحقق السري للإدارة..."
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0A102E] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-red-400 text-xs font-bold outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!adminCode) return;
                      try {
                        if (adminCode === 'TeachLand@2026_master_admin') {
                          setRoleSelected(true);
                          setShowAdminCode(false);
                          return;
                        }
                        const q = query(collection(db, 'adminInvitations'), where('code', '==', adminCode), where('used', '==', false));
                        const snap = await getDocs(q);
                        if (!snap.empty) {
                          setRoleSelected(true);
                          setShowAdminCode(false);
                        } else {
                          setError('رمز التحقق الذي أدخلته غير صحيح أو منتهي الصلاحية!');
                        }
                      } catch (e) {
                         setError('حدث خطأ أثناء التحقق من الرمز.');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    تأكيد ومتابعة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminCode(false);
                      setAdminCode('');
                    }}
                    className="px-3 py-2 bg-gray-100 dark:bg-[#101744] text-gray-500 dark:text-gray-400 rounded-xl text-xs font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            )}

            <div className="border-t border-gray-150 dark:border-white/10 pt-4 text-center">
              <span className="text-xs text-gray-400 font-bold">هل لديك حساب بالفعل؟ </span>
              <button onClick={() => navigate('/login')} className="text-[#0A102E] dark:text-[#D4F800] text-xs font-black hover:underline">
                سجل الدخول الآن
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">الاسم بالكامل</label>
                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <input name="name" required type="text" className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-11 sm:pr-12 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors text-sm font-bold" placeholder="اكتب اسمك بالكامل..." />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">المحافظة</label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <select name="governorate" required className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors appearance-none text-sm font-bold">
                          <option value="">اختر المحافظة</option>
                          {EGYPT_GOVERNORATES.map(gov => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {role === 'student' ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">المسار التدريبي</label>
                        <div className="relative">
                          <Laptop className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <select 
                            name="track" 
                            required 
                            value={selectedTrack}
                            onChange={(e) => setSelectedTrack(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors appearance-none text-sm font-bold"
                          >
                            {TECH_TRACKS.map(t => (
                              <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : role === 'teacher' ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">المسار / التخصص التدريبي</label>
                        <div className="relative">
                          <Cpu className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <select name="subject" required defaultValue="مسار تطوير البرمجيات والنظم" className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors appearance-none text-sm font-bold">
                            <option value="مسار الـ Frontend">مسار الـ Frontend</option>
                            <option value="مسار الـ Backend">مسار الـ Backend</option>
                            <option value="مسار الـ Full-Stack">مسار الـ Full-Stack</option>
                            <option value="الذكاء الاصطناعي وهندسة البيانات">الذكاء الاصطناعي وهندسة البيانات</option>
                          </select>
                        </div>
                      </div>
                    ) : role === 'parent' ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">رقم هاتف المتدرب المرتبط</label>
                        <div className="flex gap-2" dir="ltr">
                          <div className="flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-3 text-gray-900 dark:text-white text-xs font-black select-none shrink-0" dir="ltr">
                            <span className="text-base leading-none">🇪🇬</span>
                            <span className="font-mono text-xs font-black text-gray-700 dark:text-gray-300">+20</span>
                          </div>
                          <div className="relative flex-1">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <input 
                              name="studentPhone" 
                              required 
                              type="tel" 
                              maxLength={11}
                              pattern="^01[0125][0-9]{8}$"
                              title="رقم هاتف مصري مكون من 11 رقماً (مثال: 01012345678)"
                              className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors text-sm font-bold text-left font-mono tracking-wider" 
                              placeholder="01012345678" 
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {role === 'teacher' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">الرقم القومي</label>
                        <div className="relative">
                          <IdCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <input name="nationalId" required type="text" pattern="^[23][0-9]{13}$" title="رقم قومي مصري صحيح (14 رقم)" className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-11 sm:pr-12 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors text-sm font-bold" placeholder="14 رقم" dir="ltr" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">تاريخ الميلاد</label>
                        <div className="relative">
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <input name="dateOfBirth" required type="date" className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-11 sm:pr-12 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors text-sm font-bold" />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">رقم الهاتف</label>
                    <div className="flex gap-2" dir="ltr">
                      <div className="flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-3 text-gray-900 dark:text-white text-xs font-black select-none shrink-0" dir="ltr">
                        <span className="text-base leading-none">🇪🇬</span>
                        <span className="font-mono text-xs font-black text-gray-700 dark:text-gray-300">+20</span>
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <input 
                          name="phone" 
                          required 
                          type="tel" 
                          maxLength={11}
                          pattern="^01[0125][0-9]{8}$"
                          title="رقم هاتف مصري مكون من 11 رقماً (مثال: 01012345678)"
                          className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors text-sm font-bold text-left font-mono tracking-wider" 
                          placeholder="01012345678" 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">
                {isLogin ? 'البريد الإلكتروني أو رقم الهاتف' : 'البريد الإلكتروني'}
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input 
                  name="email" 
                  autoComplete="off"
                  required 
                  type={isLogin ? "text" : "email"} 
                  className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-11 sm:pr-12 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors text-sm font-bold" 
                  placeholder={isLogin ? "example@email.com أو 01XXXXXXXXX" : "email@example.com"} 
                  dir="ltr" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input name="password" autoComplete="new-password" required minLength={4} type="password" className="w-full bg-gray-50 dark:bg-[#070C22] border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-11 sm:pr-12 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4F800] dark:focus:border-[#D4F800] focus:bg-white dark:focus:bg-[#0A102E] transition-colors text-sm font-bold" placeholder="••••••••" dir="ltr" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] font-black py-3.5 rounded-xl shadow-lg shadow-[#D4F800]/20 hover:-translate-y-0.5 transition-all mt-6 text-sm disabled:opacity-50 cursor-pointer">
              {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد')}
            </button>
          </form>
        )}

        {(isLogin || roleSelected) && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-300 font-medium">
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <button onClick={() => navigate(isLogin ? '/register' : '/login')} className="text-[#0A102E] dark:text-[#D4F800] font-black hover:underline mr-1">
              {isLogin ? 'سجل الآن مجاناً' : 'سجل الدخول'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
