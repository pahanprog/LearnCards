import React, { useState, useEffect } from "react";
import "../App.scss";
import CardCollection from "../components/CardCollection";
import CollectionAdd from "../components/CollectionAdd";
import Alert from "../components/Alert";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { set, add, signOut, signIn } from "../actions";
import Axios from "axios";
import Load from "../components/Loading";

function App() {
  const dispatch = useDispatch();

  const collections = useSelector((state) => state.collections);
  const IsLogged = useSelector((state) => state.isLogged);

  // if (!IsLogged) document.location.href = "/login";

  const [loading, setLoading] = useState(true);

  const [filtered, setFiltered] = useState([]);
  const [addCollectionVisible, setAddCollectionVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertUndo, setAlertUndo] = useState(false);
  const [alertObj, setAlertObj] = useState({});

  const handleAddClick = () => {
    setAddCollectionVisible(addCollectionVisible ? false : true);
  };

  const handleAlertClose = (index) => {
    setAlertVisible(false);
    setAlertUndo(false);
    setAlertObj({});
  };

  const handleAlertShow = (title, undo = false, obj = {}) => {
    if (undo) {
      setAlertUndo(true);
    }
    if (obj) {
      setAlertObj(obj);
    }
    setAlertMessage(title);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      setAlertUndo(false);
    }, 5000);
  };

  const handleAdd = (obj) => {
    dispatch(add(obj));
    const list = [...filtered];
    list.push(obj);
    setFiltered(list);
    setAddCollectionVisible(false);
  };

  const handleDelete = async (id) => {
    const reqBody = {
      collectionId: id,
    };
    try {
      const response = await Axios.post("collections/delete", {
        data: reqBody,
      });
      const data = response.data;
      const newCollections = collections.filter((value, index) => {
        return value.collection._id !== id;
      });
      dispatch(set(newCollections));
      setFiltered(newCollections);
      handleAlertShow(
        "Deleted colletcion with title: " + data.deletedCollection.title,
        true,
        data
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async (obj) => {
    if (Object.keys(obj).length === 0) {
      console.error("undo obj is empty");
      return;
    }
    const title = obj.deletedCollection.title;
    const description = obj.deletedCollection.description;
    const cards = obj.deletedCards.map((value, index) => {
      return { question: value.question, answer: value.answer };
    });
    const collection = {
      title: title,
      description: description,
      questions: cards,
    };
    console.log(collection);
    try {
      const response = await Axios.post("collections", { data: collection });
      const data = response.data;
      if (response.status === 200) {
        dispatch(signIn());
        handleAdd(data);
        handleAlertShow(
          "Successfully undone collection deletion with title: " + data.title
        );
        console.log(data);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (collections.length !== 0) {
      setFiltered(collections);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await Axios.get("/collections");
        setLoading(false);
        if (response.status === 401) {
          dispatch(signOut());
        } else {
          dispatch(signIn());
        }
        const data = response.data;
        dispatch(set(data.collections));
        setFiltered(data.collections);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const newList = collections.filter((value) => {
      return value.collection.title
        .toLowerCase()
        .includes(searchInput.toLowerCase());
    });
    setFiltered(newList);
  }, [searchInput]);

  return (
    <div className="app">
      <Header setSearchInput={setSearchInput} search={true} />
      {loading ? (
        <Load />
      ) : IsLogged ? (
        <div className="app__main-body">
          <div className="add__new__wrapper">
            <div className="add__new" onClick={handleAddClick}>
              <img
                draggable="false"
                src={require("../Images/plus.svg")}
                alt="add icon"
              ></img>
              <p>Add new collection</p>
            </div>
            <CollectionAdd
              show={addCollectionVisible}
              handleAdd={handleAdd}
              alert={handleAlertShow}
            />
          </div>
          <div className="app__collections">
            {filtered.map((value, index) => {
              return (
                <CardCollection
                  title={value.collection.title}
                  description={value.collection.description}
                  key={value.collection._id.toString()}
                  id={value.collection._id}
                  cards={value.cards}
                  handleDelete={handleDelete}
                ></CardCollection>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="login__error">
          <h2>To use this app you need to register or sign in above</h2>
        </div>
      )}
      {/* <div className="app__main-body">
        <div className="add__new__wrapper">
          <div className="add__new" onClick={handleAddClick}>
            <img
              draggable="false"
              src={require("../Images/plus.svg")}
              alt="add icon"
            ></img>
            <p>Add new collection</p>
          </div>
          <CollectionAdd
            show={addCollectionVisible}
            handleAdd={handleAdd}
            alert={handleAlertShow}
          />
        </div>
        <div className="app__collections">
          {filtered.map((value, index) => {
            return (
              <CardCollection
                title={value.collection.title}
                description={value.collection.description}
                key={value.collection._id.toString()}
                id={value.collection._id}
                cards={value.cards}
                handleDelete={handleDelete}
              ></CardCollection>
            );
          })}
        </div>
      </div> */}

      {alertVisible ? (
        <Alert
          title={alertMessage}
          handleClose={handleAlertClose}
          undo={alertUndo}
          handleUndo={handleUndo}
          obj={alertObj}
        />
      ) : null}
    </div>
  );
}

export default App;
