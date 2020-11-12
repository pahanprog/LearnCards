import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Auth.scss";
import Alert from "../components/Alert";
import Axios from "axios";

function Register() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [remember, setRemember] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
      name: nameInput,
      email: emailInput,
      password: passwordInput,
      remember,
    };
    var response;
    try {
      response = await Axios.post("/user/register", {
        data: user,
      });
      const data = response.data;
      if (response.status === 200) {
        handleAlertShow("Successfully registered");
        setTimeout(() => {
          document.location.href = "/";
        }, 1500);
      } else {
        handleAlertShow(data);
      }
    } catch (err) {
      handleAlertShow(response.data.message);
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <section className="modal__main">
        <div className="login__header">
          <h1>Some app name</h1>
          <p>Create your account</p>
        </div>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <label>Username</label>
          <input
            type="text"
            name="username"
            onChange={(e) => {
              setNameInput(e.target.value);
            }}
          />
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
          <input type="submit" value="Sign up" />
          <div className="login">
            <p>
              Have an account?<Link to="/login">Log in now</Link>
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

export default Register;
