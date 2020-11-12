import React from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn, setUserName } from "./actions";
import axios from "axios";

import App from "./pages/App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Collection from "./pages/Collection";
import NoMatchPage from "./pages/NoMatchPage";
import Share from "./pages/Share";
import Learn from "./pages/Learn";

const Routes = () => {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Accept"] = "application/json";
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers["Access-Control-Allow-Origin"] = "*";

  return (
    <Switch>
      <Route exact path="/" component={App}></Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/register" component={Register}></Route>
      <Route exact path="/learn/:id" component={Learn}></Route>
      <Route exact path="/share/:id" component={Share}></Route>
      <Route exact path="/collection/:id" component={Collection}></Route>
      <Route component={NoMatchPage}></Route>
    </Switch>
  );
};

export default Routes;
