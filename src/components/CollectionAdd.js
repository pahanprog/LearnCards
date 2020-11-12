import React, { useState, useEffect } from "react";
import Axios from "axios";

function CollectionAdd({ show, handleAdd, alert }) {
  const [inputList, setInputList] = useState([{ question: "", answer: "" }]);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");

  const showHide = show
    ? "add__collection__wrapper add__block"
    : "add__collection__wrapper add__none";

  useEffect(() => {
    setInputList([{ question: "", answer: "" }]);
    setTitleInput("");
    setDescInput("");
  }, [showHide]);

  const postCollection = async (collection) => {
    try {
      const response = await Axios.post("/collections", {
        data: collection,
      });
      const data = response.data;
      if (response.status === 200) {
        handleAdd(data);
        alert(
          "Successfully added collection with title: " + data.collection.title
        );
        console.log(data);
      } else {
        console.log(data);
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleQAInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...inputList, { question: "", answer: "" }]);
  };

  function formSubmit(e) {
    e.preventDefault();
    const collection = {
      title: titleInput,
      description: descInput,
      questions: inputList,
    };
    console.log(collection);
    postCollection(collection);
  }

  return (
    <div className={showHide}>
      <form
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <div className="add__title-desc">
          <div className="title-group">
            <label>Collection title</label>
            <input
              type="text"
              name="title"
              onChange={(e) => {
                setTitleInput(e.target.value);
              }}
              value={titleInput}
            />
          </div>
          <div className="desc-group">
            <label>Collection description</label>
            <input
              type="text"
              name="description"
              onChange={(e) => {
                setDescInput(e.target.value);
              }}
              value={descInput}
            />
          </div>
        </div>
        <div className="add__collections__questions">
          {inputList.map((value, index) => {
            return (
              <div className="question__item" key={index.toString()}>
                <div className="question__actions">
                  {inputList.length !== 1 ? (
                    <img
                      src={require("../Images/trash.svg")}
                      onClick={(e) => {
                        handleRemoveClick(index);
                      }}
                      alt="Delete question icon"
                    ></img>
                  ) : null}
                  {inputList.length - 1 === index ? (
                    <img
                      src={require("../Images/plus.svg")}
                      onClick={(e) => {
                        handleAddClick();
                      }}
                      alt="Add question icon"
                    ></img>
                  ) : null}
                </div>
                <div className="question__props">
                  <input
                    type="text"
                    name="question"
                    placeholder={"question #" + (index + 1)}
                    value={value.question}
                    onChange={(e) => {
                      handleQAInputChange(e, index);
                    }}
                  />
                  <span>:</span>
                  <input
                    type="text"
                    name="answer"
                    placeholder="answer"
                    value={value.answer}
                    onChange={(e) => {
                      handleQAInputChange(e, index);
                    }}
                    onKeyDown={(e) => {
                      const { key } = e;
                      if (key === "Tab") {
                        handleAddClick();
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}

export default CollectionAdd;
