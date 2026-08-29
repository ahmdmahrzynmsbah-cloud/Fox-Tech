import React from 'react';

interface FoxTechLogoProps {
  className?: string;
  customUrl?: string;
  variant?: 'auto' | 'light' | 'dark';
  showIconOnly?: boolean;
  onClick?: () => void;
  alt?: string;
}

export const FoxTechLogo: React.FC<FoxTechLogoProps> = ({
  className = '',
  customUrl,
  variant = 'auto',
  showIconOnly = false,
  onClick,
  alt = 'FOX TECH',
}) => {
  // If customUrl is a valid external URL
  if (customUrl && customUrl.startsWith('http') && !customUrl.includes('placeholder')) {
    return (
      <img
        src={customUrl}
        alt={alt}
        onClick={onClick}
        className={`object-contain bg-transparent select-none shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        loading="eager"
        decoding="sync"
      />
    );
  }

  // Variant-based color classes
  const getColors = () => {
    if (variant === 'dark') {
      return {
        fox: 'text-white',
        tech: 'text-[#D4F800]',
        badge: 'bg-[#D4F800] text-[#0A102E]',
        dot: 'bg-[#D4F800]',
      };
    }
    if (variant === 'light') {
      return {
        fox: 'text-[#0A102E]',
        tech: 'text-[#D4F800]',
        badge: 'bg-[#0A102E] text-[#D4F800]',
        dot: 'bg-[#D4F800]',
      };
    }
    // Auto (Adapts to system & dark mode)
    return {
      fox: 'text-[#0A102E] dark:text-white',
      tech: 'text-[#D4F800]',
      badge: 'bg-[#0A102E] text-[#D4F800] dark:bg-[#D4F800] dark:text-[#0A102E]',
      dot: 'bg-[#D4F800]',
    };
  };

  const colors = getColors();

  // If icon-only requested, show a clean geometric 'FT' monogram
  if (showIconOnly) {
    return (
      <div 
        onClick={onClick}
        dir="ltr"
        className={`inline-flex items-center justify-center font-black select-none shrink-0 tracking-tighter ${onClick ? 'cursor-pointer' : ''} ${className || 'text-xl'}`}
        title={alt}
      >
        <span className={colors.fox}>F</span>
        <span className={colors.tech}>T</span>
      </div>
    );
  }

  // Pure Text Wordmark: "FOX TECH" with high contrast in both modes (without dot or icons)
  return (
    <div 
      onClick={onClick}
      dir="ltr"
      style={{ direction: 'ltr' }}
      className={`inline-flex items-center gap-1.5 leading-none select-none shrink-0 transition-transform duration-200 hover:scale-[1.02] ${onClick ? 'cursor-pointer' : ''} ${className}`}
      title={alt}
    >
      <span className={`text-xl sm:text-2xl md:text-[26px] font-black tracking-tight uppercase font-sans ${colors.fox} transition-colors duration-200`}>
        FOX
      </span>
      <span className={`text-xl sm:text-2xl md:text-[26px] font-black tracking-tight uppercase font-sans ${colors.tech} transition-colors duration-200`}>
        TECH
      </span>
    </div>
  );
};

export const BacCodeLogo = FoxTechLogo;
export default FoxTechLogo;

