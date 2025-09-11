import { configureStore } from "@reduxjs/toolkit";
import categories from "./slices/categorySlice";
import basket from "./slices/basketSlice";
import products from "./slices/productSlice";

export const store = configureStore({
  reducer: { 
    categories, 
    basket, 
    products },
});