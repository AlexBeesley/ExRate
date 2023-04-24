import React from "react";
import Styles from "../Styles/home.module.scss";

interface ErrorBoxProps {
  errorMessage: string;
}

export default function ErrorBox({ errorMessage }: ErrorBoxProps) {
  return (
    <div className={Styles.error}>
      <h3>Oops! Something went wrong.</h3>
      <p>Please try again later.</p>
      <p>{errorMessage}</p>
    </div>
  );
}
