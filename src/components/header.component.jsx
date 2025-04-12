import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars, faCaretDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import logo from "../asserts/images/logo.png"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const showMenu = () => setMenuOpen(true);
  const hideMenu = () => setMenuOpen(false);

  return (
    <section className="header">
      <nav>
        <a href="index.html">
          <img className="logo" src={logo} alt="logo" />
        </a>
        <div
          className="nav-links"
          id="nav-links"
          style={{ width: menuOpen ? "200px" : "0px" }}
        >
          <FontAwesomeIcon
            icon={faTimes}
            className="fa"
            size="2x"
            onClick={() => hideMenu()}
          />
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Solutions <FontAwesomeIcon icon={faCaretDown} /></a>
            </li>
            <li>
              <a href="#">Services <FontAwesomeIcon icon={faCaretDown} /></a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Clients</a>
            </li>
            <li className="box-button">
              <a href="#">Contact Us <FontAwesomeIcon className="arrow-right-icon" icon={faArrowRight} /></a>
            </li>
          </ul>
        </div>
        <FontAwesomeIcon
          icon={faBars}
          className="fa"
          size="2x"
          onClick={() => showMenu()}
        />
      </nav>
    </section>
  );
};

export default Header;
