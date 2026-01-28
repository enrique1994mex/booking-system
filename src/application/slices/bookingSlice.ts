import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from "../store";
import { BookingPreviewVM } from '@/ui/models/BookingPreviewVM';
import { mapBookingPreviewVM } from '@/ui/mappers/mapBookingPreviewVM';
import { getRoomDetailService } from '../services/getRoomDetailService';
import { BookingResultVM } from '@/ui/models/BookingResultVM';
import { mapBookingResultVM } from '@/ui/mappers/mapBookingResultVM';
import { createBookingService } from '../services/createBookingService';

type BookingStatus =
  | "idle"
  | "loadingPreview"
  | "readyToConfirm"
  | "confirming"
  | "confirmed"
  | "error";

interface BookingState {
  error: string | null;
  preview: BookingPreviewVM | null;
  result: BookingResultVM | null;
  status: BookingStatus;
}

const initialState: BookingState = {
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
  async (params, { rejectWithValue }) => {
    try {
      // Service call to get room details
      const result = await getRoomDetailService(params.roomId);

      // TEMPORAL (frontend snapshot calculation)
      const vm = mapBookingPreviewVM(result, params.dateRange);

      return vm;
    } catch (error) {
      console.error("Preview booking error:", error);
      return rejectWithValue("Failed to load booking preview");
    } 
  } 
);

// Async thunk to create a booking
export const confirmBooking = createAsyncThunk<
  BookingResultVM,
  {
    userId: string;
    roomId: string;
    from: string;
    to: string;
  },
  { 
    state: RootState;
    rejectValue: string 
  }
>(
  "booking/confirmBooking",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { booking } = getState();
      const preview = booking.preview;

      if (!preview) {
        return rejectWithValue("Booking preview not found");
      }

      const bookingResult = await createBookingService({
        userId: payload.userId,
        roomId: payload.roomId,
        dateRange: {
          from: payload.from,
          to: payload.to,
        },
      });
      // TEMPORAL: usamos preview snapshot para mostrar resumen final
      const vm = mapBookingResultVM(bookingResult, preview);

      return vm;
    } catch (error) {
      console.error("Confirm booking error:", error);
      return rejectWithValue("Failed to confirm booking");
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
        state.status = "loadingPreview";
      })
      .addCase(getRoomDetail.fulfilled, (state, action) => {
        state.preview = action.payload;
        state.error = null;
        state.status = "readyToConfirm";
      })
      .addCase(getRoomDetail.rejected, (state, action) => {
        state.error = action.payload ?? "Unknown error";
        state.status = "error";
      })
      // Confirm Booking
      .addCase(confirmBooking.pending, (state) => {
        state.status = "confirming";
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.result = action.payload;
        state.preview = null;
        state.error = null;
        state.status = "confirmed";
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.error = action.payload ?? "Unknown error";
        state.status = "error";
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
export type { BookingState };