
import React from 'react';
import { SiteSettings } from '../types';
import { User } from 'lucide-react';

interface Props {
  settings: SiteSettings;
}

const About: React.FC<Props> = ({ settings }) => {
  // Logic to split the heading and color the last word or two for that "thoda green" effect
  const words = settings.aboutHeading.split(' ');
  const mainPart = words.slice(0, -2).join(' ');
  const accentPart = words.slice(-2).join(' ');

  return (
    <section id="about" className="py-24 px-6 bg-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-accent-neon/20 rounded-2xl blur-xl group-hover:bg-accent-neon/30 transition-all"></div>
          
          <div className="relative rounded-2xl overflow-hidden aspect-square border border-white/10 bg-black flex items-center justify-center">
            {settings.aboutImageUrl ? (
              <img 
                src={settings.aboutImageUrl} 
                alt="Designer Profile" 
                className="w-full h-full object-cover transition-all duration-700" 
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-800">
                <User size={120} strokeWidth={1} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Designer Profile</span>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-8 -right-8 handwritten text-6xl text-accent-neon -rotate-12 select-none">
            About Me
          </div>
        </div>

        <div className="relative">
          <h2 className="text-5xl font-black uppercase mb-8 leading-tight">
            {mainPart} <span className="accent-neon">{accentPart}</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {settings.aboutText}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {settings.skills.map(skill => (
              <div key={skill} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent-neon rounded-full" />
                <span className="font-bold text-sm uppercase tracking-wider">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
