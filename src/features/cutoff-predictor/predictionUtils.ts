import type { College } from '../../shared/types/college';

export type PredictionBucket = 'safe' | 'moderate' | 'dream';

export interface Prediction {
  college: College;
  branchName: string;
  cutoffP: number;
  rank: number;
  margin: number;
}

export interface Predictions {
  safeList: Prediction[];
  moderateList: Prediction[];
  dreamList: Prediction[];
}

const EMPTY_PREDICTIONS: Predictions = { safeList: [], moderateList: [], dreamList: [] };

export function calculatePredictions(
  colleges: College[],
  userPercentile: number | string,
  category: string,
  region: string,
  branchFilter: string,
): Predictions {
  const percentile = typeof userPercentile === 'number' ? userPercentile : Number.parseFloat(userPercentile);
  if (Number.isNaN(percentile) || percentile < 0 || !category) return EMPTY_PREDICTIONS;

  const predictions: Predictions = { safeList: [], moderateList: [], dreamList: [] };

  colleges.forEach((college) => {
    if (region !== 'ALL' && college.region !== region && !college.city.toLowerCase().includes(region.toLowerCase())) return;

    college.branches.forEach((branch) => {
      if (branchFilter !== 'ALL' && !branch.name.toLowerCase().includes(branchFilter.toLowerCase())) return;

      const cutoff = branch.cutoffs2025[category];
      if (!cutoff || !Number.isFinite(cutoff.percentile) || !Number.isFinite(cutoff.rank)) return;

      const prediction = {
        college,
        branchName: branch.name,
        cutoffP: cutoff.percentile,
        rank: cutoff.rank,
        margin: percentile - cutoff.percentile,
      };

      if (prediction.margin >= 0) predictions.safeList.push(prediction);
      else if (prediction.margin >= -1.5) predictions.moderateList.push(prediction);
      else if (prediction.margin >= -3.5) predictions.dreamList.push(prediction);
    });
  });

  const comparePredictions = (first: Prediction, second: Prediction) => {
    const marginDifference = Math.abs(first.margin) - Math.abs(second.margin);
    if (Math.abs(marginDifference) > 0.0001) return marginDifference;
    if (second.cutoffP !== first.cutoffP) return second.cutoffP - first.cutoffP;
    return first.college.name.localeCompare(second.college.name);
  };

  Object.values(predictions).forEach((list) => list.sort(comparePredictions));
  return predictions;
}
