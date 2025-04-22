import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, ThemeState } from '../../types/theme';

// Get saved theme from localStorage or default to 'light'
const getSavedTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme');
  return (savedTheme as ThemeMode) || 'light';
};

const initialState: ThemeState = {
  mode: getSavedTheme(),
  chatBackgroundColor: {
    light: '#f0f5ff', // Light blue background for light mode
    dark: '#1a1d2d', // Dark blue background for dark mode
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setChatBackgroundColor: (state, action: PayloadAction<{ light: string; dark: string }>) => {
      state.chatBackgroundColor = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setChatBackgroundColor } = themeSlice.actions;
export default themeSlice.reducer;