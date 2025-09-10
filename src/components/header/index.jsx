import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import LogoIcon from "../../assets/icons/logo.svg";
import Icon from "../../assets/icons/icon.svg";
import { useSelector } from "react-redux";
import { useState } from "react";
import { selectBasketCount } from "../../redux/slices/basketSlice";

// MUI 
import { Drawer, IconButton, List, ListItemButton, ListItemText, Divider } from "@mui/material";

function Header() {
  const count = useSelector(selectBasketCount);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={LogoIcon} alt="logo" />
          </Link>
        </div>
        <div className={styles.list}>
          <ul>
            <li><Link to="/">Main Page</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/products">All products</Link></li>
            <li><Link to="/sales">All sales</Link></li>
          </ul>
        </div>


        <div className={styles.actions}>
          <div className={styles.icon}>
            <Link to="/cart" className={styles.cartLink}>
              <img src={Icon} alt="icon" className={styles.cartIcon} />
              {count > 0 && <span className={styles.cartBadge}>{count}</span>}
            </Link>
          </div>


          <IconButton
            className={styles.burgerBtn}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            size="large"
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
            <span className={styles.burgerLines} />
        </IconButton>
        </div>
      </div>


      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: { xs: "78vw", sm: 320 }, p: 2 } }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <strong style={{ paddingLeft: 6 }}>Menu</strong>
          <IconButton aria-label="Close menu" onClick={() => setOpen(false)}>
            <span className={styles.closeX} />
          </IconButton>
        </div>
        <Divider sx={{ mb: 1 }} />
        <List>
          <ListItemButton component={Link} to="/" onClick={() => setOpen(false)}>
            <ListItemText primary="Main Page" />
          </ListItemButton>
          <ListItemButton component={Link} to="/categories" onClick={() => setOpen(false)}>
            <ListItemText primary="Categories" />
          </ListItemButton>
          <ListItemButton component={Link} to="/products" onClick={() => setOpen(false)}>
            <ListItemText primary="All products" />
          </ListItemButton>
          <ListItemButton component={Link} to="/sales" onClick={() => setOpen(false)}>
            <ListItemText primary="All sales" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}

export default Header;