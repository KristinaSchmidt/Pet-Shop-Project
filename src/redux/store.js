import { configureStore } from "@reduxjs/toolkit";
import categories from "./slices/categorySlice";

export default configureStore({
  reducer: {
    categories,
  },
})