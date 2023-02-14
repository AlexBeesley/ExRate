import Styles from '../Styles/nav.module.scss';
import { NavLink } from "react-router-dom";

export default function Nav () {
    return (
        <nav>
        <div className={Styles.nav}>
          <NavLink className={({ isActive }) => (isActive ? Styles.activelink : Styles.navlink)} to="/"> Home </NavLink>
          <NavLink className={({ isActive }) => (isActive ? Styles.activelink : Styles.navlink)} to="/about"> About </NavLink>

          <NavLink title="Home" className={({ isActive }) => (isActive ? Styles.activeicon : Styles.navicon)} to="/"> <i className="fa-solid fa-house-user"></i> </NavLink>
          <NavLink title=".NET and C#"className={({ isActive }) => (isActive ? Styles.activeicon : Styles.navicon)} to="/about"> <i className="fa-solid fa-code"></i> </NavLink>
        </div>
      </nav>
    )
}