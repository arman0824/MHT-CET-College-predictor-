import React from 'react';
import { School, GitCompare, Target, TrendingUp, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-700 flex items-center justify-center border border-slate-600">
                <School className="w-6 h-6 text-google-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-white text-lg tracking-tight">
                  <span>MHT-CET</span>
                  <span className="text-google-blue-400 font-extrabold">Cutoff</span>
                  <span className="text-google-red-400 font-extrabold">Hub</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-google-green-400 ml-0.5"></span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Official CAP Cutoffs & Admission Predictor</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              India's most comprehensive MHT-CET engineering cutoff tracker. Real-time data for 105+ Maharashtra colleges across Mumbai, Pune, Nagpur, Nashik, and all major regions.
            </p>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-google-green-500 inline" />
              <span>Verified CET Cell Data</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://fe2025.mahacet.org" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Features Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Explore Tools</h4>
            <nav className="space-y-2.5">
              <a 
                href="#explore" 
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <School className="w-3.5 h-3.5 text-google-blue-400 flex-shrink-0" />
                <span>Explore 105+ Colleges</span>
              </a>
              <a 
                href="#predictor" 
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Target className="w-3.5 h-3.5 text-google-green-400 flex-shrink-0" />
                <span>Admission Predictor AI</span>
              </a>
              <a 
                href="#compare" 
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5 text-google-yellow-400 flex-shrink-0" />
                <span>Side-by-Side Compare</span>
              </a>
              <a 
                href="#trends" 
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-google-red-400 flex-shrink-0" />
                <span>2025 vs 2024 Trends</span>
              </a>
            </nav>
          </div>

          {/* Regions Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Maharashtra Regions</h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Mumbai & Thane</a>
              <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Pune Region</a>
              <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Nagpur</a>
              <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Nashik</a>
              <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Chh. Sambhajinagar</a>
              <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Sangli/Kolhapur</a>
              <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Amravati & Nanded</a>
              <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Solapur & Others</a>
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Quick Links</h4>
            <nav className="space-y-2.5">
              <a href="https://fe2025.mahacet.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Official CET Cell Portal</span>
              </a>
              <a href="https://cetcell.mahacet.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span>CAP Admission Schedule</span>
              </a>
              <a href="https://cetcell.mahacet.org/pdf/InformationBrochure.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Information Brochure PDF</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Document Verification Centers</span>
              </a>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <div className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} MHT-CET Cutoff Hub. Built with React + Tailwind CSS. 
            <span className="mx-2">·</span>
            Not affiliated with State CET Cell, Maharashtra. For reference only.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            <a href="mailto:support@mhcetcutoff.com" className="hover:text-white transition-colors">Contact</a>
          </div>

        </div>

      </div>
    </footer>
  );
};