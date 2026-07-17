import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import aboutReducer from './slices/aboutSlice';
import roleReducer from './slices/roleSlice';
import portfolioReducer from './slices/portfolioSlice';
import categoryReducer from './slices/categorySlice';
import projectReducer from './slices/projectSlice';
import experienceReducer from './slices/experienceSlice';
import educationReducer from './slices/educationSlice';
import stackReducer from './slices/stackSlice';
import contactReducer from './slices/contactSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  about: aboutReducer,
  role: roleReducer,
  portfolio: portfolioReducer,
  category: categoryReducer,
  project: projectReducer,
  education: educationReducer,
  experience: experienceReducer,
  stack: stackReducer,
  contact: contactReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// For TypeScript projects these types would be exported from a .ts/.tsx file.
// In plain JS, export helper getters if needed instead of TypeScript types.
export const getRootState = () => store.getState();
export const getAppDispatch = () => store.dispatch;