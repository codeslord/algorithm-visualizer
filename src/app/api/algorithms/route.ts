import { NextResponse } from 'next/server';

// GitHub repo details
const GITHUB_REPO = 'algorithm-visualizer/algorithms';
const GITHUB_API = 'https://api.github.com/repos';

// Category mapping (GitHub folder name to display name)
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

    // Fetch root directory from GitHub
    const response = await fetch(
      `${GITHUB_API}/${GITHUB_REPO}/contents`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Algorithm-Visualizer',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const contents = await response.json();

    // Filter to only include directories that are algorithm categories
    const categoryFolders = contents.filter(
      (item: any) => item.type === 'dir' && categoryMapping[item.name]
    );

    // Fetch algorithms for each category
    const categories = await Promise.all(
      categoryFolders.map(async (folder: any) => {
        try {
          const algoResponse = await fetch(folder.url, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Algorithm-Visualizer',
            },
          });

          if (!algoResponse.ok) {
            return null;
          }

          const algorithms = await algoResponse.json();

          // Filter to only include directories (actual algorithms)
          const algorithmDirs = algorithms
            .filter((item: any) => item.type === 'dir')
            .map((item: any) => ({
              key: item.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
              name: item.name,
              description: `${item.name} algorithm`,
            }));

          return {
            key: categoryMapping[folder.name],
            name: folder.name,
            algorithms: algorithmDirs,
          };
        } catch (error) {
          console.error(`Error fetching algorithms for ${folder.name}:`, error);
          return null;
        }
      })
    );

    // Filter out null results and cache
    const validCategories = categories.filter(Boolean);
    const responseData = { categories: validCategories };
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
