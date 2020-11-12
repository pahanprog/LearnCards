import React from "react";
import "../loading.scss";

function Loading() {
  return (
    <div className="load__modal">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loading;
