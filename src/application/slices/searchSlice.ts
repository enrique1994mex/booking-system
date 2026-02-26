import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppError } from '@/domain/errors/AppError';
import { searchAccommodationsService } from '../services/SearchService';

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
  error: AppError | null;
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
  { rejectValue: AppError }
>(
  'search/searchAvailableAccommodations',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const result = await searchAccommodationsService(
        { city: params.location.city, country: params.location.country },
        params.startDate,
        params.endDate
      );

      return {
        results: result,
        criteria: {
          startDate: params.startDate,
          endDate: params.endDate,
        },
      };

    } catch (e) {
      console.error('Search error:', e);
      return rejectWithValue({ code: "SERVER_ERROR", message: "Search failed. Please try again." });
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
        state.error = action.payload ?? { code: "UNKNOWN", message: "Unexpected error." };
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
export type { SearchState };
