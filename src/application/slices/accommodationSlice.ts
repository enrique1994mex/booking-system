import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GetAccommodationAvailability } from '@/domain/use-cases/GetAccommodationAvailability';
import { hideGlobalLoading, showGlobalLoading } from './uiSlice';
import { DateRange } from '@/domain/value-objects/DateRange'; 
import { AccommodationCardVM } from '@/ui/models/AccommodationCardVM';
import { mapAccommodationVM } from '@/ui/mappers/mapAccommodationVM';
import { createRepositories } from '@/infrastructure/factories/createRepositories';

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
  { accommodationId: string; startDate: string; endDate: string }
>(
  'accommodation/getAvailability',
  async (params, { dispatch }) => {
    dispatch(showGlobalLoading());

    try {
      const dateRange = new DateRange(
        new Date(params.startDate),
        new Date(params.endDate)
      );

      const { roomRepository, accommodationRepository } = createRepositories();

      const useCase = new GetAccommodationAvailability(
        roomRepository,
        accommodationRepository,
      );

      const result = await useCase.execute({
        accommodationId: params.accommodationId,
        dateRange,
      });

      const vm = mapAccommodationVM(result);

      return vm;
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
      state.loading = false;
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
      .addCase(getAccommodationAvailability.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed loading accommodation';
      });
  },
});

export const { clearAccommodation } = accommodationSlice.actions;
export default accommodationSlice.reducer;
export type { AccommodationState };