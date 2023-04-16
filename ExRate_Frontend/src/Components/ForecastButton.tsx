import React from "react";
import Styles from "../Styles/home.module.scss";

interface ForecastButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export default function ForecastButton({ disabled, onClick }: ForecastButtonProps): JSX.Element {
  return (
    <button className={Styles.button} onClick={onClick} disabled={disabled}>
      Get forecast
    </button>
  );
}
