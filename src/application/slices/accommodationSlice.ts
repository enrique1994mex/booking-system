import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { hideGlobalLoading, showGlobalLoading } from './uiSlice'; 
import { AccommodationCardVM } from '@/ui/models/AccommodationCardVM';
import { mapAccommodationVM } from '@/ui/mappers/mapAccommodationVM';
import { getAccommodationAvailabilityService } from '../services/AccommodationService';

interface AccommodationState {
  loading: boolean;
  error: string | null;
  data: AccommodationCardVM | null;
}

const initialState: AccommodationState = {
  loading: false,
  error: null,
  data: null,
};

export const getAccommodationAvailability = createAsyncThunk<
  AccommodationCardVM,
  { accommodationId: string; startDate: string; endDate: string },
  { rejectValue: string }
>(
  'accommodation/getAvailability',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(showGlobalLoading());

    try {
      // Service call to get accommodation availability
      const result = await getAccommodationAvailabilityService(
        params.accommodationId,
        params.startDate,
        params.endDate
      );

      const vm = mapAccommodationVM(result);

      return vm;
    } catch (e) {
      console.error('Accommodation availability error:', e);
      return rejectWithValue("Accommodation not available");
    } finally {
      dispatch(hideGlobalLoading());
    }
  }
);

const accommodationSlice = createSlice({
  name: 'accommodation',
  initialState,
  reducers: {
    clearAccommodation(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccommodationAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccommodationAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAccommodationAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unexpected error";
      });
  },
});

export const { clearAccommodation } = accommodationSlice.actions;
export default accommodationSlice.reducer;
export type { AccommodationState };