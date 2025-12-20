import React from 'react';

interface HomeProps {
  onNavigate: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <section className="flex flex-col gap-16 animate-in fade-in duration-500 pb-20">
      
      {/* ==================== 1. HERO SECTION ==================== */}
      <div className="flex flex-col md:flex-row items-center gap-10 pt-4">
        
        {/* LEFT: Text Content */}
        <div className="flex-1 flex flex-col gap-5">
          <span className="inline-flex items-center text-white tracking-wide uppercase bg-[#0f172a]/40 border border-white/10 rounded-full px-3 py-1 w-max text-[13px] backdrop-blur-md shadow-sm font-semibold">
             IDEA CATALYST 
          </span>
          <h1 className="text-5xl md:text-[3.5rem] font-extrabold leading-[1.1] drop-shadow-2xl">
            AI-Powered <br/> Startup Incubator
          </h1>
          <p className="text-lg text-white/80 max-w-xl font-light drop-shadow-md leading-relaxed">
            Transform raw ideas into investment-ready startups.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={() => onNavigate('submitidea')} className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-bold shadow-xl shadow-black/30 hover:scale-[1.02] active:scale-95 transition-all bg-gradient-to-br from-[#FFBA00] to-[#BB8A52] text-[#0C3B2E]">
              Submit Idea →
            </button>
            <button onClick={() => onNavigate('explore')} className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-bold border border-[#FFBA00] text-[#FFBA00] bg-[#0f172a]/40 hover:bg-[#0f172a]/80 transition-colors">
              Explore Ideas
            </button>
          </div>
        </div>

        {/* RIGHT: Hero Dashboard Mockup */}
        <div className="flex-1 w-full">
          <div className="relative rounded-2xl border border-white/10 p-5 md:p-6 shadow-2xl overflow-hidden bg-[#0f172a]/60 backdrop-blur-xl">
             <div className="absolute -top-10 -right-16 w-40 h-40 rounded-full bg-[#FFBA00]/20 blur-3xl pointer-events-none"></div>
             <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-[#6D9773]/30 blur-3xl pointer-events-none"></div>
             
             <div className="relative flex flex-col gap-3 text-white">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                   </div>
                   <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">AI Venture Dashboard</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   {/* Market Fit */}
                   <div className="rounded-lg p-3 flex flex-col gap-2 border border-white/5 bg-[#0f172a]/70">
                      <span className="text-xs text-white/60 font-medium">Market Fit Score</span>
                      <div className="w-full h-20 rounded-md bg-gradient-to-tr from-[#FFBA00]/10 to-[#BB8A52]/10 flex items-end gap-1 px-1 pb-1">
                         <div className="flex-1 bg-[#FFBA00]/90 rounded-t-sm h-[40%]"></div>
                         <div className="flex-1 bg-[#BB8A52]/90 rounded-t-sm h-[70%]"></div>
                         <div className="flex-1 bg-emerald-400/90 rounded-t-sm h-[90%]"></div>
                         <div className="flex-1 bg-sky-400/90 rounded-t-sm h-[60%]"></div>
                      </div>
                   </div>

                   {/* Funding Readiness */}
                   <div className="rounded-lg p-3 flex flex-col gap-2 border border-white/5 bg-[#0f172a]/70">
                      <span className="text-xs text-white/60 font-medium">Funding Readiness</span>
                      <div className="flex items-center gap-3">
                         <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500/30"></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-[#020617]">82%</div>
                         </div>
                         <div className="flex-1 flex flex-col gap-2">
                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full w-3/4 bg-emerald-400 rounded-full"></div></div>
                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full w-2/3 bg-amber-400 rounded-full"></div></div>
                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full w-1/2 bg-sky-400 rounded-full"></div></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-1">
                   <div className="rounded-lg p-2.5 flex flex-col gap-1 border border-white/5 bg-[#0f172a]/70">
                        <span className="text-[10px] text-white/60">AI Analyst</span>
                        <span className="text-[11px] font-bold text-white">Market, SWOT, Competition</span>
                   </div>
                   <div className="rounded-lg p-2.5 flex flex-col gap-1 border border-white/5 bg-[#0f172a]/70">
                        <span className="text-[10px] text-white/60">AI PM Planner</span>
                        <span className="text-[11px] font-bold text-white">Cost, Timeline, Architecture</span>
                   </div>
                   <div className="rounded-lg p-2.5 flex flex-col gap-1 border border-white/5 bg-[#0f172a]/70">
                        <span className="text-[10px] text-white/60">Investor Sim</span>
                        <span className="text-[11px] font-bold text-white">Funding chances, risks</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. FEATURES SECTION ==================== */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <h2 className="text-2xl font-bold drop-shadow-md text-white">Power up every stage of your startup</h2>
            <p className="text-sm text-white/80 max-w-md">From raw idea to investor-ready deck, our AI copilots guide founders through analysis, planning, and fundraising.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <article onClick={() => onNavigate('features')} className="rounded-2xl border border-white/10 p-6 flex flex-col gap-3 cursor-pointer hover:border-white/30 transition-colors bg-[#0f172a]/60 backdrop-blur-md shadow-lg group">
                <h3 className="text-base font-bold flex items-center gap-2 text-white"><span className="text-xl">🤖</span> AI Analyst</h3>
                <p className="text-sm text-white/80 leading-relaxed">Market research, SWOT breakdowns, and competition mapping in minutes.</p>
            </article>

            <article onClick={() => onNavigate('features')} className="rounded-2xl border border-white/10 p-6 flex flex-col gap-3 cursor-pointer hover:border-white/30 transition-colors bg-[#0f172a]/60 backdrop-blur-md shadow-lg group">
                <h3 className="text-base font-bold flex items-center gap-2 text-white"><span className="text-xl">📋</span> AI PM Planner</h3>
                <p className="text-sm text-white/80 leading-relaxed">Cost estimates, build timelines, and architecture drafts tailored to your idea.</p>
            </article>

            <article onClick={() => onNavigate('features')} className="rounded-2xl border border-white/10 p-6 flex flex-col gap-3 cursor-pointer hover:border-white/30 transition-colors bg-[#0f172a]/60 backdrop-blur-md shadow-lg group">
                <h3 className="text-base font-bold flex items-center gap-2 text-white"><span className="text-xl">💸</span> Investor Sim</h3>
                <p className="text-sm text-white/80 leading-relaxed">Simulate investor feedback, funding probabilities, and portfolio fit.</p>
            </article>
        </div>
      </div>

      {/* ==================== 3. SHOWCASE / COCKPIT SECTION (Missing Part) ==================== */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <h2 className="text-2xl font-bold text-white">See your founder cockpit</h2>
          <p className="text-sm text-white/80 max-w-md">A single dashboard that keeps your metrics, milestones, and investor conversations in sync.</p>
        </div>

        {/* Large Dashboard Mockup */}
        <div className="rounded-2xl border border-white/10 p-4 md:p-6 shadow-2xl bg-[#0f172a]/60 backdrop-blur-xl">
          <div className="w-full h-auto rounded-xl bg-[#0f172a]/80 border border-white/10 overflow-hidden relative flex flex-col">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-400/80 flex items-center justify-center text-[10px] font-bold text-slate-950">AI</div>
                    <div className="flex flex-col">
                        <span className="text-xs text-white font-semibold">Venture Overview</span>
                        <span className="text-[10px] text-white/60">IdeaCatalyst • Pre-seed</span>
                    </div>
                </div>
                <button className="text-[10px] border border-white/20 rounded-full px-3 py-1 bg-[#0f172a]/60 text-[#FFBA00]">Export Deck</button>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-3 py-3">
                {/* Left Column */}
                <div className="md:col-span-2 flex flex-col gap-2">
                    {/* Revenue Chart */}
                    <div className="rounded-lg bg-[#1e293b]/50 p-3 flex flex-col justify-between h-32">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] text-white/70">Runway & Revenue</span>
                            <span className="text-[10px] text-emerald-300">18 mo</span>
                        </div>
                        <div className="flex items-end gap-1.5 h-full">
                            <div className="flex-1 h-[60%] rounded-t-md bg-emerald-400/70"></div>
                            <div className="flex-1 h-[40%] rounded-t-md bg-sky-400/70"></div>
                            <div className="flex-1 h-[80%] rounded-t-md bg-amber-400/70"></div>
                            <div className="flex-1 h-[30%] rounded-t-md bg-emerald-500/60"></div>
                            <div className="flex-1 h-[50%] rounded-t-md bg-sky-500/60"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-[#1e293b]/50 p-2.5 flex flex-col gap-1">
                            <span className="text-[10px] text-white/60">User Growth</span>
                            <div className="h-1.5 rounded-full bg-slate-900 mt-1">
                                <div className="h-full w-4/5 rounded-full bg-emerald-400"></div>
                            </div>
                            <span className="text-[10px] text-white/70 mt-1">+24% MoM</span>
                        </div>
                        <div className="rounded-lg bg-[#1e293b]/50 p-2.5 flex flex-col gap-1">
                            <span className="text-[10px] text-white/60">Investor Interest</span>
                            <div className="flex gap-1.5 mt-2 items-end h-6">
                                <span className="w-1.5 h-3 rounded-full bg-emerald-400/70"></span>
                                <span className="w-1.5 h-6 rounded-full bg-emerald-400"></span>
                                <span className="w-1.5 h-4 rounded-full bg-amber-400/80"></span>
                                <span className="w-1.5 h-5 rounded-full bg-sky-400/80"></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-2">
                    <div className="rounded-lg bg-[#1e293b]/50 p-2.5 flex flex-col gap-1">
                        <span className="text-[10px] text-white/60">AI Notes</span>
                        <p className="text-[10px] text-white/80 leading-snug">Strong technical moat. Focus on B2B pilots. Highlight 3 flagship customers.</p>
                    </div>
                    <div className="rounded-lg bg-[#1e293b]/50 p-2.5 flex flex-col gap-1">
                        <span className="text-[10px] text-white/60">Next Milestones</span>
                        <ul className="space-y-1.5 mt-1">
                            <li className="flex items-center gap-1.5 text-[10px] text-white/80"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> MVP launch</li>
                            <li className="flex items-center gap-1.5 text-[10px] text-white/80"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 5 design partners</li>
                            <li className="flex items-center gap-1.5 text-[10px] text-white/80"><span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Seed pitch week</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between bg-[#1e293b]/30">
                <span className="text-[10px] text-white/60">Generated by IdeaCatalyst AI</span>
                <span className="text-[10px] text-emerald-300">Live • Synced</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Home;