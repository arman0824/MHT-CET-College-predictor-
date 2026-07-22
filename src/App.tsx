import { useState } from 'react';
import { collegesData } from './data/colleges';
import type { College } from './data/colleges';
import { Navbar } from './components/Navbar';
import { CollegeExplorer } from './components/CollegeExplorer';
import { CutoffPredictor } from './components/CutoffPredictor';
import { CollegeCompare } from './components/CollegeCompare';
import { CutoffTrends } from './components/CutoffTrends';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'predictor' | 'compare' | 'trends'>('explore');
  const [comparedColleges, setComparedColleges] = useState<College[]>([]);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparedColleges.length}
      />

      {/* Main Content Area */}
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

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
