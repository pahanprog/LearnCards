import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Auth.scss";
import Alert from "../components/Alert";
import Axios from "axios";

import { useParams, useLocation } from "react-router-dom";

function Login() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [remember, setRemember] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const url = new URLSearchParams(useLocation().search).get("url");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: emailInput,
      password: passwordInput,
      remember,
    };
    try {
      const response = await Axios.post("/user/login", {
        data: user,
      });
      const data = response.data;

      if (response.status !== 200) {
        handleAlertShow(data.message);
        return;
      }

      handleAlertShow("Successfully logged in!");
      setTimeout(() => {
        if (url) {
          document.location.href = url;
        } else document.location.href = "/";
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <section className="modal__main">
        <div className="login__header">
          <h1>Some app name</h1>
          <p>Log in to your account</p>
        </div>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <label>Email address</label>
          <input
            type="text"
            name="email"
            onChange={(e) => setEmailInput(e.target.value)}
            autoComplete="email"
          />
          <label>Password</label>
          <input
            type="password"
            name="pass"
            onChange={(e) => setPasswordInput(e.target.value)}
            autoComplete="current-password"
          />
          <div className="login__checkbox">
            <input
              type="checkbox"
              onChange={() =>
                remember ? setRemember(false) : setRemember(true)
              }
            />
            <label>Remember me</label>
          </div>
          <input type="submit" value="Sign in" />
          <div className="regiter">
            <p>
              Don't have an account?<Link to="/register">Sign up</Link>
            </p>
          </div>
        </form>
      </section>
      {alertVisible ? (
        <Alert title={alertMessage} handleClose={handleAlertClose} />
      ) : null}
    </div>
  );
}

export default Login;
