import React, { useState, useEffect } from "react";

function InlineEdit({ childRef, text, children, classname, editable, type }) {
  const [isEditable, setIsEditable] = useState(false);

  const handleKeyDown = (event) => {
    const { key } = event;
    const keys = ["Escape", "Tab"];
    const enterKey = "Enter";
    const AllKeys = [...keys, enterKey];
    if (
      (type === "textarea" && keys.indexOf(key) > -1) ||
      (type !== "textarea" && AllKeys.indexOf(key) > -1)
    ) {
      setIsEditable(false);
    }
  };

  useEffect(() => {
    if (childRef && childRef.current && isEditable === true) {
      childRef.current.focus();
    }
  }, [isEditable, childRef]);

  return (
    <>
      {isEditable ? (
        <div
          className={editable ? `${classname} edit` : classname}
          onBlur={() => setIsEditable(false)}
          onKeyDown={(e) => handleKeyDown(e)}
        >
          {children}
        </div>
      ) : (
        <div
          onClick={() => (editable ? setIsEditable(true) : null)}
          className={editable ? `${classname} edit` : classname}
        >
          <span>{text}</span>
        </div>
      )}
    </>
  );
}

export default InlineEdit;
