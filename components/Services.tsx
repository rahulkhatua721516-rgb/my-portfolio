
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SiteSettings, Category } from '../types';

interface Props {
  settings: SiteSettings;
  onFilterSelect: (category: Category) => void;
}

const Services: React.FC<Props> = ({ settings, onFilterSelect }) => {
  // Mapping service titles to Category types for filtering
  const mapTitleToCategory = (title: string): Category => {
    if (title.includes('Thumbnail')) return 'Thumbnail';
    if (title.includes('Logo')) return 'Logo Design';
    if (title.includes('Branding')) return 'Branding';
    if (title.includes('Social')) return 'Social Media';
    if (title.includes('Packaging')) return 'Packaging';
    if (title.includes('UI/UX')) return 'UI/UX';
    return 'Branding'; // Default
  };

  return (
    <section id="services" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <span className="accent-neon font-bold uppercase tracking-widest text-sm mb-4 block">Our Expertise</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">The Services We <span className="text-gray-600">Excel In.</span></h2>
          </div>
          <p className="text-gray-500 max-w-xs text-right">01 — 06 Creative Specialties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {settings.services.map((service) => (
            <button 
              key={service.id} 
              onClick={() => onFilterSelect(mapTitleToCategory(service.title))}
              className="group text-left relative p-10 border border-white/5 bg-white/[0.02] hover:bg-accent-neon hover:text-black transition-all duration-500 overflow-hidden outline-none"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-4xl font-black text-gray-800 group-hover:text-black/20 transition-colors">{service.number}</span>
                <div className="p-3 border border-white/10 rounded-full group-hover:border-black/30 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                  <ArrowUpRight />
                </div>
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{service.title}</h3>
              <p className="text-gray-500 group-hover:text-black/70 text-sm leading-relaxed">
                {service.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
