import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

const normalize = (x) =>
  Array.isArray(x) ? x :
  Array.isArray(x?.data) ? x.data :
  Array.isArray(x?.items) ? x.items :
  Array.isArray(x?.rows) ? x.rows : [];

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    const tryGet = async (path) => normalize(await api.get(path));
    try {
      try {
        return await tryGet("/categories/all");
      } catch {
        return await tryGet("/categories");
      }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to load categories"
      );
    }
  }
);

const slice = createSlice({
  name: "categories",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCategories.pending,   (s) => { s.status = "loading"; s.error = null; })
     .addCase(fetchCategories.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload || []; })
     .addCase(fetchCategories.rejected,  (s, a) => { s.status = "failed"; s.error = a.payload || "Error"; });
  },
});

export default slice.reducer;