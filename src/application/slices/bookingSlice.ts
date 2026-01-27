import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { hideGlobalLoading, showGlobalLoading } from './uiSlice'; 
import { BookingPreviewVM } from '@/ui/models/BookingPreviewVM';
import { mapBookingPreviewVM } from '@/ui/mappers/mapBookingPreviewVM';
import { getRoomDetailService } from '../services/getRoomDetailService';

interface BookingState {
  loading: boolean;
  error: string | null;
  data: BookingPreviewVM | null;
}

const initialState: BookingState = {
  loading: false,
  error: null,
  data: null,
};

export const getRoomDetail = createAsyncThunk<
  BookingPreviewVM,
  { roomId: string, dateRange: { from: string; to: string } },
  { rejectValue: string }
>(
  'booking/getRoomDetail',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(showGlobalLoading());

    try {
      // Service call to get room details
      const result = await getRoomDetailService(params.roomId);

      const vm = mapBookingPreviewVM(result, params.dateRange);

      return vm;
    } catch (e) {
      return rejectWithValue("Failed to get room details");
    } finally {
      dispatch(hideGlobalLoading());
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBooking(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoomDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoomDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getRoomDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
export type { BookingState };