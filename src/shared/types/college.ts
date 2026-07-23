export interface CutoffData {
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
