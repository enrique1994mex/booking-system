import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  bootstrapping: boolean;
}

const initialState: UIState = {
  bootstrapping: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showBootstrapping(state) {
      state.bootstrapping = true;
    },
    hideBootstrapping(state) {
      state.bootstrapping = false;
    },
  },
});

export const { showBootstrapping, hideBootstrapping } = uiSlice.actions;
export default uiSlice.reducer;
export type { UIState };
