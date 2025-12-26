
import React from 'react';

const Marquee: React.FC = () => {
  return (
    <div className="relative py-10 bg-black overflow-hidden border-y border-white/5 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter stroke-text mx-4 opacity-20">Creative Design</span>
            <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter accent-neon mx-4">×</span>
            <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter mx-4">Visual Storytelling</span>
            <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter accent-neon mx-4">×</span>
            <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter stroke-text mx-4 opacity-20">Premium UI</span>
            <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter accent-neon mx-4">×</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Marquee;
