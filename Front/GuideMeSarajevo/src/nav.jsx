import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./nav.css";

function Nav() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <h1>GuideMeSarajevo</h1>
      <nav>
        <ul className={isNavOpen ? "navList show" : "navList"}>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Routes</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
          <li>
            <a id="btnLi" href="/login">
              Login
            </a>
          </li>
        </ul>
        <div className="navToggle">
          <button onClick={toggleNav}>&#9776;</button>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
