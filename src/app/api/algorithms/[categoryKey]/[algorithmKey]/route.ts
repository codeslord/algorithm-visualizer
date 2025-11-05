import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to local algorithms directory
const ALGORITHMS_PATH = path.join(process.cwd(), 'algorithms');

// Reverse category mapping (key to folder name)
const categoryMapping: Record<string, string> = {
  'backtracking': 'Backtracking',
  'branch-bound': 'Branch and Bound',
  'brute-force': 'Brute Force',
  'divide-conquer': 'Divide and Conquer',
  'dynamic-programming': 'Dynamic Programming',
  'greedy': 'Greedy',
  'simple-recursive': 'Simple Recursive',
  'uncategorized': 'Uncategorized',
};

// Cache for algorithm files
const fileCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryKey: string; algorithmKey: string } }
) {
  const { categoryKey, algorithmKey } = params;
  const cacheKey = `${categoryKey}:${algorithmKey}`;

  try {
    // Check cache
    const cached = fileCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Get category folder name
    const categoryFolder = categoryMapping[categoryKey];
    if (!categoryFolder) {
      throw new Error(`Unknown category: ${categoryKey}`);
    }

    // Convert algorithm key to folder name (e.g., "merge-sort" -> "Merge Sort")
    const algorithmFolder = algorithmKey
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Build path to algorithm directory
    const algorithmPath = path.join(ALGORITHMS_PATH, categoryFolder, algorithmFolder);

    // Check if directory exists
    if (!fs.existsSync(algorithmPath)) {
      throw new Error(`Algorithm not found: ${algorithmPath}`);
    }

    // Read all files in the algorithm directory
    const fileNames = fs.readdirSync(algorithmPath);
    const files = fileNames
      .filter((fileName) => {
        const filePath = path.join(algorithmPath, fileName);
        return fs.statSync(filePath).isFile();
      })
      .map((fileName) => {
        const filePath = path.join(algorithmPath, fileName);
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
          name: fileName,
          content,
          contributors: ['Algorithm Visualizer Team'],
        };
      });

    // Extract description from README if available
    const readmeFile = files.find(f => f.name.toLowerCase() === 'readme.md');
    let description = `${algorithmFolder} algorithm demonstration`;

    if (readmeFile) {
      // Extract first paragraph or heading from README as description
      const lines = readmeFile.content.split('\n').filter(l => l.trim());
      const descLine = lines.find(l => !l.startsWith('#') && l.trim().length > 10);
      if (descLine) {
        description = descLine.substring(0, 200);
      }
    }

    // Format response to match expected structure
    const responseData = {
      algorithm: {
        categoryKey,
        categoryName: categoryFolder,
        algorithmKey,
        algorithmName: algorithmFolder,
        files,
        description,
      },
    };

    // Cache the result
    fileCache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(`Error fetching algorithm ${categoryKey}/${algorithmKey}:`, error);

    // Get category name for fallback
    const categoryFolder = categoryMapping[categoryKey] || categoryKey;
    const algorithmFolder = algorithmKey
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Return fallback data in expected format
    const fallbackData = {
      algorithm: {
        categoryKey,
        categoryName: categoryFolder,
        algorithmKey,
        algorithmName: algorithmFolder,
        description: `${algorithmFolder} algorithm demonstration`,
        files: [
          {
            name: 'code.js',
            content: `// ${algorithmFolder} implementation\n// Algorithm from ${categoryFolder} category\n\nconsole.log('Algorithm: ${algorithmFolder}');\nconsole.log('Category: ${categoryFolder}');\n\n// Implementation coming soon...`,
            contributors: ['Algorithm Visualizer Team'],
          },
          {
            name: 'README.md',
            content: `# ${algorithmFolder}\n\nThis is a ${categoryFolder} algorithm.\n\n## Coming Soon\nFull implementation and visualization coming soon!`,
            contributors: ['Algorithm Visualizer Team'],
          },
        ],
      },
    };

    return NextResponse.json(fallbackData);
  }
}
