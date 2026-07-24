import type { Branch, College, CutoffData } from '../types/college';

export const DEFAULT_CATEGORY = 'GOPENH';
export const ALL_CATEGORIES = 'ALL';

export function hasCategoryCutoff(branch: Branch, category: string): boolean {
  if (category === ALL_CATEGORIES) return hasAnyCutoff(branch);
  return typeof branch.cutoffs2025[category]?.percentile === 'number';
}

export function hasAnyCutoff(branch: Branch): boolean {
  return Object.values(branch.cutoffs2025).some((c) => typeof c?.percentile === 'number');
}

export function findPreferredBranch(college: College, category: string): Branch | undefined {
  if (category === ALL_CATEGORIES) {
    return college.branches.find(
      (branch) => isComputerBranch(branch) && hasAnyCutoff(branch),
    ) ?? college.branches.find((branch) => hasAnyCutoff(branch));
  }
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
  if (category === ALL_CATEGORIES) {
    return getBestCutoff(branch) ?? null;
  }
  return branch?.cutoffs2025[category] ?? null;
}

export function getBestCutoff(branch: Branch | undefined): CutoffData | undefined {
  if (!branch) return undefined;
  const list = Object.values(branch.cutoffs2025).filter((c) => typeof c?.percentile === 'number');
  if (list.length === 0) return undefined;
  return list.reduce((best, cur) => (cur.percentile > best.percentile ? cur : best));
}
