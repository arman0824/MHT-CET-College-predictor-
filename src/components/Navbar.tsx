import React from 'react';
import { School, Search, Target, GitCompare, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'predictor' | 'compare' | 'trends';
  setActiveTab: (tab: 'explore' | 'predictor' | 'compare' | 'trends') => void;
  compareCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, compareCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Google Aesthetic */}
          <div 
            onClick={() => setActiveTab('explore')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <School className="w-6 h-6 text-google-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-lg tracking-tight text-slate-900">
                <span>MHT-CET</span>
                <span className="text-google-blue-500 font-bold">Cutoff</span>
                <span className="text-google-red-500 font-bold">Hub</span>
                <span className="inline-block w-2 h-2 rounded-full bg-google-green-500 ml-0.5"></span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-google-green-600 inline" />
                Official CAP Cutoffs • 105+ Maharashtra Colleges
              </p>
            </div>
          </div>

          {/* Center Nav Pills with Google Material Depth */}
          <nav className="hidden md:flex items-center p-1.5 bg-slate-100/80 rounded-full border border-slate-200/60 shadow-[inner_0_1px_3px_rgba(0,0,0,0.06)]">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'bg-white text-google-blue-600 shadow-[0_3px_8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] border border-slate-200/50 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Search className="w-4 h-4 text-google-blue-500" />
              Explore Colleges
            </button>

            <button
              onClick={() => setActiveTab('predictor')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'predictor'
                  ? 'bg-white text-google-green-600 shadow-[0_3px_8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] border border-slate-200/50 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Target className="w-4 h-4 text-google-green-500" />
              Cutoff Predictor
              <span className="bg-google-green-100 text-google-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                AI Match
              </span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                activeTab === 'compare'
                  ? 'bg-white text-google-yellow-600 shadow-[0_3px_8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] border border-slate-200/50 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <GitCompare className="w-4 h-4 text-google-yellow-600" />
              Compare
              {compareCount > 0 && (
                <span className="w-5 h-5 bg-google-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'trends'
                  ? 'bg-white text-google-red-600 shadow-[0_3px_8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] border border-slate-200/50 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-google-red-500" />
              2025 vs 2024 Trends
            </button>
          </nav>

          {/* Right Action - MHT CET Tag */}
          <div className="flex items-center gap-3">
            <a
              href="https://fe2025.mahacet.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-slate-800 transition-all duration-150"
            >
              <Sparkles className="w-3.5 h-3.5 text-google-yellow-500" />
              CET Cell Portal ↗
            </a>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2.5 overflow-x-auto no-scrollbar gap-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'explore'
                ? 'bg-google-blue-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Explore
          </button>

          <button
            onClick={() => setActiveTab('predictor')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'predictor'
                ? 'bg-google-green-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Predictor
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'compare'
                ? 'bg-google-yellow-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare ({compareCount})
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'trends'
                ? 'bg-google-red-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Trends
          </button>
        </div>

      </div>
    </header>
  );
};
