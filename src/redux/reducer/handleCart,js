const cart = [];

const handleCart = (state = cart, action) => {
  const product = action.payload;
  switch (action.type) {
    case "ADDITEM":
      // check if product is already exits
      const exists = state.find((x) => x.id === product.id);
      if (exists) {
        // increase the quantity
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        // const product = action.payload;
        return [
          ...state,
          {
            ...product,
            qty: 1,
          },
        ];
      }
    

    case "DELITEM":
      const exists1 = state.find((x) => x.id === product.id);
      if (exists1.qty === 1) {
        return state.filter((X) => X.id !== exists1.id);
      } else {
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty - 1 } : x
        );
      }
    

    default:
      return state;
  }
};

export default handleCart;
