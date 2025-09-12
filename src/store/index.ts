import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice";
import allCategoryReducer from "./allCategorySlice";
import exploreReducer from "./exploreSlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    allCategories: allCategoryReducer,
    explore: exploreReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
