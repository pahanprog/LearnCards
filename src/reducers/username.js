const username = (state = "", action) => {
  switch (action.type) {
    case "setName":
      return (state = action.name);
    case "SIGN_OUT":
      return (state = "");
    default:
      return state;
  }
};

export default username;
