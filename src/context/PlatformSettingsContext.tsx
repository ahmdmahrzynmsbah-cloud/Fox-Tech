import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PlatformSettings } from '../types';

export const defaultSettings: PlatformSettings = {
  platformName: 'Fox Tech',
  logoChar: 'FOX',
  heroTitle: 'منصة التدريب والتطوير التقني وتأهيل مهندسي البرمجيات',
  heroSubtitle: 'مسارات تدريبية احترافية في مجالات الـ Frontend والـ Backend وهندسة النظم السحابية والذكاء الاصطناعي مع مشاريع واقعية ومراجعات أكواد مستمرة.',
  showGradesSection: true,
  showSubjectsSection: true,
  showFeaturesSection: true,
  showFaqSection: true,
  showQuduratSection: false,
  showTahsiliSection: false,
  enableQuduratTahsili: false,
  gradesTitle: 'مسارات التدريب التقني المعتمدة',
  gradesSubtitle: 'اختر مسارك البرمجي وانطلق في تجربة تدريبية عملية تركز على المهارات المطلوبة في كبرى شركات التقنية.',
  featuresBadge: 'بيئة التدريب والتأهيل البرمجي الأولى - Fox Tech',
  featuresTitle: 'منظومة تدريبية متكاملة لتطوير كفاءة المهندسين والمبرمجين',
  featuresSubtitle: 'تطبيق عملي فوري، مراجعة دقيقة للأكواد (Code Reviews)، مشاريع محاكاة لبيئات العمل الواقعية، وتوجيه مستمر.',
  featuresListTitle: 'لماذا يختار المطورون والشركات منصة Fox Tech؟',
  featuresList: [
    { id: '1', iconName: 'Laptop', title: 'مشاريع برمجية حقيقية للإنتاج', desc: 'تطبيق مباشر على بناء أنظمة وتطبيقات كاملة تُحاكي بيئات العمل الواقعية في الشركات التقنية.' },
    { id: '2', iconName: 'Target', title: 'جلسات مراجعة الأكواد (Code Reviews)', desc: 'فحص دوري ودقيق لجودة الكود، الأداء، الأمان، وتطبيق أفضل الممارسات الهندسية (Clean Code).' },
    { id: '3', iconName: 'FileText', title: 'مستودعات وتوثيق شامل للـ Architecture', desc: 'أكواد مصدرية منظمة، ملفات توثيق هندسية، ودلائل تقنية قابلة للمرجعية والتطوير.' },
    { id: '4', iconName: 'HelpCircle', title: 'إشراف وتوجيه مباشر من كبار المهندسين', desc: 'جلسات استشارية ونقاشات تقنية مع خبراء البرمجيات لحل التحديات وتوجيه المسار المهني.' },
    { id: '5', iconName: 'BarChart3', title: 'تقارير أداء ومؤشرات كفاءة برمجية', desc: 'لوحة قيادة تفاعلية ترصد سرعة الإنجاز، جودة المخرجات، ونسب اجتياز التحديات البرمجية.' },
    { id: '6', iconName: 'Trophy', title: 'شهادات إتمام مسار وتأهيل لسوق العمل', desc: 'تقييم شامل في نهاية كل مسار تدريبي مع شهادات معتمدة توثق الكفاءات المكتسبة.' }
  ],
  journeyTitle: 'خارطة طريقك من البدايات إلى الاحتراف الهندسي',
  journeySteps: [
    { id: '1', title: 'استيعاب البنية المعمارية والمفاهيم', desc: 'دراسة المفاهيم الهندسية، أساسيات اللغات، وأحدث المكتبات والأطر التقنية الحديثة.' },
    { id: '2', title: 'بناء المشاريع والأنظمة المتكاملة', desc: 'كتابة الأكواد وتطوير واجهات المستخدم وربط الخوادم وقواعد البيانات عملياً.' },
    { id: '3', title: 'مراجعة الكود وتحسين الأداء والأمان', desc: 'جلسات Code Review مكثفة وتطبيق معايير الاختبارات الآلية (Testing) والحماية.' },
    { id: '4', title: 'النشر السحابي والجاهزية الاحترافية', desc: 'نشر التطبيقات على السحابة مع معايير الـ CI/CD والجاهزية التامة لبيئات العمل الإنتاجية.' }
  ],
  statsCounters: [
    { id: '1', value: 50, suffix: 'K+', label: 'سطر كود وتحدي برمجي' },
    { id: '2', value: 95, suffix: '%', label: 'نسبة رضا المتدربين والشركات' },
    { id: '3', value: 100, suffix: '%', label: 'مشاريع وتطبيقات واقعية' },
    { id: '4', value: 4.9, suffix: '', label: 'تقييم المسارات والمعسكرات' }
  ],
  subjectsTitle: 'المسارات التقنية والمجالات التخصصية',
  subjectsSubtitle: 'مسارات شاملة تُغطي هندسة الواجهات، الخوادم، قواعد البيانات، والذكاء الاصطناعي.',
  faqTitle: 'الأسئلة الشائعة حول برامج التدريب',
  faqSubtitle: 'كل ما تحتاج لمعرفته حول مسارات التدريب التقني والمشاريع في Fox Tech',
  vodafoneCashNumber: '01034859313',
  isVodafoneCashEnabled: true,
  instapayHandle: '',
  isInstapayEnabled: true,
  bankAccountDetails: '',
  isBankAccountEnabled: true,
  customPaymentMethods: [],
  subjects: [
    { id: 'frontend', title: 'تطوير الواجهات (Frontend - React & TS)', iconName: 'Laptop', color: 'bg-blue-600/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300' },
    { id: 'backend', title: 'هندسة الخوادم (Backend - Node & Express)', iconName: 'Cpu', color: 'bg-emerald-600/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300' },
    { id: 'fullstack', title: 'النظم المتكاملة (Full-Stack Architecture)', iconName: 'Globe', color: 'bg-indigo-600/15 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' },
    { id: 'databases', title: 'قواعد البيانات والسحابة (Cloud & Databases)', iconName: 'BookOpen', color: 'bg-amber-600/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300' },
    { id: 'ai', title: 'هندسة الذكاء الاصطناعي وتطبيقاته (AI & LLMs)', iconName: 'Zap', color: 'bg-teal-600/15 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300' },
    { id: 'cyber', title: 'الأمن السيبراني وحماية النظم (Cybersecurity)', iconName: 'Shield', color: 'bg-sky-600/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300' },
    { id: 'mobile', title: 'تطوير تطبيقات الهواتف (Mobile Apps)', iconName: 'Languages', color: 'bg-rose-600/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300' },
    { id: 'devops', title: 'الـ DevOps والتشغيل السحابي (CI/CD & Cloud)', iconName: 'Trophy', color: 'bg-purple-600/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300' }
  ],
  customFaqs: [
    {
      id: '1',
      q: 'ما هي طبيعة التدريب في منصة Fox Tech؟',
      a: 'نقدم تدريباً تقنياً عملياً مكثفاً يركز على التطبيق البرمجي والمشاريع الواقعية في مجالات Frontend وBackend والأنظمة السحابية والـ AI تحت إشراف مهندسين محترفين.'
    },
    {
      id: '2',
      q: 'هل المسارات التدريبية مناسبة للمبتدئين والمتوسطين؟',
      a: 'نعم، المسارات تبدأ من المفاهيم الأساسية وتتدرج خطوة بخطوة وصولاً إلى بناء وتصميم الأنظمة المؤسسية الضخمة (Enterprise Systems) مع ورش عمل تطبيقية.'
    },
    {
      id: '3',
      q: 'كيف تتم متابعة الأداء ومراجعة المشاريع البرمجية؟',
      a: 'يقوم المدربون التقنيون بعمل مراجعات دورية للأكواد (Code Reviews) وتقديم تقارير توجيهية دقيقة لمساعدة المتدرب على اتباع أعلى معايير الجودة والأمان.'
    },
    {
      id: '4',
      q: 'هل أحصل على ملفات التوثيق والأكواد المصدرية؟',
      a: 'نعم، يحصل المتدرب على كود المصدر (Source Code) لكل مشروع، بجانب ملفات التوثيق والشروحات الهندسية الكاملة لمراجعتها في أي وقت.'
    }
  ],
  contactPhone: '01034859313',
  floatingWhatsappNumber: '201034859313',
  isFloatingWhatsappEnabled: false,
  contactEmail: 'fox.tech7777@gmail.com',
  contactAddress: 'منصة Fox Tech للتدريب والتطوير التقني وتأهيل المطورين',
  socialLinks: {
    facebook: '#',
    twitter: '#',
    youtube: '#',
    instagram: '#'
  },
  logoUrl: '',
  quduratVideoUrl: '',
  tahsiliVideoUrl: '',
  quduratVideoProvider: 'youtube',
  tahsiliVideoProvider: 'youtube',
  quduratVideoTitle: 'الفيديو التعريفي لمسار الـ Frontend',
  tahsiliVideoTitle: 'الفيديو التعريفي لمسار الـ Backend',
  quduratVideoPoster: '',
  tahsiliVideoPoster: '',
  heroVideoUrl: '',
  heroVideoProvider: 'youtube',
  heroVideoTitle: 'الفيديو التعريفي لمنصة Fox Tech للتدريب التقني',
  heroVideoPoster: '',
  heroAudienceTitle: 'لتأهيل وتطوير مهندسي البرمجيات (Frontend & Backend)',
  heroLaunchTitle: 'دفعات تدريبية مستمرة ومشروعات واقعية',
  heroLaunchTime: 'محاضرات تدريبية وCode Reviews أسبوعية',
  heroCurriculumNote: 'تدريب تطبيقي مكثف + مشاريع إنتاجية حقيقية + مراجعة أكواد بإشراف كبار المهندسين',
  heroContentTitle: 'محاور التدريب',
  heroContentBadge: 'Tech Tracks 2026',
  heroContentItems: [
    'تطوير واجهات المستخدم التفاعلية (Frontend: React, TypeScript, Tailwind)',
    'بناء الأنظمة والواجهات الخلفية (Backend: Node.js, Express, REST APIs)',
    'قواعد البيانات وإدارة البيانات السحابية (SQL, PostgreSQL, Firestore)',
    'هندسة التطبيقات المتكاملة (Full-Stack Architecture)',
    'الأمن السيبراني وحماية التطبيقات والشبكات (Cybersecurity & Auth)',
    'دمج نماذج الذكاء الاصطناعي وتطبيقات الـ AI الحديثة'
  ],
  heroDateDay: '2026',
  heroDateMonthYear: 'TECH ACADEMY',
  heroDateTime: 'مسارات وتطبيقات عملية',
  heroDateTag: 'شامل المشاريع والتطبيق',
  privacyPolicyText: `مرحباً بك في سياسة الخصوصية الخاصة بمنصة Fox Tech للتدريب التقني. خصوصيتك وأمان بياناتك هي أهم أولوياتنا.

١. البيانات التي نقوم بجمعها:
نقوم بجمع البيانات الأساسية اللازمة لإنشاء حسابك التدريبي وتشمل: الاسم، البريد الإلكتروني، ورقم الهاتف، والمسارات البرمجية المسجل بها.

٢. كيف نستخدم بياناتك ونحميها؟
تُستخدم البيانات لتقديم تجربة تدريبية مخصصة، ومتابعة تقدمك في المشاريع البرمجية، وجميع البيانات مشفرة بالكامل عبر خوادم مأمنة.

٣. سرية المعلومات:
نلتزم التزاماً تاماً بعدم بيع أو مشاركة أي من بياناتك مع أي جهات خارجية.

٤. أمان العمليات والاشتراكات:
تتم جميع العمليات المالية والاشتراكات عبر قنوات معتمدة وتخضع لأعلى معايير الأمان الرقمي.`,
  termsConditionsText: `باستخدامك لمنصة Fox Tech، فإنك توافق على الالتزام الكامل بالشروط والأحكام التالية لضمان بيئة تدريبية احترافية ومثمرة لجميع المطورين.

١. شروط الاستخدام والحسابات:
المنصة مخصصة للاستخدام الشخصي للمتدرب. يحق لكل متدرب حساب واحد فقط ويمنع مشاركة بيانات الدخول.

٢. المحتوى التدريبي والمشاريع:
توفر المنصة محتوى تقني وتدريبي عالي الجودة ومشاريع عملية تكون متاحة للمتدرب خلال فترة تدريبه.

٣. قواعد السلوك المهني:
يُشترط الالتزام بالاحترام المتبادل في مساحات النقاش البرمجي وقنوات الدعم الفني.

٤. النزاهة في تسليم المشاريع:
يجب أن تعكس المشاريع والواجبات البرمجية المرفوعة مجهود المتدرب الفعلي لتحقيق أقصى استفادة تعليمية.`,
  intellectualPropertyText: `الملكية الفكرية لمنصة Fox Tech محمية بموجب القوانين واللوائح النافذة.

١. حقوق المحتوى والمشاريع:
جميع الفيديوهات التوضيحية والمشاريع المكتوبة والمحتوى التدريبي هي ملكية فكرية حصرية للمنصة والمدربين.

٢. الحظر القانوني:
يُحظر إعادة بيع أو نشر المواد التدريبية خارج المنصة دون إذن خطي مسبق.

٣. استخدام الأكواد المصدرية:
الأكواد التدريبية مخصصة لتعلم وتطوير مهارات المتدرب وبناء معرض أعماله الشخصي.`
};

