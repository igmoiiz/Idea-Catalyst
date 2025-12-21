import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, User, Heart, Share2, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { authService } from '../services/auth.service';

interface IdeaDetailsProps {
    id: string;
    onNavigate: (view: string) => void;
}

interface Idea {
    _id: string;
    title: string;
    description: string;
    user: {
        _id?: string;
        name: string;
    };
    category: string;
    tags: string[];
    isPublic: boolean;
    likes?: number;
    createdAt: string;
    stats?: {
        views: number;
    };
}

interface PersonaResponse {
    _id: string;
    personaType: string;
    content: string;
    rating: number;
    createdAt: string;
}

const IdeaDetails: React.FC<IdeaDetailsProps> = ({ id, onNavigate }) => {
    const [idea, setIdea] = useState<Idea | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // AI Analysis State
    const [responses, setResponses] = useState<PersonaResponse[]>([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchIdeaAndResponses = async () => {
            try {
                // 1. Fetch Idea
                const ideaRes = await api.get(`/ideas/${id}`);
                if (!ideaRes.data.success) {
                    setError('Idea not found');
                    setLoading(false);
                    return;
                }

                const ideaData = ideaRes.data.data;
                setIdea(ideaData);

                // Check ownership
                const currentUser = authService.getCurrentUser();
                const isUserOwner = currentUser && (
                    (ideaData.user._id && ideaData.user._id === currentUser.id) ||
                    (typeof ideaData.user === 'string' && ideaData.user === currentUser.id)
                );
                setIsOwner(!!isUserOwner);

                // 2. Fetch Existing Responses
                try {
                    const responsesRes = await api.get(`/personas/idea/${id}`);
                    if (responsesRes.data.success) {
                        setResponses(responsesRes.data.data);

                        // Auto-analyze if owner and empty
                        if (isUserOwner && responsesRes.data.data.length === 0) {
                            triggerAnalysis(id);
                        }
                    }
                } catch (respErr) {
                    console.error("Failed to fetch responses", respErr);
                }

            } catch (err: any) {
                console.error("Failed to fetch idea details", err);
                setError(err.response?.data?.message || 'Failed to load idea');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIdeaAndResponses();
        }
    }, [id]);

    const triggerAnalysis = async (ideaId: string) => {
        setAnalyzing(true);
        setAnalysisError('');
        try {
            // Trigger parallel analysis for key personas
            const personasToAnalyze = ["Market Analyst", "Investor"];

            await Promise.all(personasToAnalyze.map(persona =>
                api.post('/personas/generate', {
                    ideaId: ideaId,
                    personaType: persona
                })
            ));

            // Refetch to get the results
            const responsesRes = await api.get(`/personas/idea/${ideaId}`);
            if (responsesRes.data.success) {
                setResponses(responsesRes.data.data);
            }
        } catch (err: any) {
            console.error("Analysis trigger failed", err);
            setAnalysisError(err.response?.data?.message || "Failed to generate AI analysis. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-[#FFBA00] text-xl font-medium animate-pulse">Loading idea details...</div>
            </div>
        );
    }

    if (error || !idea) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="text-white text-xl">{error || 'Idea not found'}</div>
                <button
                    onClick={() => onNavigate('explore')}
                    className="text-[#FFBA00] hover:underline"
                >
                    Back to Explore
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300 pb-20 pt-6 max-w-4xl mx-auto">
            <button
                onClick={() => onNavigate('explore')}
                className="group flex items-center gap-2 text-white/60 hover:text-[#FFBA00] mb-8 transition-colors"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Explore
            </button>

            <article className="bg-[#0f172a]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl mb-8">
                {/* Header */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#0f172a]/80 to-[#0f172a]/40">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {idea.tags.map(tag => (
                            <span key={tag} className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFBA00]/10 text-[#FFBA00] border border-[#FFBA00]/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{idea.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{idea.user?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                        </div>
                        {idea.stats && (
                            <div className="flex items-center gap-2">
                                <span>👁️ {idea.stats.views} views</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-xl font-semibold text-white/90 mb-3">About this Idea</h3>
                        <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                            {idea.description}
                        </p>
                    </div>

                    {idea.category && (
                        <div className="bg-[#0C3B2E]/30 rounded-xl p-4 border border-[#0C3B2E]/50">
                            <span className="block text-xs text-white/50 uppercase tracking-widest mb-1">Category</span>
                            <span className="text-lg font-medium text-white">{idea.category}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-white/10">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFBA00] text-[#0C3B2E] font-bold hover:bg-[#e6a800] transition-colors shadow-lg shadow-[#FFBA00]/10">
                            Support this Idea
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] border border-white/10 text-white hover:bg-[#1e293b] transition-colors">
                            <Heart size={18} className="text-red-400" />
                            Like ({idea.likes || 0})
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] border border-white/10 text-white hover:bg-[#1e293b] transition-colors">
                            <Share2 size={18} />
                            Share
                        </button>
                    </div>
                </div>
            </article>

            {/* AI Analysis Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-[#FFBA00]" />
                    <h2 className="text-2xl font-bold text-white">AI Persona Analysis</h2>
                </div>

                {analysisError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 flex items-center gap-3 mb-4">
                        <AlertCircle size={20} />
                        <span>{analysisError}</span>
                    </div>
                )}

                {analyzing ? (
                    <div className="p-8 rounded-2xl bg-[#0f172a]/40 border border-[#FFBA00]/30 flex flex-col items-center text-center animate-pulse">
                        <Sparkles className="text-[#FFBA00] mb-4 animate-spin-slow" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">Analyzing your idea...</h3>
                        <p className="text-white/60">Our AI personas are reviewing your concept against market data.</p>
                    </div>
                ) : responses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {responses.map(response => {
                            // Check if this is a fallback response
                            const isFallback = response.content.includes('⚠️ FALLBACK MODE') ||
                                response.content.includes('Live AI analysis unavailable');

                            return (
                                <div key={response._id} className="rounded-2xl border border-white/10 bg-[#0f172a]/60 backdrop-blur-md p-6 hover:border-[#FFBA00]/30 transition-all">
                                    {isFallback && (
                                        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2 text-yellow-200 text-sm">
                                            <AlertCircle size={16} />
                                            <span>Fallback Mode: Gemini API unavailable</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#FFBA00]/20 flex items-center justify-center text-[#FFBA00]">
                                                {response.personaType === 'Investor' ? <DollarSignMini /> : <MessageSquare size={18} />}
                                            </div>
                                            <h3 className="font-bold text-white">{response.personaType}</h3>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-[#FFBA00]">
                                            Rating: {response.rating}/10
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                                        {response.content}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 rounded-2xl bg-[#0f172a]/40 border border-white/10 flex flex-col items-center text-center">
                        <AlertCircle className="text-white/40 mb-4" size={32} />
                        <p className="text-white/60 mb-4">No analysis available yet.</p>
                        {isOwner && (
                            <button
                                onClick={() => id && triggerAnalysis(id)}
                                className="px-6 py-2 rounded-xl bg-[#FFBA00] text-[#0C3B2E] font-bold hover:scale-105 transition-transform"
                            >
                                Generate AI Analysis
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper
const DollarSignMini = ({ size = 18 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

export default IdeaDetails;
