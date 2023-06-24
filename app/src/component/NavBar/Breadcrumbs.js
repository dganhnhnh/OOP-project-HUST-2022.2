import React from "react";
import { useLocation, Link } from "react-router-dom";
import './Breadcrumbs.css'
function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="breadcrumbs">
      {pathnames.length > 0 && (
        <Link to="/">Home /</Link>
      )}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <span key={routeTo}>{name}</span>
        ) : (
          <React.Fragment key={routeTo}>
            <Link to={routeTo}>{name}</Link>
            <span>/</span>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
