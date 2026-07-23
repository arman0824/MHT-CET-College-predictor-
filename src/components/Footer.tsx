import React, { useState } from 'react';
import { School, GitCompare, Target, TrendingUp, ShieldCheck, ExternalLink, Download, ChevronDown } from 'lucide-react';

type FooterTab = 'explore' | 'predictor' | 'compare' | 'trends';

interface FooterProps {
  setActiveTab: (tab: FooterTab) => void;
}

const REGION_LINKS = [
  'Mumbai & Thane',
  'Pune Region',
  'Nagpur',
  'Nashik',
  'Chh. Sambhajinagar',
  'Sangli/Kolhapur',
  'Amravati & Nanded',
  'Solapur & Others'
];

const AccordionSection: React.FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({
  title,
  defaultOpen = false,
  children
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="md:open border-b md:border-b-0 border-slate-800 last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="md:cursor-default md:pointer-events-none w-full flex items-center justify-between py-3 md:py-0 md:mb-4 text-left"
        aria-expanded={open}
      >
        <h4 className="font-bold text-white text-sm uppercase tracking-wider">{title}</h4>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform md:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`${open ? 'block' : 'hidden'} md:block pb-3 md:pb-0`}>{children}</div>
    </div>
  );
};

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const goTo = (tab: FooterTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-24 md:pb-6 mt-auto safe-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Brand column - always visible */}
        <div className="space-y-4 mb-6 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow flex items-center justify-center">
              <School className="w-6 h-6 text-google-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-bold text-white text-lg tracking-tight">
                <span>CET</span>
                <span className="text-google-blue-400 font-extrabold">Vault</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Official CAP Cutoffs & Predictor</p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            India's most comprehensive MHT-CET engineering cutoff tracker. Real-time data for 370+ Maharashtra colleges across Mumbai, Pune, Nagpur, Nashik, and all major regions.
          </p>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-google-green-500 inline" />
            <span>Verified CET Cell Data</span>
          </div>
        </div>

        {/* Accordion sections on mobile, 3-col grid on md+ */}
        <div className="md:grid md:grid-cols-3 md:gap-8 md:mb-10 space-y-2 md:space-y-0">
          <AccordionSection title="Explore Tools" defaultOpen>
            <nav className="flex flex-col gap-2.5">
              <button
                onClick={() => goTo('explore')}
                className="touch-target -ml-2 px-2 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <School className="w-4 h-4 text-google-blue-400 shrink-0" />
                <span>Explore 370+ Colleges</span>
              </button>
              <button
                onClick={() => goTo('predictor')}
                className="touch-target -ml-2 px-2 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Target className="w-4 h-4 text-google-green-400 shrink-0" />
                <span>College Predictor</span>
              </button>
              <button
                onClick={() => goTo('compare')}
                className="touch-target -ml-2 px-2 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <GitCompare className="w-4 h-4 text-google-yellow-400 shrink-0" />
                <span>Side-by-Side Compare</span>
              </button>
              <button
                onClick={() => goTo('trends')}
                className="touch-target -ml-2 px-2 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-google-red-400 shrink-0" />
                <span>2025 vs 2024 Trends</span>
              </button>
            </nav>
          </AccordionSection>

          <AccordionSection title="Maharashtra Regions">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {REGION_LINKS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-sm text-slate-400 hover:text-white transition-colors truncate"
                >
                  {label}
                </a>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection title="Quick Links">
            <nav className="flex flex-col gap-2.5">
              <a
                href="https://cetcell.mahacet.org"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target -ml-2 px-2 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Official CET Cell Portal</span>
              </a>
              <a
                href="https://fe2026.mahacet.org/StaticPages/HomePage"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target -ml-2 px-2 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Merit List 2026</span>
              </a>
              <a
                href="/CAP-round-2025.pdf"
                download="MHT-CET-CAP-ROUND-2025.pdf"
                className="md:hidden touch-target -ml-2 px-2 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Information Brochure PDF</span>
              </a>
              <a
                href="/CAP-round-2025.pdf"
                download="MHT-CET-CAP-ROUND-2025.pdf"
                className="hidden md:inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Information Brochure PDF</span>
              </a>
            </nav>

            {/* Mobile-only full-width PDF button */}
            <a
              href="/CAP-round-2025.pdf"
              download="MHT-CET-CAP-ROUND-2025.pdf"
              className="md:hidden mt-3 touch-target w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-full"
            >
              <Download className="w-4 h-4" />
              Download Brochure PDF
            </a>
          </AccordionSection>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} CET Vault.
            <span className="mx-2">·</span>
            Not affiliated with State CET Cell, Maharashtra. For reference only.
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 text-xs text-slate-500">
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
