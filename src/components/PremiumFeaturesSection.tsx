import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { usePlatformSettings } from '../context/PlatformSettingsContext';

const AnimatedCounter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const isDecimal = !Number.isInteger(value);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const steps = duration / 16;
    const increment = value / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? parseFloat(start.toFixed(1)) : Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, isDecimal]);

  const displayCount = isDecimal ? count.toFixed(1) : count;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-[#101744] border border-slate-200/80 dark:border-[#D4F800]/15 shadow-lg shadow-slate-900/5 dark:shadow-black/40">
      <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-[#D4F800] mb-2 font-mono" dir="ltr">
        {displayCount}{suffix}
      </div>
      <div className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-300">{label}</div>
    </div>
  );
};

export default function PremiumFeaturesSection() {
  const { settings } = usePlatformSettings();

  const defaultFeatures = [
    {
      id: "1",
      iconName: "Laptop",
      title: "مشاريع برمجية حقيقية للإنتاج",
      desc: "تطبيق مباشر على بناء أنظمة وتطبيقات متكاملة تُحاكي بيئات العمل الواقعية في كبرى الشركات التقنية.",
    },
    {
      id: "2",
      iconName: "Target",
      title: "جلسات مراجعة الأكواد (Code Reviews)",
      desc: "فحص دوري ودقيق لجودة الكود، الأداء، الأمان، وتطبيق أفضل الممارسات الهندسية (Clean Code).",
    },
    {
      id: "3",
      iconName: "BarChart3",
      title: "تحليلات متقدمة ومؤشرات أداء المطور",
      desc: "تتبع دقيق لسرعة الإنجاز وجودة المعمارية البرمجية ونسب حل التحديات والخوارزميات.",
    },
    {
      id: "4",
      iconName: "FileText",
      title: "مستودعات وتوثيق شامل للـ Architecture",
      desc: "أكواد مصدرية منظمة، ملفات توثيق هندسية، ودلائل تقنية قابلة للمرجعية والتطوير المستمر.",
    },
    {
      id: "5",
      iconName: "HelpCircle",
      title: "إشراف وتوجيه مباشر من كبار المهندسين",
      desc: "جلسات استشارية ونقاشات تقنية مع خبراء البرمجيات لحل التحديات وتوجيه المسار المهني.",
    },
    {
      id: "6",
      iconName: "Trophy",
      title: "شهادات إتمام مسار وتأهيل لسوق العمل",
      desc: "تقييم شامل في نهاية كل مسار تدريبي مع شهادات معتمدة توثق الكفاءات المكتسبة.",
    }
  ];

  const defaultJourneySteps = [
    { id: "1", title: "استيعاب البنية المعمارية والمفاهيم", desc: "دراسة المفاهيم الهندسية، أساسيات اللغات، وأحدث المكتبات والأطر التقنية الحديثة." },
    { id: "2", title: "بناء المشاريع والأنظمة المتكاملة", desc: "كتابة الأكواد وتطوير واجهات المستخدم وربط الخوادم وقواعد البيانات عملياً." },
    { id: "3", title: "مراجعة الكود وتحسين الأداء والأمان", desc: "جلسات Code Review مكثفة وتطبيق معايير الاختبارات الآلية (Testing) والحماية." },
    { id: "4", title: "النشر السحابي والجاهزية الاحترافية", desc: "نشر التطبيقات على السحابة مع معايير الـ CI/CD والجاهزية التامة لبيئات العمل الإنتاجية." }
  ];

  const defaultStats = [
    { id: "1", value: 50, suffix: "K+", label: "سطر كود وتحدي برمجي" },
    { id: "2", value: 95, suffix: "%", label: "نسبة رضا المتدربين والشركات" },
    { id: "3", value: 100, suffix: "%", label: "مشاريع وتطبيقات واقعية" },
    { id: "4", value: 4.9, suffix: "", label: "تقييم المسارات والمعسكرات" }
  ];

  const activeFeatures = settings.featuresList && settings.featuresList.length > 0 ? settings.featuresList : defaultFeatures;
  const activeJourneySteps = settings.journeySteps && settings.journeySteps.length > 0 ? settings.journeySteps : defaultJourneySteps;
  const rawStats = settings.statsCounters && settings.statsCounters.length > 0 ? settings.statsCounters : defaultStats;
  const activeStats = rawStats.map(stat => {
    if (
      (stat.label && (stat.label.includes('تقييم') || stat.label.includes('المنصة'))) ||
      stat.id === '4' ||
      stat.value === 4.9 ||
      (Number(stat.value) === 4 && (stat.suffix === '.9' || stat.suffix === '9'))
    ) {
      return {
        ...stat,
        value: 4.1,
        suffix: '',
        label: stat.label || 'تقييم المنصة'
      };
    }
    if (
      (stat.label && (stat.label.includes('رضا') || stat.label.includes('تفوق') || stat.label.includes('النجاح'))) ||
      stat.id === '2' ||
      stat.value === 99 ||
      stat.value === 98
    ) {
      return {
        ...stat,
        value: 92,
        suffix: '%',
        label: 'نسبة رضا الطلاب'
      };
    }
    return stat;
  });

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
    return <IconComponent className="w-7 h-7 stroke-[2.2] text-[#182672] dark:text-[#D4F800] group-hover:text-[#0A102E] dark:group-hover:text-[#0A102E] transition-colors duration-300" />;
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-24 lg:py-28 relative overflow-hidden bg-slate-50 dark:bg-[#0A102E] text-slate-900 dark:text-white dir-rtl border-b border-slate-200 dark:border-white/10" dir="rtl">
      {/* Background Gradients & Shapes (Navy & Volt Glows) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/15 dark:bg-[#182672]/35 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4F800]/10 dark:bg-[#D4F800]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 sm:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4F800]/15 dark:bg-[#D4F800]/15 border border-[#D4F800]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#D4F800]" />
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-[#D4F800]">{settings.featuresBadge || 'المنصة الأولى لطلاب البكالوريا 🎓'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-slate-900 dark:text-white">
              {settings.featuresTitle || 'بيئة تعليمية متكاملة لضمان تفوقك في البكالوريا'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              {settings.featuresSubtitle || 'شروحات مبسطة، تدريبات بعد كل درس، مذكرات PDF، ومتابعة دراسية دقيقة تؤهلك لحصد أعلى الدرجات.'}
            </p>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="mb-24 sm:mb-32">
           <div className="text-center mb-12 sm:mb-16">
             <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">{settings.featuresListTitle || 'لماذا يختار طلاب البكالوريا منصتنا؟'}</h3>
           </div>
           
           <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-50px" }}
             variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
             }}
             className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
           >
              {activeFeatures.map((feature, i) => (
                 <motion.div
                    key={feature.id || i}
                    variants={{
                       hidden: { opacity: 0, y: 30 },
                       visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                    className="group relative p-8 rounded-3xl bg-white dark:bg-[#101744] border border-slate-200/80 dark:border-[#D4F800]/15 hover:border-[#D4F800] dark:hover:border-[#D4F800] shadow-xl shadow-slate-900/5 dark:shadow-black/40 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                 >
                    {/* Centered clearly visible icon box */}
                    <div className="w-14 h-14 rounded-2xl bg-[#D4F800]/15 dark:bg-[#D4F800]/15 border border-[#D4F800]/30 flex items-center justify-center mb-6 shadow-md shadow-[#D4F800]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D4F800]">
                       {renderIcon(feature.iconName)}
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-[#D4F800] dark:group-hover:text-[#D4F800] transition-colors">{feature.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{feature.desc}</p>
                 </motion.div>
              ))}
           </motion.div>
        </div>

        {/* Animated Statistics */}
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(activeStats.length, 4)} gap-4 md:gap-6 mb-24 sm:mb-32 relative z-20`}>
           {activeStats.map((stat, i) => (
             <AnimatedCounter key={stat.id || i} value={stat.value} suffix={stat.suffix} label={stat.label} />
           ))}
        </div>

        {/* Interactive Timeline Journey */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-16">
             <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">{settings.journeyTitle || 'رحلتك نحو احتراف البرمجة والتفوق'}</h3>
           </div>
           
           <div className="relative border-r-2 border-[#D4F800]/30 dark:border-[#D4F800]/30 pr-8 md:pr-0 md:border-r-0">
              {/* Desktop Center Line */}
              <div className="hidden md:block absolute top-0 bottom-0 right-1/2 translate-x-px w-0.5 bg-[#D4F800]/30 dark:bg-[#D4F800]/30"></div>
              
              <div className="space-y-10 md:space-y-16">
                 {activeJourneySteps.map((step, i) => (
                    <motion.div 
                       key={step.id || i}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-50px" }}
                       transition={{ duration: 0.6, delay: i * 0.15 }}
                       className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                       <div className="md:w-1/2 w-full text-right md:px-12 relative">
                          <div className="md:hidden absolute top-1/2 -right-[41px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#D4F800] ring-4 ring-[#D4F800]/30"></div>
                          <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#D4F800] ring-8 ring-white dark:ring-[#0A102E] ${i % 2 === 0 ? '-left-[9px]' : '-right-[9px]'}`}></div>
                          
                          <div className="p-6 rounded-3xl bg-white dark:bg-[#101744] border border-slate-200/80 dark:border-[#D4F800]/15 hover:border-[#D4F800] shadow-xl shadow-slate-900/5 dark:shadow-black/40 hover:-translate-y-1 transition-all duration-300">
                             <div className="text-slate-900 dark:text-[#D4F800] font-black text-lg mb-2">٠{i + 1}</div>
                             <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h4>
                             <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                          </div>
                       </div>
                       <div className="md:w-1/2 hidden md:block"></div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
