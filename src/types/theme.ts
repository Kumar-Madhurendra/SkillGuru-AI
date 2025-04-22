export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
  chatBackgroundColor: {
    light: string;
    dark: string;
  };
}