export const set = (collections) => {
  return {
    type: "set",
    collections: collections,
  };
};

export const add = (collection) => {
  return {
    type: "add",
    collection,
  };
};

export const setUserName = (name) => {
  return {
    type: "setName",
    name,
  };
};

export const signOut = () => {
  return {
    type: "SIGN_OUT",
  };
};

export const signIn = () => {
  return {
    type: "SIGN_IN",
  };
};
