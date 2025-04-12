import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAngleUp,
  faLocationDot,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { constants } from "../utils/constants";

import logo from "../asserts/images/logo.png";


const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-wrapper">
        <div className="flexed-item">
          <img className="logo" src={logo} alt="logo" />
          <p>
            We provide consultation, solutions to maximamise efficiency,
            stability and enable business growth.
          </p>
        </div>

        {constants.sections.map((section, index) => (
          <div className="flexed-item" key={index}>
            <h3>
              {section.name}{" "}
              <FontAwesomeIcon className="left-icon" icon={faAnglesLeft} />
            </h3>
            <ul>
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a href={link.route}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flexed-item">
          <h3>
            CONTACT{" "}
            <FontAwesomeIcon className="left-icon" icon={faAnglesLeft} />
          </h3>
          <div className="contact-info">
            <p>
              <FontAwesomeIcon className="icon" icon={faLocationDot} /> 1910
              Thornes Ave, Cheyenne, WY 82001.
            </p>
            <p>
              <FontAwesomeIcon className="icon" icon={faPhone} /> +1469 883 2587
            </p>
            <p>
              <FontAwesomeIcon className="icon" icon={faEnvelope} />{" "}
              info@ebizoncloud.com
            </p>
          </div>
        </div>
      </div>

      <div className="copyright-row">
        <p>Copyright© 2025 eBizon Cloud - All Rights Reserved.</p>
        <p>Privacy Policy</p>
        <div className="angle-up">
          <FontAwesomeIcon icon={faAngleUp} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
