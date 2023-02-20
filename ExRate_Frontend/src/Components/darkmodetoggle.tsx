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
    root.style.setProperty('--Primary', '#FFF');
    root.style.setProperty('--Secondary', '#FFF');
    root.style.setProperty('--Tertiary', '#FFF');
    root.style.setProperty('--Quaternary', '#FFF');
    root.style.setProperty('--Accent', '#FFF');
    root.style.setProperty('--background', '#FFF');
    root.style.setProperty('--shadow', '#FFF');
    root.style.setProperty('--highlight', '#FFF');
    root.style.setProperty('--light', '#FFF');
    root.style.setProperty('--light-hover', '#FFF');
  } else {
    root.style.setProperty('--Primary', '#000');
    root.style.setProperty('--Secondary', '#000');
    root.style.setProperty('--Tertiary', '#000');
    root.style.setProperty('--Quaternary', '#000');
    root.style.setProperty('--Accent', '#000');
    root.style.setProperty('--background', '#000');
    root.style.setProperty('--shadow', '#000');
    root.style.setProperty('--highlight', '#000');
    root.style.setProperty('--light', '#000');
    root.style.setProperty('--light-hover', '#000');
  }
  

  return (
    <div className={Styles.darkmodetoggle}>
      <button className={Styles.button} onClick={() => setToggle(!toggle)}>
        <i className="fa-solid fa-lightbulb"></i>
      </button>
    </div>
  );
}