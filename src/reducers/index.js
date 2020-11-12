import { combineReducers } from "redux";

import collectionReducer from "./collections";
import loggedReducer from "./isLogged";
import username from "./username";

const rootReducer = combineReducers({
  collections: collectionReducer,
  isLogged: loggedReducer,
  username,
});

export default rootReducer;
