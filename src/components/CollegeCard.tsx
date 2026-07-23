import React, { useState } from 'react';
import type { College } from '../data/colleges';
import { MapPin, Building, Star, ChevronDown, ChevronUp, Plus, Check, Award, Flame } from 'lucide-react';

interface CollegeCardProps {
  college: College;
  selectedCategory: string;
  isCompared: boolean;
  onToggleCompare: (college: College) => void;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({
  college,
  selectedCategory,
  isCompared,
  onToggleCompare
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeBranchFilter, setActiveBranchFilter] = useState<string>('ALL');

  // Find top branch that has exact data for selectedCategory
  const csBranch = college.branches.find(
    b => (b.name.includes("Computer") || b.name.includes("CSE")) && b.cutoffs2025?.[selectedCategory]
  ) || college.branches.find(
    b => b.cutoffs2025?.[selectedCategory]
  ) || college.branches[0];

  const topCutoff2025 = csBranch?.cutoffs2025?.[selectedCategory];

  // Only display branches that have exact data for selectedCategory
  const availableBranches = college.branches.filter(b => b.cutoffs2025?.[selectedCategory]);
  const displayedBranches = activeBranchFilter === 'ALL'
    ? availableBranches
    : availableBranches.filter(b => b.name.toLowerCase().includes(activeBranchFilter.toLowerCase()));

  return (
    <div className="google-card group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-200">

      {/* Header Badges Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1 bg-slate-900 text-white font-mono text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
            DTE: {college.code}
          </span>

          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            college.status.includes('Government')
              ? 'bg-google-green-50 text-google-green-700 border border-google-green-100'
              : 'bg-google-blue-50 text-google-blue-700 border border-google-blue-100'
          }`}>
            <Building className="w-3 h-3" />
            {college.status}
          </span>

          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            Estd. {college.established}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{college.rating}</span>
        </div>
      </div>

      {/* College Name & Location */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-google-blue-600 transition-colors">
          {college.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1.5">
          <MapPin className="w-3.5 h-3.5 text-google-red-500 shrink-0" />
          <span>{college.city}, {college.region} Region</span>
        </p>
      </div>

      {/* Key Cutoff Spotlight Box */}
      <div className="bg-gradient-to-r from-slate-50 via-google-blue-50/30 to-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200/70 my-3 sm:my-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Flame className="w-3.5 h-3.5 text-google-red-500 shrink-0" />
            <span className="truncate">Top Branch ({csBranch?.name.split(" ")[0]}):</span>
            <span className="bg-google-blue-100 text-google-blue-800 font-bold px-1.5 py-0.2 rounded text-[10px] shrink-0">
              {selectedCategory}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
            {topCutoff2025 ? (
              <>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {topCutoff2025.percentile.toFixed(2)}%ile
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  (Rank ~#{topCutoff2025.rank.toLocaleString()})
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-slate-400">No cutoff data available</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 pt-2">
        <button
          onClick={() => onToggleCompare(college)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-150 ${
            isCompared
              ? 'bg-google-green-500 text-white shadow-[0_3px_8px_rgba(52,168,83,0.3)] active:scale-95'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] active:translate-y-[1px]'
          }`}
        >
          {isCompared ? (
            <>
              <Check className="w-4 h-4" />
              In Compare List
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Compare
            </>
          )}
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 google-btn-primary text-sm py-3 sm:py-2.5 px-4"
        >
          <span>{expanded ? 'Hide Details' : `Cutoffs (${availableBranches.length} Branches)`}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Branch Cutoffs Drawer */}
      {expanded ? (
        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-200/80 animate-fadeIn">

          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Award className="w-4 h-4 text-google-blue-500 shrink-0" />
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              Branch-wise Cutoffs <span className="text-slate-500 font-medium">({selectedCategory})</span>
            </h4>
          </div>

          {/* Branch Filter Pills */}
          <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4 -mx-1 px-1 overflow-x-auto no-scrollbar">
            {['ALL', 'Computer', 'IT', 'AI', 'Telecom', 'Electrical', 'Mechanical', 'Civil'].map((b) => (
              <button
                key={b}
                onClick={() => setActiveBranchFilter(b)}
                className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-full transition-colors ${
                  activeBranchFilter === b
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Mobile branch list (stacked cards) */}
          <div className="sm:hidden space-y-2">
            {displayedBranches.length > 0 ? (
              displayedBranches.map((br) => {
                const c2025 = br.cutoffs2025[selectedCategory];
                if (!c2025) return null;
                return (
                  <div key={br.code} className="bg-slate-50/70 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-900 leading-tight">{br.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">Code: {br.code}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-google-blue-600">{c2025.percentile.toFixed(2)}%</div>
                        <div className="text-[11px] font-semibold text-slate-400">2025</div>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white rounded-lg border border-slate-200 px-2 py-1.5">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Rank</div>
                        <div className="font-mono font-semibold text-slate-700">#{c2025.rank.toLocaleString()}</div>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200 px-2 py-1.5">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Intake</div>
                        <div className="font-semibold text-slate-700">{br.intake}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-sm text-slate-400 italic">
                No branches found with cutoff data for "{selectedCategory}" matching "{activeBranchFilter}".
              </div>
            )}
          </div>

          {/* Desktop branch table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 shadow-inner bg-slate-50/50">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Branch Name</th>
                  <th className="p-3 text-center">2025 Cutoff (%ile)</th>
                  <th className="p-3 text-center">Approx State Rank</th>
                  <th className="p-3 text-center">Intake</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white">
                {displayedBranches.length > 0 ? (
                  displayedBranches.map((br) => {
                    const c2025 = br.cutoffs2025[selectedCategory];
                    if (!c2025) return null;

                    return (
                      <tr key={br.code} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-medium text-slate-900">
                          <div>{br.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">Code: {br.code}</span>
                        </td>
                        <td className="p-3 text-center font-bold text-google-blue-600 text-sm">
                          {c2025.percentile.toFixed(2)}%
                        </td>
                        <td className="p-3 text-center font-mono text-slate-600">
                          #{c2025.rank.toLocaleString()}
                        </td>
                        <td className="p-3 text-center text-slate-600">
                          {br.intake} seats
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                      No branches found with cutoff data for "{selectedCategory}" matching "{activeBranchFilter}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};
