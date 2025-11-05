import { create } from 'zustand';
import { User } from './types';
import Cookies from 'js-cookie';

interface EnvState {
  ext: string;
  user?: User;

  // Actions
  setExt: (ext: string) => void;
  setUser: (user?: User) => void;
}

const initialState = {
  ext: Cookies.get('ext') || 'js',
  user: undefined,
};

export const useEnvStore = create<EnvState>((set) => ({
  ...initialState,

  setExt: (ext) => {
    Cookies.set('ext', ext, { expires: 365 });
    set({ ext });
  },

  setUser: (user) => set({ user }),
}));
