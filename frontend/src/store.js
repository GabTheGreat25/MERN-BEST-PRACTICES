/**
 * This module exports a configured Redux store that uses Redux Toolkit and includes middleware.
 * The store is pre-configured with the reducers used in the "products" and "productDetails" slices,
 * as well as the "thunk" middleware.
 */

import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {
  productsReducer,
  productDetailsReducer,
} from "./reducers/productReducers";

/**
 * The store is configured using the `configureStore` function from Redux Toolkit.
 * The `reducer` field of the configuration object is an object that maps the keys
 * "products" and "productDetails" to their respective reducers.
 * The `middleware` field of the configuration object is an array that includes the "thunk" middleware.
 */
const store = configureStore({
  reducer: {
    products: productsReducer,
    productDetails: productDetailsReducer,
  },
  middleware: [thunk],
});

/**
 * Export the configured store so that it can be used in other parts of the application.
 */
export default store;

// import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";
// import {
//   productsReducer,
//   productDetailsReducer,
// } from "./reducers/productReducers";

// const reducer = combineReducers({
//   products: productsReducer,
//   productDetails: productDetailsReducer,
// });

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(
//   reducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;
