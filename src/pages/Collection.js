import React, { useState, useEffect, useRef } from "react";
import "../Collection.scss";
import { useParams, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import InlineEdit from "../components/InlineEdit";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Axios from "axios";
import Load from "../components/Loading";
import { signIn } from "../actions";

function Collection(props) {
  const dispatch = useDispatch();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const inputRef = useRef();
  const [inputValue, setInputValue] = useState({ title: "", description: "" });
  const [cardsInputValue, setCardsInputValue] = useState([]);

  const [infoIsEditable, setInfoIsEditable] = useState(false);
  const [cardsIsEditable, setCardsIsEditable] = useState(false);

  const [loading, setLoading] = useState(true);

  const [startInputValue, setStartInputValue] = useState({
    title: "",
    description: "",
  });
  const [startCardsInputValue, setStartCardsInputValue] = useState([]);

  const [deletedCards, setDeletedCards] = useState([]);

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const copy = { ...inputValue };
    copy[name] = value;
    setInputValue(copy);
  };

  const handleCardChange = (e, index) => {
    const { name, value } = e.target;
    const copy = [...cardsInputValue];
    copy[index][name] = value;
    setCardsInputValue(copy);
  };

  const handleCardAdd = () => {
    const copy = [...cardsInputValue];
    copy.push({ question: "New card q", answer: "new card a" });
    setCardsInputValue(copy);
  };

  const handleCardDelete = (id) => {
    const list = JSON.parse(JSON.stringify(cardsInputValue));

    const delList = JSON.parse(JSON.stringify(deletedCards));
    if (list[id]._id) delList.push(list[id]);
    setDeletedCards(delList);

    list.splice(id, 1);
    setCardsInputValue(JSON.parse(JSON.stringify(list)));
  };

  const handleCancelEditInfo = () => {
    setInfoIsEditable(false);
    setInputValue(startInputValue);
  };

  const handleCancelEditCards = () => {
    setCardsIsEditable(false);
    setCardsInputValue(JSON.parse(JSON.stringify(startCardsInputValue)));
    setDeletedCards([]);
  };

  const handleAlertShow = (title) => {
    setAlertMessage(title);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  const { id } = useParams();
  const edit = new URLSearchParams(useLocation().search).get("edit");

  const collection = useSelector((state) =>
    state.collections.find((x) => x.collection._id === id)
  );
  const IsLogged = useSelector((state) => state.isLogged);

  const handleShareClick = async () => {
    const url = window.location.href;
    const share_url = url.replace("collection", "share");
    try {
      await navigator.clipboard.writeText(share_url);
      handleAlertShow("Share url copied in clipboard");
    } catch (err) {
      handleAlertShow(err);
    }
  };

  const handleUpdateCards = async () => {
    const cards = { questions: cardsInputValue, delete: deletedCards, _id: id };
    try {
      const response = await Axios.post("/collections/update/cards", {
        data: cards,
      });
      if (response.status === 200) {
        setCardsIsEditable(false);
        handleAlertShow("Successfully updated collection cards!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInfo = async () => {
    const collection = {
      title: inputValue.title,
      description: inputValue.description,
      _id: id,
    };
    try {
      const response = await Axios.post("/collections/update/info", {
        data: collection,
      });
      if (response.status === 200) {
        setInfoIsEditable(false);
        handleAlertShow("Successfully updated collection info!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (edit === "true") {
      setInfoIsEditable(true);
      setCardsIsEditable(true);
    }
    if (collection) {
      setLoading(false);
      setCardsInputValue(collection.cards);
      setStartCardsInputValue(collection.cards);
      setInputValue({
        title: collection.collection.title,
        description: collection.collection.description,
      });
      setStartInputValue({
        title: collection.collection.title,
        description: collection.collection.description,
      });
      return;
    }
    const fetchData = async () => {
      try {
        const response = await Axios.get(`/collections/${id}`);
        const data = response.data;
        setLoading(false);
        if (response.status === 200) {
          setInputValue({
            title: data.collection.title,
            description: data.collection.description,
          });
          setStartInputValue({
            title: data.collection.title,
            description: data.collection.description,
          });
          setCardsInputValue(data.cards);
          setStartCardsInputValue(data.cards);
          dispatch(signIn());
        } else {
          handleAlertShow(data.message);
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app">
      <Header back={true} />
      {loading ? (
        <Load />
      ) : IsLogged ? (
        <div className="collection">
          <img
            src={require("../Images/share.svg")}
            className="share"
            onClick={handleShareClick}
            draggable="false"
          ></img>
          <div className="collection__header">
            <div
              className={
                infoIsEditable
                  ? "collection__actions editing"
                  : "collection__actions"
              }
            >
              <img
                src={require("../Images/edit.svg")}
                onClick={() => setInfoIsEditable(true)}
                draggable="false"
                alt="edit icon"
              ></img>
              {infoIsEditable ? (
                <div className="actions">
                  <button onClick={handleUpdateInfo}>Save</button>
                  <button onClick={handleCancelEditInfo}>Cancel</button>
                </div>
              ) : null}
            </div>
            <h1>Collection info</h1>
            <div className="collection__info">
              <div className="header__title">
                <label>Collection title</label>
                <InlineEdit
                  text={inputValue.title}
                  childRef={inputRef}
                  classname="title"
                  editable={infoIsEditable}
                >
                  <input
                    className="title"
                    ref={inputRef}
                    type="text"
                    value={inputValue.title}
                    name="title"
                    onChange={(e) => handleInputChange(e)}
                  />
                </InlineEdit>
              </div>
              <div className="header__description">
                <label>Collection description</label>
                <InlineEdit
                  text={inputValue.description}
                  childRef={inputRef}
                  classname="description"
                  editable={infoIsEditable}
                >
                  <input
                    className="description"
                    ref={inputRef}
                    type="text"
                    value={inputValue.description}
                    name="description"
                    onChange={(e) => handleInputChange(e)}
                  />
                </InlineEdit>
              </div>
            </div>
          </div>
          <div className="collection__body">
            <h2>Collection cards</h2>
            <div
              className={
                cardsIsEditable
                  ? "collection__actions cards editing"
                  : "collection__actions cards"
              }
            >
              <img
                src={require("../Images/edit.svg")}
                onClick={() => setCardsIsEditable(true)}
                draggable="false"
                alt="edit icon"
              ></img>
              {cardsIsEditable ? (
                <div className="actions">
                  <button onClick={handleUpdateCards}>Save</button>
                  <button onClick={handleCancelEditCards}>Cancel</button>
                </div>
              ) : null}
            </div>
            <div className="cards__grid">
              {cardsInputValue.map((value, index) => {
                return (
                  <div className="card__item" key={index.toString()}>
                    {cardsIsEditable ? (
                      <div className="card__item__actions">
                        <img
                          src={require("../Images/trash.svg")}
                          alt="delete icon"
                          onClick={() => handleCardDelete(index)}
                          alt="trash icon"
                        ></img>
                      </div>
                    ) : null}
                    <label>Card #{index + 1}</label>
                    <InlineEdit
                      text={value.question}
                      childRef={inputRef}
                      classname="question"
                      editable={cardsIsEditable}
                    >
                      <input
                        className="question"
                        ref={inputRef}
                        type="text"
                        value={value.question}
                        name="question"
                        onChange={(e) => handleCardChange(e, index)}
                      />
                    </InlineEdit>
                    <InlineEdit
                      text={value.answer}
                      childRef={inputRef}
                      classname="answer"
                      editable={cardsIsEditable}
                    >
                      <input
                        className="answer"
                        ref={inputRef}
                        type="text"
                        value={value.answer}
                        name="answer"
                        onChange={(e) => handleCardChange(e, index)}
                      />
                    </InlineEdit>
                  </div>
                );
              })}
              {cardsIsEditable ? (
                <div className="card__item add-new" onClick={handleCardAdd}>
                  <img
                    src={require("../Images/plus.svg")}
                    draggable="false"
                    alt="plus icon"
                  ></img>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="login__error">
          <h2>To use this app you need to register or sign in above</h2>
        </div>
      )}

      {alertVisible ? (
        <Alert title={alertMessage} handleClose={handleAlertClose} />
      ) : null}
    </div>
  );
}

export default Collection;
