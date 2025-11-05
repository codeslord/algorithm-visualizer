import { create } from 'zustand';
import { Chunk, LineIndicator } from './types';

interface PlayerState {
  chunks: Chunk[];
  cursor: number;
  lineIndicator?: LineIndicator;
  isPlaying: boolean;
  speed: number;

  // Actions
  setChunks: (chunks: Chunk[]) => void;
  setCursor: (cursor: number) => void;
  setLineIndicator: (lineIndicator?: LineIndicator) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSpeed: (speed: number) => void;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  reset: () => void;
}

const initialState = {
  chunks: [],
  cursor: 0,
  lineIndicator: undefined,
  isPlaying: false,
  speed: 1,
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,

  setChunks: (chunks) => set({ chunks, cursor: 0 }),

  setCursor: (cursor) => {
    const { chunks } = get();
    if (cursor >= 0 && cursor <= chunks.length) {
      const chunk = chunks[cursor - 1];
      const lineIndicator = chunk
        ? { lineNumber: chunk.lineNumber, cursor }
        : undefined;
      set({ cursor, lineIndicator });
    }
  },

  setLineIndicator: (lineIndicator) => set({ lineIndicator }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setSpeed: (speed) => set({ speed }),

  next: () => {
    const { cursor, chunks } = get();
    if (cursor < chunks.length) {
      get().setCursor(cursor + 1);
    }
  },

  prev: () => {
    const { cursor } = get();
    if (cursor > 0) {
      get().setCursor(cursor - 1);
    }
  },

  first: () => {
    get().setCursor(0);
  },

  last: () => {
    const { chunks } = get();
    get().setCursor(chunks.length);
  },

  reset: () => set(initialState),
}));
