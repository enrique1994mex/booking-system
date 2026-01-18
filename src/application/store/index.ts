import { configureStore } from '@reduxjs/toolkit';
import searchReducer, { SearchState } from '@/application/slices/searchSlice';
import uiReducer, { UIState } from '@/application/slices/uiSlice';
import accommodationReducer, { AccommodationState } from '@/application/slices/accommodationSlice';

const rootReducer = {
  search: searchReducer,
  ui: uiReducer,
  accommodation: accommodationReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = {
  search: SearchState;
  ui: UIState;
  accommodation: AccommodationState;
};
export type AppDispatch = typeof store.dispatch;