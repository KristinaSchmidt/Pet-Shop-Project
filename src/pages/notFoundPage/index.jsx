import ImageError from "../../assets/images/404.png";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";


export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.code}>
          <img className={styles.dog} src={ImageError} alt="dog" />
        </div>

        <h1 className={styles.title}>Page Not Found</h1>

        <p className={styles.hint}>
          We’re sorry, the page you requested could not be found. Please go back to the homepage.
        </p>

        <Link to="/" className={styles.btn}>Go Home</Link>
      </section>

    </div>
  );
}