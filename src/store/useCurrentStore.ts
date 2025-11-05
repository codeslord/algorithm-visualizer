import { create } from 'zustand';
import { Algorithm, FileContent, ScratchPaper } from './types';

interface CurrentState {
  algorithm?: Algorithm;
  scratchPaper?: ScratchPaper;
  titles: string[];
  files: FileContent[];
  editingFile?: FileContent;
  description: string;
  shouldBuild: boolean;
  saved: boolean;

  // Actions
  setAlgorithm: (algorithm?: Algorithm) => void;
  setScratchPaper: (scratchPaper?: ScratchPaper) => void;
  setTitles: (titles: string[]) => void;
  setFiles: (files: FileContent[]) => void;
  setEditingFile: (file?: FileContent) => void;
  setDescription: (description: string) => void;
  setShouldBuild: (shouldBuild: boolean) => void;
  setSaved: (saved: boolean) => void;
  updateFileContent: (name: string, content: string) => void;
  reset: () => void;
}

const initialState = {
  algorithm: undefined,
  scratchPaper: undefined,
  titles: [],
  files: [],
  editingFile: undefined,
  description: '',
  shouldBuild: true,
  saved: true,
};

export const useCurrentStore = create<CurrentState>((set, get) => ({
  ...initialState,

  setAlgorithm: (algorithm) => set({ algorithm, scratchPaper: undefined }),

  setScratchPaper: (scratchPaper) => set({ scratchPaper, algorithm: undefined }),

  setTitles: (titles) => set({ titles }),

  setFiles: (files) => set({ files }),

  setEditingFile: (editingFile) => set({ editingFile }),

  setDescription: (description) => set({ description }),

  setShouldBuild: (shouldBuild) => set({ shouldBuild }),

  setSaved: (saved) => set({ saved }),

  updateFileContent: (name, content) => {
    const files = get().files.map((file) =>
      file.name === name ? { ...file, content } : file
    );
    const editingFile = get().editingFile;
    const updatedEditingFile =
      editingFile?.name === name ? { ...editingFile, content } : editingFile;

    set({
      files,
      editingFile: updatedEditingFile,
      saved: false,
      shouldBuild: true,
    });
  },

  reset: () => set(initialState),
}));
