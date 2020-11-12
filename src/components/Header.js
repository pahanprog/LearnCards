import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../actions";
import Axios from "axios";

function Header(props) {
  const dispatch = useDispatch();

  const username = useSelector((state) => state.username);

  const loggedin = useSelector((state) => state.isLogged);

  let history = useHistory();

  const handleSignInClick = () => {
    var loc = document.location.href;
    loc = loc.split("/");
    var wantedURL = "";
    for (var i = 3; i < loc.length; i++) {
      wantedURL += `/${loc[i]}`;
    }
    document.location.href = `/login?url=${wantedURL}`;
  };

  const handleSignOut = async () => {
    try {
      await Axios("/user/signout");
    } catch (err) {
      console.error(err);
    }
    dispatch(signOut());
  };

  return (
    <div className="app__header">
      <h1 className="header__logo">LearnCards</h1>
      {props.search && loggedin ? (
        <div className="header__search">
          <img src={require("../Images/search.svg")} alt="search icon"></img>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => {
              props.setSearchInput(e.target.value);
            }}
          />
        </div>
      ) : null}
      <div className="header__actions">
        {username ? (
          <div className="username">
            <p>{username}</p>
          </div>
        ) : null}
        {props.back ? (
          <div className="page__actions">
            <p
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </p>
          </div>
        ) : null}
        {useSelector((state) => state.isLogged) ? (
          <div className="profile__actions">
            <p className="main__action" onClick={handleSignOut}>
              Sign out
            </p>
          </div>
        ) : (
          <div className="profile__actions">
            <Link to="/register">
              <p href="">Register</p>
            </Link>
            <a onClick={handleSignInClick}>
              <p className="main__action">Sign in</p>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
