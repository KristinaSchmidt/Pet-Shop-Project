import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "@mui/material/Button";
import petImage from "../../assets/images/petImage.png";

function Main() {
  return (
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
              ":hover": { backgroundColor: "#000" },
          }}
        >
        Check out
        </Button>
      </div>
    </section>
  );
}

export default Main;