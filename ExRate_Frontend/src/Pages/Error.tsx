import React from "react";
import Styles from "../Styles/main.module.scss";

export default function Error() {
  return (
    <div className={Styles.error}>
      <p><i className="fa-solid fa-bug"></i> 404: Page not found</p>
      <div className={Styles.spacer}></div>
    </div>
  );
}