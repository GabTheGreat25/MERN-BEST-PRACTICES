import React from "react"; // Importing React
import { Routes, Route } from "react-router-dom"; // Importing Routes and Route components from react-router-dom

import Header from "./components/layout/Header"; // Importing the Header component
import Footer from "./components/layout/Footer"; // Importing the Footer component
import Home from "./components/Home"; // Importing the Home component
import ProductDetails from "./components/product/ProductDetails"; // Importing the ProductDetails component

function App() {
  // Defining the App component
  return (
    // App component returns the following JSX code
    <div className="App">
      <Header />
      <Routes>
        {/* Using the Routes component to define the routes for the app */}
        <Route path="/" element={<Home />} exact="true" />
        {/* Definining the route for the Home component */}
        <Route path="/product/:id" element={<ProductDetails />} exact="true" />
        {/* Definining the route for the ProductDetails component */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App; // Exporting the App component as the default export of this module
