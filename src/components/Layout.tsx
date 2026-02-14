import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: string) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, isAuthenticated, onLogout }) => {
  return (
    <div
      className="w-full min-h-screen flex flex-col text-white font-sans selection:bg-[#FFBA00] selection:text-[#0C3B2E]"
      style={{
        background: 'linear-gradient(135deg, #0C3B2E 0%, #6D9773 40%, #BB8A52 75%, #FFBA00 100%)',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      {/* NAVBAR */}
      <header className="w-full">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-[#FFBA00] flex items-center justify-center text-[#0C3B2E] font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
              IC
            </div>
            <span className="font-semibold text-lg drop-shadow-md tracking-tight">Idea Catalyst</span>
          </div>

          {/* Links - UPDATED TO NAVIGATE */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
              <button onClick={() => onNavigate('features')} className="hover:text-[#FFBA00] transition-colors drop-shadow-sm">Features</button>
              <button onClick={() => onNavigate('marketplace')} className="hover:text-[#FFBA00] transition-colors drop-shadow-sm">Marketplace</button>
              <button onClick={() => onNavigate('personas')} className="hover:text-[#FFBA00] transition-colors drop-shadow-sm">Personas</button>
              <button onClick={() => onNavigate('about')} className="hover:text-[#FFBA00] transition-colors drop-shadow-sm">About</button>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              {isAuthenticated ? (
                <button onClick={onLogout} className="text-xs md:text-sm border border-[#FFBA00] text-[#0C3B2E] rounded-full px-4 py-1.5 font-bold bg-[#FFBA00] hover:bg-[#e6a800] transition-colors shadow-lg">
                  Logout
                </button>
              ) : (
                <>
                  <button onClick={() => onNavigate('signin')} className="text-xs md:text-sm border border-[#FFBA00] text-[#FFBA00] rounded-full px-4 py-1.5 font-medium bg-[#0f172a]/40 hover:bg-[#0f172a]/60 transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => onNavigate('signup')} className="text-xs md:text-sm border border-[#FFBA00] text-[#0C3B2E] rounded-full px-4 py-1.5 font-bold bg-[#FFBA00] hover:bg-[#e6a800] transition-colors shadow-lg">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-10 md:gap-12">
        {children}
      </main>

      {/* FOOTER - UPDATED LINKS */}
      <footer className="w-full mt-auto border-t border-white/10 bg-[#0f172a]/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-white/80 font-medium">
            <button onClick={() => onNavigate('about')} className="hover:text-[#FFBA00] transition-colors">About</button>
            <button className="hover:text-[#FFBA00] transition-colors">Contact</button>
            <button className="hover:text-[#FFBA00] transition-colors">Terms</button>
          </div>
          <p className="text-sm text-white/60">© 2026 Idea Catalyst. All rights reserved | Created by Moiz Baloch & Aimah Bilal</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;