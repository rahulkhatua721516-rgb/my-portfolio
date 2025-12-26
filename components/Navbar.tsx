
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { View } from '../App';

interface Props {
  onViewChange: (view: View) => void;
  currentView: View;
}

const Navbar: React.FC<Props> = ({ onViewChange, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Works', id: 'works' },
    { name: 'Services', id: 'services' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleScrollClick = (id: string) => {
    if (currentView !== 'home') {
      onViewChange('home');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <button 
          onClick={() => onViewChange('home')} 
          className="text-2xl font-black tracking-tighter outline-none hover:opacity-80 transition-opacity"
        >
          PORT<span className="accent-neon">FOLIO.</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(link => (
            <button 
              key={link.name} 
              onClick={() => handleScrollClick(link.id)}
              className="text-sm font-bold uppercase tracking-widest hover:accent-neon transition-colors outline-none"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => handleScrollClick('contact')} 
            className="bg-accent-neon text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform outline-none"
          >
            Let's Talk <ArrowRight size={16} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden accent-neon outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-8 z-[60]">
          {links.map(link => (
            <button 
              key={link.name} 
              onClick={() => handleScrollClick(link.id)} 
              className="text-4xl font-black hover:accent-neon transition-colors outline-none"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => { onViewChange('admin'); setIsOpen(false); }} 
            className="text-xl font-bold uppercase text-gray-500 hover:accent-neon outline-none"
          >
            Admin Portal
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="bg-accent-neon text-black px-10 py-4 rounded-full text-xl font-bold mt-4 outline-none"
          >
            Close
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
