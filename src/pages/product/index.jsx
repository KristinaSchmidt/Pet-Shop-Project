import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./styles.module.css";
import { api, apiImg } from "../../redux/slices/api";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/basketSlice";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Produkt laden
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setStatus("loading");
        setError("");

        let payload = await api.get(`/products/${id}`);
        let p = payload?.data ?? payload;           // {data} oder direkt Objekt
        if (!p || !p.id) {
          const all = await api.get("/products/all");
          const arr = Array.isArray(all) ? all : Array.isArray(all?.data) ? all.data : [];
          p = arr.find((x) => String(x.id) === String(id));
        }
        if (!p) throw new Error("Product not found");

        if (p.categoryId) {
          try {
            const cats = await api.get("/categories/all");
            const cat = (cats ?? []).find((c) => String(c.id) === String(p.categoryId));
            if (!ignore) setCategory(cat || null);
          } catch { /* ignore */ }
        }

        if (!ignore) {
          setProduct(p);
          setStatus("succeeded");
          setImgIdx(0);
        }
      } catch (e) {
        if (!ignore) {
          setError(e?.response?.data?.message || e.message);
          setStatus("failed");
        }
      }
    })();
    return () => { ignore = true; };
  }, [id]);


  const norm = useMemo(() => {
    if (!product) return null;
    const old = Number(product.price) || 0;
    const now = Number(product.discont_price ?? product.discount_price ?? old) || 0;
    const pct = old > 0 && now > 0 && now < old ? Math.round(100 * (1 - now / old)) : 0;

    const imgs = [
      product.image,
      ...(Array.isArray(product.images) ? product.images : []),
    ].filter(Boolean);

    return { old, now, pct, imgs };
  }, [product]);

  if (status === "loading") return <div className={styles.container}><p className={styles.muted}>Loading…</p></div>;
  if (status === "failed")   return <div className={styles.container}><p className={styles.error}>Error: {error}</p></div>;
  if (!product || !norm)     return <div className={styles.container}><p className={styles.muted}>No data.</p></div>;

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumbs}>
        <span className={styles.crumb}><Link className={styles.chip} to="/">Main page</Link></span>
        <span className={styles.crumb}><Link className={styles.chip} to="/categories">Categories</Link></span>
        {category && (
          <span className={styles.crumb}>
            <Link className={styles.chip} to={`/categories/${category.id}`}>{category.title}</Link>
          </span>
        )}
        <span className={`${styles.crumb} ${styles.current}`}>
          <span className={styles.chip}>{product.title}</span>
        </span>
      </nav>

      {/* Hauptbereich */}
      <div className={styles.grid}>
        {/* Bilder links */}
        <aside className={styles.gallery}>
          <div className={styles.thumbs}>
            {norm.imgs.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={()=> dispatch(addItem(product, qty))}
                className={`${styles.thumbBtn} ${i===imgIdx ? styles.active : ""}`}
              >
                <img src={apiImg(src)} alt={`thumb-${i}`} />
              </button>
            ))}
          </div>
          <div className={styles.mainImg}>
            <img src={apiImg(norm.imgs[imgIdx] ?? norm.imgs[0])} alt={product.title} />
            {norm.pct > 0 && <span className={styles.badge}>-{norm.pct}%</span>}
          </div>
        </aside>

        {/* Info rechts */}
        <section className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.priceRow}>
            <span className={styles.priceNow}>${norm.now.toFixed(2)}</span>
            {norm.pct > 0 && <span className={styles.old}>${norm.old.toFixed(2)}</span>}
            {norm.pct > 0 && <span className={styles.pct}>-{norm.pct}%</span>}
          </div>

          {/* Quantity + Add to cart */}
          <div className={styles.buyRow}>
            <div className={styles.qty}>
              <button type="button" onClick={()=>setQty(q => Math.max(1, q-1))}>−</button>
              <input
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e)=> setQty(Math.min(99, Math.max(1, Number(e.target.value)||1)))}
              />
              <button type="button" onClick={()=>setQty(q => Math.min(99, q+1))}>+</button>
            </div>
            <button
              type="button"
              className={styles.addBtn}
              onClick={()=>{/* addToCart, product, quantity */}}
            >
              Add to cart
            </button>
          </div>


          <div className={styles.descBox}>
            <h3 className={styles.subhead}>Description</h3>
            <p className={`${styles.desc} ${expanded ? styles.open : ""}`}>
              {product.description || "No description provided."}
            </p>
            {(product.description || "").length > 160 && (
              <button type="button" className={styles.readMore} onClick={()=>setExpanded(v=>!v)}>
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}