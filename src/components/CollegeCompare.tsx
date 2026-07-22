import React from 'react';
import type { College } from '../data/colleges';
import { GitCompare, X, Star, ExternalLink, MapPin, Trash2 } from 'lucide-react';

interface CollegeCompareProps {
  comparedColleges: College[];
  onRemoveCompare: (collegeCode: string) => void;
  onClearAll: () => void;
  onNavigateExplore: () => void;
}

export const CollegeCompare: React.FC<CollegeCompareProps> = ({
  comparedColleges,
  onRemoveCompare,
  onClearAll,
  onNavigateExplore
}) => {
  if (comparedColleges.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-md max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-google-yellow-50 text-google-yellow-600 rounded-full flex items-center justify-center mx-auto border border-google-yellow-100 shadow-sm">
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Colleges Selected for Comparison</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          You can select up to 3 colleges from the <strong>Explore Colleges</strong> list or the <strong>Predictor</strong> by clicking the "Compare" button on any college card.
        </p>
        <button
          onClick={onNavigateExplore}
          className="google-btn-primary text-xs mx-auto mt-4"
        >
          Explore & Add Colleges
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-google-yellow-600" />
            Side-by-Side <span className="text-google-yellow-600">College Comparison</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparing {comparedColleges.length} of 3 selected Maharashtra colleges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {comparedColleges.length < 3 && (
            <button
              onClick={onNavigateExplore}
              className="google-btn-secondary text-xs"
            >
              + Add More ({3 - comparedColleges.length} slots left)
            </button>
          )}

          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-google-red-600 bg-google-red-50 hover:bg-google-red-100 border border-google-red-200 px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Comparison
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
        <table className="w-full text-left border-collapse min-w-[700px]">
          
          {/* Header Row with College Cards */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-6 text-xs uppercase tracking-wider text-slate-400 font-extrabold w-1/4">
                Metric / Details
              </th>
              {comparedColleges.map((college) => (
                <th key={college.code} className="p-6 w-1/4 align-top relative border-l border-slate-200">
                  <button
                    onClick={() => onRemoveCompare(college.code)}
                    className="absolute top-4 right-4 p-1 rounded-full bg-slate-200 hover:bg-google-red-500 hover:text-white text-slate-600 transition-colors"
                    title="Remove college"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <span className="inline-block bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                    DTE: {college.code}
                  </span>

                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {college.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-google-red-500 inline shrink-0" />
                    {college.city}, {college.region}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            
            {/* Status */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">College Type</td>
              {comparedColleges.map((col) => (
                <td key={col.code} className="p-4 border-l border-slate-200 font-medium">
                  {col.status}
                </td>
              ))}
            </tr>

            {/* Established Year */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Established</td>
              {comparedColleges.map((col) => (
                <td key={col.code} className="p-4 border-l border-slate-200">
                  Year {col.established} ({new Date().getFullYear() - col.established} yrs old)
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Student Rating</td>
              {comparedColleges.map((col) => (
                <td key={col.code} className="p-4 border-l border-slate-200">
                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {col.rating} / 5.0
                  </span>
                </td>
              ))}
            </tr>

            {/* Annual Tuition Fees */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Annual Fees</td>
              {comparedColleges.map((col) => (
                <td key={col.code} className="p-4 border-l border-slate-200 font-semibold text-slate-500 text-xs leading-normal">
                  Check website for latest fees
                </td>
              ))}
            </tr>

            {/* Computer Engineering Cutoff (2025) */}
            <tr className="bg-google-blue-50/30">
              <td className="p-4 font-bold text-google-blue-900">Computer Engg. Cutoff (2025 GOPENH)</td>
              {comparedColleges.map((col) => {
                const cs = col.branches.find(b => b.name.includes("Computer") || b.name.includes("CSE"));
                const cutoff = cs?.cutoffs2025['GOPENH'];
                return (
                  <td key={col.code} className="p-4 border-l border-slate-200 font-extrabold text-google-blue-600 text-sm">
                    {cutoff ? `${cutoff.percentile.toFixed(2)}%ile (#${cutoff.rank.toLocaleString()})` : 'N/A'}
                  </td>
                );
              })}
            </tr>

            {/* Information Technology Cutoff (2025) */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">IT Cutoff (2025 GOPENH)</td>
              {comparedColleges.map((col) => {
                const it = col.branches.find(b => b.name.includes("Information Technology") || b.name.includes("IT"));
                const cutoff = it?.cutoffs2025['GOPENH'];
                return (
                  <td key={col.code} className="p-4 border-l border-slate-200 font-bold text-slate-800">
                    {cutoff ? `${cutoff.percentile.toFixed(2)}%ile` : 'N/A'}
                  </td>
                );
              })}
            </tr>

            {/* AI & Data Science Cutoff (2025) */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">AI & DS Cutoff (2025 GOPENH)</td>
              {comparedColleges.map((col) => {
                const ai = col.branches.find(b => b.name.includes("Artificial") || b.name.includes("AI"));
                const cutoff = ai?.cutoffs2025['GOPENH'];
                return (
                  <td key={col.code} className="p-4 border-l border-slate-200 font-bold text-slate-800">
                    {cutoff ? `${cutoff.percentile.toFixed(2)}%ile` : 'N/A'}
                  </td>
                );
              })}
            </tr>

            {/* ENTC Cutoff (2025) */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">ENTC Cutoff (2025 GOPENH)</td>
              {comparedColleges.map((col) => {
                const entc = col.branches.find(b => b.name.includes("Telecommunication") || b.name.includes("Electronics"));
                const cutoff = entc?.cutoffs2025['GOPENH'];
                return (
                  <td key={col.code} className="p-4 border-l border-slate-200 font-bold text-slate-800">
                    {cutoff ? `${cutoff.percentile.toFixed(2)}%ile` : 'N/A'}
                  </td>
                );
              })}
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};
