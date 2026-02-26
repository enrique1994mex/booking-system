import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from "../store";
import { AppError } from '@/domain/errors/AppError';
import { BookingPreviewVM } from '@/ui/models/BookingPreviewVM';
import { mapBookingPreviewVM } from '@/ui/mappers/mapBookingPreviewVM';
import { getRoomDetailService } from '../services/getRoomDetailService';
import { createBookingService } from '../services/bookingCommandService';

type BookingStatus =
  | "idle"
  | "loadingPreview"
  | "readyToConfirm"
  | "confirming"
  | "error";

interface BookingState {
  error: AppError | null;
  preview: BookingPreviewVM | null;
  bookingId: string | null;
  status: BookingStatus;
}

const initialState: BookingState = {
  error: null,
  preview: null,
  bookingId: null,
  status: "idle",
};

export const getRoomDetail = createAsyncThunk<
  BookingPreviewVM,
  { roomId: string, dateRange: { from: string; to: string } },
  { rejectValue: AppError }
>(
  'booking/getRoomDetail',
  async (params, { rejectWithValue }) => {
    try {
      const result = await getRoomDetailService(params.roomId);
      const vm = mapBookingPreviewVM(result, params.dateRange);
      return vm;
    } catch (error) {
      console.error("Preview booking error:", error);
      return rejectWithValue({ code: "SERVER_ERROR", message: "Failed to load booking preview." });
    }
  }
);

export const confirmBooking = createAsyncThunk<
  string,
  {
    userId: string;
    roomId: string;
    from: string;
    to: string;
  },
  {
    state: RootState;
    rejectValue: AppError;
  }
>(
  "booking/confirmBooking",
  async (payload, { rejectWithValue }) => {
    try {
      const booking = await createBookingService({
        userId: payload.userId,
        roomId: payload.roomId,
        dateRange: {
          from: payload.from,
          to: payload.to,
        },
      });

      return booking.id;
    } catch (error) {
      console.error("Confirm booking error:", error);
      return rejectWithValue({ code: "SERVER_ERROR", message: "Failed to confirm booking. Please try again." });
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBooking(state) {
      state.preview = null;
      state.bookingId = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoomDetail.pending, (state) => {
        state.status = "loadingPreview";
      })
      .addCase(getRoomDetail.fulfilled, (state, action) => {
        state.preview = action.payload;
        state.error = null;
        state.status = "readyToConfirm";
      })
      .addCase(getRoomDetail.rejected, (state, action) => {
        state.error = action.payload ?? { code: "UNKNOWN", message: "Unexpected error." };
        state.status = "error";
      })
      .addCase(confirmBooking.pending, (state) => {
        state.status = "confirming";
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.bookingId = action.payload;
        state.preview = null;
        state.error = null;
        state.status = "idle";
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.error = action.payload ?? { code: "UNKNOWN", message: "Unexpected error." };
        state.status = "error";
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
export type { BookingState };
