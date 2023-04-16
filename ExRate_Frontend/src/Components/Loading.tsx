import Loader from "react-spinners/PuffLoader";
import Styles from "../Styles/home.module.scss";

export default function Loading({ color, size }) {
  return (
    <div className={Styles.loader}>
      <Loader color={color} size={size} />
    </div>
  );
};
