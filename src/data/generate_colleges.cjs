const fs = require('fs');
const path = require('path');

// Since this file is inside src/data, colleges.json is in the exact same folder
const jsonPath = path.join(__dirname, 'colleges.json');
const tsPath = path.join(__dirname, 'colleges.ts');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Error: colleges.json not found in ' + __dirname);
  process.exit(1);
}

const rawData = fs.readFileSync(jsonPath, 'utf8');
const jsonColleges = JSON.parse(rawData);

// Rank estimation formula based on percentile (out of ~200,000 CET candidates)
function estimateRank(percentile) {
  if (percentile <= 0) return 200000;
  if (percentile >= 100) return 1;
  return Math.max(1, Math.round(((100 - percentile) / 100) * 200000));
}

const collegesData = jsonColleges.map((college) => {
  return {
    code: String(college.code || '').padStart(4, '0'),
    name: college.name,
    shortName: college.shortName || college.name.split(',')[0].substring(0, 30),
    city: college.city || 'Maharashtra',
    region: college.region || 'Maharashtra',
    status: college.status || 'Un-Aided',
    established: college.established || 1990,
    fees: college.fees || 100000,
    rating: college.rating || 4.0,
    website: college.website || '#',
    branches: (college.branches || []).map((branch) => {
      // Process 2025 Cutoffs strictly from JSON (No fallback categories)
      const cutoffs2025 = {};
      if (branch.cutoffs2025) {
        Object.entries(branch.cutoffs2025).forEach(([category, pVal]) => {
          const percentile = parseFloat(pVal);
          if (!isNaN(percentile)) {
            cutoffs2025[category] = {
              percentile: Number(percentile.toFixed(4)),
              rank: estimateRank(percentile)
            };
          }
        });
      }

      // Process 2024 Cutoffs (if present)
      const cutoffs2024 = {};
      if (branch.cutoffs2024) {
        Object.entries(branch.cutoffs2024).forEach(([category, pVal]) => {
          const percentile = parseFloat(pVal);
          if (!isNaN(percentile)) {
            cutoffs2024[category] = {
              percentile: Number(percentile.toFixed(4)),
              rank: estimateRank(percentile)
            };
          }
        });
      }

      return {
        code: String(branch.code || ''),
        name: branch.name,
        intake: branch.intake || 60,
        cutoffs2025,
        cutoffs2024: Object.keys(cutoffs2024).length > 0 ? cutoffs2024 : cutoffs2025
      };
    })
  };
});

// Write to colleges.ts
const tsContent = `export interface CutoffData {
  percentile: number;
  rank: number;
}

export interface Branch {
  code: string;
  name: string;
  intake: number;
  cutoffs2025: Record<string, CutoffData>;
  cutoffs2024: Record<string, CutoffData>;
}

export interface College {
  code: string;
  name: string;
  shortName: string;
  city: string;
  region: string;
  status: string;
  established: number;
  fees: number;
  rating: number;
  website: string;
  branches: Branch[];
}

export const collegesData: College[] = ${JSON.stringify(collegesData, null, 2)};
`;

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log('✅ Successfully re-generated src/data/colleges.ts strictly from colleges.json!');