import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

interface MarketplaceProps {
    onNavigate: (view: string) => void;
    onViewDetails: (id: string) => void;
}

interface Startup {
    _id: string;
    title: string;
    description: string;
    industry: string;
    funding: string;
    valuation: string;
    goal: string;
    raised: string;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onNavigate, onViewDetails }) => {
    const [filter, setFilter] = useState('all');
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStartups();
    }, []);

    const fetchStartups = async () => {
        try {
            const response = await api.get('/marketplace');
            if (response.data.success) {
                setStartups(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch startups", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStartups = startups.filter(s =>
        filter === 'all' ? true : s.industry.toLowerCase() === filter.toLowerCase() || s.funding.toLowerCase() === filter.toLowerCase()
    );

    return (
        <div className="animate-in fade-in duration-300 pb-20 pt-6">

            {/* Back Button */}
            <button
                onClick={() => onNavigate('home')}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg mb-8 group"
            >
                <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-[2.5rem] font-bold text-[#FFBA00] mb-2">Startup Marketplace</h1>
                    <p className="text-white/80">Invest in the next generation of unicorns.</p>
                </div>

                {/* Search */}
                <div className="w-full md:w-auto min-w-[300px]">
                    <div className="flex items-center gap-3 rounded-xl bg-[#0f172a]/60 border border-white/15 px-4 py-3 focus-within:border-[#FFBA00] transition-colors">
                        <Search className="text-white/60" size={20} />
                        <input type="text" placeholder="Find investment opportunities..." className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-sm text-white/70">Filter:</span>
                {['all', 'seed', 'series a', 'ai', 'fintech'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`text-sm px-4 py-1.5 rounded-full border border-white/15 font-medium transition-all ${filter === f ? 'bg-[#FFBA00] text-[#0C3B2E]' : 'bg-[#0f172a]/60 text-white hover:bg-[#0f172a]'}`}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div className="text-white text-center py-10">Loading marketplace...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStartups.map(startup => (
                        <article
                            key={startup._id}
                            onClick={() => onViewDetails(startup._id)}
                            className="rounded-2xl border border-white/15 p-6 flex flex-col gap-4 hover:border-[#FFBA00]/50 transition-all cursor-pointer bg-[#0f172a]/60 backdrop-blur-md hover:-translate-y-1 shadow-lg group"
                        >

                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg">
                                        {startup.title.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg text-white font-bold leading-tight">{startup.title}</h3>
                                        <span className="text-xs text-white/60">{startup.industry}</span>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-md bg-white/10 text-[10px] uppercase font-bold text-[#FFBA00] border border-white/5">
                                    {startup.funding}
                                </span>
                            </div>

                            <p className="text-sm text-white/80 line-clamp-2 min-h-[40px]">{startup.description}</p>

                            {/* Financial Stats */}
                            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0f172a]/50 border border-white/10">
                                <div>
                                    <span className="text-[10px] text-white/50 block">Valuation</span>
                                    <span className="text-sm font-bold text-white">{startup.valuation}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-white/50 block">Target</span>
                                    <span className="text-sm font-bold text-white">{startup.goal}</span>
                                </div>
                            </div>

                            {/* Funding Progress */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-xs text-white/70">
                                    <span>Raised</span>
                                    <span className="text-[#FFBA00]">{startup.raised}</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-800">
                                    <div className="h-full bg-gradient-to-r from-[#FFBA00] to-[#BB8A52] rounded-full" style={{ width: startup.raised }}></div>
                                </div>
                            </div>

                            <div className="pt-2 mt-auto">
                                <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white group-hover:bg-[#FFBA00] group-hover:text-[#0C3B2E] transition-all flex items-center justify-center gap-2">
                                    Invest Now <ArrowLeft size={16} className="rotate-180" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;