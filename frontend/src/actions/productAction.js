import axios from "axios";
import {
  PRODUCTS_REQUEST,
  PRODUCTS_SUCCESS,
  PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/productConstants";

// Define a function that returns another function that accepts a `dispatch` argument
const getProducts = () => async (dispatch) => {
  try {
    // Dispatch an action to indicate that the request for products has begun
    dispatch({ type: PRODUCTS_REQUEST });

    // Make a GET request to the "/api/v1/products" endpoint using Axios
    const { data } = await axios.get("/api/v1/products");

    // Log the response data to the console
    console.log(data);

    // If the response is successful
    if (data.success) {
      // Log the array of products and the number of products to the console
      console.log(data.info.products);
      console.log(data.info.productsCount);

      // Dispatch an action with the products and number of products as the payload
      dispatch({
        type: PRODUCTS_SUCCESS,
        payload: {
          products: data.info.products,
          productsCount: data.info.productsCount,
        },
      });
    } else {
      // If the response is not successful, dispatch an action with the error message as the payload
      dispatch({
        type: PRODUCTS_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    // If there is an error, dispatch an action with the error message as the payload
    dispatch({
      type: PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

const getProductDetails = (id) => async (dispatch) => {
  try {
    // Dispatch the PRODUCT_DETAILS_REQUEST action to indicate that the request is being made
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    // Make a request to the API to get the details of a product with the specified id
    const { data } = await axios.get(`/api/v1/product/${id}`);
    console.log(data);

    // If the request is successful, dispatch the PRODUCT_DETAILS_SUCCESS action with the product details as the payload
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.info });
    console.log(data.info); // The reason it is being used is that the info property of the data object is not contained within an array
    console.log(data.info.product);
  } catch (error) {
    // If there is an error while making the API request, dispatch the PRODUCT_DETAILS_FAIL action with the error message as the payload
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

const clearErrors = () => async (dispatch) => {
  // Dispatch the CLEAR_ERRORS action to clear any errors in the state
  dispatch({ type: CLEAR_ERRORS });
};

export { getProducts, getProductDetails, clearErrors };