export const getFontFamilyCSS = (fontName?: string) => {
  switch (fontName) {
    case 'Alan Sans':
      return '"Alan Sans", "IBM Plex Sans Arabic", sans-serif';
    case 'IBM Plex Sans Arabic':
      return '"IBM Plex Sans Arabic", "Alan Sans", sans-serif';
    case 'Tajawal':
      return '"Tajawal", "IBM Plex Sans Arabic", sans-serif';
    case 'Cairo':
      return '"Cairo", "Tajawal", sans-serif';
    default:
      return '"Alan Sans", "IBM Plex Sans Arabic", "Tajawal", sans-serif';
  }
};

const sanitizeSettings = (raw: any): PlatformSettings => {
  const full = { ...defaultSettings, ...raw } as PlatformSettings;
  if (full.statsCounters && Array.isArray(full.statsCounters)) {
    full.statsCounters = full.statsCounters.map(stat => {
      if (
        (stat.label && (stat.label.includes('تقييم') || stat.label.includes('المنصة'))) ||
        stat.id === '4' ||
        stat.value === 4.9 ||
        (Number(stat.value) === 4 && (stat.suffix === '.9' || stat.suffix === '9'))
      ) {
        return { ...stat, value: 4.1, suffix: '', label: stat.label || 'تقييم المنصة' };
      }
      if (
        (stat.label && (stat.label.includes('رضا') || stat.label.includes('تفوق') || stat.label.includes('النجاح'))) ||
        stat.id === '2' ||
        stat.value === 99 ||
        stat.value === 98
      ) {
        return { ...stat, value: 92, suffix: '%', label: 'نسبة رضا الطلاب' };
      }
      return stat;
    });
  }
  return full;
};

