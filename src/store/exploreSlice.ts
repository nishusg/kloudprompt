// store/exploreSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPrompts } from "../services/PromptService";
import { Prompt } from "../models/Prompt";

export interface ExploreState {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;

  // Filters
  search: string;
  modelType: string | null;
  generationType: string | null;
  category: string | null;

  // Pagination
  page: number;
  limit: number;
  total: number;
}

const initialState: ExploreState = {
  prompts: [],
  loading: false,
  error: null,

  search: "",
  modelType: null,
  generationType: null,
  category: null,

  page: 1,
  limit: 9,
  total: 0,
};

// Async thunk to fetch prompts
export const fetchExplorePrompts = createAsyncThunk(
  "explore/fetchExplorePrompts",
  async (_, { getState }) => {
    const state = getState() as { explore: ExploreState };
    const { page, limit, search, modelType, generationType, category } = state.explore;

    const { prompts, total } = await getPrompts({
      page,
      limit,
      search: search || undefined,
      modelType: modelType || undefined,
      generationType: generationType || undefined,
      category: category || undefined,
    });

    return { prompts, total };
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    clearSearch(state) {
      state.search = "";
      state.page = 1;
    },
    setModelType(state, action: PayloadAction<string | null>) {
      state.modelType = action.payload;
      state.page = 1;
    },
    setGenerationType(state, action: PayloadAction<string | null>) {
      state.generationType = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.category = action.payload;
      state.page = 1;
    },
    clearFilters(state) {
      state.modelType = null;
      state.generationType = null;
      state.category = null;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExplorePrompts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExplorePrompts.fulfilled,
        (state, action: PayloadAction<{ prompts: Prompt[]; total: number }>) => {
          state.prompts = action.payload.prompts;
          state.total = action.payload.total;
          state.loading = false;
        }
      )
      .addCase(fetchExplorePrompts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load prompts";
      });
  },
});

export const {
  setSearch,
  clearSearch,
  setModelType,
  setGenerationType,
  setCategory,
  clearFilters,
  setPage,
} = exploreSlice.actions;

export default exploreSlice.reducer;
