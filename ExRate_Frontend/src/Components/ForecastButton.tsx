import React from "react";
import Styles from "../Styles/home.module.scss";

interface ForecastButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export const ForecastButton: React.FC<ForecastButtonProps> = ({
  disabled,
  onClick,
}) => {
  return (
    <button className={Styles.button} onClick={onClick} disabled={disabled}>
      Get forecast
    </button>
  );
};
