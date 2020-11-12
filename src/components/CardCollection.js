import React from "react";
import "./CollectionPreview";
import CollectionPreview from "./CollectionPreview";
import { Link } from "react-router-dom";

function CardCollection(props) {
  return (
    <div className="collection__item">
      <div className="collection__header">
        <div className="collection__header__text">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </div>
        <div className="collection__header__actions">
          <Link to={`/collection/${props.id}?edit=true`}>
            <img src={require("../Images/edit.svg")} alt="edit icon"></img>
          </Link>
          <img
            src={require("../Images/trash.svg")}
            alt="delete icon"
            onClick={() => {
              props.handleDelete(props.id);
            }}
          ></img>
        </div>
      </div>
      <div className="collection__preview">
        {props.cards.map((value, index) => {
          if (index >= 3) {
            return null;
          }
          return (
            <CollectionPreview
              question={value.question}
              answer={value.answer}
              key={value._id.toString()}
              id={value._id}
            />
          );
        })}
      </div>
      <div className="collection__preview__actions">
        <Link to={"/collection/" + props.id}>
          <div className="actions__view-all">
            <p>View all</p>
          </div>
        </Link>
        <Link to={"/learn/" + props.id}>
          <div className="actions__start-learning">
            <p>Start learning</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default CardCollection;
