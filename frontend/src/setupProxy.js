// This code sets up a proxy to forward requests from the frontend
// running on port 3000 to a backend running on port 4000.

// Import the createProxyMiddleware function from the http-proxy-middleware package
const { createProxyMiddleware } = require("http-proxy-middleware");

// Export a function that takes an Express app object as its argument
module.exports = function (app) {
  // Use the createProxyMiddleware function to set up a proxy
  // The first argument ("/api") specifies which requests should be forwarded
  // The second argument is an options object that specifies where to forward the requests
  app.use(
    "/api",
    createProxyMiddleware({
      // Target is the URL where the requests should be forwarded
      target: "http://localhost:4000",
      // Change origin is necessary when the target is a different domain
      changeOrigin: true,
    })
  );
};
