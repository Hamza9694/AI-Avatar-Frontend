import React from "react";
import { constants } from "../utils/constants";

const LandingPageHero = (props) => {
  const { selectedTag, setSelectedTag } = props;

  return (
    <div className="info-section">
      <div className="pink-circle"></div>
      <div className="blue-circle-wrapper">
        <div className="blue-circle"></div>
      </div>

      <h1 className="heading">{constants.heroHeading}</h1>
      <p className="desciption">{constants.heroDescription}</p>

      <div className="button-container">
        {constants.tags.map((tag, index) => (
          <div
            key={index}
            className={`tag ${selectedTag === tag ? "active" : ""}`}
            onClick={() =>  setSelectedTag(tag === selectedTag ? "" : tag)}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPageHero;
