import React from "react"; // Import the React library
import ReactDOM from "react-dom/client"; // Import the ReactDOM library
import { BrowserRouter } from "react-router-dom"; // Import the BrowserRouter component from the react-router-dom library

import { Provider } from "react-redux"; // Import the Provider component from the react-redux library
import store from "./store"; // Import the store from the store.js file in the current directory
import App from "./App"; // Import the App component from the App.js file in the current directory

import { positions, transitions, Provider as AlertProvider } from "react-alert"; // Import the necessary components from the react-alert library
import AlertTemplate from "react-alert-template-basic"; // Import the AlertTemplate component from the react-alert-template-basic library

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
}; // Create an options object for react-alert

const root = ReactDOM.createRoot(document.getElementById("root"));
// Call the createRoot function of ReactDOM to create a root with the specified DOM element

root.render(
  <Provider store={store}>
    {/* Provide the Redux store to the component tree using the <Provider> component */}
    <BrowserRouter>
      {/* Use the browser history to keep UI in sync with URL */}
      <AlertProvider template={AlertTemplate} {...options}>
        {/* Provide the AlertTemplate and options to the component tree using the <AlertProvider> component */}
        <App /> {/* Render the top-level <App> component  */}
      </AlertProvider>
    </BrowserRouter>
  </Provider>
); // Render the application, which is wrapped with the Provider, BrowserRouter and AlertProvider components, to the root element created by ReactDOM
