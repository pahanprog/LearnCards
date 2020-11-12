import React from "react";

function Card({ question, answer, handleFlip }) {
  return (
    <div className="card-inner">
      <div className="card-front">
        <img
          alt="flip icon"
          className="front"
          src={require("../Images/flip.svg")}
          onClick={handleFlip}
        ></img>
        <h1>{question}</h1>
      </div>
      <div className="card-back">
        <img
          alt="flip icon"
          className="back"
          src={require("../Images/flip.svg")}
          onClick={handleFlip}
        ></img>
        <h2>{answer}</h2>
      </div>
    </div>
  );
}

export default Card;
