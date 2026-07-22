import React from 'react';
import type { College } from '../data/colleges';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, HelpCircle, Award } from 'lucide-react';

interface CutoffTrendsProps {
  colleges: College[];
}

export const CutoffTrends: React.FC<CutoffTrendsProps> = ({ colleges }) => {
  // Top 10 colleges by CS cutoff
  const topColleges = [...colleges]
    .sort((a, b) => {
      const aCut = a.branches.find(br => br.name.includes("Computer"))?.cutoffs2025['GOPENH']?.percentile || 0;
      const bCut = b.branches.find(br => br.name.includes("Computer"))?.cutoffs2025['GOPENH']?.percentile || 0;
      return bCut - aCut;
    })
    .slice(0, 10);

  return (
    <div className="space-y-8 py-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-google-red-50 text-google-red-500 flex items-center justify-center border border-google-red-100 shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              MHT-CET <span className="text-google-red-500">Cutoff Trends Analysis</span> (2025 vs 2024)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Historical MHT-CET score & percentile variations across top engineering colleges in Maharashtra.
            </p>
          </div>
        </div>
      </div>

      {/* Top 10 Premier Colleges Trends Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md">
        
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
          <Award className="w-5 h-5 text-google-yellow-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Top 10 Most Competitive Maharashtra Colleges (Computer Engineering Cutoffs)
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Rank & College</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-right">2025 Cutoff (%ile)</th>
                <th className="p-3.5 text-right">2024 Cutoff (%ile)</th>
                <th className="p-3.5 text-center">Trend Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {topColleges.map((col, idx) => {
                const cs = col.branches.find(b => b.name.includes("Computer") || b.name.includes("CSE")) || col.branches[0];
                const c2025 = cs?.cutoffs2025['GOPENH']?.percentile || 0;
                const c2024 = cs?.cutoffs2024['GOPENH']?.percentile || 0;
                const diff = c2025 - c2024;

                return (
                  <tr key={col.code} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <span>{col.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">
                      {col.city}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-google-blue-600 text-sm">
                      {c2025.toFixed(2)}%ile
                    </td>
                    <td className="p-3.5 text-right font-semibold text-slate-500">
                      {c2024.toFixed(2)}%ile
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${
                        diff > 0
                          ? 'bg-google-green-50 text-google-green-700 border border-google-green-200'
                          : diff < 0
                            ? 'bg-google-red-50 text-google-red-600 border border-google-red-200'
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {diff > 0 && <ArrowUpRight className="w-3.5 h-3.5" />}
                        {diff < 0 && <ArrowDownRight className="w-3.5 h-3.5" />}
                        {diff === 0 && <Minus className="w-3.5 h-3.5" />}
                        {diff >= 0 ? `+${diff.toFixed(2)}%` : `${diff.toFixed(2)}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* MHT-CET CAP FAQ Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-lg font-extrabold text-slate-900 mb-2">
          <HelpCircle className="w-5 h-5 text-google-blue-500" />
          Understanding MHT-CET CAP Admission Cutoffs
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600">
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1">
              What does GOPENH vs GOPENO cutoff mean?
            </h4>
            <p>
              <strong>GOPENH</strong> represents General Open seats reserved for students belonging to the <em>Home University</em> region of that college. <strong>GOPENO</strong> represents seats for students belonging to <em>Other than Home University</em> regions within Maharashtra. Cutoffs for GOPENO are typically slightly higher.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1">
              Are these cutoffs based strictly on MHT-CET percentiles?
            </h4>
            <p>
              Yes! All cutoffs displayed on this platform are based solely on official State Common Entrance Test Cell (MHT-CET) percentile scores and State Merit Ranks for engineering admissions (FE 2025/2024 CAP round lists).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-1">
              How many CAP rounds are conducted by CET Cell Maharashtra?
            </h4>
            <p>
              The DTE CET Cell typically conducts 4 Centralized Admission Process (CAP) rounds followed by ACAP (Against CAP) / Institutional Spot Round seats directly at college campuses.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
