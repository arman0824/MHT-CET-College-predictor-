import React, { useState, useMemo, useEffect } from 'react';
import type { College } from '../data/colleges';
import { Target, Sparkles, CheckCircle, AlertCircle, BookmarkPlus, MapPin, Save } from 'lucide-react';

interface CutoffPredictorProps {
  colleges: College[];
  onToggleCompare: (college: College) => void;
  comparedColleges: College[];
}

const CATEGORY_LABELS: Record<string, string> = {
  GOPENH: 'GOPENH (General Open Home Univ)',
  GOPENO: 'GOPENO (General Open Other Univ)',
  GOPENS: 'GOPENS (General Open State Level)',
  LOPENH: 'LOPENH (Ladies Open Home Univ)',
  LOPENO: 'LOPENO (Ladies Open Other Univ)',
  LOPENS: 'LOPENS (Ladies Open State Level)',
  OBC: 'OBC (Other Backward Class)',
  GOBCH: 'GOBCH (General OBC Home Univ)',
  GOBCO: 'GOBCO (General OBC Other Univ)',
  GOBCS: 'GOBCS (General OBC State Level)',
  LOBCH: 'LOBCH (Ladies OBC Home Univ)',
  LOBCO: 'LOBCO (Ladies OBC Other Univ)',
  LOBCS: 'LOBCS (Ladies OBC State Level)',
  SC: 'SC (Scheduled Caste)',
  GSCH: 'GSCH (General SC Home Univ)',
  GSCO: 'GSCO (General SC Other Univ)',
  GSCS: 'GSCS (General SC State Level)',
  LSCH: 'LSCH (Ladies SC Home Univ)',
  LSCO: 'LSCO (Ladies SC Other Univ)',
  LSCS: 'LSCS (Ladies SC State Level)',
  ST: 'ST (Scheduled Tribe)',
  GSTH: 'GSTH (General ST Home Univ)',
  GSTO: 'GSTO (General ST Other Univ)',
  GSTS: 'GSTS (General ST State Level)',
  LSTH: 'LSTH (Ladies ST Home Univ)',
  LSTO: 'LSTO (Ladies ST Other Univ)',
  LSTS: 'LSTS (Ladies ST State Level)',
  EWS: 'EWS (Economically Weaker Section)',
  TFWS: 'TFWS (Tuition Fee Waiver Scheme)',
  GSEBCH: 'GSEBCH (General SEBC Home Univ)',
  GSEBCO: 'GSEBCO (General SEBC Other Univ)',
  GSEBCS: 'GSEBCS (General SEBC State Level)',
  LSEBCH: 'LSEBCH (Ladies SEBC Home Univ)',
  LSEBCO: 'LSEBCO (Ladies SEBC Other Univ)',
  LSEBCS: 'LSEBCS (Ladies SEBC State Level)',
  GNT1H: 'GNT1H (General NT-1 Home Univ)',
  GNT1O: 'GNT1O (General NT-1 Other Univ)',
  GNT1S: 'GNT1S (General NT-1 State Level)',
  GNT2H: 'GNT2H (General NT-2 Home Univ)',
  GNT2O: 'GNT2O (General NT-2 Other Univ)',
  GNT2S: 'GNT2S (General NT-2 State Level)',
  GNT3H: 'GNT3H (General NT-3 Home Univ)',
  GNT3O: 'GNT3O (General NT-3 Other Univ)',
  GNT3S: 'GNT3S (General NT-3 State Level)',
  GVJH: 'GVJH (General VJ/DT Home Univ)',
  GVJO: 'GVJO (General VJ/DT Other Univ)',
  GVJS: 'GVJS (General VJ/DT State Level)',
  LNT1H: 'LNT1H (Ladies NT-1 Home Univ)',
  LNT1O: 'LNT1O (Ladies NT-1 Other Univ)',
  LNT1S: 'LNT1S (Ladies NT-1 State Level)',
  LNT2H: 'LNT2H (Ladies NT-2 Home Univ)',
  LNT2O: 'LNT2O (Ladies NT-2 Other Univ)',
  LNT2S: 'LNT2S (Ladies NT-2 State Level)',
  LNT3H: 'LNT3H (Ladies NT-3 Home Univ)',
  LNT3O: 'LNT3O (Ladies NT-3 Other Univ)',
  LNT3S: 'LNT3S (Ladies NT-3 State Level)',
  LVJH: 'LVJH (Ladies VJ/DT Home Univ)',
  LVJO: 'LVJO (Ladies VJ/DT Other Univ)',
  LVJS: 'LVJS (Ladies VJ/DT State Level)',
  MI: 'MI (Minority)',
  ORPHAN: 'ORPHAN (Orphan)',
  DEFOPENS: 'DEFOPENS (Defense Open State)',
  DEFOBCS: 'DEFOBCS (Defense OBC State)',
  DEFSEBCS: 'DEFSEBCS (Defense SEBC State)',
  PWDOPENS: 'PWDOPENS (PWD Open State)',
  PWDOPENH: 'PWDOPENH (PWD Open Home Univ)',
  PWDOBCS: 'PWDOBCS (PWD OBC State)',
  PWDOBCH: 'PWDOBCH (PWD OBC Home Univ)',
  PWDSCS: 'PWDSCS (PWD SC State)'
};

