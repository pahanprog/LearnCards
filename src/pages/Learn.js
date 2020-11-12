import React, { useState, useEffect } from "react";
import "../Learn.scss";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import Axios from "axios";
import Load from "../components/Loading";

function Learn() {
  const { id } = useParams();

  const collection = useSelector((state) => state.collections).find(
    (x) => x.collection._id === id
  );
  const IsLogged = useSelector((state) => state.isLogged);

  const [loading, setLoading] = useState(true);

  const handleFlip = (fnew = false) => {
    if (fnew && !isFlipped) {
      return;
    }
    setFlipToNew(fnew);
    setIsFlipped(!isFlipped);
  };

  const handleAllright = () => {
    alert("Lets gooo!");
  };

  const handleRight = () => {
    handleFlip(true);
    const index = cardsList.findIndex((x) => x === card);
    const list = [...cardsList];
    list.splice(index, 1);
    setCardsList(list);
    if (list.length === 0) {
      handleAllright();
    }
  };

  const handleSkip = () => {
    handleFlip(true);
    const item = cardsList[Math.floor(Math.random() * cardsList.length)];
    setCard(item);
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const [flipTonew, setFlipToNew] = useState(false);
  const [cardsList, setCardsList] = useState([]);
  const [card, setCard] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`/cards/${id}`);
        const data = response.data;
        setLoading(false);
        if (response.status === 200) {
          setCardsList(data);
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };
    if (!collection) {
      fetchData();
    } else {
      setLoading(false);
      const cards = collection.cards;
      setCardsList(cards);
      const item = cardsList[Math.floor(Math.random() * cardsList.length)];
      setCard(item);
    }
  }, []);

  useEffect(() => {
    const item = cardsList[Math.floor(Math.random() * cardsList.length)];
    setCard(item);
  }, [cardsList]);

  return (
    <div className="learn">
      <Header back={true} />
      {loading ? (
        <Load />
      ) : IsLogged ? (
        <div className="main">
          <div
            className={
              isFlipped
                ? "card-main flipped"
                : flipTonew
                ? "card-main new"
                : "card-main"
            }
          >
            {card ? (
              <Card
                question={card.question}
                answer={card.answer}
                handleFlip={() => handleFlip(false)}
              />
            ) : null}
          </div>
          <div className="card__actions">
            <p onClick={handleSkip}>Skip this card</p>
            <p onClick={handleRight}>I answered right!</p>
            <p>I forgot...</p>
          </div>
        </div>
      ) : (
        <div className="login__error">
          <h2>To use this app you need to register or sign in above</h2>
        </div>
      )}
    </div>
  );
}

export default Learn;
