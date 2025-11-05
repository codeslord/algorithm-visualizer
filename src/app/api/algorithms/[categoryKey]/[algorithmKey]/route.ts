import { NextRequest, NextResponse } from 'next/server';

// GitHub repo details
const GITHUB_REPO = 'algorithm-visualizer/algorithms';
const GITHUB_RAW = 'https://raw.githubusercontent.com';

// Reverse category mapping (key to GitHub folder name)
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

    // Get GitHub category folder name
    const categoryFolder = categoryMapping[categoryKey];
    if (!categoryFolder) {
      throw new Error(`Unknown category: ${categoryKey}`);
    }

    // Convert algorithm key to folder name (e.g., "merge-sort" -> "Merge Sort")
    const algorithmFolder = algorithmKey
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Fetch directory contents from GitHub API
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(categoryFolder)}/${encodeURIComponent(algorithmFolder)}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Algorithm-Visualizer',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const contents = await response.json();

    // Fetch all files in the directory
    const files = await Promise.all(
      contents
        .filter((item: any) => item.type === 'file')
        .map(async (file: any) => {
          try {
            // Fetch raw file content
            const fileResponse = await fetch(file.download_url);

            if (!fileResponse.ok) {
              console.error(`Failed to fetch ${file.name}`);
              return null;
            }

            const content = await fileResponse.text();

            return {
              name: file.name,
              content: content,
              contributors: ['Algorithm Visualizer Team'],
            };
          } catch (error) {
            console.error(`Error fetching file ${file.name}:`, error);
            return null;
          }
        })
    );

    // Filter out null results
    const validFiles = files.filter(Boolean);

    // Extract description from README if available
    const readmeFile = validFiles.find(f => f?.name.toLowerCase() === 'readme.md');
    let description = `${algorithmFolder} algorithm demonstration`;

    if (readmeFile) {
      // Extract first paragraph or heading from README as description
      const lines = readmeFile.content.split('\n').filter(l => l.trim());
      const descLine = lines.find(l => !l.startsWith('#') && l.trim().length > 10);
      if (descLine) {
        description = descLine.substring(0, 200);
      }
    }

    const data = {
      description,
      files: validFiles,
    };

    // Cache the result
    fileCache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching algorithm ${categoryKey}/${algorithmKey}:`, error);

    // Return fallback data
    const fallbackData = {
      description: `${algorithmKey} algorithm demonstration`,
      files: [
        {
          name: 'code.js',
          content: `// ${algorithmKey} implementation\n// Algorithm from ${categoryKey} category\n\nconsole.log('Algorithm: ${algorithmKey}');\nconsole.log('Category: ${categoryKey}');\n\n// Implementation coming soon...`,
          contributors: ['Algorithm Visualizer Team'],
        },
        {
          name: 'README.md',
          content: `# ${algorithmKey}\n\nThis is a ${categoryKey} algorithm.\n\n## Coming Soon\nFull implementation and visualization coming soon!`,
          contributors: ['Algorithm Visualizer Team'],
        },
      ],
    };

    return NextResponse.json(fallbackData);
  }
}
