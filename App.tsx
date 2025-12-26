
import React, { useState, useEffect } from 'react';
import GrainOverlay from './components/GrainOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import Process from './components/Process';
import Services from './components/Services';
import PortfolioGrid from './components/PortfolioGrid';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { storageService } from './services/storageService';
import { Project, SiteSettings, Category } from './types';
import { DEFAULT_SETTINGS } from './constants';

export type View = 'home' | 'admin';

// Home Page Wrapper
const HomeView: React.FC<{ 
  settings: SiteSettings; 
  onViewChange: (view: View) => void 
}> = ({ settings, onViewChange }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All');

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await storageService.getProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleFilterChange = (filter: Category | 'All') => {
    setActiveFilter(filter);
    const target = document.getElementById('works');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar onViewChange={onViewChange} currentView="home" />
      <main className="relative z-10">
        <Hero settings={settings} />
        <Marquee />
        <About settings={settings} />
        <Stats settings={settings} />
        <Services settings={settings} onFilterSelect={handleFilterChange} />
        <Process />
        <PortfolioGrid 
          projects={projects} 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        <Contact settings={settings} />
      </main>
      <Footer onViewChange={onViewChange} />
    </>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(storageService.isLoggedIn());
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<View>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      const data = await storageService.getSettings();
      setSettings(data);
      setLoading(false);
    };
    initApp();
  }, []);

  const refreshSettings = async () => {
    const data = await storageService.getSettings();
    setSettings(data);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('admin');
  };

  const handleLogout = () => {
    storageService.logout();
    setIsAuthenticated(false);
    setView('home');
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="accent-neon font-black text-2xl animate-pulse uppercase tracking-[0.5em]">Initialising...</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-[#000000]">
      <GrainOverlay />
      
      {view === 'home' && (
        <HomeView settings={settings} onViewChange={handleViewChange} />
      )}

      {view === 'admin' && (
        <>
          {isAuthenticated ? (
            <AdminDashboard 
              onLogout={handleLogout} 
              onSettingsUpdate={refreshSettings}
              onViewChange={handleViewChange}
            />
          ) : (
            <AdminLogin 
              onLoginSuccess={handleLoginSuccess} 
              onViewChange={handleViewChange} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
