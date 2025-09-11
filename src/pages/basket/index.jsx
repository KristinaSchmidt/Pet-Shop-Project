import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { selectBasketItems, selectBasketTotal, selectBasketCount, inc, dec, setQty, removeItem } from "../../redux/slices/basketSlice";
import { apiImg, api } from "../../redux/slices/api";
import { useMemo, useState } from "react";

export default function BasketPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectBasketItems);
  const total = useSelector(selectBasketTotal);
  const count = useSelector(selectBasketCount);

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });
  const [submitted, setSubmitted] = useState(false);


  const CLEAR_ON_INVALID = true;


  const validators = useMemo(() => ({
    name: (v) => v.trim().length >= 2,
    phone: (v) => /^\+?[0-9][0-9 ()-]{5,}$/.test(v.trim()),
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  }), []);


  const errText = {
    name: "Please enter your name (min 2 characters).",
    phone: "Please enter a valid phone number.",
    email: "Please enter a valid email address.",
  };

  const isValidField = {
    name: validators.name(form.name),
    phone: validators.phone(form.phone),
    email: validators.email(form.email),
  };
  const isValid = isValidField.name && isValidField.phone && isValidField.email;


  const placeholders = {
    name: (submitted || touched.name) && !isValidField.name ? errText.name : "Name",
    phone: (submitted || touched.phone) && !isValidField.phone ? errText.phone : "Phone number",
    email: (submitted || touched.email) && !isValidField.email ? errText.email : "Email",
  };

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    if (!isValidField[field] && CLEAR_ON_INVALID) {

      setForm((f) => ({ ...f, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }
    if (!isValid) {

      if (CLEAR_ON_INVALID) {
        setForm((f) => ({
          name: isValidField.name ? f.name : "",
          phone: isValidField.phone ? f.phone : "",
          email: isValidField.email ? f.email : "",
        }));
      }
      return;
    }

    const payload = {
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        qty: i.qty,
        price: Number(i.priceNow),
        subtotal: Number(i.priceNow * i.qty),
      })),
      total: Number(total.toFixed(2)),
      createdAt: new Date().toISOString(),
    };


    const endpointsToTry = [
      "/order",
      "/orders",
      "/order/create",
      "/order/send",
      "/checkout",
      "/cart/order",
      "/api/order",
      "/api/orders",
    ];

    let lastErr = null;
    for (const path of endpointsToTry) {
      try {
        console.log("[ORDER][TRY]", path);
        const res = await api.post(path, payload, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("[ORDER_OK]", path, res?.status);
        alert(`Order placed via ${path} (status: ${res?.status}).`);
        return;
      } catch (err) {
        const status = err?.response?.status;
        console.warn("[ORDER_FAIL]", path, status);
        lastErr = err;
        if (status && status !== 404) break;
      }
    }

    alert(
      lastErr?.response
        ? `Server error: ${lastErr.response.status} ${lastErr.response.statusText || ""}`
        : `Network/Proxy error: ${lastErr?.message}`
    );
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

          {items.map((i) => (
            <article key={i.id} className={styles.card}>
              <img className={styles.thumb} src={apiImg(i.image)} alt={i.title} />
              <div className={styles.info}>
                <h3 className={styles.itemTitle}>{i.title}</h3>
                <div className={styles.controls}>
                  <div className={styles.qty}>
                    <button type="button" onClick={() => dispatch(dec(i.id))}>−</button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={i.qty}
                      onChange={(e) => dispatch(setQty({ id: i.id, qty: Number(e.target.value) }))}
                    />
                    <button type="button" onClick={() => dispatch(inc(i.id))}>+</button>
                  </div>
                  <div className={styles.prices}>
                    <span className={styles.now}>${(i.priceNow * i.qty).toFixed(0)}</span>
                    {i.priceOld > i.priceNow && (
                      <span className={styles.old}>${(i.priceOld * i.qty).toFixed(0)}</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={styles.remove}
                onClick={() => dispatch(removeItem(i.id))}
                aria-label="Remove item"
              >
                ×
              </button>
            </article>
          ))}
        </div>

        <aside className={styles.summary}>
          <h3 className={styles.sumTitle}>Order details</h3>
          <dl className={styles.meta}>
            <div><dt>Items</dt><dd>{count}</dd></div>
            <div><dt>Total</dt><dd className={styles.total}>${total.toFixed(2)}</dd></div>
          </dl>


          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <input
                className={`${styles.input} ${ (submitted || touched.name) && !isValidField.name ? styles.inputInvalid : "" }`}
                placeholder={placeholders.name}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onBlur={() => handleBlur("name")}

                aria-invalid={(submitted || touched.name) && !isValidField.name}
                aria-label="Name"
              />
            </div>

            <div className={styles.field}>
              <input
                className={`${styles.input} ${ (submitted || touched.phone) && !isValidField.phone ? styles.inputInvalid : "" }`}
                placeholder={placeholders.phone}
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                onBlur={() => handleBlur("phone")}

                aria-invalid={(submitted || touched.phone) && !isValidField.phone}
                aria-label="Phone number"
              />
            </div>

            <div className={styles.field}>
              <input
                className={`${styles.input} ${ (submitted || touched.email) && !isValidField.email ? styles.inputInvalid : "" }`}
                placeholder={placeholders.email}
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                onBlur={() => handleBlur("email")}

                aria-invalid={(submitted || touched.email) && !isValidField.email}
                aria-label="Email"
              />
            </div>


            <button className={styles.orderBtn} type="submit" disabled={!items.length}>
              Order
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}