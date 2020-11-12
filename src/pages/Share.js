import React, { useState, useEffect } from "react";
import "../Collection.scss";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Axios from "axios";
import { useSelector } from "react-redux";
import Load from "../components/Loading";

function Share() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [collectionHeader, setCollectionHeader] = useState({});
  const [collectionCardss, setCollectionCards] = useState([]);

  const IsLogged = useSelector((state) => state.isLogged);

  const [loading, setLoading] = useState(true);

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handleAlertShow = (title) => {
    setAlertMessage(title);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  const { id } = useParams();

  const handleSaveClick = async () => {
    const collection = {
      title: collectionHeader.title,
      description: collectionHeader.description,
      questions: collectionCardss,
    };
    try {
      const response = await Axios.post("/collections", {
        data: collection,
      });
      const data = response.data;
      if (response.status === 200) {
        // window.location.href = "/";
        handleAlertShow(
          "Successfully added collection with title: " + data.title
        );
      } else {
        handleAlertShow(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`share/${id}`);
        const data = response.data;
        setLoading(false);
        if (response.status === 200) {
          setCollectionHeader(data.collection);
          setCollectionCards(data.cards);
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
          <div className="share__actions">
            <span onClick={handleSaveClick}>Save to your account</span>
            <Link to="/">
              <span>Cancel</span>
            </Link>
          </div>
          <div className="collection__header">
            <h1>Collection info</h1>
            <div className="collection__info">
              <div className="header__title">
                <label>Collection title</label>
                <span className="title">{collectionHeader.title}</span>
              </div>
              <div className="header__description">
                <label>Collection description</label>
                <span className="description">
                  {collectionHeader.description}
                </span>
              </div>
            </div>
          </div>
          <div className="collection__body">
            <h2>Collection cards</h2>
            <div className="cards__grid">
              {collectionCardss.map((value, index) => {
                return (
                  <div className="card__item" key={index.toString()}>
                    <label>Card #{index + 1}</label>
                    <span>{value.question}</span>
                    <span>{value.answer}</span>
                  </div>
                );
              })}
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

export default Share;