const REGIONS = [
  { id: 'ALL', label: 'All Regions (Maharashtra)' },
  { id: 'Mumbai', label: 'Mumbai & Thane' },
  { id: 'Pune', label: 'Pune' },
  { id: 'Nagpur', label: 'Nagpur' },
  { id: 'Nashik', label: 'Nashik' },
  { id: 'Aurangabad', label: 'Chh. Sambhajinagar' },
  { id: 'Sangli/Kolhapur/Satara', label: 'Sangli / Kolhapur' },
  { id: 'Nanded/Amravati/Jalgaon', label: 'Amravati & Nanded' }
];

const BRANCHES = [
  { id: 'ALL', label: 'All Branches' },
  { id: 'Computer', label: 'Computer Engineering / CSE' },
  { id: 'Information Technology', label: 'Information Technology (IT)' },
  { id: 'Artificial Intelligence', label: 'AI & Data Science / AIML' },
  { id: 'Telecommunication', label: 'Electronics & Telecommunication' },
  { id: 'Electrical', label: 'Electrical Engineering' },
  { id: 'Mechanical', label: 'Mechanical Engineering' },
  { id: 'Civil', label: 'Civil Engineering' }
];

const STORAGE_KEY = 'cetvault.predictor.v1';

interface PersistedState {
  percentile: number;
  category: string;
  region: string;
  branch: string;
}

const loadPersisted = (): PersistedState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (typeof parsed.percentile !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
};

type Bucket = 'safe' | 'moderate' | 'dream';

const BUCKET_META: Record<Bucket, { label: string; short: string; icon: React.ComponentType<{ className?: string }>; color: string; bgClass: string; borderClass: string; textClass: string; description: string }> = {
  safe: {
    label: 'High Chance (Safe)',
    short: 'Safe',
    icon: CheckCircle,
    color: 'green',
    bgClass: 'bg-google-green-50',
    borderClass: 'border-google-green-500',
    textClass: 'text-google-green-700',
    description: 'Cutoff ≤ your score. High admission probability in CAP Round 1.'
  },
  moderate: {
    label: 'Good Chance (Competitive)',
    short: 'Competitive',
    icon: AlertCircle,
    color: 'amber',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-700',
    description: 'Cutoff up to 1.5% above your score. Competitive for CAP Round 2 & 3.'
  },
  dream: {
    label: 'Target / Dream',
    short: 'Dream',
    icon: Sparkles,
    color: 'blue',
    bgClass: 'bg-google-blue-50',
    borderClass: 'border-google-blue-500',
    textClass: 'text-google-blue-700',
    description: 'Cutoff 1.5%–3.5% above your score. Try CAP Round 3 or ACAP spots.'
  }
};

