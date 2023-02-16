import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";

import ProductDetails from "./components/product/ProductDetails";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/product/:id" component={ProductDetails} exact />;
      </Routes>
      <Home />
      <Footer />
    </div>
  );
};

export default App;
