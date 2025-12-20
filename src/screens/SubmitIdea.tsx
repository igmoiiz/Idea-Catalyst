import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import api from '../api/axios';

interface SubmitIdeaProps {
    onNavigate: (view: string) => void;
    onViewDetails: (id: string) => void;
}

const SubmitIdea: React.FC<SubmitIdeaProps> = ({ onNavigate, onViewDetails }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); // Problem
    const [solution, setSolution] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!title || !description || !category) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const fullDescription = `Problem: ${description}\nSolution: ${solution}`;

            const res = await api.post('/ideas', {
                title,
                description: fullDescription,
                category,
                isPublic: true, // Default to true for now
                tags: [category, 'New']
            });

            if (res.data.success && res.data.data._id) {
                onViewDetails(res.data.data._id);
            } else {
                onNavigate('explore');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit idea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in duration-300 pb-20 pt-6">

            {/* CLEAN ICON-ONLY BACK BUTTON */}
            <button
                onClick={() => onNavigate('home')}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg mb-8 group"
                title="Go Back"
            >
                <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <h1 className="text-[2.5rem] font-bold text-[#FFBA00] mb-8">Submit Your Startup Idea</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: FORM CARD */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-white/20 bg-[#0f172a]/70 backdrop-blur-xl p-6 md:p-7 shadow-2xl">
                        <form className="flex flex-col gap-5" onSubmit={e => e.preventDefault()}>
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-base text-white/90 font-medium">Idea Title</label>
                                <input
                                    type="text"
                                    className="rounded-xl bg-[#0f172a]/60 border border-white/15 px-4 py-2.5 text-white outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00] transition-all"
                                    placeholder="e.g., AI-Powered Fitness Coach"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-base text-white/90 font-medium">Problem Statement</label>
                                <textarea
                                    rows={4}
                                    className="rounded-xl bg-[#0f172a]/60 border border-white/15 px-4 py-2.5 text-white outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00] resize-none transition-all"
                                    placeholder="Describe the problem your idea solves..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-base text-white/90 font-medium">Proposed Solution</label>
                                <textarea
                                    rows={4}
                                    className="rounded-xl bg-[#0f172a]/60 border border-white/15 px-4 py-2.5 text-white outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00] resize-none transition-all"
                                    placeholder="How does your idea solve this problem?"
                                    value={solution}
                                    onChange={e => setSolution(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-base text-white/90 font-medium">Industry</label>
                                <select
                                    className="rounded-xl bg-[#0f172a]/60 border border-white/15 px-4 py-2.5 text-white outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00] transition-all appearance-none cursor-pointer"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option className="bg-[#0f172a]" value="">Select an industry</option>
                                    <option className="bg-[#0f172a]" value="FinTech">FinTech</option>
                                    <option className="bg-[#0f172a]" value="AI">AI / Machine Learning</option>
                                    <option className="bg-[#0f172a]" value="HealthTech">HealthTech</option>
                                    <option className="bg-[#0f172a]" value="EdTech">EdTech</option>
                                    <option className="bg-[#0f172a]" value="E-commerce">E-commerce</option>
                                    <option className="bg-[#0f172a]" value="SaaS">SaaS</option>
                                    <option className="bg-[#0f172a]" value="CleanTech">CleanTech</option>
                                    <option className="bg-[#0f172a]" value="Other">Other</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full mt-3 rounded-xl py-3 text-base font-semibold shadow-lg shadow-black/40 hover:scale-[1.01] active:scale-100 transition-transform bg-gradient-to-br from-[#FFBA00] to-[#BB8A52] text-[#0C3B2E] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Idea →'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: TIPS SIDEBAR */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-white/20 bg-[#0f172a]/70 backdrop-blur-xl p-5 shadow-2xl sticky top-6">
                        <h3 className="text-base text-white font-semibold mb-3 flex items-center gap-2">
                            <span className="text-lg">💡</span> Tips for Success
                        </h3>
                        <ul className="space-y-3 text-sm text-white/80">
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> <span><strong>Keep it concise:</strong> Focus on the core value proposition.</span></li>
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> <span><strong>Define real problem:</strong> Clearly articulate the pain point.</span></li>
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> <span><strong>Avoid jargon:</strong> Use simple, clear language.</span></li>
                            <li className="flex items-start gap-2"><span className="text-sky-400 mt-0.5">•</span> <span><strong>Be specific:</strong> Provide concrete examples and metrics.</span></li>
                            <li className="flex items-start gap-2"><span className="text-sky-400 mt-0.5">•</span> <span><strong>Think big:</strong> Don't limit your vision, but stay realistic.</span></li>
                        </ul>
                        <div className="mt-5 pt-4 border-t border-white/10">
                            <p className="text-[11px] text-white/60 leading-relaxed">Our AI will analyze your idea across market fit, competition, technical feasibility, and funding potential.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitIdea;