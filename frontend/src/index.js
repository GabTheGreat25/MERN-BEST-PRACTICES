import React from "react"; // Import the React library
import ReactDOM from "react-dom/client"; // Import the ReactDOM library
import { BrowserRouter } from "react-router-dom"; // Import the BrowserRouter component from the react-router-dom library

import { Provider } from "react-redux"; // Import the Provider component from the react-redux library
import store from "./store"; // Import the store from the store.js file in the current directory
import App from "./App"; // Import the App component from the App.js file in the current directory
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root"));
// Call the createRoot function of ReactDOM to create a root with the specified DOM element

root.render(
  <Provider store={store}>
    {/* Provide the Redux store to the component tree using the <Provider> component */}
    <BrowserRouter>
      {/* Use the browser history to keep UI in sync with URL */}
      <App /> {/* Render the top-level <App> component  */}
      <ToastContainer />
    </BrowserRouter>
  </Provider>
); // Render the application, which is wrapped with the Provider, BrowserRouter and AlertProvider components, to the root element created by ReactDOM
