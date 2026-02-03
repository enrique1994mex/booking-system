import { configureStore } from '@reduxjs/toolkit';
import searchReducer, { SearchState } from '@/application/slices/searchSlice';
import uiReducer, { UIState } from '@/application/slices/uiSlice';
import accommodationReducer, { AccommodationState } from '@/application/slices/accommodationSlice';
import bookingReducer, { BookingState } from '@/application/slices/bookingSlice';
import authReducer, { AuthState } from '@/application/slices/authSlice';

const rootReducer = {
  search: searchReducer,
  ui: uiReducer,
  accommodation: accommodationReducer,
  booking: bookingReducer,
  auth: authReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = {
  search: SearchState;
  ui: UIState;
  accommodation: AccommodationState;
  booking: BookingState;
  auth: AuthState;
};
export type AppDispatch = typeof store.dispatch;