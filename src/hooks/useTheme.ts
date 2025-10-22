import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleTheme as toggleThemeAction, setTheme } from '@store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  const setThemeMode = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    toggleTheme,
    setThemeMode,
  };
};