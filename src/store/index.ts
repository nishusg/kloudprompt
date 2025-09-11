import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice";
import allCategoryReducer from "./allCategorySlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    allCategories: allCategoryReducer, // 👈 added
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
