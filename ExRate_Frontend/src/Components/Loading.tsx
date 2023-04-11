import React from "react";
import Loader from "react-spinners/PuffLoader";
import Styles from "../Styles/home.module.scss";

interface LoadingProps {
  color: string;
  size: number;
}

export const Loading: React.FC<LoadingProps> = ({ color, size }) => {
  return (
    <div className={Styles.loader}>
      <Loader color={color} size={size} />
    </div>
  );
};
