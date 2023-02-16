import React, { Fragment, useState, useEffect } from "react";
import MetaData from "./layout/Metadata";
import Product from "./product/Product";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productAction";
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, products, error, productsCount } = useSelector(
    (state) => state.products
  );

  //   useEffect( () => {
  //     dispatch(getProducts())
  //   }, [dispatch] );

  useEffect(() => {
    if (error) {
      alert.success("success");
      return alert.error(error);
    }
    dispatch(getProducts());
  }, [dispatch, alert, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
