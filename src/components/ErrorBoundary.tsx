import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (
      error?.name === 'AbortError' ||
      error?.message?.toLowerCase().includes('abort') ||
      error?.message?.toLowerCase().includes('cancelled')
    ) {
      return { hasError: false, error: null, errorInfo: null };
    }
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (
      error?.name === 'AbortError' ||
      error?.message?.toLowerCase().includes('abort') ||
      error?.message?.toLowerCase().includes('cancelled')
    ) {
      return;
    }
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError && this.state.error?.name !== 'AbortError') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white text-center" dir="rtl">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-xl font-black text-white">حدث خطأ غير متوقع</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-bold">
              يرجى إعادة تحميل الصفحة لمتابعة العمل في المنصة.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              إعادة تحميل الصفحة 🔄
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

