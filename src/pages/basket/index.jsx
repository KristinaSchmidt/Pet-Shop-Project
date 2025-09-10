import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import {
  selectBasketItems, selectBasketTotal, selectBasketCount,
  inc, dec, setQty, removeItem
} from "../../redux/slices/basketSlice";
import { apiImg, api } from "../../redux/slices/api";
import { useState } from "react";

export default function BasketPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectBasketItems);
  const total = useSelector(selectBasketTotal);
  const count = useSelector(selectBasketCount);

  // Form-State
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const canOrder = items.length > 0 && form.name && form.phone && form.email;

  // POST-Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      items: items.map(i => ({
        id: i.id,
        title: i.title,
        qty: i.qty,
        price: Number(i.priceNow),
        subtotal: Number(i.priceNow * i.qty)
      })),
      total: Number(total.toFixed(2)),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await api.post("/order", payload, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("ORDER_OK", res.data);
    } catch (err) {
      console.error("ORDER_FAIL", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <h1 className={styles.title}>Shopping cart</h1>
        <Link to="/" className={styles.backBtn}>Back to the store</Link>
      </div>

      <div className={styles.grid}>
        <div className={styles.list}>
          {items.length === 0 && <p className={styles.muted}>Your cart is empty.</p>}

          {items.map(i => (
            <article key={i.id} className={styles.card}>
              <img className={styles.thumb} src={apiImg(i.image)} alt={i.title} />
              <div className={styles.info}>
                <h3 className={styles.itemTitle}>{i.title}</h3>
                <div className={styles.controls}>
                  <div className={styles.qty}>
                    <button onClick={()=>dispatch(dec(i.id))}>−</button>
                    <input
                      type="number" min="1" max="99" value={i.qty}
                      onChange={(e)=>dispatch(setQty({ id: i.id, qty: e.target.value }))}
                    />
                    <button onClick={()=>dispatch(inc(i.id))}>+</button>
                  </div>
                  <div className={styles.prices}>
                    <span className={styles.now}>${(i.priceNow * i.qty).toFixed(0)}</span>
                    {i.priceOld > i.priceNow && (
                      <span className={styles.old}>${(i.priceOld * i.qty).toFixed(0)}</span>
                    )}
                  </div>
                </div>
              </div>
              <button className={styles.remove} onClick={()=>dispatch(removeItem(i.id))}>×</button>
            </article>
          ))}
        </div>

        <aside className={styles.summary}>
          <h3 className={styles.sumTitle}>Order details</h3>
          <dl className={styles.meta}>
            <div><dt>Items</dt><dd>{count}</dd></div>
            <div><dt>Total</dt><dd className={styles.total}>${total.toFixed(2)}</dd></div>
          </dl>


          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              placeholder="Name"
              value={form.name}
              onChange={(e)=>setForm(f=>({ ...f, name: e.target.value }))}
              required
            />
            <input
              className={styles.input}
              placeholder="Phone number"
              value={form.phone}
              onChange={(e)=>setForm(f=>({ ...f, phone: e.target.value }))}
              required
            />
            <input
              className={styles.input}
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e)=>setForm(f=>({ ...f, email: e.target.value }))}
              required
            />
            <button className={styles.orderBtn} type="submit" disabled={!canOrder}>
              Order
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}