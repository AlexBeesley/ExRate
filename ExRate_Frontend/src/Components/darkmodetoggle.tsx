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
    root.style.setProperty('--primary', '#D9EDDF');
    root.style.setProperty('--secondary', '#679C76');
    root.style.setProperty('--tertiary', '#006B6C');
    root.style.setProperty('--quaternary', '#5E5E5E');
    root.style.setProperty('--accent', '#00FF88');
    root.style.setProperty('--background', '#001900');
    root.style.setProperty('--disable', '#A9A9A9');
    root.style.setProperty('--disable-text', '#E0E0E0');
  } else {
    root.style.setProperty('--primary', '#000');
    root.style.setProperty('--secondary', '#8FBC8F');
    root.style.setProperty('--tertiary', '#00CED1');
    root.style.setProperty('--quaternary', '#A9A9A9');
    root.style.setProperty('--accent', '#FFC0CB');
    root.style.setProperty('--background', '#F5F5F5');
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