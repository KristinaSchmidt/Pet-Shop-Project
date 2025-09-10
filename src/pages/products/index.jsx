import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { api, apiImg } from "../../redux/slices/api";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/basketSlice";

export default function AllProductsPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // Produkte laden
  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    setError("");
    api.get("/products/all")
      .then((payload) => {
        if (ignore) return;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        setItems(list);
        setStatus("succeeded");
      })
      .catch((e) => {
        if (ignore) return;
        setStatus("failed");
        setError(e?.response?.data?.message || e.message);
      });
    return () => { ignore = true; };
  }, []);

  // Filter
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const list = useMemo(() => {
    const norm = (p) => {
      const old = Number(p.price) || 0;
      const now = Number(p.discont_price ?? p.discount_price ?? old) || 0;
      const pct = old > 0 && now > 0 && now < old ? Math.round(100 * (1 - now / old)) : 0;
      return { ...p, __old: old, __now: now, __pct: pct };
    };
    let arr = items.map(norm);

    const min = from === "" ? undefined : Number(from);
    const max = to === "" ? undefined : Number(to);
    if (onlyDiscount) arr = arr.filter((p) => p.__pct > 0);
    if (min !== undefined) arr = arr.filter((p) => p.__now >= min);
    if (max !== undefined) arr = arr.filter((p) => p.__now <= max);

    if (sortBy === "price_asc") arr.sort((a, b) => a.__now - b.__now);
    if (sortBy === "price_desc") arr.sort((a, b) => b.__now - a.__now);
    if (sortBy === "sale") arr.sort((a, b) => b.__pct - a.__pct);

    return arr;
  }, [items, from, to, onlyDiscount, sortBy]);

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs}>
        <span className={styles.crumb}>
          <Link className={styles.chip} to="/">Main page</Link>
        </span>
        <span className={`${styles.crumb} ${styles.current}`}>
          <span className={styles.chip}>All products</span>
        </span>
      </nav>

      <h1 className={styles.pageTitle}>All products</h1>

      {/* Filter */}
      <div className={styles.controls}>
        <div className={styles.priceFilter}>
          <span>Price</span>
          <input type="number" placeholder="from" value={from} onChange={(e)=>setFrom(e.target.value)} />
          <input type="number" placeholder="to" value={to} onChange={(e)=>setTo(e.target.value)} />
        </div>

        <label className={styles.check}>
          <input type="checkbox" checked={onlyDiscount} onChange={(e)=>setOnlyDiscount(e.target.checked)} />
          Discounted items
        </label>

        <div className={styles.sort}>
          <span>Sorted</span>
          <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
            <option value="default">by default</option>
            <option value="price_asc">price: low → high</option>
            <option value="price_desc">price: high → low</option>
            <option value="sale">biggest discount</option>
          </select>
        </div>
      </div>

      {/* Status */}
      {status === "loading" && <p className={styles.muted}>Loading…</p>}
      {status === "failed" && <p className={styles.error}>Error: {error}</p>}
      {status === "succeeded" && list.length === 0 && <p className={styles.muted}>No products found.</p>}

      {/* Grid */}
      <div className={styles.grid}>
        {list.map((p) => (
          <Link key={p.id} to={`/products/${p.id}`} className={styles.card}>
            <div className={styles.imageWrap}>
              {p.__pct > 0 && <span className={styles.badge}>-{p.__pct}%</span>}
              <img src={apiImg(p.image)} alt={p.title} />
              <button
                type="button"
                className={styles.addBtn}
                onClick={(e)=>{ e.preventDefault(); dispatch(addItem(p, 1)); }}
              >
                Add to cart
              </button>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.title} title={p.title}>{p.title}</h3>
              <div className={styles.prices}>
                <span className={styles.priceNow}>${p.__now.toFixed(2)}</span>
                {p.__pct > 0 && <span className={styles.old}>${p.__old.toFixed(2)}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}