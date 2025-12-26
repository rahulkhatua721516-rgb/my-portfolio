
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { storageService } from '../services/storageService';
import { Project, Message, Category, SiteSettings, Stat } from '../types';
import { CATEGORIES } from '../constants';
import { LayoutDashboard, Image as ImageIcon, MessageSquare, LogOut, Plus, Trash2, Edit2, X, Settings, Home, Mail, ShieldCheck, AlertTriangle, CheckCircle2, Upload, Save, User, Reply, BarChart3, Move, Share2, PhoneCall } from 'lucide-react';
import { View } from '../App';

interface Props {
  onLogout: () => void;
  onSettingsUpdate: () => void;
  onViewChange: (view: View) => void;
}

const AdminDashboard: React.FC<Props> = ({ onLogout, onSettingsUpdate, onViewChange }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'settings'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'project' | 'message' | 'clear_all' } | null>(null);

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    imageUrl: '',
    objectPosition: 'center'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fix: Made refreshData async and used await for storageService calls to resolve promises correctly
  const refreshData = useCallback(async () => {
    const [pData, mData, sData] = await Promise.all([
      storageService.getProjects(),
      storageService.getMessages(),
      storageService.getSettings()
    ]);
    setProjects(pData);
    setMessages(mData);
    setSiteSettings(sData);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Fix: Made confirmDelete async and added awaits for storageService operations
  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'project') {
      await storageService.deleteProject(deleteConfirm.id);
      setProjects(prev => prev.filter(p => p.id !== deleteConfirm.id));
      showToast('Project deleted permanently');
    } else if (deleteConfirm.type === 'message') {
      await storageService.deleteMessage(deleteConfirm.id);
      setMessages(prev => prev.filter(m => m.id !== deleteConfirm.id));
      showToast('Message removed');
    } else if (deleteConfirm.type === 'clear_all') {
      await storageService.clearAllMessages();
      setMessages([]);
      showToast('Inbox cleared');
    }

    setDeleteConfirm(null);
  };

  const resizeImage = (base64Str: string, maxWidth: number = 1200): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSaving(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const optimized = await resizeImage(reader.result as string);
        setProjectData({ ...projectData, imageUrl: optimized });
        setIsSaving(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAboutImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && siteSettings) {
      setIsSaving(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const optimized = await resizeImage(reader.result as string, 800);
        setSiteSettings({ ...siteSettings, aboutImageUrl: optimized });
        setIsSaving(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fix: Added await to async storage operations
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.imageUrl) {
      showToast('Please upload an image', 'error');
      return;
    }
    
    setIsSaving(true);
    try {
      if (editingProject) {
        await storageService.updateProject(editingProject.id, projectData);
        showToast('Project updated');
      } else {
        await storageService.saveProject(projectData);
        showToast('Work added to portfolio');
      }
      setIsModalOpen(false);
      setProjectData({ title: '', description: '', category: CATEGORIES[0], imageUrl: '', objectPosition: 'center' });
      setEditingProject(null);
      refreshData();
    } catch (err) {
      showToast('Storage limit reached. Try a smaller image.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Fix: Made handleUpdateSettings async and added await
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    await storageService.updateSettings(siteSettings);
    onSettingsUpdate();
    showToast('Settings saved successfully');
  };

  const handleStatChange = (idx: number, field: keyof Stat, value: string) => {
    if (!siteSettings) return;
    const newStats = [...siteSettings.stats];
    newStats[idx] = { ...newStats[idx], [field]: value };
    setSiteSettings({ ...siteSettings, stats: newStats });
  };

  const handleReply = (email: string, name: string) => {
    const subject = encodeURIComponent(`Re: Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Hi ${name},\n\nThank you for reaching out via my portfolio. `);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setProjectData({
      title: p.title,
      description: p.description,
      category: p.category,
      imageUrl: p.imageUrl,
      objectPosition: p.objectPosition || 'center'
    });
    setIsModalOpen(true);
  };

  if (!siteSettings) return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <div className="accent-neon font-black text-2xl animate-pulse tracking-widest uppercase">Booting Admin...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000000] text-white flex relative">
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-black/80 backdrop-blur-xl border border-accent-neon/30 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
            {toast.type === 'error' ? <AlertTriangle className="text-red-500" size={20} /> : <CheckCircle2 className="accent-neon" size={20} />}
            <p className="font-bold uppercase tracking-widest text-xs">{toast.message}</p>
          </div>
        </div>
      )}

      <aside className="w-64 border-r border-white/5 bg-black p-8 flex flex-col sticky top-0 h-screen shrink-0">
        <div className="mb-12">
           <h2 className="text-xl font-black accent-neon tracking-tighter">ADMIN CORE</h2>
           <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">v2.8.5.stable</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-accent-neon text-black font-bold' : 'hover:bg-white/5 text-gray-500'}`}>
            <LayoutDashboard size={20} /> My Works
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-accent-neon text-black font-bold' : 'hover:bg-white/5 text-gray-500'}`}>
            <Settings size={20} /> Site Config
          </button>
          <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-accent-neon text-black font-bold' : 'hover:bg-white/5 text-gray-500'}`}>
            <MessageSquare size={20} /> Messages
          </button>
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-white/5">
          <button onClick={() => onViewChange('home')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white font-bold text-sm">
            <Home size={18} /> View Site
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-bold">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tight">
              {activeTab === 'projects' ? 'Portfolio' : activeTab === 'settings' ? 'Settings' : 'Inbox'}
            </h1>
          </div>
          {activeTab === 'projects' && (
            <button 
              onClick={() => { setEditingProject(null); setProjectData({ title: '', description: '', category: CATEGORIES[0], imageUrl: '', objectPosition: 'center' }); setIsModalOpen(true); }}
              className="bg-accent-neon text-black px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus size={20} /> New Project
            </button>
          )}
        </header>

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 group">
                <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
                  <img 
                    src={project.imageUrl} 
                    className="w-full h-full object-cover" 
                    style={{ objectPosition: project.objectPosition || 'center' }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => openEditModal(project)} className="p-3 bg-accent-neon text-black rounded-full hover:scale-110 transition-transform">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => setDeleteConfirm({ id: project.id, type: 'project' })} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold uppercase text-sm mb-1">{project.title}</h3>
                <span className="text-[10px] text-accent-neon font-black uppercase tracking-widest">{project.category}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={handleUpdateSettings} className="max-w-4xl space-y-16 pb-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-accent-neon flex items-center gap-2">
                   <User size={16} /> Personal Branding
                </h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Designer Name</label>
                  <input 
                    type="text" 
                    value={siteSettings.designerName} 
                    onChange={e => setSiteSettings({...siteSettings, designerName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Hero Headline</label>
                  <input 
                    type="text" 
                    value={siteSettings.heroHeading} 
                    onChange={e => setSiteSettings({...siteSettings, heroHeading: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-accent-neon">Profile Identity</h3>
                <div 
                  onClick={() => aboutImageInputRef.current?.click()}
                  className="relative aspect-square w-48 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-neon/30 transition-colors group overflow-hidden"
                >
                  {siteSettings.aboutImageUrl ? (
                    <img src={siteSettings.aboutImageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <User size={32} className="text-gray-700" />
                      <span className="text-[10px] font-bold uppercase text-gray-700">Upload Photo</span>
                    </div>
                  )}
                  <input ref={aboutImageInputRef} type="file" accept="image/*" onChange={handleAboutImageChange} className="hidden" />
                </div>
              </div>
            </div>

            <div className="space-y-8 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
              <h3 className="text-sm font-black uppercase tracking-widest text-accent-neon flex items-center gap-2">
                 <PhoneCall size={16} /> Contact Section Config
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Contact Display Email</label>
                  <input 
                    type="email" 
                    value={siteSettings.contactEmail} 
                    onChange={e => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-accent-neon font-black text-lg accent-neon"
                    placeholder="arpan.sharma@gmail.com"
                  />
                  <p className="text-[10px] text-gray-600 italic">This is the email address shown in the footer and contact sections.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Contact Heading</label>
                    <input 
                      type="text" 
                      value={siteSettings.contactHeading} 
                      onChange={e => setSiteSettings({...siteSettings, contactHeading: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Contact Subtext</label>
                    <textarea 
                      value={siteSettings.contactSubtext} 
                      onChange={e => setSiteSettings({...siteSettings, contactSubtext: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-accent-neon flex items-center gap-2">
                 <Share2 size={16} /> Social Presence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Instagram Link</label>
                  <input 
                    type="text" 
                    value={siteSettings.socialLinks.instagram} 
                    onChange={e => setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, instagram: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Discord Link</label>
                  <input 
                    type="text" 
                    value={siteSettings.socialLinks.discord} 
                    onChange={e => setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, discord: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon"
                    placeholder="https://discord.gg/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">X (Twitter) Link</label>
                  <input 
                    type="text" 
                    value={siteSettings.socialLinks.x} 
                    onChange={e => setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, x: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon"
                    placeholder="https://x.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">LinkedIn Link</label>
                  <input 
                    type="text" 
                    value={siteSettings.socialLinks.linkedin} 
                    onChange={e => setSiteSettings({...siteSettings, socialLinks: {...siteSettings.socialLinks, linkedin: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-accent-neon flex items-center gap-2">
                 <BarChart3 size={16} /> Showcase Stats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {siteSettings.stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Value (e.g. 150+)</label>
                      <input 
                        type="text" 
                        value={stat.value} 
                        onChange={e => handleStatChange(idx, 'value', e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent-neon accent-neon font-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Label</label>
                      <input 
                        type="text" 
                        value={stat.label} 
                        onChange={e => handleStatChange(idx, 'label', e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent-neon text-gray-400 font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-sm font-black uppercase tracking-widest text-accent-neon">About Intro</h3>
               <textarea 
                  value={siteSettings.aboutText} 
                  onChange={e => setSiteSettings({...siteSettings, aboutText: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon min-h-[150px]"
               />
            </div>

            <button type="submit" className="bg-accent-neon text-black px-12 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3">
              <Save size={20} /> Save Configuration
            </button>
          </form>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex justify-between items-start group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-lg">{msg.name}</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-gray-500 italic">{new Date(msg.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-accent-neon text-sm font-bold mb-3 tracking-wider">{msg.email}</p>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{msg.message}</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleReply(msg.email, msg.name)} 
                    className="p-3 bg-white/5 text-accent-neon rounded-full hover:bg-accent-neon hover:text-black transition-all flex items-center gap-2 group/btn"
                    title="Reply via Email"
                  >
                    <Reply size={20} />
                    <span className="text-[10px] font-black uppercase hidden group-hover/btn:block">Reply</span>
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm({ id: msg.id, type: 'message' })} 
                    className="p-3 bg-white/5 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                    title="Delete Message"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-3xl">
                <Mail className="mx-auto text-gray-800 mb-4" size={48} />
                <p className="text-gray-500 font-bold uppercase">Your inbox is clean</p>
              </div>
            )}
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center">
              <h2 className="text-2xl font-black uppercase mb-2">Confirm Purge</h2>
              <p className="text-gray-500 text-sm mb-8">This action will delete the entry from local memory.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-6 py-3 rounded-xl bg-white/5 font-bold">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 px-6 py-3 rounded-xl bg-red-500 font-bold">Delete</button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[1500] bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] w-full max-w-4xl p-8 md:p-12 shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                <X size={32} />
              </button>
              <h2 className="text-3xl font-black uppercase mb-8">{editingProject ? 'Edit Work' : 'New Project'}</h2>
              
              <div className="grid lg:grid-cols-2 gap-10">
                <form onSubmit={handleSaveProject} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Title</label>
                      <input type="text" required value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</label>
                      <select value={projectData.category} onChange={e => setProjectData({...projectData, category: e.target.value as Category})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-neon">
                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#0f0f0f]">{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Image</label>
                    <div onClick={() => fileInputRef.current?.click()} className="relative w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden border-white/10">
                      {projectData.imageUrl ? <img src={projectData.imageUrl} className="w-full h-full object-cover" style={{ objectPosition: projectData.objectPosition }} /> : <><Upload className="text-gray-500 mb-2" size={32} /><p className="text-xs text-gray-500 font-bold uppercase">Upload Project Preview</p></>}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <Move size={12} /> Set Image Position (Focal Point)
                    </label>
                    <div className="grid grid-cols-3 gap-2 w-32">
                      {['top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'].map(pos => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setProjectData({...projectData, objectPosition: pos})}
                          className={`aspect-square rounded-md border transition-all ${projectData.objectPosition === pos ? 'bg-accent-neon border-accent-neon' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                          title={pos}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-600 italic">Adjust which part of the image is centered in the portfolio frame.</p>
                  </div>

                  <button type="submit" disabled={isSaving} className="w-full bg-accent-neon text-black py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                    {isSaving ? 'Processing...' : editingProject ? 'Update' : 'Publish'}
                  </button>
                </form>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cropping Preview</label>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <span className="text-[8px] font-bold text-gray-600 uppercase">Thumbnail View (16:9)</span>
                      <div className="aspect-video bg-black rounded-xl border border-white/5 overflow-hidden">
                        {projectData.imageUrl && <img src={projectData.imageUrl} className="w-full h-full object-cover transition-all" style={{ objectPosition: projectData.objectPosition }} />}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[8px] font-bold text-gray-600 uppercase">Branding View (3:4)</span>
                      <div className="aspect-[3/4] h-40 bg-black rounded-xl border border-white/5 overflow-hidden mx-auto">
                        {projectData.imageUrl && <img src={projectData.imageUrl} className="w-full h-full object-cover transition-all" style={{ objectPosition: projectData.objectPosition }} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
