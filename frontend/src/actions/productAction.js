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

import Fuse from "fuse.js";

export const getProducts =
  (keyword = "", currentPage = 1, price, category = null) =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCTS_REQUEST });

      const categoryParam = category ? `&category=${category}` : "";
      const url = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}${categoryParam}`;

      const { data } = await axios.get(url);
      console.log(data);
      dispatch({
        type: PRODUCTS_SUCCESS,
        payload: data.info,
      });
    } catch (error) {
      dispatch({
        type: PRODUCTS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.info,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};
