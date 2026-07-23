import type { Branch, College, CutoffData } from '../types/college';

export const DEFAULT_CATEGORY = 'GOPENH';

export function hasCategoryCutoff(branch: Branch, category: string): boolean {
  return typeof branch.cutoffs2025[category]?.percentile === 'number';
}

export function findPreferredBranch(college: College, category: string): Branch | undefined {
  return college.branches.find(
    (branch) => isComputerBranch(branch) && hasCategoryCutoff(branch, category),
  ) ?? college.branches.find((branch) => hasCategoryCutoff(branch, category));
}

export function isComputerBranch(branch: Branch): boolean {
  return branch.name.includes('Computer') || branch.name.includes('CSE');
}

export function findBranchByKeywords(college: College, keywords: string[]): Branch | undefined {
  return college.branches.find((branch) => keywords.some((keyword) => branch.name.includes(keyword)));
}

export function getCategoryCutoff(branch: Branch | undefined, category: string): CutoffData | null {
  return branch?.cutoffs2025[category] ?? null;
}
