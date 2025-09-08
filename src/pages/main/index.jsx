import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "@mui/material/Button";
import petImage from "../../assets/images/petImage.png";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { apiImg, api } from "../../redux/slices/api";
import PromoBanner from "../../components/promoBanner/index";


function Main() {
  const dispatch = useDispatch();
  const { items: catItems, status: catStatus } = useSelector((s) => s.categories);

  // Kategorien laden)
  useEffect(() => {
    if (catStatus === "idle") dispatch(fetchCategories());
  }, [catStatus, dispatch]);

  // 4er-Karussell
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo(() => {
    const out = [];
    for (let i = 0; i < catItems.length; i += 4) out.push(catItems.slice(i, i + 4));
    return out;
  }, [catItems]);


  useEffect(() => setPage(0), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  const canPrev = page > 0;
  const canNext = page < Math.max(slides.length - 1, 0);



const [saleItems, setSaleItems] = useState([]);
const [saleStatus, setSaleStatus] = useState("idle");
const [saleError, setSaleError] = useState("");

useEffect(() => {
  if (saleStatus !== "idle") return;
  setSaleStatus("loading");
  api.get("/products/all")
    .then((data) => {
      const discounted = (data ?? []).filter(
        (p) => Number(p.discont_price) > 0 && Number(p.discont_price) < Number(p.price)
      );
      setSaleItems(discounted.slice(0, 8)); // max. 8 insgesamt verfügbar
      setSaleStatus("succeeded");
    })
    .catch((err) => { setSaleError(err?.message || "Load failed"); setSaleStatus("failed"); });
}, [saleStatus]);

// === Karussell-Logik (4 pro Slide) ===
const saleSlides = useMemo(() => {
  const out = [];
  for (let i = 0; i < saleItems.length; i += 4) out.push(saleItems.slice(i, i + 4));
  return out;
}, [saleItems]);

const [salePage, setSalePage] = useState(0);
const [salePaused, setSalePaused] = useState(false);
useEffect(() => setSalePage(0), [saleSlides.length]);

const saleCanPrev = salePage > 0;
const saleCanNext = salePage < Math.max(saleSlides.length - 1, 0);





  return (
    <>
      <section
        className={styles.container}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.32), rgba(0,0,0,0.18)), url(${petImage})`,
        }}
      >
        <div className={styles.content}>
          <h1 className={styles.title}>
            Amazing Discounts<br />on Pets Products!
          </h1>

          <Button
            className={styles.cta}
            component={Link}
            to="/sales"
            variant="contained"
            sx={{
              width: { xs: 170, md: 218 },
              height: { xs: 46, md: 58 },
              fontSize: { xs: 14, md: 16 },
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#0D50FF",
              "&:hover": { backgroundColor: "#000" },
            }}
          >
            Check out
          </Button>
        </div>
      </section>

      {/* KARUSSELL: immer 4 Karten */}
      {slides.length > 0 && (
    <section className={styles.catSection} aria-label="Categories carousel">
      <div className={styles.catHeader}>
        <h2>Categories</h2>
         <span className={styles.catDivider} aria-hidden="true" />
        <Link to="/categories" className={styles.catAllBtn}>All categories</Link>
      </div>

      <div
        className={styles.catCarousel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          className={`${styles.catNav} ${styles.catPrev}`}
          onClick={() => canPrev && setPage((p) => p - 1)}
          disabled={!canPrev}
          aria-label="Previous"
        />
        <div className={styles.catViewport}>
          <div
            className={styles.catTrack}
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {slides.map((group, i) => (
              <ul key={i} className={styles.catSlide}>
                {group.map((cat) => (
                  <li key={cat.id} className={styles.catCard}>
                    <Link to={`/categories/${cat.id}`} className={styles.catCardLink}>
                      <div className={styles.catThumb}>
                        <img src={apiImg(cat.image)} alt={cat.title} />
                      </div>
                      <span className={styles.catTitle}>{cat.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <button
          className={`${styles.catNav} ${styles.catNext}`}
          onClick={() => canNext && setPage((p) => p + 1)}
          disabled={!canNext}
          aria-label="Next"
        />
      </div>

      <div className={styles.catDots} role="tablist" aria-label="Slides">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.catDot} ${i === page ? styles.active : ""}`}
            onClick={() => setPage(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === page}
            role="tab"
          />
        ))}
      </div>
    </section>
      )}

      <PromoBanner />


      <section className={styles.saleSection} aria-label="Sale carousel">
  <div className={styles.saleHeader}>
    <h2>Sale</h2>
    <span className={styles.saleDivider} aria-hidden="true" />
    <Link to="/sales" className={styles.saleAllBtn}>All sales</Link>
  </div>

  {saleStatus === "loading" && <p className={styles.info}>Loading…</p>}
  {saleStatus === "failed" && <p className={styles.error}>Error: {saleError}</p>}

  {saleSlides.length > 0 && (
    <div
      className={styles.saleCarousel}
      onMouseEnter={() => setSalePaused(true)}
      onMouseLeave={() => setSalePaused(false)}
    >
      <button
        className={`${styles.saleNav} ${styles.salePrev}`}
        onClick={() => saleCanPrev && setSalePage((p) => p - 1)}
        disabled={!saleCanPrev}
        aria-label="Previous"
      />
      <div className={styles.saleViewport}>
        <div
          className={styles.saleTrack}
          style={{ transform: `translateX(-${salePage * 100}%)` }}
        >
          {saleSlides.map((group, i) => (
            <ul key={i} className={styles.saleSlide}>
              {group.map((p) => {
                const price = Number(p.discont_price);
                const old = Number(p.price);
                const percent = Math.round(100 * (1 - price / old));
                return (
                  <li key={p.id} className={styles.saleCard}>
  <Link to={`/products/${p.id}`} className={styles.saleCardLink}>
    <div className={styles.saleThumb}>
      <img src={apiImg(p.image)} alt={p.title} />
      <span className={styles.saleBadge}>-{percent}%</span>
    </div>

    {/* ↓ neu: Content im Card unter dem Bild */}
    <div className={styles.saleBody}>
      <h3 className={styles.saleTitle} title={p.title}>{p.title}</h3>
      <div className={styles.salePriceRow}>
        <span className={styles.salePriceNow}>${price}</span>
        <span className={styles.salePriceOld}>${old}</span>
      </div>
    </div>
  </Link>
</li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
      <button
        className={`${styles.saleNav} ${styles.saleNext}`}
        onClick={() => saleCanNext && setSalePage((p) => p + 1)}
        disabled={!saleCanNext}
        aria-label="Next"
      />
    </div>
  )}

  <div className={styles.saleDots} role="tablist" aria-label="Sale slides">
    {saleSlides.map((_, i) => (
      <button
        key={i}
        className={`${styles.saleDot} ${i === salePage ? styles.active : ""}`}
        onClick={() => setSalePage(i)}
        aria-label={`Go to sale slide ${i + 1}`}
        aria-selected={i === salePage}
        role="tab"
      />
    ))}
  </div>
</section>
    </>
  );
}

export default Main;