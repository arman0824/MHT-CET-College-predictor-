import { lazy, Suspense, useEffect, useState } from 'react';
import type { College } from '../shared/types/college';
import { fetchColleges } from '../shared/api/colleges';
import { Navbar } from '../shared/layout/Navbar';
import { CollegeExplorer } from '../features/college-explorer/CollegeExplorer';
import { Footer } from '../shared/layout/Footer';
import { GitCompare } from 'lucide-react';
import type { AppTab } from './navigation';

const CutoffPredictor = lazy(() => import('../features/cutoff-predictor/CutoffPredictor').then(({ CutoffPredictor: component }) => ({ default: component })));
const CollegeCompare = lazy(() => import('../features/college-comparison/CollegeCompare').then(({ CollegeCompare: component }) => ({ default: component })));
const AboutCap = lazy(() => import('../features/cutoff-trends/AboutCap').then(({ AboutCap: component }) => ({ default: component })));

function TabLoadingState() {
  return (
    <section className="flex min-h-72 items-center justify-center" aria-label="Loading page">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-google-blue-100 border-t-google-blue-500" />
    </section>
  );
}

export function App() {
  const [activeTab, setActiveTabState] = useState<AppTab>('explore');
  const [comparedColleges, setComparedColleges] = useState<College[]>([]);
  const [colleges, setColleges] = useState<College[] | null>(null);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    fetchColleges().then(setColleges).catch(() => setDataError(true));
  }, []);

  const setActiveTab = (tab: AppTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const showFloatingCompare = comparedColleges.length > 0 && activeTab !== 'compare';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparedColleges.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'explore' && colleges && (
          <CollegeExplorer
            colleges={colleges}
            comparedColleges={comparedColleges}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeTab === 'predictor' && colleges && (
          <Suspense fallback={<TabLoadingState />}>
            <CutoffPredictor
              colleges={colleges}
              onToggleCompare={handleToggleCompare}
              comparedColleges={comparedColleges}
            />
          </Suspense>
        )}

        {activeTab === 'compare' && (
          <Suspense fallback={<TabLoadingState />}>
            <CollegeCompare
              comparedColleges={comparedColleges}
              onRemoveCompare={handleRemoveCompare}
              onClearAll={handleClearAllCompare}
              onNavigateExplore={() => setActiveTab('explore')}
            />
          </Suspense>
        )}

        {activeTab === 'trends' && (
          <Suspense fallback={<TabLoadingState />}>
            <AboutCap />
          </Suspense>
        )}

        {(['explore', 'predictor'].includes(activeTab) && !colleges) ? (
          <section className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-google-blue-100 border-t-google-blue-500" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-600">
              {dataError ? 'College data could not be loaded. Please refresh and try again.' : 'Loading college data…'}
            </p>
          </section>
        ) : null}
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
