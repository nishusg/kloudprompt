// store/allCategorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPromptsByCategory } from "../services/PromptService";
import { Prompt } from "../models/Prompt";

export interface AllCategoryState {
  categoryPrompts: Record<string, Prompt[]>;
  visibleCategories: string[];
  currentIndex: number;
  loading: boolean;
}

const initialState: AllCategoryState = {
  categoryPrompts: {},
  visibleCategories: [],
  currentIndex: 0,
  loading: false,
};

// Async thunk to fetch prompts for a category
export const fetchCategoryPrompts = createAsyncThunk(
  "allCategories/fetchCategoryPrompts",
  async (category: string) => {
    const data = await getPromptsByCategory(category, 6);
    return { category, prompts: data.prompts || [] };
  }
);

const allCategorySlice = createSlice({
  name: "allCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryPrompts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCategoryPrompts.fulfilled,
        (state, action: PayloadAction<{ category: string; prompts: Prompt[] }>) => {
          const { category, prompts } = action.payload;

          // Save prompts for this category
          state.categoryPrompts[category] = prompts;

          // Add category to visible list if not already added
          if (!state.visibleCategories.includes(category)) {
            state.visibleCategories.push(category);
            state.currentIndex += 1;
          }

          state.loading = false;
        }
      )
      .addCase(fetchCategoryPrompts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default allCategorySlice.reducer;
