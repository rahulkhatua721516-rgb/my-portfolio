
import React from 'react';

const Process: React.FC = () => {
  const steps = [
    { title: 'Discovery', desc: 'Understanding your brand goals, target audience, and project requirements.' },
    { title: 'Concept', desc: 'Developing creative directions and moodboards to align with the vision.' },
    { title: 'Execution', desc: 'Refining the chosen direction into a polished, high-fidelity design.' },
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="accent-neon font-bold uppercase tracking-widest text-xs mb-4 block italic">The Workflow</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase">How I <span className="text-gray-600">Create.</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="p-8 border border-white/5 bg-white/[0.02] rounded-2xl relative overflow-hidden group hover:border-accent-neon/30 transition-all">
              <span className="absolute -top-4 -right-4 text-8xl font-black text-white/[0.02] group-hover:text-accent-neon/5 transition-colors">0{idx + 1}</span>
              <h3 className="text-2xl font-black uppercase mb-4 accent-neon">0{idx + 1}. {step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
