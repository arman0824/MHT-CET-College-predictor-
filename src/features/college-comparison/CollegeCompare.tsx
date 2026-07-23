import React, { useState } from 'react';
import type { College } from '../../shared/types/college';
import { GitCompare, X, Star, MapPin, Trash2, LayoutGrid, Rows3 } from 'lucide-react';
import { findBranchByKeywords, getCategoryCutoff } from '../../shared/lib/college';

interface CollegeCompareProps {
  comparedColleges: College[];
  onRemoveCompare: (collegeCode: string) => void;
  onClearAll: () => void;
  onNavigateExplore: () => void;
}

type Layout = 'stacked' | 'side';

interface BranchCutoffs {
  cs: { percentile: number; rank: number } | null;
  it: { percentile: number; rank: number } | null;
  ai: { percentile: number; rank: number } | null;
  entc: { percentile: number; rank: number } | null;
}

const getCutoffs = (college: College): BranchCutoffs => {
  const cs = findBranchByKeywords(college, ['Computer', 'CSE']);
  const it = findBranchByKeywords(college, ['Information Technology', 'IT']);
  const ai = findBranchByKeywords(college, ['Artificial', 'AI']);
  const entc = findBranchByKeywords(college, ['Telecommunication', 'Electronics']);

  const pick = (branch: typeof cs) => getCategoryCutoff(branch, 'GOPENH');
  return { cs: pick(cs), it: pick(it), ai: pick(ai), entc: pick(entc) };
};

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 pt-0.5">{label}</span>
    <span className="text-sm text-slate-800 font-semibold text-right min-w-0 break-words">{children}</span>
  </div>
);

