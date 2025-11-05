import { create } from 'zustand';
import { Category, FileContent } from './types';

interface DirectoryState {
  categories: Category[];
  scratchPapers: FileContent[];

  // Actions
  setCategories: (categories: Category[]) => void;
  setScratchPapers: (scratchPapers: FileContent[]) => void;
}

const initialState = {
  categories: [],
  scratchPapers: [],
};

export const useDirectoryStore = create<DirectoryState>((set) => ({
  ...initialState,

  setCategories: (categories) => set({ categories }),

  setScratchPapers: (scratchPapers) => set({ scratchPapers }),
}));
