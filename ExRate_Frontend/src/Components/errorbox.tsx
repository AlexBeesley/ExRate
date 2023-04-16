import React from "react";
import Styles from "../Styles/home.module.scss";

export default function ErrorBox() {
  return (
    <div className={Styles.error}>
      <h3>Oops! Something went wrong.</h3>
      <p>Please try again later.</p>
    </div>
  );
}