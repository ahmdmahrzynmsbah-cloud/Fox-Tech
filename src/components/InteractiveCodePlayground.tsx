import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Maximize2, Minimize2, Copy, Check, Download, 
  Smartphone, Tablet, Monitor, Code2, Terminal, FileCode, Sparkles, 
  Columns, Rows, Trash2, Eye, ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface InteractiveCodePlaygroundProps {
  lessonId: string;
  lessonTitle: string;
  initialHtml: string;
  initialCss: string;
  initialJs: string;
  previewNote?: string;
}

export const InteractiveCodePlayground: React.FC<InteractiveCodePlaygroundProps> = ({
  lessonId,
  lessonTitle,
  initialHtml,
  initialCss,
  initialJs,
  previewNote
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [cssCode, setCssCode] = useState(initialCss);
  const [jsCode, setJsCode] = useState(initialJs);
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layout, setLayout] = useState<'split' | 'stacked'>('split');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: 'log' | 'error' | 'warn'; text: string; time: string }>>([]);
  const [showConsole, setShowConsole] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync when initial values change
  useEffect(() => {
    setHtmlCode(initialHtml);
    setCssCode(initialCss);
    setJsCode(initialJs);
    setPreviewKey(prev => prev + 1);
  }, [initialHtml, initialCss, initialJs, lessonId]);

  // Handle Tab key in textarea for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentCode = getCurrentCode();
      const newCode = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
      setCurrentCode(newCode);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const getCurrentCode = () => {
    if (activeTab === 'html') return htmlCode;
    if (activeTab === 'css') return cssCode;
    return jsCode;
  };

  const setCurrentCode = (value: string) => {
    if (activeTab === 'html') setHtmlCode(value);
    else if (activeTab === 'css') setCssCode(value);
    else setJsCode(value);
    setPreviewKey(prev => prev + 1);
  };

  // Reset to initial code
  const handleReset = () => {
    setHtmlCode(initialHtml);
    setCssCode(initialCss);
    setJsCode(initialJs);
    setConsoleLogs([]);
    setPreviewKey(prev => prev + 1);
    toast.success('تمت إعادة ضبط كود المحرر للنسخة الأصلية!');
  };

  // Copy current code
  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    toast.success(`تم نسخ كود ${activeTab.toUpperCase()} بنجاح!`);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export full HTML document
  const handleDownload = () => {
    const fullHtml = generateFullDocument();
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `foxtech-${lessonId}-code.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('تم تحميل ملف المشروع HTML كاملاً بنجاح!');
  };

  // Listen to messages from iframe console capture
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === `foxtech-sandbox-${lessonId}`) {
        const time = new Date().toLocaleTimeString('ar-EG', { hour12: false });
        setConsoleLogs(prev => [...prev.slice(-49), {
          type: event.data.type || 'log',
          text: event.data.message || '',
          time
        }]);
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [lessonId]);

  // Generate sandbox document with console interceptor
  const generateFullDocument = () => {
    const consoleInterceptor = `
      <script>
        (function() {
          const originId = 'foxtech-sandbox-${lessonId}';
          const originalLog = console.log;
          const originalWarn = console.warn;
          const originalError = console.error;

          function formatArgs(args) {
            return Array.from(args).map(arg => {
              if (typeof arg === 'object') {
                try { return JSON.stringify(arg, null, 2); } catch(e) { return String(arg); }
              }
              return String(arg);
            }).join(' ');
          }

          console.log = function() {
            window.parent.postMessage({ source: originId, type: 'log', message: formatArgs(arguments) }, '*');
            originalLog.apply(console, arguments);
          };
          console.warn = function() {
            window.parent.postMessage({ source: originId, type: 'warn', message: formatArgs(arguments) }, '*');
            originalWarn.apply(console, arguments);
          };
          console.error = function() {
            window.parent.postMessage({ source: originId, type: 'error', message: formatArgs(arguments) }, '*');
            originalError.apply(console, arguments);
          };
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ source: originId, type: 'error', message: 'خطأ: ' + msg + ' (سطر: ' + line + ')' }, '*');
            return false;
          };
        })();
      </script>
    `;

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lessonTitle} - Fox Tech</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 16px;
      color: #f8fafc;
      background-color: #0f172a;
    }
    ${cssCode}
  </style>
  ${consoleInterceptor}
</head>
<body>
  ${htmlCode}
  <script>
    try {
      ${jsCode}
    } catch(err) {
      console.error('حدث استثناء في الكود:', err.message);
    }
  </script>
</body>
</html>`;
  };

  // Generate line numbers
  const currentLines = getCurrentCode().split('\n');
  const lineCount = Math.max(currentLines.length, 12);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Width mapping for device preview
  const getDeviceWidthClass = () => {
    switch (deviceView) {
      case 'mobile': return 'max-w-[375px] mx-auto shadow-2xl border-x border-slate-700';
      case 'tablet': return 'max-w-[768px] mx-auto shadow-2xl border-x border-slate-700';
      default: return 'w-full';
    }
  };

  return (
    <div className={`transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto flex flex-col justify-between' 
        : 'relative w-full rounded-2xl border border-emerald-500/30 bg-slate-950/90 shadow-2xl overflow-hidden'
    }`}>
      {/* Top Main Toolbar */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Title and Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-white tracking-wide">
                محرر ومحاكي الكود الحي (Live IDE)
              </h4>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                معاينة مباشرة
              </span>
            </div>
            {previewNote && (
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 line-clamp-1">{previewNote}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Layout Toggle */}
          <div className="hidden md:flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => setLayout('split')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                layout === 'split' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="عرض جنباً إلى جنب"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('stacked')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                layout === 'stacked' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="عرض عمودي"
            >
              <Rows className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Code */}
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer active:scale-95"
            title="استعادة الكود الأصلي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>

          {/* Download Project */}
          <button
            type="button"
            onClick={handleDownload}
            className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-bold items-center gap-1.5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer active:scale-95"
            title="تحميل كود المشروع HTML كاملاً"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير HTML</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
              isFullscreen 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
            title={isFullscreen ? 'تصغير الشاشة' : 'تكبير الشاشة ملء الواجهة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Split Grid (Editor + Live Preview) */}
      <div className={`p-3 sm:p-4 grid gap-4 ${
        layout === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
      }`}>
        {/* Left / Code Editor Box */}
        <div className={`space-y-2 flex flex-col ${
          layout === 'split' ? 'lg:col-span-6 xl:col-span-7' : 'w-full'
        }`}>
          {/* File Tabs Bar */}
          <div className="flex items-center justify-between bg-[#070d19] px-2 py-1.5 rounded-xl border border-slate-800/80 shadow-inner">
            {/* Mac style dots + File Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <div className="hidden sm:flex items-center gap-1.5 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>

              {/* Tab HTML */}
              <button
                type="button"
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'html'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>index.html</span>
              </button>

              {/* Tab CSS */}
              <button
                type="button"
                onClick={() => setActiveTab('css')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'css'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>style.css</span>
              </button>

              {/* Tab JS */}
              <button
                type="button"
                onClick={() => setActiveTab('js')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'js'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>script.js</span>
              </button>
            </div>

            {/* Quick Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 flex items-center gap-1 transition-all"
              title="نسخ الكود الحالي"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>

          {/* IDE Editor Container with Line Numbers */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#040711] shadow-2xl flex font-mono flex-1">
            {/* Line Numbers Gutter */}
            <div 
              className="py-3 px-2 bg-[#060a17] text-slate-600 select-none text-right border-l border-slate-800/80 text-xs font-mono font-semibold space-y-1 min-w-[36px]"
              dir="ltr"
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-relaxed h-[22px] flex items-center justify-end">
                  {num}
                </div>
              ))}
            </div>

            {/* Textarea Code Input */}
            <textarea
              ref={textareaRef}
              value={getCurrentCode()}
              onChange={(e) => setCurrentCode(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={isFullscreen ? 24 : 14}
              spellCheck={false}
              dir="ltr"
              className={`w-full py-3 px-3.5 font-mono text-xs sm:text-sm bg-transparent focus:outline-none resize-none leading-relaxed transition-all selection:bg-emerald-500/30 selection:text-white ${
                activeTab === 'html' ? 'text-orange-200' : activeTab === 'css' ? 'text-sky-200' : 'text-yellow-200'
              } ${isFullscreen ? 'min-h-[500px]' : 'min-h-[320px] lg:min-h-[420px]'}`}
              placeholder="اكتب كودك هنا..."
            />
          </div>

          {/* Editor Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-2 py-1 bg-slate-900/60 rounded-lg border border-slate-800/60">
            <div className="flex items-center gap-3">
              <span>اللغة: <strong className="text-slate-300 uppercase">{activeTab}</strong></span>
              <span>الأسطر: <strong className="text-slate-300">{currentLines.length}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">UTF-8</span>
              <span>•</span>
              <span>Tab: 2 Spaces</span>
            </div>
          </div>
        </div>

        {/* Right / Live Preview & Console Output Box */}
        <div className={`space-y-2 flex flex-col ${
          layout === 'split' ? 'lg:col-span-6 xl:col-span-5' : 'w-full'
        }`}>
          {/* Preview Navigation Bar */}
          <div className="flex items-center justify-between bg-[#070d19] px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                المعاينة الحية (Live Result)
              </span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`p-1 rounded text-xs transition-all ${
                  deviceView === 'desktop' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض شاشة حاسوب كاملة"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('tablet')}
                className={`p-1 rounded text-xs transition-all ${
                  deviceView === 'tablet' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض شاشة تابلت (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`p-1 rounded text-xs transition-all ${
                  deviceView === 'mobile' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض شاشة هاتف (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Iframe Preview Area */}
          <div className={`relative rounded-xl overflow-hidden border border-slate-800 bg-[#070c18] flex-1 flex flex-col ${
            isFullscreen ? 'min-h-[500px]' : 'min-h-[320px] lg:min-h-[420px]'
          }`}>
            <div className={`w-full flex-1 bg-slate-950 flex flex-col justify-center transition-all ${getDeviceWidthClass()}`}>
              <iframe
                key={previewKey}
                title={`live-sandbox-${lessonId}`}
                srcDoc={generateFullDocument()}
                className="w-full flex-1 min-h-[260px] border-0 bg-slate-900/90"
                sandbox="allow-scripts allow-modals"
              />
            </div>

            {/* Console Output Panel Drawer */}
            <div className="border-t border-slate-800 bg-slate-950/95 flex flex-col transition-all">
              {/* Console Header */}
              <div 
                onClick={() => setShowConsole(!showConsole)}
                className="px-3 py-1.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/70 border-b border-slate-900 text-xs font-mono select-none"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold">لوحة المخرجات (Console Log)</span>
                  {consoleLogs.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      {consoleLogs.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {consoleLogs.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConsoleLogs([]);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                      title="مسح سجل المخرجات"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <span className="text-[10px] text-slate-500 font-bold">
                    {showConsole ? 'إخفاء' : 'إظهار'}
                  </span>
                </div>
              </div>

              {/* Console Logs Body */}
              {showConsole && (
                <div className="p-2.5 max-h-36 overflow-y-auto font-mono text-[11px] space-y-1 bg-[#030611]" dir="ltr">
                  {consoleLogs.length === 0 ? (
                    <p className="text-slate-600 italic text-center py-2 text-xs">
                      لا توجد مخرجات console.log بعد.. جرب كتابة أمر برمجي لتجربة المخرجات!
                    </p>
                  ) : (
                    consoleLogs.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-2 py-0.5 px-1.5 rounded ${
                          log.type === 'error' ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500' :
                          log.type === 'warn' ? 'bg-amber-950/40 text-amber-300 border-l-2 border-amber-500' :
                          'bg-slate-900/60 text-emerald-300 border-l-2 border-emerald-500'
                        }`}
                      >
                        <span className="text-slate-500 text-[9px] select-none">{log.time}</span>
                        <span className="flex-1 whitespace-pre-wrap break-all">{log.text}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
