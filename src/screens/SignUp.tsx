import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { authService } from '../services/auth.service';

interface SignUpProps {
   onNavigate: (view: string) => void;
   onLoginSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onNavigate, onLoginSuccess }) => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
         await authService.register(name, email, password);
         if (onLoginSuccess) {
            onLoginSuccess();
         } else {
            onNavigate('home');
         }
      } catch (err: any) {
         setError(err.response?.data?.message || 'Registration failed');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full flex justify-center animate-in fade-in zoom-in duration-300">
         <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-white/20 bg-[#0f172a]/70 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row">

            <div className="flex-1 bg-[#0f172a]/80 px-6 py-8 flex flex-col gap-5 relative">

               {/* NEW STYLED BACK BUTTON (Top Left) */}
               <button
                  onClick={() => onNavigate('home')}
                  className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg group"
                  title="Go Back"
               >
                  <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
               </button>

               <div className="flex items-center justify-center gap-2 mb-1 mt-6">
                  <div className="w-7 h-7 rounded-full bg-[#FFBA00] flex items-center justify-center text-[#0C3B2E] text-[11px] font-bold">IC</div>
                  <span className="text-white text-sm font-semibold">Idea Catalyst</span>
               </div>
               <div className="text-center">
                  <h2 className="text-[1.75rem] font-semibold mb-1 text-[#FFBA00]">Create account</h2>
                  <p className="text-sm text-white/80">Join Idea Catalyst today.</p>
               </div>

               {error && (
                  <div className="mb-2 p-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                     {error}
                  </div>
               )}

               <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-1">
                     <label className="text-sm text-white/80 ml-1">Full Name</label>
                     <input
                        type="text"
                        className="rounded-xl bg-[#0f172a]/60 border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                        placeholder="Alex Founder"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                     />
                  </div>
                  <div className="flex flex-col gap-1">
                     <label className="text-sm text-white/80 ml-1">Email</label>
                     <input
                        type="email"
                        className="rounded-xl bg-[#0f172a]/60 border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>
                  <div className="flex flex-col gap-1">
                     <label className="text-sm text-white/80 ml-1">Password</label>
                     <input
                        type="password"
                        className="rounded-xl bg-[#0f172a]/60 border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00]"
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>
                  <div className="flex flex-col gap-1">
                     <label className="text-sm text-white/80 ml-1">Startup stage</label>
                     <select className="rounded-xl bg-[#0f172a]/60 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFBA00] focus:ring-1 focus:ring-[#FFBA00] appearance-none cursor-pointer">
                        <option className="bg-[#0f172a]">Idea only</option>
                        <option className="bg-[#0f172a]">Prototype</option>
                        <option className="bg-[#0f172a]">Pre-launch</option>
                        <option className="bg-[#0f172a]">Launched</option>
                     </select>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-white/80">
                     <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 rounded border border-white/20 bg-[#0f172a]/60 accent-[#FFBA00]" required />
                     <label>I agree to the <span className="underline underline-offset-2">Terms</span> and <span className="underline underline-offset-2">Privacy Policy</span>.</label>
                  </div>
                  <button
                     disabled={loading}
                     className="w-full mt-2 rounded-xl py-2.5 text-sm font-semibold shadow-lg shadow-black/40 hover:scale-[1.01] active:scale-100 transition-transform bg-gradient-to-br from-[#FFBA00] to-[#BB8A52] text-[#0C3B2E] disabled:opacity-70 disabled:cursor-not-allowed">
                     {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
               </form>
               <p className="text-sm text-white/80 mt-4 text-center">Already have an account? <span onClick={() => onNavigate('signin')} className="text-sky-300 font-medium hover:text-sky-200 underline-offset-2 hover:underline cursor-pointer">Sign In</span></p>
            </div>

            <div className="hidden md:block w-1/2 relative">
               <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-tr from-[#6D9773] via-[#BB8A52] to-[#FFBA00] opacity-90"></div>
               <div className="absolute -top-10 right-6 w-28 h-28 rounded-3xl border border-white/30 bg-white/10 rotate-6"></div>
               <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-white/10 border border-white/20"></div>
               <div className="absolute top-1/2 left-4 -translate-y-1/2 w-28 h-32 rounded-3xl bg-[#0C3B2E]/30 border border-white/20 backdrop-blur-md"></div>
            </div>
         </div>
      </div>
   );
};

export default SignUp;