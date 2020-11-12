const collectionReducer = (state = [], action) => {
  switch (action.type) {
    case "set":
      return (state = action.collections);
    case "add": {
      const list = [...state];
      list.push(action.collection);
      return (state = list);
    }
    default:
      return state;
  }
};

export default collectionReducer;
