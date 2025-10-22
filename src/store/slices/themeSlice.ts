import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  systemTheme: Theme;
  useSystemTheme: boolean;
}

const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const initialState: ThemeState = {
  theme: 'light',
  systemTheme: getSystemTheme(),
  useSystemTheme: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      state.useSystemTheme = false;
      
      if (typeof document !== 'undefined') {
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      state.useSystemTheme = false;
      
      if (typeof document !== 'undefined') {
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    
    setSystemTheme: (state, action: PayloadAction<Theme>) => {
      state.systemTheme = action.payload;
      
      if (state.useSystemTheme) {
        state.theme = action.payload;
        
        if (typeof document !== 'undefined') {
          if (action.payload === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    },
    
    setUseSystemTheme: (state, action: PayloadAction<boolean>) => {
      state.useSystemTheme = action.payload;
      
      if (action.payload) {
        state.theme = state.systemTheme;
        
        if (typeof document !== 'undefined') {
          if (state.systemTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    },
  },
});

export const { setTheme, toggleTheme, setSystemTheme, setUseSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;