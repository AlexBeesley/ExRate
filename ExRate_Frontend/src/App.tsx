import Styles from "./Styles/main.module.scss";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Nav from "./Components/nav";
import DarkModeToggle from "./Components/darkmodetoggle";
import Footer from "./Components/footer";
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
          <Loader color={root.style.getPropertyValue('--Secondary')} size={15} />
        </div>
      ) : (
        <>
          <div className={Styles.stickyContainer}>
            <Nav />
            <DarkModeToggle />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </>)}
    </BrowserRouter>
  )
}
