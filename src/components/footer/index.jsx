import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import mapImage from "../../assets/images/map.png";
import instagramIcon from "../../assets/icons/ic-instagram.svg";
import whatsappIcon from "../../assets/icons/ic-whatsapp.svg";

function Footer() {
    return (
    <div className={styles.footer}>
      <h1>Contact</h1>

      <div className={styles.container}>
        <div className={styles.card}>
          <p>Phone</p>
          <h2>+49 30 915-88492</h2>
        </div>

        <div className={styles.card}>
          <p>Socials</p>
          <div className={styles.socials}>
            <Link to="/">
              <img src={instagramIcon} alt="Instagram" />
            </Link>
            <Link to="/">
              <img src={whatsappIcon} alt="WhatsApp" />
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <p>Address</p>
          <h2>Wallstraße 9-13, 10179 Berlin, Deutschland</h2>
        </div>


        <div className={styles.card}>
          <p>Working Hours</p>
          <h2>24 hours a day</h2>
        </div>
      </div>


      <div className={styles.map}>
        <img src={mapImage} alt="Map" />
      </div>
    </div>
  );
}

export default Footer;