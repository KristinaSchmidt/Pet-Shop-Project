import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { apiImg } from "../../redux/slices/api";
import styles from "./styles.module.css";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <section className={styles.section}>
      
      {/* Button */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link to="/" className={styles.chip}>Main page</Link>
        <span className={`${styles.chip} ${styles.chipActive}`}>Categories</span>
      </nav>

      <header className={styles.header}>
        <h2>Categories</h2>
      </header>

      {status === "loading" && <p className={styles.info}>Loading…</p>}
      {status === "failed" && <p className={styles.error}>Error: {error}</p>}

      {status === "succeeded" && (
        <div className={styles.grid}>
          {items.map((cat) => {
            const slug = String(cat.id ?? cat.title).toLowerCase().replace(/\s+/g, "-");
            return (
              <article key={cat.id ?? cat.title} className={styles.card}>
                <Link
                  to={`/categories/${cat.id ?? slug}`}
                  className={styles.cardLink}
                  aria-label={`Open ${cat.title}`}
                >
                  <div className={styles.thumbWrap}>
                    <img src={apiImg(cat.image)} alt={cat.title} />
                  </div>
                  <h3 className={styles.cardTitle}>{cat.title}</h3>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}