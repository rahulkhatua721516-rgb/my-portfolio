
import React from 'react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
}

const Stats: React.FC<Props> = ({ settings }) => {
  return (
    <section className="py-20 px-6 bg-black border-b border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {settings.stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <span className="text-5xl md:text-6xl font-black accent-neon mb-2 tracking-tighter">
              {stat.value}
            </span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
