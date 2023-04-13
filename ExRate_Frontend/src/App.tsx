import Styles from "./Styles/main.module.scss";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Error from "./Pages/ErrorPage";
import Nav from "./Components/Nav";
import DarkModeToggle from "./Components/Darkmodetoggle";
import Footer from "./Components/Footer";
import icon from "./Images/icon.png";
import Loader from "react-spinners/PropagateLoader";

export const App = () => {
  let root = document.documentElement;

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false);
    }, 1500)
  }, [])

  return (
    <BrowserRouter>
      <Helmet>
        <link rel="icon" href={icon} />
      </Helmet>
      {loading ? (
        <div className={Styles.loader}>
          <Loader color={root.style.getPropertyValue('--secondary')} size={15} />
        </div>
      ) : (
        <div className={Styles.main}>
          <Nav />
          <DarkModeToggle />
          <div className={Styles.flexWrapper}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Error />} />
            </Routes>
            <Footer />
          </div>
        </div>)}
    </BrowserRouter>
  )
}
