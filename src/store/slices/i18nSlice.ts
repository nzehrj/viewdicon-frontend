import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LanguageCode = 'en' | 'yo' | 'ig' | 'ha' | 'sw' | 'zu' | 'xh';

interface I18nState {
  language: LanguageCode;
  isLoading: boolean;
  translations: Record<string, string>;
}

const initialState: I18nState = {
  language: 'en',
  isLoading: false,
  translations: {},
};

const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.language = action.payload;
    },
    setTranslations: (state, action: PayloadAction<Record<string, string>>) => {
      state.translations = action.payload;
    },
    setI18nLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetI18n: () => initialState,
  },
});

export const { setLanguage, setTranslations, setI18nLoading, resetI18n } = i18nSlice.actions;
export default i18nSlice.reducer;