import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleTheme, setTheme, setChatBackgroundColor } from '../store/slices/themeSlice';
import { ThemeMode } from '../types/theme';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { mode, chatBackgroundColor } = useSelector((state: RootState) => state.theme);
  
  const toggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);
  
  const changeTheme = useCallback((newTheme: ThemeMode) => {
    dispatch(setTheme(newTheme));
  }, [dispatch]);
  
  const changeChatBackgroundColor = useCallback((colors: { light: string; dark: string }) => {
    dispatch(setChatBackgroundColor(colors));
  }, [dispatch]);
  
  // Get the current chat background color based on the current theme
  const currentChatBackgroundColor = mode === 'dark' 
    ? chatBackgroundColor.dark 
    : chatBackgroundColor.light;
  
  return {
    currentTheme: mode,
    isDarkMode: mode === 'dark',
    toggle,
    changeTheme,
    chatBackgroundColor,
    currentChatBackgroundColor,
    changeChatBackgroundColor
  };
};

export default useTheme;
