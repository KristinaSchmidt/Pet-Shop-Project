import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

const normalize = (x) =>
  Array.isArray(x) ? x :
  Array.isArray(x?.data) ? x.data :
  Array.isArray(x?.items) ? x.items :
  Array.isArray(x?.rows) ? x.rows : [];

// Alle Produkte laden
export const fetchProductsAll = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/products/all");
      return normalize(data);
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || e.message);
    }
  }
);

const slice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProductsAll.pending,   (s)    => { s.status = "loading"; s.error = null; })
     .addCase(fetchProductsAll.fulfilled, (s,a)  => { s.status = "succeeded"; s.items = a.payload || []; })
     .addCase(fetchProductsAll.rejected,  (s,a)  => { s.status = "failed"; s.error = a.payload || "Error"; });
  },
});

export default slice.reducer;


export const selectProducts       = (s) => s.products?.items  ?? [];
export const selectProductsStatus = (s) => s.products?.status ?? "idle";
export const selectProductsError  = (s) => s.products?.error  ?? null;