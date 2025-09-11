import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPromptsByCategory } from "../services/PromptService";
import { Prompt } from "../models";

export const fetchCategoryPrompts = createAsyncThunk(
  "category/fetchPrompts",
  async ({ category, page }: { category: string; page: number }) => {
    const data = await getPromptsByCategory(category, 9, page);
    return { category, page, ...data };
  }
);

interface CategoryState {
  [category: string]: {
    prompts: Prompt[];
    totalPages: number;
    currentPage: number;
    loading: boolean;
  };
}

const initialState: CategoryState = {};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryPrompts.pending, (state, action) => {
        const { category, page } = action.meta.arg;
        if (!state[category]) {
          state[category] = {
            prompts: [],
            totalPages: 1,
            currentPage: page,
            loading: true,
          };
        } else {
          state[category].loading = true;
          state[category].currentPage = page;
        }
      })
      .addCase(fetchCategoryPrompts.fulfilled, (state, action) => {
        const { category, page, prompts, totalPages } = action.payload;
        state[category] = {
          prompts,
          totalPages: Number(totalPages),
          currentPage: page,
          loading: false,
        };
      })
      .addCase(fetchCategoryPrompts.rejected, (state, action) => {
        const { category } = action.meta.arg;
        if (state[category]) {
          state[category].loading = false;
        }
      });
  },
});

export default categorySlice.reducer;
