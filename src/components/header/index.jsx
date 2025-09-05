import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import LogoIcon from "../../assets/icons/logo.svg";
import Icon from "../../assets/icons/icon.svg";


function Header() {
    return (
        <div className={styles.header}>
           <div className={styles.logo}>
            <Link to="/">
            <img src={LogoIcon} alt="logo"></img>
            </Link>
           </div>

           <div className={styles.list}>
                <ul>
                    <li>
                        <Link to="/">Main Page</Link>
                    </li>
                    <li>
                        <Link to="/categories">Categories</Link>
                    </li>
                    <li>
                        <Link to="/products">All products</Link>
                    </li>
                    <li>
                        <Link to="/sales">All sales</Link>
                    </li>
                </ul>
           </div>

           <div className={styles.icon}>
            <Link to="/">
            <img src={Icon} alt="icon"></img>
            </Link>
           </div>
        </div>
    )
}

export default Header;