export const CollegeCompare: React.FC<CollegeCompareProps> = ({
  comparedColleges,
  onRemoveCompare,
  onClearAll,
  onNavigateExplore
}) => {
  const [layout, setLayout] = useState<Layout>('stacked');
  const [confirmingClear, setConfirmingClear] = useState(false);

  if (comparedColleges.length === 0) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-md max-w-xl mx-auto my-8 sm:my-12 space-y-4">
        <div className="w-16 h-16 bg-google-yellow-50 text-google-yellow-600 rounded-full flex items-center justify-center mx-auto border border-google-yellow-100 shadow-sm">
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Colleges Selected for Comparison</h2>
        <p className="text-sm text-slate-500">
          You can select up to 3 colleges from the <strong>Explore Colleges</strong> list or the <strong>Predictor</strong> by tapping "Compare" on any college card.
        </p>
        <button
          onClick={onNavigateExplore}
          className="google-btn-primary text-sm mx-auto mt-4"
        >
          Explore & Add Colleges
        </button>
      </div>
    );
  }

  const handleClear = () => {
    if (confirmingClear) {
      onClearAll();
      setConfirmingClear(false);
    } else {
      setConfirmingClear(true);
      window.setTimeout(() => setConfirmingClear(false), 3000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-google-yellow-600" />
            <span>
              <span className="hidden sm:inline">Side-by-Side </span>
              <span className="text-google-yellow-600">College Comparison</span>
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparing {comparedColleges.length} of 3 selected colleges.
          </p>
        </div>

        {/* Mobile layout toggle (visible < md) */}
        <div className="md:hidden inline-flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
          <button
            onClick={() => setLayout('stacked')}
            className={`touch-target inline-flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-bold ${
              layout === 'stacked' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
            aria-label="Stacked view"
            aria-pressed={layout === 'stacked'}
          >
            <Rows3 className="w-4 h-4" />
            Stacked
          </button>
          <button
            onClick={() => setLayout('side')}
            className={`touch-target inline-flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-bold ${
              layout === 'side' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
            aria-label="Side-by-side view"
            aria-pressed={layout === 'side'}
          >
            <LayoutGrid className="w-4 h-4" />
            Side-by-side
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {comparedColleges.length < 3 ? (
            <button
              onClick={onNavigateExplore}
              className="google-btn-secondary text-xs"
            >
              + Add More ({3 - comparedColleges.length} slots)
            </button>
          ) : null}

          <button
            onClick={handleClear}
            className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 ${
              confirmingClear
                ? 'bg-google-red-500 text-white border border-google-red-500'
                : 'text-google-red-600 bg-google-red-50 hover:bg-google-red-100 border border-google-red-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {confirmingClear ? 'Tap again to confirm' : 'Clear'}
          </button>
        </div>
      </div>

      {/* Mobile: stacked cards (default) or side-by-side */}
      <div className="md:hidden">
        {layout === 'stacked' ? (
          <div className="space-y-3">
            {comparedColleges.map((college) => {
              const c = getCutoffs(college);
              return (
                <div key={college.code} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative">
                  <button
                    onClick={() => onRemoveCompare(college.code)}
                    className="touch-target absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-google-red-500 hover:text-white text-slate-600"
                    aria-label={`Remove ${college.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="pr-12">
                    <span className="inline-block bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded mb-1.5">
                      DTE: {college.code}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {college.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-google-red-500 inline shrink-0" />
                      {college.city}, {college.region}
                    </p>
                  </div>

                  <div className="mt-3">
                    <Row label="Type">{college.status}</Row>
                    <Row label="Estd.">Year {college.established} ({new Date().getFullYear() - college.established} yrs)</Row>
                    <Row label="Rating">
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {college.rating} / 5.0
                      </span>
                    </Row>
                    <Row label="CSE 2025">
                      {c.cs ? <span className="text-google-blue-600 font-extrabold">{c.cs.percentile.toFixed(2)}%ile <span className="text-slate-500 font-normal text-xs">#{c.cs.rank.toLocaleString()}</span></span> : 'N/A'}
                    </Row>
                    <Row label="IT 2025">{c.it ? `${c.it.percentile.toFixed(2)}%ile` : 'N/A'}</Row>
                    <Row label="AI 2025">{c.ai ? `${c.ai.percentile.toFixed(2)}%ile` : 'N/A'}</Row>
                    <Row label="ENTC 2025">{c.entc ? `${c.entc.percentile.toFixed(2)}%ile` : 'N/A'}</Row>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto snap-x-mobile rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs uppercase tracking-wider text-slate-400 font-extrabold w-1/4 sticky left-0 bg-slate-50 z-10">
                    Metric
                  </th>
                  {comparedColleges.map((college) => (
                    <th key={college.code} className="p-4 w-1/4 align-top relative border-l border-slate-200">
                      <button
                        onClick={() => onRemoveCompare(college.code)}
                        className="touch-target absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-slate-200 hover:bg-google-red-500 hover:text-white text-slate-600"
                        aria-label={`Remove ${college.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="inline-block bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded mb-1.5">
                        DTE: {college.code}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight pr-10">
                        {college.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-google-red-500 inline shrink-0" />
                        {college.city}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50 sticky left-0">Type</td>
                  {comparedColleges.map((c) => <td key={c.code} className="p-3 border-l border-slate-200 font-medium">{c.status}</td>)}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50 sticky left-0">Estd.</td>
                  {comparedColleges.map((c) => <td key={c.code} className="p-3 border-l border-slate-200">{c.established} ({new Date().getFullYear() - c.established} yrs)</td>)}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50 sticky left-0">Rating</td>
                  {comparedColleges.map((c) => (
                    <td key={c.code} className="p-3 border-l border-slate-200">
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {c.rating}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="bg-google-blue-50/30">
                  <td className="p-3 font-bold text-google-blue-900 sticky left-0">CSE 2025</td>
                  {comparedColleges.map((c) => {
                    const k = getCutoffs(c);
                    return (
                      <td key={c.code} className="p-3 border-l border-slate-200 font-extrabold text-google-blue-600 text-sm">
                        {k.cs ? `${k.cs.percentile.toFixed(2)}%ile (#${k.cs.rank.toLocaleString()})` : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50 sticky left-0">IT 2025</td>
                  {comparedColleges.map((c) => {
                    const k = getCutoffs(c);
                    return <td key={c.code} className="p-3 border-l border-slate-200 font-bold text-slate-800">{k.it ? `${k.it.percentile.toFixed(2)}%ile` : 'N/A'}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50 sticky left-0">AI 2025</td>
                  {comparedColleges.map((c) => {
                    const k = getCutoffs(c);
                    return <td key={c.code} className="p-3 border-l border-slate-200 font-bold text-slate-800">{k.ai ? `${k.ai.percentile.toFixed(2)}%ile` : 'N/A'}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 bg-slate-50/50 sticky left-0">ENTC 2025</td>
                  {comparedColleges.map((c) => {
                    const k = getCutoffs(c);
                    return <td key={c.code} className="p-3 border-l border-slate-200 font-bold text-slate-800">{k.entc ? `${k.entc.percentile.toFixed(2)}%ile` : 'N/A'}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Desktop: original table layout, unchanged */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-6 text-xs uppercase tracking-wider text-slate-400 font-extrabold w-1/4">
                Metric / Details
              </th>
              {comparedColleges.map((college) => (
                <th key={college.code} className="p-6 w-1/4 align-top relative border-l border-slate-200">
                  <button
                    onClick={() => onRemoveCompare(college.code)}
                    className="touch-target absolute top-4 right-4 inline-flex items-center justify-center rounded-full bg-slate-200 hover:bg-google-red-500 hover:text-white text-slate-600"
                    title="Remove college"
                    aria-label={`Remove ${college.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <span className="inline-block bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                    DTE: {college.code}
                  </span>

                  <h3 className="text-base font-extrabold text-slate-900 leading-tight pr-10">
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
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">College Type</td>
              {comparedColleges.map((col) => (
                <td key={col.code} className="p-4 border-l border-slate-200 font-medium">
                  {col.status}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Established</td>
              {comparedColleges.map((col) => (
                <td key={col.code} className="p-4 border-l border-slate-200">
                  Year {col.established} ({new Date().getFullYear() - col.established} yrs old)
                </td>
              ))}
            </tr>

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

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Annual Fees</td>
              {comparedColleges.map((col) => (
                <td key={col.code} className="p-4 border-l border-slate-200 font-semibold text-slate-500 text-xs leading-normal">
                  Check website for latest fees
                </td>
              ))}
            </tr>

            <tr className="bg-google-blue-50/30">
              <td className="p-4 font-bold text-google-blue-900">Computer Engg. Cutoff (2025 GOPENH)</td>
              {comparedColleges.map((col) => {
                const k = getCutoffs(col);
                return (
                  <td key={col.code} className="p-4 border-l border-slate-200 font-extrabold text-google-blue-600 text-sm">
                    {k.cs ? `${k.cs.percentile.toFixed(2)}%ile (#${k.cs.rank.toLocaleString()})` : 'N/A'}
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">IT Cutoff (2025 GOPENH)</td>
              {comparedColleges.map((col) => {
                const k = getCutoffs(col);
                return <td key={col.code} className="p-4 border-l border-slate-200 font-bold text-slate-800">{k.it ? `${k.it.percentile.toFixed(2)}%ile` : 'N/A'}</td>;
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">AI & DS Cutoff (2025 GOPENH)</td>
              {comparedColleges.map((col) => {
                const k = getCutoffs(col);
                return <td key={col.code} className="p-4 border-l border-slate-200 font-bold text-slate-800">{k.ai ? `${k.ai.percentile.toFixed(2)}%ile` : 'N/A'}</td>;
              })}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">ENTC Cutoff (2025 GOPENH)</td>
              {comparedColleges.map((col) => {
                const k = getCutoffs(col);
                return <td key={col.code} className="p-4 border-l border-slate-200 font-bold text-slate-800">{k.entc ? `${k.entc.percentile.toFixed(2)}%ile` : 'N/A'}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
