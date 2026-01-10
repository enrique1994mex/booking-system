import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SearchAvailableRooms } from '@/domain/use-cases/SearchAvailableRooms';
import { DateRange } from '@/domain/value-objects/DateRange';
import { createRepositories } from '@/infrastructure/factories/createRepositories';
import type { Room } from '@/domain/entities/Room';
import type { Accommodation } from '@/domain/entities/Accommodation';
import { hideGlobalLoading, showGlobalLoading } from './uiSlice';

interface SearchParams {
  location: string;
  startDate: string;
  endDate: string;
}

interface SearchResult {
  accommodation: Accommodation;
  rooms: Room[];
}

interface SearchState {
  loading: boolean;
  error: string | null;
  results: SearchResult[];
}

const initialState: SearchState = {
  loading: false,
  error: null,
  results: [],
};

export const searchAvailableRooms = createAsyncThunk<
  SearchResult[],
  SearchParams,
  { rejectValue: string }
>(
  'search/searchAvailableRooms',
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

      const useCase = new SearchAvailableRooms(accommodationRepository,roomRepository);

      const result = await useCase.execute({
        location: params.location,
        dateRange,
      });

      // ADAPTACIÓN Application → UI
      const groupedResults = result.reduce((acc, item) => {
      const existing = acc.find(
        (r) => r.accommodation.id === item.accommodation.id
      );

      if (existing) {
        existing.rooms.push(item.room);
      } else {
          acc.push({
          accommodation: item.accommodation, 
          rooms: [item.room],
        });
      }

      return acc;
      }, [] as SearchResult[]);

      return groupedResults;
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
      .addCase(searchAvailableRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAvailableRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchAvailableRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unexpected error';
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer; 