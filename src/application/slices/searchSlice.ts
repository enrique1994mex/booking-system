import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SearchAccommodations } from '@/domain/use-cases/SearchAccommodations';
import { DateRange } from '@/domain/value-objects/DateRange';
import { createRepositories } from '@/infrastructure/factories/createRepositories';
import { hideGlobalLoading, showGlobalLoading } from './uiSlice';

interface SearchParams {
  location: {
    city: string;
    country: string;
  };
  startDate: string;
  endDate: string;
}

interface SearchCriteria {
  startDate: string;
  endDate: string;
}

interface SearchResult {
  id: string;
  name: string;
  location: string;
  priceFrom: number;
}

interface SearchState {
  loading: boolean;
  error: string | null;
  results: SearchResult[];
  criteria: SearchCriteria | null;
}

const initialState: SearchState = {
  loading: false,
  error: null,
  results: [],
  criteria: null,
};

export const searchAvailableAccomodations = createAsyncThunk<
  { results: SearchResult[]; criteria: SearchCriteria },
  SearchParams,
  { rejectValue: string }
>(
  'search/searchAvailableAccommodations',
  async (params: SearchParams, { dispatch, rejectWithValue }) => {
    dispatch(showGlobalLoading());

    try {
      // Crear rangos de fechas
      const dateRange = new DateRange(
        new Date(params.startDate),
        new Date(params.endDate)
      );

      // Crear repositorios
      const { roomRepository, accommodationRepository } = createRepositories();

      const useCase = new SearchAccommodations(accommodationRepository, roomRepository);

      const result = await useCase.execute({
        location: {
          city: params.location.city,
          country: params.location.country,
        },
        dateRange,
      });

      return {
        results: result,
        criteria: {
          startDate: params.startDate,
          endDate: params.endDate,
        },
      };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return rejectWithValue('Search failed. Please try again.');
    } finally {
      dispatch(hideGlobalLoading());
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAvailableAccomodations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAvailableAccomodations.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.criteria = action.payload.criteria;
      })
      .addCase(searchAvailableAccomodations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unexpected error';
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer; 
export type { SearchState };