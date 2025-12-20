import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface FeaturesProps {
  onNavigate: (view: string) => void;
}

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('analyst');

  return (
    <div className="animate-in fade-in duration-300 pb-20 pt-6">
        
        {/* NEW CIRCULAR BACK BUTTON */}
        <button 
            onClick={() => onNavigate('home')} 
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg mb-8 group"
            title="Go Back"
        >
            <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <h1 className="text-[2.5rem] font-bold text-[#FFBA00] mb-8">AI-Powered Features</h1>

        {/* TABS */}
        <div className="flex flex-wrap gap-4 mb-8">
            {[
                { id: 'analyst', label: '🤖 Analyst' },
                { id: 'pm', label: '📋 Project Manager' },
                { id: 'investor', label: '💸 Investor Sim' }
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`text-base px-6 py-3 rounded-full border font-bold transition-all ${activeTab === tab.id ? 'bg-[#FFBA00] text-[#0C3B2E] border-[#FFBA00] shadow-lg shadow-[#FFBA00]/20' : 'bg-[#0f172a]/60 text-white border-white/15 hover:bg-[#0f172a]'}`}>
                    {tab.label}
                </button>
            ))}
        </div>

        {/* ================= ANALYST TAB ================= */}
        {activeTab === 'analyst' && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                 
                 {/* Market Overview */}
                 <article className="rounded-2xl border border-white/15 p-6 md:p-7 shadow-xl bg-[#0f172a]/60 backdrop-blur-md">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">📊</div>
                        <div className="flex-1">
                            <h2 className="text-xl text-white font-bold mb-4">Market Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1"><span className="text-sm text-white/60">Market Size</span><span className="text-2xl text-[#FFBA00] font-bold">$4.2B</span></div>
                                <div className="flex flex-col gap-1"><span className="text-sm text-white/60">Growth Rate</span><span className="text-2xl text-emerald-400 font-bold">18% YoY</span></div>
                            </div>
                        </div>
                    </div>
                 </article>

                 {/* Competition Analysis (RESTORED) */}
                 <article className="rounded-2xl border border-white/15 p-6 md:p-7 shadow-xl bg-[#0f172a]/60 backdrop-blur-md">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-2xl flex-shrink-0">🎯</div>
                       <h2 className="text-xl text-white font-bold">Competition Analysis</h2>
                    </div>
                    <div className="space-y-4">
                       {[
                           { n: 'Competitor A', d: 'Market Leader', v: '80%', c: 'amber' },
                           { n: 'Competitor B', d: 'Fast Growing', v: '60%', c: 'sky' },
                           { n: 'Competitor C', d: 'Niche Player', v: '40%', c: 'emerald' }
                       ].map((comp, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#0f172a]/60 border border-white/10">
                               <div className="flex items-center gap-3">
                                   <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${comp.c}-400 to-${comp.c}-600 flex items-center justify-center text-sm font-bold text-slate-950`}>{comp.n.charAt(11)}</div>
                                   <div><div className="font-semibold text-white">{comp.n}</div><div className="text-xs text-white/60">{comp.d}</div></div>
                               </div>
                               <div className="flex items-center gap-2">
                                   <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden"><div className={`h-full bg-gradient-to-r from-${comp.c}-400 to-${comp.c}-600`} style={{width: comp.v}}></div></div>
                                   <span className="text-xs font-medium text-white/80">{comp.v}</span>
                               </div>
                           </div>
                       ))}
                    </div>
                 </article>

                 {/* SWOT Analysis */}
                 <article className="rounded-2xl border border-white/15 p-6 md:p-7 shadow-xl bg-[#0f172a]/60 backdrop-blur-md">
                    <h2 className="text-xl text-white font-bold mb-5">SWOT Analysis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { t: 'Strengths', i: '💪', c: 'emerald', l: ['Strong technical team', 'Unique AI algorithms', 'Early market entry'] },
                            { t: 'Weaknesses', i: '⚠️', c: 'rose', l: ['Limited funding', 'Small customer base', 'Brand recognition low'] },
                            { t: 'Opportunities', i: '🚀', c: 'sky', l: ['Growing market demand', 'Partnership potential', 'International expansion'] },
                            { t: 'Threats', i: '⚡', c: 'amber', l: ['Established competitors', 'Regulatory changes', 'Economic downturn'] }
                        ].map((swot, i) => (
                            <div key={i} className={`rounded-xl bg-${swot.c}-900/20 border border-${swot.c}-400/30 p-4`}>
                                <h3 className={`text-${swot.c}-400 font-semibold mb-2 flex items-center gap-2`}><span className="text-lg">{swot.i}</span> {swot.t}</h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    {swot.l.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2"><span className={`text-${swot.c}-400 mt-0.5`}>•</span> {item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                 </article>

                 {/* Profitability Score (RESTORED) */}
                 <article className="rounded-2xl border border-white/15 p-6 md:p-7 shadow-xl bg-[#0f172a]/60 backdrop-blur-md">
                    <h2 className="text-xl text-white font-bold mb-6">Profitability Score</h2>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                       <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[20px] border-[#1e293b]">
                           <div className="absolute inset-0 rounded-full border-[20px] border-emerald-500 border-l-transparent border-b-transparent -rotate-45"></div>
                           <div className="text-center"><span className="text-5xl font-bold text-white">75</span><br/><span className="text-xs text-white/60">out of 100</span></div>
                       </div>
                       <div className="flex-1 w-full space-y-4">
                           {[{l:'Revenue Potential',v:'85%',c:'emerald'},{l:'Cost Efficiency',v:'70%',c:'amber'},{l:'Market Timing',v:'80%',c:'sky'},{l:'Scalability',v:'90%',c:'emerald'}].map((x,i)=>(
                               <div key={i} className="flex flex-col gap-2">
                                   <div className="flex justify-between text-sm"><span className="text-white/80">{x.l}</span><span className={`text-${x.c}-400 font-semibold`}>{x.v}</span></div>
                                   <div className="w-full h-2 rounded-full bg-slate-800"><div className={`h-full bg-gradient-to-r from-${x.c}-400 to-${x.c}-600 rounded-full`} style={{width: x.v.replace('/100','')}}></div></div>
                               </div>
                           ))}
                       </div>
                    </div>
                 </article>
            </div>
        )}

        {/* ================= PM TAB ================= */}
        {activeTab === 'pm' && (
             <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                
                {/* Project Timeline */}
                <article className="rounded-2xl border border-white/15 p-6 md:p-7 shadow-xl bg-[#0f172a]/60 backdrop-blur-md">
                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0">📅</div>
                        <h2 className="text-xl text-white font-bold mt-2">Project Timeline</h2>
                    </div>
                    <div className="space-y-4">
                        {[{w:'Week 1-2', t:'Planning & Design', c:'emerald', l:'33%', m:'0%'}, {w:'Week 3-4', t:'Backend Dev', c:'sky', l:'50%', m:'33%'}, {w:'Week 4-5', t:'Frontend Build', c:'amber', l:'33%', m:'50%'}, {w:'Week 6', t:'Testing', c:'purple', l:'16%', m:'83%'}].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-sm text-white/80 w-24 flex-shrink-0">{item.w}</span>
                                <div className="flex-1 h-8 rounded-lg bg-[#0f172a]/60 border border-white/10 overflow-hidden relative">
                                    <div className={`h-full absolute bg-gradient-to-r from-${item.c}-400 to-${item.c}-600 flex items-center px-3`} style={{width: item.l, left: item.m}}>
                                        <span className="text-xs text-slate-950 font-semibold">{item.t}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                {/* Architecture Diagram (RESTORED) */}
                <article className="rounded-2xl border border-white/15 p-6 md:p-7 shadow-xl bg-[#0f172a]/60 backdrop-blur-md">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-2xl flex-shrink-0">🏗️</div>
                       <h2 className="text-xl text-white font-bold mt-2">Architecture Diagram</h2>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                       {[{i:'💻',t:'Client',s:'React App',c:'emerald'}, {i:'⚡',t:'API',s:'Node.js',c:'sky'}, {i:'🗄️',t:'Database',s:'MongoDB',c:'amber'}, {i:'🤖',t:'AI Service',s:'OpenAI',c:'purple'}].map((x,i)=>(
                           <React.Fragment key={i}>
                               <div className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-${x.c}-400/20 to-${x.c}-600/20 border border-${x.c}-400/30 min-w-[120px]`}>
                                   <span className="text-2xl">{x.i}</span><span className="text-sm font-semibold">{x.t}</span><span className="text-xs text-white/60">{x.s}</span>
                               </div>
                               {i<3 && <span className="text-2xl text-white/60">→</span>}
                           </React.Fragment>
                       ))}
                    </div>
                </article>

                {/* Tech Stack + Cost Breakdown (RESTORED) */}
                <article className="rounded-2xl border border-white/15 p-6 md:p-7 shadow-xl bg-[#0f172a]/60 backdrop-blur-md">
                    <h2 className="text-xl text-white font-bold mb-5">Estimated Cost Breakdown</h2>
                    <div className="space-y-3">
                        {[{i:'🎨',t:'Design & UX',d:'Wireframes',p:'$1,500',c:'emerald'}, {i:'⚙️',t:'Backend',d:'API, Auth',p:'$2,000',c:'sky'}, {i:'🖥️',t:'Frontend',d:'UI, Responsive',p:'$1,500',c:'amber'}, {i:'🧪',t:'Testing',d:'Unit Tests',p:'$800',c:'purple'}].map((x,i)=>(
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#0f172a]/60 border border-white/10">
                                <div className="flex items-center gap-3"><span className="text-lg">{x.i}</span><div><div className="font-semibold text-white">{x.t}</div><div className="text-xs text-white/60">{x.d}</div></div></div>
                                <span className={`text-base font-bold text-${x.c}-400`}>{x.p}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-900/40 to-sky-900/40 border border-emerald-400/30 mt-4">
                            <div className="flex items-center gap-3"><span className="text-lg">💎</span><div className="font-bold text-white">Total Estimated Cost</div></div>
                            <span className="text-xl font-bold text-[#FFBA00]">$5,800</span>
                        </div>
                    </div>
                </article>
             </div>
        )}

        {/* ================= INVESTOR TAB ================= */}
        {activeTab === 'investor' && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                
                {/* Funding Probability */}
                <article className="rounded-2xl border border-white/15 p-6 md:p-7 shadow-xl bg-[#0f172a]/60 backdrop-blur-md">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">💰</div>
                        <h2 className="text-xl text-white font-bold mt-2">Funding Probability</h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-56 h-56 flex-shrink-0 flex items-center justify-center rounded-full border-[18px] border-[#1e293b]">
                            <div className="absolute inset-0 rounded-full border-[18px] border-emerald-500 border-l-transparent border-b-transparent transform -rotate-45"></div>
                            <div className="text-center"><span className="text-6xl font-bold text-emerald-400">72</span><span className="text-lg text-white/80">%</span><div className="text-sm text-white/60">Funding Chance</div></div>
                        </div>
                        <div className="flex-1 w-full space-y-4">
                            {[{l:'Angel Investors',v:'80%',c:'emerald'}, {l:'Seed VCs',v:'68%',c:'sky'}, {l:'Accelerators',v:'75%',c:'purple'}, {l:'Corporate VCs',v:'65%',c:'amber'}].map((x,i)=>(
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm"><span className="text-white/80">{x.l}</span><span className={`text-${x.c}-400 font-semibold`}>{x.v}</span></div>
                                    <div className="w-full h-2.5 rounded-full bg-slate-800"><div className={`h-full bg-gradient-to-r from-${x.c}-400 to-${x.c}-600 rounded-full`} style={{width: x.v}}></div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>

                {/* What Investors Like (RESTORED) */}
                <article className="rounded-2xl border border-emerald-400/30 bg-emerald-900/10 p-6 md:p-7 shadow-xl">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">✅</div>
                       <h2 className="text-xl text-emerald-400 font-bold mt-2">What Investors Like</h2>
                    </div>
                    <div className="space-y-3">
                        {['Strong Market Demand', 'Technical Feasibility', 'Scalable Business Model', 'Experienced Team'].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#0f172a]/40 border border-emerald-400/20">
                                <span className="text-emerald-400 text-xl mt-0.5">✔</span>
                                <div className="flex-1"><h3 className="font-semibold text-white mb-1">{item}</h3><p className="text-xs text-white/80">Description regarding {item.toLowerCase()}.</p></div>
                            </div>
                        ))}
                    </div>
                </article>

                {/* Investor Concerns (RESTORED) */}
                <article className="rounded-2xl border border-amber-400/30 bg-amber-900/10 p-6 md:p-7 shadow-xl">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl flex-shrink-0">⚠️</div>
                       <h2 className="text-xl text-amber-400 font-bold mt-2">Investor Concerns</h2>
                    </div>
                    <div className="space-y-3">
                        {['Competition Crowded', 'Customer Acquisition Cost', 'Regulatory Uncertainty'].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#0f172a]/40 border border-amber-400/20">
                                <span className="text-amber-400 text-xl mt-0.5">⚠</span>
                                <div className="flex-1"><h3 className="font-semibold text-white mb-1">{item}</h3><p className="text-xs text-white/80">Potential risk factor regarding {item.toLowerCase()}.</p></div>
                            </div>
                        ))}
                    </div>
                </article>

                {/* Next Steps (RESTORED) */}
                <article className="rounded-2xl border border-sky-400/30 bg-sky-900/10 p-6 md:p-7 shadow-xl">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-2xl flex-shrink-0">🎯</div>
                       <h2 className="text-xl text-sky-400 font-bold mt-2">Recommended Next Steps</h2>
                    </div>
                    <div className="space-y-3">
                        {['Build MVP', 'Conduct User Testing', 'Secure Design Partners', 'Prepare Pitch Deck'].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#0f172a]/40 border border-sky-400/20">
                                <span className="text-sky-400 text-xl mt-0.5">•</span>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white mb-1">{item}</h3>
                                    <div className="mt-2 flex items-center gap-2"><div className="flex-1 h-1.5 rounded-full bg-slate-800"><div className="h-full w-1/4 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"></div></div><span className="text-xs text-white/60">In Progress</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
            </div>
        )}
    </div>
  );
};

export default Features;