import React from "react";

function Alert(props) {
  const additionStyle = {
    bottom: props.bottom,
  };

  return (
    <div className="alert__body" style={additionStyle}>
      <div className="timer__wrapper">
        <span
          className="alert__timer"
          // onAnimationEnd={() => props.handleClose(props.index)}
        ></span>
      </div>
      <p>{props.title}</p>
      {props.undo ? (
        <img
          src={require("../Images/undo.svg")}
          onClick={() => props.handleUndo(props.obj)}
          alt="undo icon"
        />
      ) : null}
      <img
        src={require("../Images/close.svg")}
        onClick={() => {
          props.handleClose(props.index);
        }}
        alt="close icon"
      />
    </div>
  );
}

export default Alert;
