import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import pets from "../../assets/images/pets.svg";



export default function PromoBanner({
  title = "5% off on the first order",
  image = pets,
  onSubmit,
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
    navigate("/sales");
  };

  return (
  <section className={styles.container}>
    <section className={styles.promo} aria-labelledby="promo-title">
      <div className={styles.inner}>
        {/* Titel  */}
        <h2 id="promo-title" className={styles.title}>{title}</h2>

        {/* Links*/}
        <div className={styles.left} aria-hidden="true">
          <div
            className={styles.decor}
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>

        {/* Rechts: Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.visuallyHidden} htmlFor="promo-name">Name</label>
          <input id="promo-name" name="name" placeholder="Name" value={form.name} onChange={handleChange} />

          <label className={styles.visuallyHidden} htmlFor="promo-phone">Phone number</label>
          <input id="promo-phone" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />

          <label className={styles.visuallyHidden} htmlFor="promo-email">Email</label>
          <input id="promo-email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />

          <button type="submit">Get a discount</button>
        </form>
      </div>
    </section>
  </section>
);
}