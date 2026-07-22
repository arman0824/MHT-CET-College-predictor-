import React, { useState, useMemo } from 'react';
import type { College } from '../data/colleges';
import { Target, Sparkles, CheckCircle, AlertCircle, BookmarkPlus, MapPin } from 'lucide-react';

interface CutoffPredictorProps {
  colleges: College[];
  onToggleCompare: (college: College) => void;
  comparedColleges: College[];
}

export const CutoffPredictor: React.FC<CutoffPredictorProps> = ({
  colleges,
  onToggleCompare,
  comparedColleges
}) => {
  const [userPercentile, setUserPercentile] = useState<number>(95.0);
  const [userCategory, setUserCategory] = useState<string>('GOPENH');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'safe' | 'moderate' | 'dream'>('safe');

  const categories = [
    { id: 'GOPENH', label: 'GOPENH (General Open Home Univ)' },
    { id: 'GOPENO', label: 'GOPENO (General Open Other Univ)' },
    { id: 'LOPENH', label: 'LOPENH (Ladies Open Home Univ)' },
    { id: 'LOPENO', label: 'LOPENO (Ladies Open Other Univ)' },
    { id: 'OBC', label: 'OBC (Other Backward Class)' },
    { id: 'SC', label: 'SC (Scheduled Caste)' },
    { id: 'ST', label: 'ST (Scheduled Tribe)' },
    { id: 'TFWS', label: 'TFWS (Tuition Fee Waiver Scheme)' }
  ];

  // Calculation Engine
  const predictions = useMemo(() => {
    const p = Number(userPercentile) || 0;

    const safeList: Array<{ college: College; branchName: string; cutoffP: number; rank: number; margin: number }> = [];
    const moderateList: Array<{ college: College; branchName: string; cutoffP: number; rank: number; margin: number }> = [];
    const dreamList: Array<{ college: College; branchName: string; cutoffP: number; rank: number; margin: number }> = [];

    colleges.forEach((college) => {
      // Region check
      if (selectedRegion !== 'ALL' && college.region !== selectedRegion && !college.city.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return;
      }

      college.branches.forEach((branch) => {
        // Branch check
        if (selectedBranch !== 'ALL' && !branch.name.toLowerCase().includes(selectedBranch.toLowerCase())) {
          return;
        }

        const cutoffData = branch.cutoffs2025[userCategory] || branch.cutoffs2025['GOPENH'];
        const cutoffP = cutoffData?.percentile || 99.9;
        const rank = cutoffData?.rank || 99999;
        const margin = p - cutoffP;

        if (margin >= 0.5) {
          // Safe match
          safeList.push({ college, branchName: branch.name, cutoffP, rank, margin });
        } else if (margin >= -1.2 && margin < 0.5) {
          // Moderate / Good chance match
          moderateList.push({ college, branchName: branch.name, cutoffP, rank, margin });
        } else if (margin >= -3.5 && margin < -1.2) {
          // Dream target match
          dreamList.push({ college, branchName: branch.name, cutoffP, rank, margin });
        }
      });
    });

    // Sort by smallest margin difference
    safeList.sort((a, b) => Math.abs(a.margin) - Math.abs(b.margin));
    moderateList.sort((a, b) => Math.abs(a.margin) - Math.abs(b.margin));
    dreamList.sort((a, b) => Math.abs(a.margin) - Math.abs(b.margin));

    return { safeList, moderateList, dreamList };
  }, [colleges, userPercentile, userCategory, selectedRegion, selectedBranch]);

  const activeList = activeTab === 'safe'
    ? predictions.safeList
    : activeTab === 'moderate'
      ? predictions.moderateList
      : predictions.dreamList;

  return (
    <div className="space-y-8 py-6">
      
      {/* Predictor Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-google-green-50 text-google-green-600 flex items-center justify-center border border-google-green-100 shadow-sm">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              MHT-CET <span className="text-google-green-600">Admission Predictor</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Enter your exact score & category to view your college admission probability for CAP Round 1 & 2.
            </p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
          
          {/* MHT CET Percentile Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-google-yellow-500" />
              Your MHT-CET Percentile:
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={userPercentile}
              onChange={(e) => setUserPercentile(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-full bg-white border border-slate-300 text-slate-900 font-bold text-lg rounded-xl p-3 focus:ring-2 focus:ring-google-green-500 focus:outline-none shadow-sm"
              placeholder="e.g. 96.50"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Reservation Category:
            </label>
            <select
              value={userCategory}
              onChange={(e) => setUserCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl p-3.5 focus:ring-2 focus:ring-google-green-500 focus:outline-none shadow-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Preferred Region:
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl p-3.5 focus:ring-2 focus:ring-google-green-500 focus:outline-none shadow-sm"
            >
              <option value="ALL">All Regions (Maharashtra)</option>
              <option value="Mumbai">Mumbai & Thane</option>
              <option value="Pune">Pune</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Nashik">Nashik</option>
              <option value="Aurangabad">Chh. Sambhajinagar</option>
              <option value="Sangli/Kolhapur/Satara">Sangli / Kolhapur</option>
              <option value="Nanded/Amravati/Jalgaon">Amravati & Nanded</option>
            </select>
          </div>

          {/* Preferred Branch */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Preferred Branch:
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl p-3.5 focus:ring-2 focus:ring-google-green-500 focus:outline-none shadow-sm"
            >
              <option value="ALL">All Branches</option>
              <option value="Computer">Computer Engineering / CSE</option>
              <option value="Information Technology">Information Technology (IT)</option>
              <option value="Artificial Intelligence">AI & Data Science / AIML</option>
              <option value="Telecommunication">Electronics & Telecommunication</option>
              <option value="Electrical">Electrical Engineering</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
            </select>
          </div>

        </div>

        {/* Dynamic Category Pill Header */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <span>Calculated results for:</span>
            <span className="bg-google-green-50 text-google-green-700 border border-google-green-200 px-3 py-1 rounded-full text-xs font-bold">
              {userPercentile}%ile • {userCategory}
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Total Matches Found: <span className="font-bold text-slate-900">{predictions.safeList.length + predictions.moderateList.length + predictions.dreamList.length} options</span>
          </div>
        </div>

      </div>

      {/* Bucket Tabs Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Safe Tab Button */}
        <button
          onClick={() => setActiveTab('safe')}
          className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
            activeTab === 'safe'
              ? 'bg-google-green-50 border-google-green-500 shadow-[0_4px_16px_rgba(52,168,83,0.15)] ring-2 ring-google-green-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle className="w-5 h-5 text-google-green-600" />
              <span>High Chance (Safe)</span>
            </div>
            <span className="bg-google-green-500 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {predictions.safeList.length}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cutoff is equal or lower than your score. High admission probability in CAP Round 1.
          </p>
        </button>

        {/* Moderate Tab Button */}
        <button
          onClick={() => setActiveTab('moderate')}
          className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
            activeTab === 'moderate'
              ? 'bg-amber-50 border-amber-500 shadow-[0_4px_16px_rgba(245,158,11,0.15)] ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>Good Chance (Competitive)</span>
            </div>
            <span className="bg-amber-500 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {predictions.moderateList.length}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cutoff is within ±1.0% of your score. Highly competitive for CAP Round 2 & 3.
          </p>
        </button>

        {/* Dream Tab Button */}
        <button
          onClick={() => setActiveTab('dream')}
          className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
            activeTab === 'dream'
              ? 'bg-google-blue-50 border-google-blue-500 shadow-[0_4px_16px_rgba(26,115,232,0.15)] ring-2 ring-google-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles className="w-5 h-5 text-google-blue-500" />
              <span>Target / Dream Colleges</span>
            </div>
            <span className="bg-google-blue-500 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {predictions.dreamList.length}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cutoff is 1.0% to 3.5% above your score. Try in CAP Round 3 or ACAP Spot Seats.
          </p>
        </button>

      </div>

      {/* Predictions Table / Cards View */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {activeTab === 'safe' && <CheckCircle className="w-5 h-5 text-google-green-600" />}
            {activeTab === 'moderate' && <AlertCircle className="w-5 h-5 text-amber-500" />}
            {activeTab === 'dream' && <Sparkles className="w-5 h-5 text-google-blue-500" />}
            Showing {activeList.length} Recommended Options
          </h3>
        </div>

        {activeList.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {activeList.map((item, idx) => {
              const isCompared = comparedColleges.some(c => c.code === item.college.code);
              return (
                <div key={`${item.college.code}-${item.branchName}-${idx}`} className="py-4 hover:bg-slate-50/80 px-3 rounded-2xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                        Code: {item.college.code}
                      </span>
                      <span className="text-xs font-bold text-google-blue-600 bg-google-blue-50 px-2 py-0.5 rounded">
                        {item.branchName}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-google-red-500 inline" />
                        {item.college.city}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {item.college.name}
                    </h4>

                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Status: <strong className="text-slate-700">{item.college.status}</strong></span>
                      <span>Fees: <strong className="text-slate-700">Check college website</strong></span>
                    </div>
                  </div>

                  {/* Cutoff & Margin Badge */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">
                        {item.cutoffP.toFixed(2)}%ile
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        Rank ~#{item.rank.toLocaleString()}
                      </div>
                      <div className={`text-[11px] font-extrabold mt-0.5 ${
                        item.margin >= 0 ? 'text-google-green-600' : 'text-google-red-500'
                      }`}>
                        {item.margin >= 0 ? `+${item.margin.toFixed(2)}% above cutoff` : `${item.margin.toFixed(2)}% below cutoff`}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleCompare(item.college)}
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-sm"
                      title="Add to compare list"
                    >
                      <BookmarkPlus className={`w-5 h-5 ${isCompared ? 'text-google-green-600 fill-google-green-100' : ''}`} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 font-medium">
            No matching college branches found in this probability bucket. Try adjusting your MHT-CET score or branch preferences above.
          </div>
        )}

      </div>

    </div>
  );
};
