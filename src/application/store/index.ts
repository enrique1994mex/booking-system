import { configureStore } from '@reduxjs/toolkit';
import searchReducer, { SearchState } from '@/application/slices/searchSlice';
import uiReducer, { UIState } from '@/application/slices/uiSlice';
import accommodationReducer, { AccommodationState } from '@/application/slices/accommodationSlice';
import bookingReducer, { BookingState } from '@/application/slices/bookingSlice'; 

const rootReducer = {
  search: searchReducer,
  ui: uiReducer,
  accommodation: accommodationReducer,
  booking: bookingReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = {
  search: SearchState;
  ui: UIState;
  accommodation: AccommodationState;
  booking: BookingState;
};
export type AppDispatch = typeof store.dispatch;