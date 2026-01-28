import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { hideGlobalLoading, showGlobalLoading } from './uiSlice'; 
import { BookingPreviewVM } from '@/ui/models/BookingPreviewVM';
import { mapBookingPreviewVM } from '@/ui/mappers/mapBookingPreviewVM';
import { getRoomDetailService } from '../services/getRoomDetailService';
import { BookingResultVM } from '@/ui/models/BookingResultVM';
import { mapBookingResultVM } from '@/ui/mappers/mapBookingResultVM';
import { createBookingService } from '../services/createBookingService';

interface BookingState {
  loading: boolean;
  error: string | null;
  preview: BookingPreviewVM | null;
  result: BookingResultVM | null;
  status: "idle" | "preview" | "confirming" | "confirmed" | "failed";
}

const initialState: BookingState = {
  loading: false,
  error: null,
  preview: null,
  result: null,
  status: "idle",
};

// Async thunk to get room details
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
      console.error("Get room detail error:", e);
      return rejectWithValue("Failed to get room details");
    } finally {
      dispatch(hideGlobalLoading());
    }
  }
);

// Async thunk to create a booking
export const confirmBooking = createAsyncThunk<
  BookingResultVM,
  {
    userId: string;
  },
  { 
    state: { booking: BookingState };
    rejectValue: string 
  }
>(
  "booking/confirmBooking",
  async ({ userId }, { dispatch, getState, rejectWithValue }) => {
    dispatch(showGlobalLoading());

    try {
      const state = getState(); 
      const preview = state.booking.preview;

      if (!preview) {
        return rejectWithValue("Booking preview not found");
      }

      // Build domain input
      const booking = await createBookingService({
        userId,
        roomId: preview.roomId,
        dateRange: {
          from: preview.stay.from,
          to: preview.stay.to,
        },
      });

      // Map to UI model using preview context
      const vm = mapBookingResultVM(booking, preview);

      return vm;
    } catch (error) {
      console.error("Confirm booking error:", error);
      return rejectWithValue("Failed to confirm booking");
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
      state.preview = null;
      state.result = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Preview 
      .addCase(getRoomDetail.pending, (state) => {
        state.loading = true;
        state.status = "preview";
      })
      .addCase(getRoomDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.preview = action.payload;
        state.error = null;
      })
      .addCase(getRoomDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
        state.status = "failed";
      })
      // Confirm Booking
      .addCase(confirmBooking.pending, (state) => {
        state.loading = true;
        state.status = "confirming";
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.preview = null;
        state.error = null;
        state.status = "confirmed";
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
        state.status = "failed";
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
export type { BookingState };