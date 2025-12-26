
import React from 'react';
import { ArrowDown, Circle } from 'lucide-react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
}

const Hero: React.FC<Props> = ({ settings }) => {
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-12 md:pt-20 overflow-hidden bg-black">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-white/5 rounded-full blur-[60px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        {/* Availability Badge for Mobile Appeal */}
        <div className="mb-12 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#baff00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#baff00]"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Available for projects</span>
        </div>

        {/* The "Selection Box" Wrapper */}
        <div className="relative inline-block p-6 sm:p-12 md:p-20 group w-[95%] sm:w-auto">
          
          {/* Design Tool Bounding Box (The "White Rectangular") */}
          <div className="absolute inset-0 border border-dashed border-white/30 pointer-events-none">
            {/* Corner Handles - Scaled for Mobile */}
            <div className="absolute -top-1 -left-1 md:-top-1.5 md:-left-1.5 w-2 h-2 md:w-3 md:h-3 bg-white border border-black shadow-sm" />
            <div className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 w-2 h-2 md:w-3 md:h-3 bg-white border border-black shadow-sm" />
            <div className="absolute -bottom-1 -left-1 md:-bottom-1.5 md:-left-1.5 w-2 h-2 md:w-3 md:h-3 bg-white border border-black shadow-sm" />
            <div className="absolute -bottom-1 -right-1 md:-bottom-1.5 md:-right-1.5 w-2 h-2 md:w-3 md:h-3 bg-white border border-black shadow-sm" />
            
            {/* Midpoint Handles - Visible only on larger screens to avoid clutter */}
            <div className="hidden sm:block absolute top-1/2 -left-1 md:-left-1.5 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white border border-black shadow-sm" />
            <div className="hidden sm:block absolute top-1/2 -right-1 md:-right-1.5 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white border border-black shadow-sm" />
            <div className="hidden sm:block absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 bg-white border border-black shadow-sm" />
            <div className="hidden sm:block absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 bg-white border border-black shadow-sm" />
          </div>

          {/* Accent Text Top-Left */}
          <div className="absolute top-2 left-4 sm:top-4 sm:left-8 md:top-6 md:left-10 flex gap-1 md:gap-2 items-baseline select-none z-20">
            <span className="text-white font-black uppercase text-[10px] sm:text-base md:text-2xl tracking-tighter">Graphic</span>
            <span className="text-gray-500 font-bold uppercase text-[10px] sm:text-base md:text-2xl tracking-tighter">Design</span>
          </div>

          {/* Main Title Area */}
          <div className="relative flex flex-col items-center">
            {/* Metallic Title - Using responsive units for perfect fit */}
            <h1 className="relative text-[14vw] sm:text-[10vw] md:text-[13rem] font-black uppercase tracking-tighter leading-none flex items-center justify-center select-none py-6 sm:py-8 md:py-0">
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-300 to-gray-500"
                style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))' }}
              >
                Portf
              </span>
              
              {/* THE "O" WITH HANDS AND ORB */}
              <div className="relative inline-flex items-center justify-center mx-[-0.01em] md:mx-[-0.05em]">
                {/* The Glowing Orb */}
                <div className="w-[0.7em] h-[0.7em] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)] sm:shadow-[0_0_40px_rgba(255,255,255,0.7)] md:shadow-[0_0_80px_rgba(255,255,255,0.8)] border-[1px] md:border-[0.1em] border-white/20 animate-pulse" />
                
                {/* Hands Holding Orb SVG */}
                <svg 
                  viewBox="0 0 100 100" 
                  className="absolute bottom-[-5%] w-full h-[110%] text-black/95 pointer-events-none"
                  fill="currentColor"
                >
                  <path d="M25,85 Q35,60 45,78 Q50,92 55,78 Q65,60 75,85 L75,100 L25,100 Z" opacity="0.95" />
                  <path d="M22,92 C30,70 42,75 45,88" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4" />
                  <path d="M78,92 C70,70 58,75 55,88" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4" />
                </svg>
              </div>

              <span 
                className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-300 to-gray-500"
                style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))' }}
              >
                lio
              </span>
            </h1>

            {/* Signature Overlay - Lowered for Mobile and Scale Adjusted */}
            <div className="absolute bottom-0 right-[-5%] sm:right-0 md:-bottom-6 md:right-10 transform rotate-[-3deg] md:rotate-[-5deg] select-none z-30">
              <span className="handwritten accent-neon text-2xl sm:text-5xl md:text-8xl" style={{ textShadow: 'none' }}>
                {settings.designerName}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Meta & Buttons */}
        <div className="mt-12 sm:mt-16 md:mt-24 max-w-2xl mx-auto space-y-8 sm:space-y-10 px-4">
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 leading-relaxed font-light tracking-wide">
            {settings.heroSubtext}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 md:gap-8 justify-center items-center w-full">
            <a 
              href="#works" 
              onClick={(e) => handleScrollClick(e, '#works')} 
              className="group relative bg-accent-neon text-black w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-full text-sm sm:text-base md:text-lg font-black uppercase tracking-widest overflow-hidden transition-all text-center shadow-[0_10px_30px_rgba(186,255,0,0.2)]"
            >
              <span className="relative z-10">{settings.heroViewWorkText}</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleScrollClick(e, '#contact')} 
              className="text-white hover:text-accent-neon font-black uppercase text-xs sm:text-sm md:text-base tracking-[0.2em] flex items-center gap-3 transition-colors p-4 group"
            >
              {settings.heroContactText} 
              <div className="w-6 sm:w-12 h-[1px] bg-white/20 group-hover:bg-accent-neon group-hover:w-16 transition-all" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Scroll Hint - Hidden on smallest devices */}
      <a 
        href="#about" 
        onClick={(e) => handleScrollClick(e, '#about')} 
        className="hidden md:flex absolute bottom-10 left-10 md:left-20 items-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-600 hover:text-white transition-colors rotate-90 origin-left"
      >
        Scroll Down <ArrowDown size={14} className="-rotate-90" />
      </a>
    </section>
  );
};

export default Hero;
