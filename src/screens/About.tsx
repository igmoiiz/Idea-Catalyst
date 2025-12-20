import React from 'react';
import { ArrowLeft, Users, Globe, Award } from 'lucide-react';

interface AboutProps {
  onNavigate: (view: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-300 pb-20 pt-6">
        
        {/* Back Button */}
        <button 
            onClick={() => onNavigate('home')} 
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg mb-8 group"
        >
            <ArrowLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-6">Empowering the next generation of <span className="text-[#FFBA00]">Founders</span>.</h1>
            <p className="text-xl text-white/80 leading-relaxed mb-12">
                Idea Catalyst is an AI-driven incubator designed to democratize entrepreneurship. 
                We believe that great ideas come from everywhere, but execution is what defines success. 
                Our platform bridges the gap between raw concepts and investment-ready ventures.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="p-6 rounded-2xl bg-[#0f172a]/60 border border-white/10 backdrop-blur-md text-center">
                    <Users className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-1">10k+</div>
                    <div className="text-sm text-white/60">Founders Joined</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#0f172a]/60 border border-white/10 backdrop-blur-md text-center">
                    <DollarSignIcon className="w-10 h-10 text-[#FFBA00] mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-1">$50M+</div>
                    <div className="text-sm text-white/60">Capital Raised</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#0f172a]/60 border border-white/10 backdrop-blur-md text-center">
                    <Globe className="w-10 h-10 text-sky-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-1">120+</div>
                    <div className="text-sm text-white/60">Countries</div>
                </div>
            </div>

            {/* Text Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-8 rounded-3xl bg-[#0f172a]/40 border border-white/5">
                    <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                    <p className="text-white/70 leading-relaxed">
                        To build the world's most accessible startup ecosystem. We provide the tools, 
                        mentorship, and network that were previously available only to a select few in Silicon Valley.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-[#0f172a]/40 border border-white/5">
                    <h3 className="text-2xl font-bold text-white mb-4">How it Works</h3>
                    <p className="text-white/70 leading-relaxed">
                        Submit your idea, let our AI agents analyze and refine it, build your roadmap, 
                        and then list it on our marketplace to connect with accredited investors instantly.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

// Helper Icon Component
const DollarSignIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

export default About;