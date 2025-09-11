import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import pets from "../../assets/images/pets.svg";
import { api } from "../../redux/slices/api";

export default function PromoBanner({
  title = "5% off on the first order",
  image = pets,
  onSubmit,
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const navigate = useNavigate();


  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit?.(form);

    const payload = {
      source: "promo-banner",
      contact: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await api.post("/order/send", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status >= 200 && res.status < 300) {
        console.log("[PROMO_OK] /order/send", res.status, res.statusText);
      } else {
        console.warn("[PROMO_WARN] Unerwarteter Status:", res.status);
      }
    } catch (err) {
      const status = err?.response?.status;
      console.error("[PROMO_FAIL] /order/send", status || err?.message);
    }

    navigate("/sales");
  };

  return (
    <section className={styles.container}>
      <section className={styles.promo} aria-labelledby="promo-title">
        <div className={styles.inner}>
          <h2 id="promo-title" className={styles.title}>{title}</h2>

          <div className={styles.left} aria-hidden="true">
            <div
              className={styles.decor}
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.visuallyHidden} htmlFor="promo-name">Name</label>
            <input
              id="promo-name"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            <label className={styles.visuallyHidden} htmlFor="promo-phone">Phone number</label>
            <input
              id="promo-phone"
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
            />

            <label className={styles.visuallyHidden} htmlFor="promo-email">Email</label>
            <input
              id="promo-email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <button type="submit">Get a discount</button>
          </form>
        </div>
      </section>
    </section>
  );
}