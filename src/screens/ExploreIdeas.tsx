import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

interface ExploreProps {
    onNavigate: (view: string) => void;
    onViewDetails: (id: string) => void;
}

// Define Interface for Idea
interface Idea {
    _id: string;
    title: string;
    description: string;
    user: {
        name: string;
    };
    tags: string[];
    likes?: number; // Backend doesn't have likes yet, handling gracefully
    createdAt: string;
}

const ExploreIdeas: React.FC<ExploreProps> = ({ onNavigate, onViewDetails }) => {
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('recent');
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            const response = await api.get('/ideas/feed');
            if (response.data.success) {
                setIdeas(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch ideas", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredIdeas = ideas.filter(idea =>
        filter === 'all' ? true : idea.tags.some(t => t.toLowerCase() === filter)
    ).sort((a, b) => {
        // Sort logic
        if (sort === 'recent') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0; // Popular sort not fully implemented in backend yet
    });

    return (
        <div className="animate-in fade-in duration-300 pb-20 pt-6">

            {/* CLEAN ICON-ONLY BACK BUTTON */}
            <button
                onClick={() => onNavigate('home')}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg mb-8 group"
                title="Go Back"
            >
                <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <h1 className="text-4xl font-bold text-[#FFBA00] mb-6">Explore Startup Ideas</h1>

            <div className="flex flex-col gap-4 mb-8">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 rounded-xl bg-[#0f172a]/60 border border-white/15 px-4 py-3 focus-within:border-[#FFBA00] transition-colors">
                        <Search className="text-white/60" size={20} />
                        <input type="text" placeholder="Search startup ideas..." className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40" />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-white/70">Filter:</span>
                    {['all', 'ai', 'fintech', 'healthtech'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`text-sm px-4 py-1.5 rounded-full border border-white/15 font-medium transition-all ${filter === f ? 'bg-[#FFBA00] text-[#0C3B2E]' : 'bg-[#0f172a]/60 text-white hover:bg-[#0f172a]'}`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                    <div className="h-6 w-px bg-white/15 mx-2"></div>
                    <span className="text-sm text-white/70">Sort:</span>
                    {['recent', 'popular'].map(s => (
                        <button key={s} onClick={() => setSort(s)}
                            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-all ${sort === s ? 'bg-[#FFBA00] text-[#0C3B2E]' : 'bg-[#0f172a]/60 text-white hover:bg-[#0f172a]'}`}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-white text-center py-10">Loading ideas...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredIdeas.map(idea => (
                        <article
                            key={idea._id}
                            onClick={() => onViewDetails(idea._id)}
                            className="rounded-2xl border border-white/15 p-6 flex flex-col gap-3 hover:border-white/30 transition-all cursor-pointer bg-[#0f172a]/60 backdrop-blur-md hover:translate-y-[-2px] shadow-lg group"
                        >
                            <h3 className="text-lg text-white font-bold">{idea.title}</h3>
                            <p className="text-sm text-white/80 line-clamp-2">{idea.description}</p>

                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xl bg-white/10 w-8 h-8 flex items-center justify-center rounded-full">💡</span>
                                <div className="flex flex-col">
                                    <span className="text-xs text-white/60">Founder</span>
                                    <span className="text-sm text-white/90 font-medium">{idea.user?.name || 'Unknown'}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {idea.tags && idea.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-md bg-[#0f172a] border border-white/10 text-white/70">{tag}</span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                                <span className="text-sm text-white/70">❤️ {0} likes</span>
                                <span className="text-sm text-[#FFBA00] font-medium group-hover:underline">View Details →</span>
                            </div>
                        </article>
                    ))}
                    {filteredIdeas.length === 0 && (
                        <div className="col-span-full text-center text-white/50 py-10">
                            No ideas found. Be the first to submit one!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExploreIdeas;