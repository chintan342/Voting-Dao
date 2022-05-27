import { Fragment, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <Fragment>
      <Navigation />
      <Outlet />
    </Fragment>
  );
};

export default Layout;
