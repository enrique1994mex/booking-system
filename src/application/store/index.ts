import { configureStore } from '@reduxjs/toolkit';
import searchReducer, { SearchState } from '@/application/slices/searchSlice';
import uiReducer, { UIState } from '@/application/slices/uiSlice';

const rootReducer = {
  search: searchReducer,
  ui: uiReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = {
  search: SearchState;
  ui: UIState;
};
export type AppDispatch = typeof store.dispatch;