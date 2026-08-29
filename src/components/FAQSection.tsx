import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePlatformSettings } from '../context/PlatformSettingsContext';

const defaultFaqs = [
  {
    question: "كيف يمكنني الوصول إلى الكورسات التي اشتركت بها؟",
    answer: "يمكنك الوصول إلى الكورسات التي اشتركت بها من خلال قسم 'موادي' في القائمة الجانبية أو السفلية. ستجد هناك جميع الكورسات الخاصة بك."
  },
  {
    question: "لماذا لا يعمل الفيديو أو يظهر شاشة سوداء؟",
    answer: "تأكد من استقرار اتصالك بالإنترنت. إذا استمرت المشكلة، جرب تحديث الصفحة أو استخدام متصفح مختلف. بعض الفيديوهات قد تتطلب بضع ثوانٍ للتحميل في البداية."
  },
  {
    question: "كيف يمكنني تغيير كلمة المرور أو تحديث بياناتي؟",
    answer: "يمكنك تحديث بياناتك الشخصية وتغيير كلمة المرور من خلال الانتقال إلى صفحة الإعدادات عبر الضغط على صورتك الشخصية في أعلى الشاشة واختيار 'الملف الشخصي'."
  },
  {
    question: "ماذا أفعل إذا واجهت مشكلة في الدفع؟",
    answer: "إذا واجهت أي مشكلة أثناء عملية الدفع أو شحن الرصيد، يرجى التواصل مع فريق الدعم الفني وتزويدهم برقم العملية المرجعي للمساعدة الفورية."
  },
  {
    question: "هل يمكنني مشاهدة الدروس أوفلاين (بدون إنترنت)؟",
    answer: "في الوقت الحالي، مشاهدة الدروس تتطلب اتصالاً بالإنترنت لحماية المحتوى وضمان جودة المشاهدة، ولكننا نعمل على توفير خيارات إضافية في المستقبل."
  }
];

export default function FAQSection() {
  const { settings } = usePlatformSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeFaqs = (settings.customFaqs && settings.customFaqs.length > 0)
    ? settings.customFaqs.map(f => ({ question: f.q, answer: f.a }))
    : defaultFaqs;

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{settings.faqTitle || 'الأسئلة الشائعة'}</h2>
        <p className="text-gray-600 dark:text-gray-400">{settings.faqSubtitle || 'إجابات سريعة للأسئلة الأكثر شيوعاً لمساعدتك في استخدام المنصة.'}</p>
      </div>

      <div className="space-y-4">
        {activeFaqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#1E2433] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleOpen(index)}
              className="w-full text-right px-6 py-4 flex items-center justify-between focus:outline-none hover:bg-slate-50 dark:hover:bg-[#151B28] transition-colors"
            >
              <span className="font-black text-gray-900 dark:text-white text-base sm:text-lg">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-[#658C00] dark:text-[#D4F800] shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 pt-2 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0F1117]/60 text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base font-medium">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gray-50 dark:bg-[#1E2433] rounded-2xl p-6 text-center border border-slate-200 dark:border-white/10">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">لم تجد إجابة لسؤالك؟</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">فريق الدعم متاح دائماً لمساعدتك على مدار الساعة.</p>
        <a 
          href="https://wa.me/201034859313" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 bg-[#D4F800] hover:bg-[#c2e400] text-[#0A102E] px-8 py-3 rounded-xl font-black transition-all shadow-md cursor-pointer"
        >
          تواصل مع الدعم الفني ⚡
        </a>
      </div>
    </div>
  );
}
