
import React, { useState, useMemo } from 'react';
import { Project, Category } from '../types';
import { CATEGORIES } from '../constants';
import { Plus } from 'lucide-react';

interface Props {
  projects: Project[];
  activeFilter: Category | 'All';
  onFilterChange: (filter: Category | 'All') => void;
}

const PortfolioGrid: React.FC<Props> = ({ projects, activeFilter, onFilterChange }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);
  }, [projects, activeFilter]);

  // Helper to get specific aspect ratio based on category
  const getAspectRatioClass = (category: Category) => {
    switch (category) {
      case 'Thumbnail':
        return 'aspect-video'; // 16:9
      case 'Logo Design':
        return 'aspect-square'; // 1:1
      case 'Branding':
        return 'aspect-[3/4]'; // 3:4
      default:
        return 'aspect-[4/5]'; // Default for others
    }
  };

  return (
    <section id="works" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black uppercase mb-12">
            Selected <span className="text-gray-600">Works</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onFilterChange('All')}
              className={`px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest transition-all ${activeFilter === 'All' ? 'bg-accent-neon text-black' : 'border border-white/10 text-gray-400 hover:border-accent-neon hover:text-accent-neon'}`}
            >
              All projects
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => onFilterChange(cat)}
                className={`px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest transition-all ${activeFilter === cat ? 'bg-accent-neon text-black' : 'border border-white/10 text-gray-400 hover:border-accent-neon hover:text-accent-neon'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group relative cursor-pointer"
              onClick={() => setSelectedImage(project.imageUrl)}
            >
              <div className={`relative overflow-hidden ${getAspectRatioClass(project.category)} bg-white/5 rounded-2xl z-[100]`}>
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                  style={{ objectPosition: project.objectPosition || 'center' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-accent-neon rounded-full flex items-center justify-center text-black scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <Plus size={32} />
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <span className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-black uppercase tracking-tight group-hover:accent-neon transition-colors">{project.title}</h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-gray-600 italic">
            No projects found in this category.
          </div>
        )}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}
    </section>
  );
};

export default PortfolioGrid;
