import { configureStore } from '@reduxjs/toolkit';

// Existing slices
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import dashboardReducer from './slices/dashboardSlice';
import authFlowReducer from './slices/authFlowSlice';
import i18nReducer from './slices/i18nSlice';
import syncReducer from './slices/syncSlice';

// NEW slices
import feedReducer from './slices/feedSlice';
import potReducer from './slices/potSlice';
import cowrieReducer from './slices/cowrieSlice';
import eventReducer from './slices/eventSlice';
import tvReducer from './slices/tvSlice';

export const store = configureStore({
  reducer: {
    // Existing slices
    auth: authReducer,
    user: userReducer,
    theme: themeReducer,
    dashboard: dashboardReducer,
    authFlow: authFlowReducer,
    i18n: i18nReducer,
    sync: syncReducer,
    
    // NEW slices
    feed: feedReducer,
    pot: potReducer,
    cowrie: cowrieReducer,
    event: eventReducer,
    tv: tvReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/setTokens',
          'pot/recordInteraction',
          'feed/setScrollPosition',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'auth.accessToken',
          'auth.refreshToken',
          'pot.lastInteraction.timestamp',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;