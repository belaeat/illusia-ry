import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  searchTerm: string;
  category: string;
  availability: string;
  location: string;
}

const initialState: FiltersState = {
  searchTerm: "",
  category: "",
  availability: "",
  location: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setAvailability(state, action: PayloadAction<string>) {
      state.availability = action.payload;
    },
    setLocation(state, action: PayloadAction<string>) {
      state.location = action.payload;
    },
    clearFilters() {
      return initialState;
    },
  },
});

export const {
  setSearchTerm,
  setCategory,
  setAvailability,
  setLocation,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
