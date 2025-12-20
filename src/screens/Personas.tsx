import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, User, Zap } from 'lucide-react';
import api from '../api/axios';

interface PersonasProps {
    onNavigate: (view: string) => void;
    isAuthenticated?: boolean;
}

interface Idea {
    _id: string;
    title: string;
}

interface PersonaResponse {
    _id: string;
    personaType: string;
    content: string;
    rating: number;
}

const Personas: React.FC<PersonasProps> = ({ onNavigate, isAuthenticated }) => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [selectedIdeaId, setSelectedIdeaId] = useState('');
    const [selectedPersona, setSelectedPersona] = useState('VC'); // VC, Customer, Skeptic
    const [response, setResponse] = useState<PersonaResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchingIdeas, setFetchingIdeas] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyIdeas();
        } else {
            setFetchingIdeas(false);
        }
    }, [isAuthenticated]);

    const fetchMyIdeas = async () => {
        try {
            const res = await api.get('/ideas/my-ideas');
            if (res.data.success) {
                setIdeas(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedIdeaId(res.data.data[0]._id);
                }
            }
        } catch (error) {
            console.error("Error fetching ideas", error);
        } finally {
            setFetchingIdeas(false);
        }
    };

    const generateResponse = async () => {
        if (!selectedIdeaId) return;
        setLoading(true);
        setResponse(null);

        try {
            // First check if exists (optional, handled by backend usually but nice to be explicit in UI)
            const res = await api.post('/personas/generate', {
                ideaId: selectedIdeaId,
                personaType: selectedPersona
            });

            if (res.data.success) {
                setResponse(res.data.data);
            }
        } catch (error: any) {
            console.error("Error generating response", error);
            alert(error.response?.data?.message || "Failed to generate response");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="animate-in fade-in duration-300 pb-20 pt-6">
                <button
                    onClick={() => onNavigate('home')}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg mb-8 group"
                >
                    <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <h1 className="text-[2.5rem] font-bold text-[#FFBA00] mb-2">AI Persona Feedback</h1>
                <p className="text-white/80 mb-8 max-w-2xl">Sign in to see your idea through the eyes of different personas.</p>
                <div className="p-10 rounded-2xl bg-[#0f172a]/60 border border-white/10 text-center flex flex-col items-center gap-4">
                    <p className="text-white text-lg">You must be signed in to access this feature.</p>
                    <button onClick={() => onNavigate('signin')} className="px-8 py-3 rounded-xl bg-[#FFBA00] text-[#0C3B2E] font-bold shadow-lg hover:scale-105 transition-transform">Sign In</button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300 pb-20 pt-6">

            {/* Back Button */}
            <button
                onClick={() => onNavigate('home')}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg mb-8 group"
            >
                <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <h1 className="text-[2.5rem] font-bold text-[#FFBA00] mb-2">AI Persona Feedback</h1>
            <p className="text-white/80 mb-8 max-w-2xl">See your idea through the eyes of different personas: a Venture Capitalist, a Potential Customer, or a Skeptic.</p>

            {fetchingIdeas ? (
                <div className="text-white">Loading your ideas...</div>
            ) : ideas.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#0f172a]/60 border border-white/10 text-center">
                    <p className="text-white mb-4">You haven't submitted any ideas yet.</p>
                    <button onClick={() => onNavigate('submitidea')} className="px-6 py-2 rounded-xl bg-[#FFBA00] text-[#0C3B2E] font-semibold">Submit an Idea</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="col-span-1 space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/80">Select Your Idea</label>
                            <select
                                className="w-full rounded-xl bg-[#0f172a]/60 border border-white/15 px-4 py-3 text-white outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                                value={selectedIdeaId}
                                onChange={(e) => setSelectedIdeaId(e.target.value)}
                            >
                                {ideas.map(idea => (
                                    <option key={idea._id} value={idea._id} className="bg-[#0f172a]">{idea.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-white/80">Select Persona</label>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => setSelectedPersona('VC')}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedPersona === 'VC' ? 'bg-[#FFBA00]/10 border-[#FFBA00] text-white' : 'bg-[#0f172a]/40 border-white/10 text-white/60 hover:bg-[#0f172a]/60'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedPersona === 'VC' ? 'bg-[#FFBA00] text-[#0C3B2E]' : 'bg-white/10'}`}>
                                        <DollarSignMini />
                                    </div>
                                    <span className="font-medium">Venture Capitalist</span>
                                </button>

                                <button
                                    onClick={() => setSelectedPersona('Customer')}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedPersona === 'Customer' ? 'bg-[#FFBA00]/10 border-[#FFBA00] text-white' : 'bg-[#0f172a]/40 border-white/10 text-white/60 hover:bg-[#0f172a]/60'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedPersona === 'Customer' ? 'bg-[#FFBA00] text-[#0C3B2E]' : 'bg-white/10'}`}>
                                        <User size={16} />
                                    </div>
                                    <span className="font-medium">Potential Customer</span>
                                </button>

                                <button
                                    onClick={() => setSelectedPersona('Skeptic')}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedPersona === 'Skeptic' ? 'bg-[#FFBA00]/10 border-[#FFBA00] text-white' : 'bg-[#0f172a]/40 border-white/10 text-white/60 hover:bg-[#0f172a]/60'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedPersona === 'Skeptic' ? 'bg-[#FFBA00] text-[#0C3B2E]' : 'bg-white/10'}`}>
                                        <Zap size={16} />
                                    </div>
                                    <span className="font-medium">The Skeptic</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={generateResponse}
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFBA00] to-[#BB8A52] text-[#0C3B2E] font-bold shadow-lg shadow-[#FFBA00]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Analyzing...' : <> <MessageSquare size={18} /> Generate Feedback </>}
                        </button>
                    </div>

                    {/* Output */}
                    <div className="md:col-span-2">
                        {response ? (
                            <div className="rounded-2xl border border-white/20 bg-[#0f172a]/70 backdrop-blur-xl p-6 shadow-2xl h-full animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                                    <div className="w-12 h-12 rounded-full bg-[#FFBA00] flex items-center justify-center text-[#0C3B2E]">
                                        {selectedPersona === 'VC' && <DollarSignMini size={24} />}
                                        {selectedPersona === 'Customer' && <User size={24} />}
                                        {selectedPersona === 'Skeptic' && <Zap size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {selectedPersona === 'VC' && "Venture Capitalist Analysis"}
                                            {selectedPersona === 'Customer' && "Customer Perspective"}
                                            {selectedPersona === 'Skeptic' && "Critical Review"}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-sm text-white/60">Rating:</span>
                                            <span className="text-[#FFBA00] font-bold">{response.rating}/10</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none">
                                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{response.content}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[300px] rounded-2xl border border-white/10 bg-[#0f172a]/30 flex flex-col items-center justify-center text-white/40 p-10 text-center">
                                <MessageSquare size={48} className="mb-4 opacity-50" />
                                <p>Select an idea and persona, then click "Generate Feedback" to see the AI analysis.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Icon
const DollarSignMini = ({ size = 16 }: { size?: number }) => (
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

export default Personas;
