import React, { useState, useMemo } from 'react';
import type { College } from '../data/colleges';
import { CollegeCard } from './CollegeCard';
import { Search, SlidersHorizontal, RotateCcw, Filter, Check } from 'lucide-react';
import { MobileSheet } from './MobileSheet';
import { Chip } from './Chip';

interface CollegeExplorerProps {
  colleges: College[];
  comparedColleges: College[];
  onToggleCompare: (college: College) => void;
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

const BRANCH_OPTIONS = [
  { id: 'ALL', label: 'All Branches' },
  { id: 'Computer', label: 'Computer Engineering / CSE' },
  { id: 'Information Technology', label: 'Information Technology (IT)' },
  { id: 'Artificial Intelligence', label: 'AI & Data Science / AIML' },
  { id: 'Telecommunication', label: 'Electronics & Telecommunication' },
  { id: 'Electrical', label: 'Electrical Engineering' },
  { id: 'Mechanical', label: 'Mechanical Engineering' },
  { id: 'Civil', label: 'Civil Engineering' },
  { id: 'Chemical', label: 'Chemical Engineering' }
];

const STATUS_OPTIONS = [
  { id: 'ALL', label: 'All College Types' },
];

const SORT_OPTIONS: Array<{ id: 'percentile_desc' | 'percentile_asc' | 'name' | 'rating'; label: string }> = [
  { id: 'percentile_desc', label: 'Cutoff: High to Low' },
  { id: 'percentile_asc', label: 'Cutoff: Low to High' },
  { id: 'rating', label: 'Rating: High to Low' },
  { id: 'name', label: 'College Name (A-Z)' }
];

export const CollegeExplorer: React.FC<CollegeExplorerProps> = ({
  colleges,
  comparedColleges,
  onToggleCompare
}) => {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return categories.some(c => c.id === 'GOPENH') ? 'GOPENH' : (categories[0]?.id || 'GOPENH');
  });
  const [sortBy, setSortBy] = useState<'percentile_desc' | 'percentile_asc' | 'name' | 'rating'>('percentile_desc');
  const [minPercentile, setMinPercentile] = useState<number>(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('ALL');
    setSelectedStatus('ALL');
    setSelectedBranch('ALL');
    setSelectedCategory(categories.some(c => c.id === 'GOPENH') ? 'GOPENH' : (categories[0]?.id || 'GOPENH'));
    setSortBy('percentile_desc');
    setMinPercentile(0);
  };

  const activeFilterCount =
    (selectedRegion !== 'ALL' ? 1 : 0) +
    (selectedStatus !== 'ALL' ? 1 : 0) +
    (selectedBranch !== 'ALL' ? 1 : 0) +
    (selectedCategory !== (categories.some(c => c.id === 'GOPENH') ? 'GOPENH' : (categories[0]?.id || 'GOPENH')) ? 1 : 0) +
    (minPercentile > 0 ? 1 : 0);

  // Filter & Sort Logic - strictly requires exact category cutoff data
  const filteredColleges = useMemo(() => {
    return colleges.filter((col) => {
      // Must have at least one branch with exact category cutoff data
      const hasCategoryData = col.branches.some(
        (b) => b.cutoffs2025?.[selectedCategory] && typeof b.cutoffs2025[selectedCategory].percentile === 'number'
      );
      if (!hasCategoryData) return false;

      const matchesSearch =
        searchTerm.trim() === '' ||
        col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.code.includes(searchTerm);

      const matchesRegion =
        selectedRegion === 'ALL' || col.region === selectedRegion || col.city.toLowerCase().includes(selectedRegion.toLowerCase());

      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'Government' && col.status.includes('Government')) ||
        (selectedStatus === 'Private' && !col.status.includes('Government')) ||
        (selectedStatus === 'Autonomous' && col.status.includes('Autonomous'));

      const matchesBranch =
        selectedBranch === 'ALL' ||
        col.branches.some(b => b.name.toLowerCase().includes(selectedBranch.toLowerCase()) && b.cutoffs2025?.[selectedCategory]);

      const topBranch = col.branches.find(b => (b.name.includes("Computer") || b.name.includes("CSE")) && b.cutoffs2025?.[selectedCategory]) || col.branches.find(b => b.cutoffs2025?.[selectedCategory]);
      const p = topBranch?.cutoffs2025?.[selectedCategory]?.percentile || 0;
      const matchesPercentile = p >= minPercentile;

      return matchesSearch && matchesRegion && matchesStatus && matchesBranch && matchesPercentile;
    }).sort((colA, colB) => {
      const aTopBranch = colA.branches.find(br => (br.name.includes("Computer") || br.name.includes("CSE")) && br.cutoffs2025?.[selectedCategory]) || colA.branches.find(br => br.cutoffs2025?.[selectedCategory]);
      const bTopBranch = colB.branches.find(br => (br.name.includes("Computer") || br.name.includes("CSE")) && br.cutoffs2025?.[selectedCategory]) || colB.branches.find(br => br.cutoffs2025?.[selectedCategory]);

      const aCutoff = aTopBranch?.cutoffs2025?.[selectedCategory]?.percentile || 0;
      const bCutoff = bTopBranch?.cutoffs2025?.[selectedCategory]?.percentile || 0;

      if (sortBy === 'percentile_desc') return bCutoff - aCutoff;
      if (sortBy === 'percentile_asc') return aCutoff - bCutoff;
      if (sortBy === 'name') return colA.name.localeCompare(colB.name);
      if (sortBy === 'rating') return colB.rating - colA.rating;
      return 0;
    });
  }, [colleges, searchTerm, selectedRegion, selectedStatus, selectedBranch, selectedCategory, sortBy, minPercentile]);

  const statusLabel = STATUS_OPTIONS.find(s => s.id === selectedStatus)?.label || '';
  const branchLabel = BRANCH_OPTIONS.find(b => b.id === selectedBranch)?.label || '';
  const categoryLabel = categories.find(c => c.id === selectedCategory)?.label?.split(' ')[0] || selectedCategory;

  const filterSheet = (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-bold text-slate-700 mb-2 block">Reservation Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="touch-target w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700 mb-2 block">Branch</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="touch-target w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
        >
          {BRANCH_OPTIONS.map((br) => (
            <option key={br.id} value={br.id}>{br.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700 mb-2 block">College Type</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="touch-target w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700 mb-2 block">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'percentile_desc' | 'percentile_asc' | 'name' | 'rating')}
          className="touch-target w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center text-sm font-bold text-slate-700 mb-2">
          <span>Minimum MHT-CET Percentile</span>
          <span className="text-google-blue-600 font-extrabold">{minPercentile}%ile +</span>
        </div>
        <input
          type="range"
          min="0"
          max="99"
          step="1"
          value={minPercentile}
          onChange={(e) => setMinPercentile(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-google-blue-500"
        />
      </div>
    </div>
  );

  const defaultCatId = categories.some(c => c.id === 'GOPENH') ? 'GOPENH' : (categories[0]?.id || 'GOPENH');

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">

      {/* Search Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200/80">
        <div className="max-w-3xl mx-auto text-center mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore <span className="text-google-blue-500">Maharashtra</span> Engineering Cutoffs
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Some Colleges May NOT show-up based on the selected Resevation Category. In the FILTERS tab Make sure it matches your preference.
          </p>
        </div>

        {/* Search input row + filter trigger */}
        <div className="max-w-2xl mx-auto flex items-stretch gap-2">
          <div className="relative flex-1 flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-full focus-within:shadow-[0_8px_30px_rgba(26,115,232,0.2)] focus-within:border-google-blue-500 transition-all duration-200">
            <Search className="w-5 h-5 text-google-blue-500 absolute left-4 sm:left-5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by college name, city, or DTE code…"
              className="w-full pl-11 sm:pl-13 pr-10 py-3.5 rounded-full text-sm font-medium bg-white text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
              >
                Clear
              </button>
            ) : null}
          </div>

          {/* Mobile filter trigger */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="md:hidden touch-target shrink-0 inline-flex items-center justify-center gap-1.5 bg-google-blue-500 hover:bg-google-blue-600 text-white text-sm font-bold rounded-full px-4 relative"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-google-red-500 text-white text-[11px] font-extrabold flex items-center justify-center">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>

        {/* Desktop Region Pills (visible >= md) */}
      </div>

      {/* Mobile active filter chips (visible < md) */}
      {activeFilterCount > 0 ? (
        <div className="md:hidden -mt-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Active:</span>
            {selectedStatus !== 'ALL' ? (
              <Chip color="blue" label={statusLabel} onRemove={() => setSelectedStatus('ALL')} />
            ) : null}
            {selectedBranch !== 'ALL' ? (
              <Chip color="blue" label={branchLabel} onRemove={() => setSelectedBranch('ALL')} />
            ) : null}
            {selectedCategory !== defaultCatId ? (
              <Chip color="blue" label={categoryLabel} onRemove={() => setSelectedCategory(defaultCatId)} />
            ) : null}
            {minPercentile > 0 ? (
              <Chip color="blue" label={`${minPercentile}%+`} onRemove={() => setMinPercentile(0)} />
            ) : null}
            <button
              onClick={handleResetFilters}
              className="shrink-0 text-xs font-bold text-google-red-600 bg-google-red-50 border border-google-red-100 px-3 py-1.5 rounded-full"
            >
              Reset
            </button>
          </div>
        </div>
      ) : null}

      {/* Desktop Filter Controls Toolbar (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-google-blue-500" />
            Refine Search & Category Cutoffs
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-slate-500 hover:text-google-red-500 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Reservation Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Branch Filter</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
            >
              {BRANCH_OPTIONS.map((br) => (
                <option key={br.id} value={br.id}>{br.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">College Type</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Sort Colleges By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'percentile_desc' | 'percentile_asc' | 'name' | 'rating')}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
            <span>Filter Minimum MHT-CET Percentile Cutoff:</span>
            <span className="text-google-blue-600 font-extrabold text-sm">{minPercentile}%ile +</span>
          </div>
          <input
            type="range"
            min="0"
            max="99"
            step="1"
            value={minPercentile}
            onChange={(e) => setMinPercentile(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-google-blue-500"
          />
        </div>
      </div>

      {/* Search Results Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2">
        <div className="text-sm font-semibold text-slate-700">
          Showing <span className="font-bold text-slate-900">{filteredColleges.length}</span> colleges matching criteria
        </div>
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Active Category: <span className="font-bold text-google-blue-600 bg-google-blue-50 px-2 py-0.5 rounded border border-google-blue-100">{selectedCategory}</span>
        </div>
      </div>

      {/* College List Grid */}
      {filteredColleges.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredColleges.map((college) => {
            const isCompared = comparedColleges.some(c => c.code === college.code);
            return (
              <CollegeCard
                key={college.code}
                college={college}
                selectedCategory={selectedCategory}
                isCompared={isCompared}
                onToggleCompare={onToggleCompare}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-6 sm:my-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Colleges Found</h3>
          <p className="text-sm text-slate-500 mt-2">
            No engineering colleges matched your search parameters with cutoff data for <span className="font-bold text-slate-700">{selectedCategory}</span>. Try adjusting your category, minimum percentile, or region filters above.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 google-btn-secondary text-sm mx-auto"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Mobile filter bottom sheet */}
      <MobileSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="flex-1 touch-target inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-full"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => setFiltersOpen(false)}
              className="flex-1 touch-target inline-flex items-center justify-center gap-1.5 bg-google-blue-500 text-white text-sm font-bold rounded-full"
            >
              <Check className="w-4 h-4" />
              Apply
            </button>
          </div>
        }
      >
        {filterSheet}
      </MobileSheet>
    </div>
  );
};
