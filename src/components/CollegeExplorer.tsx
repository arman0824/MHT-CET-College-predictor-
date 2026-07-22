import React, { useState, useMemo } from 'react';
import type { College } from '../data/colleges';
import { CollegeCard } from './CollegeCard';
import { Search, SlidersHorizontal, MapPin, RotateCcw, Filter } from 'lucide-react';

interface CollegeExplorerProps {
  colleges: College[];
  comparedColleges: College[];
  onToggleCompare: (college: College) => void;
}

export const CollegeExplorer: React.FC<CollegeExplorerProps> = ({
  colleges,
  comparedColleges,
  onToggleCompare
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('GOPENH');
  const [sortBy, setSortBy] = useState<'percentile_desc' | 'percentile_asc' | 'name' | 'rating'>('percentile_desc');
  const [minPercentile, setMinPercentile] = useState<number>(0);

  // Region options
  const regions = [
    { id: 'ALL', label: 'All Regions' },
    { id: 'Mumbai', label: 'Mumbai & Thane' },
    { id: 'Pune', label: 'Pune' },
    { id: 'Nagpur', label: 'Nagpur' },
    { id: 'Nashik', label: 'Nashik' },
    { id: 'Aurangabad', label: 'Chh. Sambhajinagar' },
    { id: 'Sangli/Kolhapur/Satara', label: 'Sangli/Kolhapur' },
    { id: 'Nanded/Amravati/Jalgaon', label: 'Amravati & Nanded' }
  ];

  // Category options
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

  // Branch options
  const branchOptions = [
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

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('ALL');
    setSelectedStatus('ALL');
    setSelectedBranch('ALL');
    setSelectedCategory('GOPENH');
    setSortBy('percentile_desc');
    setMinPercentile(0);
  };

  // Filter & Sort Logic
  const filteredColleges = useMemo(() => {
    return colleges.filter((col) => {
      // Search Matching
      const matchesSearch =
        searchTerm.trim() === '' ||
        col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.code.includes(searchTerm);

      // Region Matching
      const matchesRegion =
        selectedRegion === 'ALL' || col.region === selectedRegion || col.city.toLowerCase().includes(selectedRegion.toLowerCase());

      // Status Matching
      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'Government' && col.status.includes('Government')) ||
        (selectedStatus === 'Private' && !col.status.includes('Government')) ||
        (selectedStatus === 'Autonomous' && col.status.includes('Autonomous'));

      // Branch Matching
      const matchesBranch =
        selectedBranch === 'ALL' ||
        col.branches.some(b => b.name.toLowerCase().includes(selectedBranch.toLowerCase()));

      // Percentile Filter
      const topBranch = col.branches.find(b => b.name.includes("Computer") || b.name.includes("CSE")) || col.branches[0];
      const p = topBranch?.cutoffs2025[selectedCategory]?.percentile || topBranch?.cutoffs2025['GOPENH']?.percentile || 0;
      const matchesPercentile = p >= minPercentile;

      return matchesSearch && matchesRegion && matchesStatus && matchesBranch && matchesPercentile;
    }).sort((a, b) => {
      const aTopBranch = a.branches.find(br => br.name.includes("Computer") || br.name.includes("CSE")) || a.branches[0];
      const bTopBranch = b.branches.find(br => br.name.includes("Computer") || br.name.includes("CSE")) || b.branches[0];
      
      const aCutoff = aTopBranch?.cutoffs2025[selectedCategory]?.percentile || 0;
      const bCutoff = bTopBranch?.cutoffs2025[selectedCategory]?.percentile || 0;

      if (sortBy === 'percentile_desc') return bCutoff - aCutoff;
      if (sortBy === 'percentile_asc') return aCutoff - bCutoff;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [colleges, searchTerm, selectedRegion, selectedStatus, selectedBranch, selectedCategory, sortBy, minPercentile]);

  return (
    <div className="space-y-8 py-6">
      
      {/* Floating Google Material Search Bar Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200/80">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore <span className="text-google-blue-500">Maharashtra</span> Engineering Cutoffs
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Search 370+ CAP engineering colleges across Mumbai, Pune, Nagpur, Nashik & all districts. Filter by MHT-CET score & category.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-full focus-within:shadow-[0_8px_30px_rgba(26,115,232,0.2)] focus-within:border-google-blue-500 transition-all duration-200">
            <Search className="w-5 h-5 text-google-blue-500 absolute left-5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by college name, city, branch, or DTE CAP Code (e.g., VJTI, 3012)..."
              className="w-full pl-13 pr-12 py-4 rounded-full text-sm font-medium bg-white text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Region Pills Bar */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar pt-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-google-red-500" />
            Region:
          </span>
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-150 ${
                selectedRegion === reg.id
                  ? 'bg-google-blue-500 text-white shadow-[0_2px_8px_rgba(26,115,232,0.3)] scale-[1.02]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-google-blue-500" />
            Refine Search & Category Cutoffs
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-google-red-500 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">
              Reservation Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">
              Branch Filter:
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
            >
              {branchOptions.map((br) => (
                <option key={br.id} value={br.id}>
                  {br.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">
              College Type:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
            >
              <option value="ALL">All College Types</option>
              <option value="Government">Government / Govt-Aided</option>
              <option value="Private">Private / Un-Aided</option>
              <option value="Autonomous">Autonomous Colleges</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">
              Sort Colleges By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-google-blue-500 focus:outline-none"
            >
              <option value="percentile_desc">Cutoff: High to Low</option>
              <option value="percentile_asc">Cutoff: Low to High</option>
              <option value="rating">Rating: High to Low</option>
              <option value="name">College Name (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Min Percentile Slider */}
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
      <div className="flex items-center justify-between px-2">
        <div className="text-sm font-semibold text-slate-700">
          Showing <span className="font-bold text-slate-900">{filteredColleges.length}</span> colleges matching criteria
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Active Category: <span className="font-bold text-google-blue-600 bg-google-blue-50 px-2 py-0.5 rounded border border-google-blue-100">{selectedCategory}</span>
        </div>
      </div>

      {/* College List Grid */}
      {filteredColleges.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Colleges Found</h3>
          <p className="text-xs text-slate-500 mt-2">
            No engineering colleges matched your search parameters. Try lowering your minimum percentile or selecting "All Regions".
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 google-btn-secondary text-xs mx-auto"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};
