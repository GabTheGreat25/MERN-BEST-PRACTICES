// Import product constants
import {
  PRODUCTS_REQUEST,
  PRODUCTS_SUCCESS,
  PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/productConstants";

// Products Reducer
const productsReducer = (state = { products: [] }, action) => {
  // Check for PRODUCTS_REQUEST action
  if (action.type === PRODUCTS_REQUEST)
    // If true, return state with loading true and empty products array
    return { loading: true, products: [] };

  // Check for PRODUCTS_SUCCESS action
  if (action.type === PRODUCTS_SUCCESS)
    // If true, return state with loading false and products data
    return {
      loading: false,
      ...action.payload,
    };

  // Check for PRODUCTS_FAIL action
  if (action.type === PRODUCTS_FAIL)
    // If true, return state with loading false and error message
    return { loading: false, error: action.payload };

  // Check for CLEAR_ERRORS action
  if (action.type === CLEAR_ERRORS)
    // If true, return state with error set to null
    return { ...state, error: null };

  // Return state by default
  return state;
};

// Product Details Reducer
const productDetailsReducer = (state = { product: {} }, action) => {
  // Check for PRODUCT_DETAILS_REQUEST action
  if (action.type === PRODUCT_DETAILS_REQUEST)
    // If true, return state with loading true
    return { ...state, loading: true };

  // Check for PRODUCT_DETAILS_SUCCESS action
  if (action.type === PRODUCT_DETAILS_SUCCESS)
    // If true, return state with loading false and product data
    return { loading: false, product: action.payload };

  // Check for PRODUCT_DETAILS_FAIL action
  if (action.type === PRODUCT_DETAILS_FAIL)
    // If true, return state with error message
    return { ...state, error: action.payload };

  // Check for CLEAR_ERRORS action
  if (action.type === CLEAR_ERRORS)
    // If true, return state with error set to null
    return { ...state, error: null };

  // Return state by default
  return state;
};

export { productsReducer, productDetailsReducer };
