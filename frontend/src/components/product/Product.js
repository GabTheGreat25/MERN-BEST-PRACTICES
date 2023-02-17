import React from "react"; // Importing React library to create components
import { Link } from "react-router-dom"; // Importing Link component from React Router library to handle links

// Defining a functional component named Product that accepts a product object as a prop
const Product = ({ product }) => {
  // Returns JSX code that will be rendered in the browser
  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      {/* A container div with a class of "col-sm-12 col-md-6 col-lg-3 my-3" */}
      <div className="card p-3 rounded">
        {/* A div with a class of "card p-3 rounded" */}
        <img
          className="card-img-top mx-auto"
          src={product.images[0].url} // The first image URL of the product object passed as prop
          alt="productImage"
        />
        <div className="card-body d-flex flex-column">
          {/* A div with a class of "card-body d-flex flex-column" */}
          <h5 className="card-title">
            <a href="/">{product.name}</a> {/* A link with the product name */}
          </h5>
          <div className="ratings mt-auto">
            {/* A div with a class of "ratings mt-auto" */}
            <div className="rating-outer">
              {/* A div with a class of "rating-outer" */}
              <div
                className="rating-inner"
                style={{ width: `${(product.ratings / 5) * 100}%` }} // The width of the rating bar based on the product rating
              ></div>
            </div>
            <span id="no_of_reviews">({product.numOfReviews} reviews)</span>{" "}
            {/* The number of reviews of the product */}
          </div>
          <p className="card-text">${product.price}</p>{" "}
          {/* The price of the product */}
          <Link
            to={`product/${product._id}`} // A link to the product details page with the product ID as parameter
            id="view_btn"
            className="btn btn-block" // A button with a class of "btn btn-block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product; // Exporting the Product component to use in other files
