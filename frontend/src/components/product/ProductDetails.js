// Importing required modules and components from external packages and files
import React, { Fragment, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader";
import MetaData from "../layout/Metadata";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails, clearErrors } from "../../actions/productAction";

const ProductDetails = () => {
  // Creating variables to access dispatch function and alerts from react-alert
  const dispatch = useDispatch();

  // Getting the id parameter from the URL
  let { id } = useParams();

  // Using useSelector to get product details from the redux store
  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  const notify = (error = "test") =>
    toast.error(error, {
      position: toast.POSITION.TOP_LEFT,
    });

  // Using useEffect to call getProductDetails action when component mounts or id changes
  useEffect(() => {
    dispatch(getProductDetails(id)); // Dispatching getProductDetails action with the id parameter

    // If there's an error, show an alert and dispatch clearErrors action
    if (error) {
      notify(error); // Showing an error alert
      dispatch(clearErrors()); // Dispatching clearErrors action to clear errors from the redux store
    }
  }, [dispatch, error, id]);

  // Rendering the product details on the page
  return (
    <Fragment>
      {/* If the component is still loading, display a Loader component */}
      {loading ? (
        <Loader />
      ) : (
        // If the component has finished loading, display product information
        <Fragment>
          {/* Display metadata for the product */}
          <MetaData title={product.name} />

          {/* Display the product's image carousel */}
          <div className="row d-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images &&
                  product.images.map((image) => (
                    <Carousel.Item key={image.public_id}>
                      <img
                        className="d-block w-100"
                        src={image.url}
                        alt={product.title}
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>

            {/* Display product information */}
            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product # {product._id}</p>

              <hr />

              {/* Display product ratings */}
              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${(product.ratings / 5) * 100}%` }}
                ></div>
              </div>
              <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

              <hr />

              {/* Display product price */}
              <p id="product_price">${product.price}</p>

              {/* Display the stock counter and add to cart button */}
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus">-</span>

                {/* Display the quantity of items selected */}
                <input
                  type="number"
                  className="form-control count d-inline"
                  value={"quantity"}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={"increaseQty"}>
                  +
                </span>
              </div>

              {/* Add to cart button */}
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
              >
                Add to Cart
              </button>

              <hr />

              {/* Display product stock status */}
              <p>
                Status:{" "}
                <span
                  id="stock_status"
                  className={product.stock > 0 ? "greenColor" : "redColor"}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </p>

              <hr />

              {/* Display product description */}
              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />

              {/* Display product seller */}
              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>

              {/* Review section */}
              <button
                id="review_btn"
                type="button"
                className="btn btn-primary mt-4"
                data-toggle="modal"
                data-target="#ratingModal"
              >
                Submit Your Review
              </button>

              {/* Review login message */}
              <div className="alert alert-danger mt-5" type="alert">
                Login to post your review.
              </div>
              {/* Rating modal */}
              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <div
                    className="modal fade" // create a modal that fades in and out
                    id="ratingModal" // set the modal ID to "ratingModal"
                    tabIndex="-1" // set the tab index to -1
                    role="dialog" // set the role to "dialog"
                    aria-labelledby="ratingModalLabel" // set the aria-labelledby attribute to "ratingModalLabel"
                    aria-hidden="true" // set the aria-hidden attribute to true
                  >
                    <div className="modal-dialog" role="document">
                      {/* create a modal dialog with a "document" role */}
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="ratingModalLabel">
                            Submit Review
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal" // add data attribute to dismiss the modal when clicked
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span> /
                          </button>
                        </div>
                        <div className="modal-body">
                          <ul className="stars">
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                          </ul>
                          <textarea
                            name="review"
                            id="review"
                            className="form-control mt-3" // create a textarea with a class of "form-control" and top margin of 3
                          ></textarea>
                          <button
                            className="btn my-3 float-right review-btn px-4 text-white" // create a button with classes and styles
                            data-dismiss="modal" // add data attribute to dismiss the modal when clicked
                            aria-label="Close"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
export default ProductDetails;
