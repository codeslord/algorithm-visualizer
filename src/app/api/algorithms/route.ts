import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to local algorithms directory
const ALGORITHMS_PATH = path.join(process.cwd(), 'algorithms');

// Category mapping (folder name to key)
const categoryMapping: Record<string, string> = {
  'Backtracking': 'backtracking',
  'Branch and Bound': 'branch-bound',
  'Brute Force': 'brute-force',
  'Divide and Conquer': 'divide-conquer',
  'Dynamic Programming': 'dynamic-programming',
  'Greedy': 'greedy',
  'Simple Recursive': 'simple-recursive',
  'Uncategorized': 'uncategorized',
};

// Cache for algorithm categories
let categoriesCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json(categoriesCache);
    }

    // Check if algorithms directory exists
    if (!fs.existsSync(ALGORITHMS_PATH)) {
      throw new Error('Algorithms directory not found. Please clone the algorithms repository.');
    }

    // Read algorithm categories from local directory
    const items = fs.readdirSync(ALGORITHMS_PATH, { withFileTypes: true });

    const categories = items
      .filter((item) => item.isDirectory() && categoryMapping[item.name])
      .map((categoryDir) => {
        const categoryPath = path.join(ALGORITHMS_PATH, categoryDir.name);
        const algorithmDirs = fs
          .readdirSync(categoryPath, { withFileTypes: true })
          .filter((item) => item.isDirectory());

        const algorithms = algorithmDirs.map((algoDir) => ({
          key: algoDir.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
          name: algoDir.name,
          description: `${algoDir.name} algorithm`,
        }));

        return {
          key: categoryMapping[categoryDir.name],
          name: categoryDir.name,
          algorithms,
        };
      });

    const responseData = { categories };
    categoriesCache = responseData;
    cacheTimestamp = now;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching algorithm categories:', error);

    // Return fallback data in expected format
    return NextResponse.json({
      categories: [
        {
          key: 'divide-conquer',
          name: 'Divide and Conquer',
          algorithms: [
            { key: 'merge-sort', name: 'Merge Sort', description: 'Merge Sort algorithm' },
            { key: 'quicksort', name: 'Quicksort', description: 'Quicksort algorithm' },
          ],
        },
        {
          key: 'backtracking',
          name: 'Backtracking',
          algorithms: [
            { key: 'n-queens-problem', name: 'N-Queens Problem', description: 'N-Queens Problem' },
          ],
        },
      ],
    });
  }
}
