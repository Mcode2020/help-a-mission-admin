import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  searchQuery: string;
  activeModal: string | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  searchQuery: '',
  activeModal: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSearchQuery,
  setActiveModal,
} = uiSlice.actions;

export default uiSlice.reducer;

interface RootStateLike {
  ui: UiState;
}

// Selectors
export const selectUiState = (state: RootStateLike) => state.ui;
export const selectSidebarOpen = createSelector(selectUiState, (ui) => ui.sidebarOpen);
export const selectSearchQuery = createSelector(selectUiState, (ui) => ui.searchQuery);
export const selectActiveModal = createSelector(selectUiState, (ui) => ui.activeModal);
