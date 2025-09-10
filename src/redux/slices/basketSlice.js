import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "basket_v1";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function save(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

function normProduct(p) {
  const priceOld = Number(p.price) || 0;
  const priceNow = Number(p.discont_price ?? p.discount_price ?? priceOld) || 0;
  return { priceOld, priceNow };
}

const initialState = { items: load() };

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem: {
      prepare(product, qty = 1) {
        return { payload: { product, qty: Math.max(1, Math.min(99, Number(qty) || 1)) } };
      },
      reducer(state, action) {
        const { product, qty } = action.payload;
        const { priceOld, priceNow } = normProduct(product);
        const id = product.id;
        const i = state.items.findIndex(x => String(x.id) === String(id));
        if (i >= 0) {
          state.items[i].qty = Math.min(99, state.items[i].qty + qty);
        } else {
          state.items.push({
            id,
            title: product.title,
            image: product.image,
            priceOld,
            priceNow,
            qty,
          });
        }
        save(state.items);
      }
    },
    removeItem(state, action) {
      const id = action.payload;
      state.items = state.items.filter(x => String(x.id) !== String(id));
      save(state.items);
    },
    setQty(state, action) {
      const { id, qty } = action.payload;
      const val = Math.max(1, Math.min(99, Number(qty) || 1));
      const it = state.items.find(x => String(x.id) === String(id));
      if (it) it.qty = val;
      save(state.items);
    },
    inc(state, action) {
      const id = action.payload;
      const it = state.items.find(x => String(x.id) === String(id));
      if (it) it.qty = Math.min(99, it.qty + 1);
      save(state.items);
    },
    dec(state, action) {
      const id = action.payload;
      const it = state.items.find(x => String(x.id) === String(id));
      if (it) it.qty = Math.max(1, it.qty - 1);
      save(state.items);
    },
    clear(state) {
      state.items = [];
      save(state.items);
    },
  },
});


export const { addItem, removeItem, setQty, inc, dec, clear } = basketSlice.actions;

export const selectBasketItems = (s) => s.basket.items;
export const selectBasketCount = (s) => s.basket.items.reduce((n,i)=>n+i.qty,0);
export const selectBasketTotal = (s) => s.basket.items.reduce((sum,i)=>sum+i.priceNow*i.qty,0);

export default basketSlice.reducer;