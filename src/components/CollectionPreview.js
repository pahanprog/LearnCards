import React from "react";

function CollectionPreview(props) {
  return (
    <div className="preview__item">
      <h4>{props.question}</h4>
      <p>{props.answer}</p>
    </div>
  );
}

export default CollectionPreview;
