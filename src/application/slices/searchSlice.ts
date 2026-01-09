import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SearchAvailableRooms } from '@/domain/use-cases/SearchAvailableRooms';
import { DateRange } from '@/domain/value-objects/DateRange';
import { MockRoomRepository } from '@/infrastructure/repositories/MockRoomRepository';
import { MockAccommodationRepository } from '@/infrastructure/repositories/MockAccommodationRepository';
import type { Room } from '@/domain/entities/Room';
import type { Accommodation } from '@/domain/entities/Accommodation';

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

export const searchAvailableRooms = createAsyncThunk(
  'search/searchAvailableRooms',
  async (params: SearchParams) => {
    const dateRange = new DateRange(
      new Date(params.startDate),
      new Date(params.endDate)
    );

    const roomRepository = new MockRoomRepository();
    const accommodationRepository = new MockAccommodationRepository();
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
      .addCase(searchAvailableRooms.rejected, (state) => {
        state.loading = false;
        state.error = 'Error searching available rooms';
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer; 