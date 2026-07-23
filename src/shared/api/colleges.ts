import type { College } from '../types/college';

const DATA_URL = '/data/colleges.json';
let collegesRequest: Promise<College[]> | undefined;

export function fetchColleges(): Promise<College[]> {
  collegesRequest ??= fetch(DATA_URL).then(async (response) => {
    if (!response.ok) throw new Error('College data could not be loaded.');
    return response.json() as Promise<College[]>;
  });

  return collegesRequest;
}
