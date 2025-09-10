import { configureStore } from "@reduxjs/toolkit";
import categories from "./slices/categorySlice";
import basket from "./slices/basketSlice";

export const store = configureStore({
  reducer: { categories, basket },
});