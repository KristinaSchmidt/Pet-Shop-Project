import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiImg } from "../../redux/slices/api";
import styles from "./styles.module.css";

export default function Sales() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "idle") return;
    setStatus("loading");
    api.get("/products/all")
      .then((data) => {
        const discounted = (data ?? []).filter(
          (p) => Number(p.discont_price) > 0 && Number(p.discont_price) < Number(p.price)
        );
        setItems(discounted.slice(0, 8)); // ALLE 8
        setStatus("succeeded");
      })
      .catch((e) => { setError(e?.message || "Load failed"); setStatus("failed"); });
  }, [status]);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>All sales</h2>
      </header>

      {status === "loading" && <p>Loading…</p>}
      {status === "failed" && <p className={styles.error}>Error: {error}</p>}

      <div className={styles.grid}>
        {items.map((p) => {
          const price = Number(p.discont_price);
          const old = Number(p.price);
          const percent = Math.round(100 * (1 - price / old));
          return (
            <article key={p.id} className={styles.card}>
              <Link to={`/products/${p.id}`} className={styles.cardLink}>
                <div className={styles.thumb}>
                  <img src={apiImg(p.image)} alt={p.title} />
                  <span className={styles.badge}>-{percent}%</span>
                </div>
                <h3 className={styles.title}>{p.title}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.now}>${price}</span>
                  <span className={styles.old}>${old}</span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}