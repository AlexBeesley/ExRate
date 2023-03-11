import { useEffect, useState } from "react";
import Styles from "../Styles/darkmodetoggle.module.scss";

export default function DarkModeToggle() {
  let data = window.localStorage.getItem('DARK_MODE_KEY')
  if (data !== null) {
    data = JSON.parse(data);
  }
  const [toggle, setToggle] = useState(
    () => data || false
  );

  useEffect(() => {
    window.localStorage.setItem('DARK_MODE_KEY', JSON.stringify(toggle));
  }, [toggle]);

  let root = document.documentElement;

  console.log("dark mode:", toggle);

  if (toggle) {
    root.style.setProperty('--primary', '#FFF');
    root.style.setProperty('--secondary', '#009F76');
    root.style.setProperty('--tertiary', '#FFF');
    root.style.setProperty('--accent', '#4e9c87');
    root.style.setProperty('--accent-secondary', '#FFC400');
    root.style.setProperty('--background', '#001000');
    root.style.setProperty('--disable', '#A9A9A9');
    root.style.setProperty('--disable-text', '#E0E0E0');
  } else {
    root.style.setProperty('--primary', '#000');
    root.style.setProperty('--secondary', '#009F76');
    root.style.setProperty('--tertiary', '#000');
    root.style.setProperty('--accent', '#4e9c87');
    root.style.setProperty('--accent-secondary', '#FFC400');
    root.style.setProperty('--background', '#FFF');
    root.style.setProperty('--disable', '#E0E0E0');
    root.style.setProperty('--disable-text', '#A9A9A9');
  }

  return (
    <div className={Styles.darkmodetoggle}>
      <button className={Styles.button} onClick={() => setToggle(!toggle)}>
        <i className="fa-solid fa-lightbulb"></i>
      </button>
    </div>
  );
}