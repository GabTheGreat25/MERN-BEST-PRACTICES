import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productAction";
import Loader from "./layout/Loader";
import MetaData from "./layout/Metadata";
import Product from "./product/Product";
import { useAlert } from "react-alert";

const Home = () => {
  // Define variables and functions with hooks
  const dispatch = useDispatch(); // Get the dispatch function from the redux store
  const { loading, products, error } = useSelector((state) => state.products); // Get products, loading state, and error from the redux store
  const alert = useAlert(); // Get the alert function from the react-alert library

  // Call the dispatch function to get products and handle errors
  useEffect(() => {
    dispatch(getProducts()); // Dispatch an action to get products
    if (error) alert.error(error); // Show an error alert if there is an error
  }, [dispatch, alert, error]);

  // Render the home page with products, metadata, and loading indicator
  return (
    <Fragment>
      {loading ? ( // Show a loading indicator if the products are being loaded
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Buy Best Products Online" />{" "}
          {/* Set metadata for the
          page */}
          <h1 className="text-center" id="products_heading">
            Latest Products
          </h1>
          <section className="container mt-5" id="products">
            <div className="row">
              {products && // Check if there are products to display
                products.map(
                  (
                    product // Map through the products and display them
                  ) => <Product key={product._id} product={product} />
                )}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