interface PlatformSettingsContextType {
  settings: PlatformSettings;
  loading: boolean;
  updateSettings: (newSettings: PlatformSettings) => Promise<void>;
}

const PlatformSettingsContext = createContext<PlatformSettingsContextType>({
  settings: defaultSettings,
  loading: true,
  updateSettings: async () => {},
});

export const usePlatformSettings = () => useContext(PlatformSettingsContext);

export const PlatformSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
      const cached = localStorage.getItem('cached_platform_settings');
      if (cached) {
        return sanitizeSettings(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Could not load platform settings from localStorage:", e);
    }
    return defaultSettings;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'platform_settings', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        const rawData = docSnap.data();
        const fullSettings = sanitizeSettings(rawData);
        setSettings(fullSettings);
        try {
          localStorage.setItem('cached_platform_settings', JSON.stringify(fullSettings));
        } catch (e) {
          console.warn("Could not cache platform settings to localStorage:", e);
        }
        // If Firestore had old stats (e.g. 4.9 rating or 99%/98% satisfaction), silently sync sanitized settings
        const hasOutdatedStats = rawData.statsCounters?.some((s: any) => 
          (s.label?.includes('تقييم') && (s.value === 4.9 || s.suffix === '.9')) ||
          s.value === 4.9 ||
          ((s.label?.includes('رضا') || s.label?.includes('تفوق') || s.label?.includes('النجاح')) && (s.value === 99 || s.value === 98))
        );
        if (hasOutdatedStats) {
          setDoc(doc(db, 'platform_settings', 'config'), fullSettings, { merge: true }).catch(console.error);
        }
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching platform settings:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const fontCss = getFontFamilyCSS(settings.fontFamily);
    document.documentElement.style.setProperty('--platform-font-family', fontCss);
  }, [settings.fontFamily]);

  const updateSettings = async (newSettings: PlatformSettings) => {
    // Optimistic update + local cache
    setSettings(newSettings);
    try {
      localStorage.setItem('cached_platform_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn("Could not cache updated settings:", e);
    }
    try {
      await setDoc(doc(db, 'platform_settings', 'config'), newSettings);
    } catch (error) {
      console.error("Error updating settings in Firestore:", error);
      throw error;
    }
  };

  return (
    <PlatformSettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </PlatformSettingsContext.Provider>
  );
};