export const CutoffPredictor: React.FC<CutoffPredictorProps> = ({
  colleges,
  onToggleCompare,
  comparedColleges
}) => {
  const initial = loadPersisted();

  // Dynamically extract all reservation categories present across colleges.ts
  const categories = useMemo(() => {
    const catSet = new Set<string>();
    colleges.forEach((college) => {
      college.branches?.forEach((branch) => {
        if (branch.cutoffs2025) {
          Object.keys(branch.cutoffs2025).forEach((cat) => {
            if (cat) catSet.add(cat);
          });
        }
      });
    });

    if (catSet.size === 0) {
      return [{ id: 'GOPENH', label: 'GOPENH (General Open Home Univ)' }];
    }

    const priorityOrder: Record<string, number> = {
      GOPENH: 1,
      GOPENO: 2,
      GOPENS: 3,
      LOPENH: 4,
      LOPENO: 5,
      OBC: 6,
      GOBCH: 7,
      SC: 8,
      GSCH: 9,
      ST: 10,
      GSTH: 11,
      EWS: 12,
      TFWS: 13
    };

    const list = Array.from(catSet).map((id) => ({
      id,
      label: CATEGORY_LABELS[id] || `${id} (${id})`
    }));

    list.sort((a, b) => {
      const pA = priorityOrder[a.id] ?? 999;
      const pB = priorityOrder[b.id] ?? 999;
      if (pA !== pB) return pA - pB;
      return a.id.localeCompare(b.id);
    });

    return list;
  }, [colleges]);

  // Allowed userPercentile state to be number OR string to permit clear/empty inputs
  const [userPercentile, setUserPercentile] = useState<number | string>(initial?.percentile ?? 95.0);
  const [userCategory, setUserCategory] = useState<string>(() => {
    if (initial?.category) return initial.category;
    return 'GOPENH';
  });
  const [selectedRegion, setSelectedRegion] = useState<string>(initial?.region ?? 'ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>(initial?.branch ?? 'ALL');
  const [activeTab, setActiveTab] = useState<Bucket>('safe');
  const [saved, setSaved] = useState<boolean>(!!initial);

  // Keep userCategory synced with available categories if necessary
  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.id === userCategory)) {
      setUserCategory(categories[0].id);
    }
  }, [categories, userCategory]);

  useEffect(() => {
    setSaved(!!loadPersisted());
  }, []);

  const persist = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          percentile: Number(userPercentile) || 0,
          category: userCategory,
          region: selectedRegion,
          branch: selectedBranch
        } satisfies PersistedState)
      );
      setSaved(true);
    } catch {
      /* ignore */
    }
  };

  // Calculation Engine - Enforces strict category cutoffs without fake fallbacks
  const predictions = useMemo(() => {
    const p = typeof userPercentile === 'number' ? userPercentile : parseFloat(String(userPercentile));
    if (isNaN(p) || p < 0 || !userCategory) {
      return { safeList: [], moderateList: [], dreamList: [] };
    }

    const safeList: Array<{ college: College; branchName: string; cutoffP: number; rank: number; margin: number }> = [];
    const moderateList: Array<{ college: College; branchName: string; cutoffP: number; rank: number; margin: number }> = [];
    const dreamList: Array<{ college: College; branchName: string; cutoffP: number; rank: number; margin: number }> = [];

    colleges.forEach((college) => {
      if (selectedRegion !== 'ALL' && college.region !== selectedRegion && !college.city.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return;
      }

      college.branches.forEach((branch) => {
        if (selectedBranch !== 'ALL' && !branch.name.toLowerCase().includes(selectedBranch.toLowerCase())) {
          return;
        }

        // Strictly evaluate cutoff for selected category.
        // NO fallback to GOPENH and NO fake 99.9/99999 values!
        const cutoffData = branch.cutoffs2025?.[userCategory];
        if (
          !cutoffData ||
          typeof cutoffData.percentile !== 'number' ||
          isNaN(cutoffData.percentile) ||
          typeof cutoffData.rank !== 'number' ||
          isNaN(cutoffData.rank)
        ) {
          return;
        }

        const cutoffP = cutoffData.percentile;
        const rank = cutoffData.rank;
        const margin = p - cutoffP;

        if (margin >= 0) {
          safeList.push({ college, branchName: branch.name, cutoffP, rank, margin });
        } else if (margin >= -1.5 && margin < 0) {
          moderateList.push({ college, branchName: branch.name, cutoffP, rank, margin });
        } else if (margin >= -3.5 && margin < -1.5) {
          dreamList.push({ college, branchName: branch.name, cutoffP, rank, margin });
        }
      });
    });

    // Sort within each bucket by closeness to user score (smallest absolute margin first)
    const sortFn = (
      a: { margin: number; cutoffP: number; college: College; branchName: string },
      b: { margin: number; cutoffP: number; college: College; branchName: string }
    ) => {
      const absDiff = Math.abs(a.margin) - Math.abs(b.margin);
      if (Math.abs(absDiff) > 0.0001) return absDiff;
      if (b.cutoffP !== a.cutoffP) return b.cutoffP - a.cutoffP;
      return a.college.name.localeCompare(b.college.name);
    };

    safeList.sort(sortFn);
    moderateList.sort(sortFn);
    dreamList.sort(sortFn);

    return { safeList, moderateList, dreamList };
  }, [colleges, userPercentile, userCategory, selectedRegion, selectedBranch]);

  const activeList = activeTab === 'safe'
    ? predictions.safeList
    : activeTab === 'moderate'
      ? predictions.moderateList
      : predictions.dreamList;

  const totalCount = predictions.safeList.length + predictions.moderateList.length + predictions.dreamList.length;

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">

      {/* Predictor Form Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-google-green-50 text-google-green-600 flex items-center justify-center border border-google-green-100 shadow-sm shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              MHT-CET <span className="text-google-green-600">Admission Predictor</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Enter your score & category to view your admission probability for CAP Round 1 & 2.
            </p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/60">

          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-google-yellow-500" />
              Your MHT-CET Percentile
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              inputMode="decimal"
              value={userPercentile}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setUserPercentile('');
                } else {
                  const num = parseFloat(val);
                  if (!isNaN(num)) {
                    setUserPercentile(num > 100 ? 100 : val);
                  }
                }
              }}
              className="touch-target w-full bg-white border border-slate-300 text-slate-900 font-bold text-xl sm:text-lg rounded-xl p-3 focus:ring-2 focus:ring-google-green-500 focus:outline-none shadow-sm"
              placeholder="e.g. 96.50"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Reservation Category</label>
            <select
              value={userCategory}
              onChange={(e) => setUserCategory(e.target.value)}
              className="touch-target w-full bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl p-3.5 focus:ring-2 focus:ring-google-green-500 focus:outline-none shadow-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Preferred Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="touch-target w-full bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl p-3.5 focus:ring-2 focus:ring-google-green-500 focus:outline-none shadow-sm"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Preferred Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="touch-target w-full bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl p-3.5 focus:ring-2 focus:ring-google-green-500 focus:outline-none shadow-sm"
            >
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Save my score + summary row */}
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-sm font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
            <span>Calculated for:</span>
            <span className="bg-google-green-50 text-google-green-700 border border-google-green-200 px-3 py-1 rounded-full text-xs font-bold">
              {userPercentile || 0}%ile • {userCategory}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">
              {totalCount} matches
            </span>
            <button
              onClick={persist}
              className="touch-target inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-full"
              aria-label="Save my score"
            >
              <Save className="w-3.5 h-3.5" />
              {saved ? 'Saved' : 'Save my score'}
            </button>
          </div>
        </div>
      </div>

      {/* Bucket segmented tabs (mobile-first) + 3-col cards (desktop) */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {(Object.keys(BUCKET_META) as Bucket[]).map((key) => {
            const meta = BUCKET_META[key];
            const Icon = meta.icon;
            const count = key === 'safe' ? predictions.safeList.length : key === 'moderate' ? predictions.moderateList.length : predictions.dreamList.length;
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border transition-colors ${
                  active
                    ? `${meta.bgClass} ${meta.borderClass} ${meta.textClass}`
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {meta.short}
                <span className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-white/70' : 'bg-slate-100'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(BUCKET_META) as Bucket[]).map((key) => {
          const meta = BUCKET_META[key];
          const Icon = meta.icon;
          const count = key === 'safe' ? predictions.safeList.length : key === 'moderate' ? predictions.moderateList.length : predictions.dreamList.length;
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                active
                  ? `${meta.bgClass} ${meta.borderClass} shadow-[0_4px_16px_rgba(0,0,0,0.08)] ring-2 ring-${meta.color}-500/20`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Icon className={`w-5 h-5 ${meta.textClass}`} />
                  <span>{meta.label}</span>
                </div>
                <span className={`${meta.bgClass.replace('-50', '-500')} text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full`}>
                  {count}
                </span>
              </div>
              <p className="text-xs text-slate-500">{meta.description}</p>
            </button>
          );
        })}
      </div>

      {/* Predictions list */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">

        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            {activeTab === 'safe' && <CheckCircle className="w-5 h-5 text-google-green-600" />}
            {activeTab === 'moderate' && <AlertCircle className="w-5 h-5 text-amber-500" />}
            {activeTab === 'dream' && <Sparkles className="w-5 h-5 text-google-blue-500" />}
            <span>{activeList.length} Recommended Options</span>
          </h3>
        </div>

        {activeList.length > 0 ? (
          <div className="space-y-2.5 sm:space-y-3">
            {activeList.map((item, idx) => {
              const isCompared = comparedColleges.some(c => c.code === item.college.code);
              const marginPositive = item.margin >= 0;
              return (
                <div
                  key={`${item.college.code}-${item.branchName}-${idx}`}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  {/* Top: college name + status pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {item.college.name}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
                        <span className="font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                          {item.college.code}
                        </span>
                        <span className="font-semibold text-google-blue-600 bg-google-blue-50 border border-google-blue-100 px-2 py-0.5 rounded">
                          {item.branchName}
                        </span>
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-google-red-500 shrink-0" />
                          {item.college.city}
                        </span>
                      </div>
                      <div className="mt-1.5 text-xs text-slate-500">
                        {item.college.status}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleCompare(item.college)}
                      className={`touch-target shrink-0 inline-flex items-center justify-center rounded-full transition-colors ${
                        isCompared ? 'bg-google-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Add to compare list"
                      aria-label={isCompared ? 'Remove from compare list' : 'Add to compare list'}
                    >
                      {isCompared ? <CheckCircle className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Bottom: clear metric row */}
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5">
                      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Cutoff 2025 ({userCategory})</div>
                      <div className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                        {item.cutoffP.toFixed(2)}<span className="text-xs sm:text-sm font-bold text-slate-500">%ile</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5">
                      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Rank</div>
                      <div className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                        #{item.rank.toLocaleString()}
                      </div>
                    </div>
                    <div className={`rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 border ${
                      marginPositive
                        ? 'bg-google-green-50 border-google-green-200'
                        : 'bg-google-red-50 border-google-red-200'
                    }`}>
                      <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${marginPositive ? 'text-google-green-700' : 'text-google-red-700'}`}>
                        Your Margin
                      </div>
                      <div className={`mt-0.5 text-base sm:text-lg font-black ${marginPositive ? 'text-google-green-700' : 'text-google-red-700'}`}>
                        {marginPositive ? '+' : ''}{item.margin.toFixed(2)}<span className="text-xs sm:text-sm font-bold opacity-75">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 sm:py-12 text-center text-sm text-slate-400 font-medium">
            No matching college branches found with cutoff data for <span className="font-bold text-slate-600">{userCategory}</span> in this probability bucket. Try adjusting your MHT-CET score, category, or branch preferences above.
          </div>
        )}
      </div>
    </div>
  );
};
