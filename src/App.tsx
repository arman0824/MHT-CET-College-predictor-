import { useEffect, useState } from 'react';
import { collegesData } from './data/colleges';
import type { College } from './data/colleges';
import { Navbar } from './components/Navbar';
import { CollegeExplorer } from './components/CollegeExplorer';
import { CutoffPredictor } from './components/CutoffPredictor';
import { CollegeCompare } from './components/CollegeCompare';
import { CutoffTrends } from './components/CutoffTrends';
import { Footer } from './components/Footer';
import { GitCompare } from 'lucide-react';

type Tab = 'explore' | 'predictor' | 'compare' | 'trends';

export function App() {
  const [activeTab, setActiveTabState] = useState<Tab>('explore');
  const [comparedColleges, setComparedColleges] = useState<College[]>([]);

  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle college in compare list (max 3)
  const handleToggleCompare = (college: College) => {
    const exists = comparedColleges.some(c => c.code === college.code);
    if (exists) {
      setComparedColleges(comparedColleges.filter(c => c.code !== college.code));
    } else {
      if (comparedColleges.length >= 3) {
        alert("You can compare a maximum of 3 colleges side-by-side. Please remove one college first.");
        return;
      }
      setComparedColleges([...comparedColleges, college]);
    }
  };

  const handleRemoveCompare = (collegeCode: string) => {
    setComparedColleges(comparedColleges.filter(c => c.code !== collegeCode));
  };

  const handleClearAllCompare = () => {
    setComparedColleges([]);
  };

  // Hide floating compare pill when user is already on compare tab
  const showFloatingCompare = comparedColleges.length > 0 && activeTab !== 'compare';

  // Lock body scroll while a compare-confirm modal would be open in CollegeCompare.
  // (No-op here; placeholder for future enhancements.)
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparedColleges.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'explore' && (
          <CollegeExplorer
            colleges={collegesData}
            comparedColleges={comparedColleges}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeTab === 'predictor' && (
          <CutoffPredictor
            colleges={collegesData}
            onToggleCompare={handleToggleCompare}
            comparedColleges={comparedColleges}
          />
        )}

        {activeTab === 'compare' && (
          <CollegeCompare
            comparedColleges={comparedColleges}
            onRemoveCompare={handleRemoveCompare}
            onClearAll={handleClearAllCompare}
            onNavigateExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'trends' && (
          <CutoffTrends colleges={collegesData} />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />

      {/* Floating compare pill — only visible on mobile when user has selections and is not on the compare tab */}
      {showFloatingCompare ? (
        <div className="md:hidden fixed bottom-4 inset-x-0 z-30 px-4 safe-bottom pointer-events-none">
          <button
            onClick={() => setActiveTab('compare')}
            className="pointer-events-auto w-full flex items-center justify-center gap-2 bg-google-yellow-500 hover:bg-google-yellow-600 text-slate-900 font-bold text-sm py-3 px-4 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:scale-95 transition-transform"
            aria-label={`View comparison (${comparedColleges.length} selected)`}
          >
            <GitCompare className="w-4 h-4" />
            View Comparison ({comparedColleges.length})
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
