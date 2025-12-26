
import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storageService';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
}

const Contact: React.FC<Props> = ({ settings }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    
    setTimeout(() => {
      try {
        storageService.saveMessage(formData);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } catch (err) {
        setStatus('error');
      }
    }, 1000);
  };

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/2">
          <span className="handwritten text-accent-neon text-4xl block mb-6 -rotate-6">Let's work together</span>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-10">
            {settings.contactHeading.split(' ').slice(0, -1).join(' ')} <span className="accent-neon">{settings.contactHeading.split(' ').pop()}</span>
          </h2>
          <div className="space-y-6">
            <p className="text-gray-400 text-lg">{settings.contactSubtext}</p>
            <div className="pt-8">
              <span className="text-xs uppercase tracking-widest text-gray-500 block mb-2">Connect at</span>
              <a href={`mailto:${settings.contactEmail}`} className="text-3xl font-black hover:accent-neon transition-colors break-all">{settings.contactEmail}</a>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <form onSubmit={handleSubmit} className="bg-white/[0.03] p-8 md:p-12 rounded-3xl border border-white/5 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aarav Sharma" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent-neon transition-colors text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aarav.sharma@gmail.com" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent-neon transition-colors text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Your Message</label>
              <textarea 
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project..."
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-accent-neon transition-colors resize-none text-white"
              />
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-accent-neon text-black py-5 rounded-xl font-black uppercase text-lg tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : (
                <>Send Message <Send size={20} /></>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-3 text-accent-neon bg-accent-neon/10 p-4 rounded-xl">
                <CheckCircle />
                <span className="font-bold">Message received! I'll get back to you shortly.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
