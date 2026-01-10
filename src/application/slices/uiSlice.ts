import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  globalLoading: boolean;
}

const initialState: UIState = {
  globalLoading: false,
};  

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showGlobalLoading(state) {
      state.globalLoading = true;
    },
    hideGlobalLoading(state) {
      state.globalLoading = false;
    },
  },
});

export const { showGlobalLoading, hideGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;