import axios from 'axios';
import { Category, FileContent } from '@/store/types';

// Configure axios
axios.interceptors.response.use((response) => response.data);

const GET = <T = any>(url: string) => {
  return async (...args: any[]): Promise<T> => {
    const tokens = url.split('/');
    const baseURL = /^https?:\/\//i.test(url) ? '' : '/api';
    const mappedURL =
      baseURL +
      tokens.map((token) => (token.startsWith(':') ? args.shift() : token)).join('/');
    const [params, cancelToken] = args;
    return axios.get(mappedURL, { params, cancelToken });
  };
};

const POST = <T = any>(url: string) => {
  return async (...args: any[]): Promise<T> => {
    const tokens = url.split('/');
    const baseURL = /^https?:\/\//i.test(url) ? '' : '/api';
    const mappedURL =
      baseURL +
      tokens.map((token) => (token.startsWith(':') ? args.shift() : token)).join('/');
    const [body, params, cancelToken] = args;
    return axios.post(mappedURL, body, { params, cancelToken });
  };
};

const PATCH = <T = any>(url: string) => {
  return async (...args: any[]): Promise<T> => {
    const tokens = url.split('/');
    const baseURL = /^https?:\/\//i.test(url) ? '' : '/api';
    const mappedURL =
      baseURL +
      tokens.map((token) => (token.startsWith(':') ? args.shift() : token)).join('/');
    const [body, params, cancelToken] = args;
    return axios.patch(mappedURL, body, { params, cancelToken });
  };
};

const DELETE = <T = any>(url: string) => {
  return async (...args: any[]): Promise<T> => {
    const tokens = url.split('/');
    const baseURL = /^https?:\/\//i.test(url) ? '' : '/api';
    const mappedURL =
      baseURL +
      tokens.map((token) => (token.startsWith(':') ? args.shift() : token)).join('/');
    const [params, cancelToken] = args;
    return axios.delete(mappedURL, { params, cancelToken });
  };
};

// Algorithm API
export const AlgorithmApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await GET<{ categories: Category[] }>('/algorithms')();
    return response.categories;
  },
  getAlgorithm: async (
    categoryKey: string,
    algorithmKey: string
  ): Promise<{
    categoryKey: string;
    categoryName: string;
    algorithmKey: string;
    algorithmName: string;
    files: FileContent[];
    description: string;
  }> => {
    const response = await GET<{
      algorithm: {
        categoryKey: string;
        categoryName: string;
        algorithmKey: string;
        algorithmName: string;
        files: FileContent[];
        description: string;
      };
    }>('/algorithms/:categoryKey/:algorithmKey')(categoryKey, algorithmKey);
    return response.algorithm;
  },
};

// Visualization API
export const VisualizationApi = {
  getVisualization: GET('/visualizations/:visualizationId'),
};

// GitHub API
export const GitHubApi = {
  auth: (token?: string) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `token ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    return Promise.resolve();
  },
  getUser: GET('https://api.github.com/user'),
  listGists: GET('https://api.github.com/gists'),
  createGist: POST('https://api.github.com/gists'),
  editGist: PATCH('https://api.github.com/gists/:id'),
  getGist: GET('https://api.github.com/gists/:id'),
  deleteGist: DELETE('https://api.github.com/gists/:id'),
  forkGist: POST('https://api.github.com/gists/:id/forks'),
};

// Tracer API
export const TracerApi = {
  md: ({ code }: { code: string }) =>
    Promise.resolve([
      {
        key: 'markdown',
        method: 'MarkdownTracer',
        args: ['Markdown'],
      },
      {
        key: 'markdown',
        method: 'set',
        args: [code],
      },
      {
        key: null,
        method: 'setRoot',
        args: ['markdown'],
      },
    ]),
  json: ({ code }: { code: string }) => Promise.resolve(JSON.parse(code)),
  js: ({ code }: { code: string }) =>
    // For now, return empty array. This would need a Web Worker implementation
    Promise.resolve([]),
  cpp: POST('/tracers/cpp'),
  java: POST('/tracers/java'),
};
