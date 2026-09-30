import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { usePlatformSettings } from '../context/PlatformSettingsContext';

export default function FloatingWhatsappButton() {
  const location = useLocation();
  const { settings } = usePlatformSettings();

  // Show only on the platform landing page / portfolio ('/')
  if (location.pathname !== '/' || settings?.isFloatingWhatsappEnabled === false) {
    return null;
  }

  const whatsappNum = settings?.floatingWhatsappNumber || '201034859313';

  const handleWhatsappClick = () => {
    const sanitizedNumber = whatsappNum.replace(/\D/g, '');
    const message = encodeURIComponent('مرحباً، أود الاستفسار بخصوص المسارات والخدمات في أكاديمية فوكس تك');
    const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {/* Tooltip Label */}
      <div className="hidden sm:flex items-center px-3 py-1.5 bg-slate-900/95 text-white text-xs font-bold rounded-xl shadow-xl border border-slate-800 backdrop-blur-md">
        <span>تواصل معنا عبر واتساب</span>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleWhatsappClick}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 relative group"
        aria-label="تواصل معنا عبر واتساب"
        title="تواصل معنا عبر واتساب"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25" />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </button>
    </div>
  );
}
