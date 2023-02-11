const sendToken = (user, statusCode, res) => {
  // Obtains the JWT token from the user object
  const token = user.getJwtToken();

  // Determines the duration for which the token will remain valid by computing the time in milliseconds
  const expiresIn = process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000;

  // Sends the token to the client as a cookie along with the user information as a JSON response
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + expiresIn), // Specifies the expiration date for the cookie
      httpOnly: true, // Restricts access to the cookie to only HTTP requests and not JavaScript code
    })
    .json({ success: true, token, user }); // Returns the response with a success status, the token, and the user data
};

module.exports = sendToken;

/**
 * The purpose of the sendToken function is to deliver a JSON Web Token (JWT) to the client.
 * This function requires three inputs:
 *
 * user: the user object from which the JWT token is retrieved
 * statusCode: the HTTP status code to be included in the response
 * res: the response object that is utilized to send the token and other information to the client
 *
 * The function performs the following actions:
 * 1. It obtains the JWT token from the user object using the getJwtToken method.
 * 2. It computes the length of time for which the token will remain valid by multiplying the COOKIE_EXPIRES_TIME environment variable by various values to convert it into milliseconds.
 * 3. It sends the token to the client as a cookie and returns the user information along with a success status as a JSON response.*    The response has the following properties:
 *    - status: the HTTP status code specified by the statusCode argument passed to the function
 *    - cookie: the JWT token, stored as a cookie with the following properties:
 *      - expires: the calculated expiration date for the token
 *      - httpOnly: a boolean value indicating whether the cookie can only be accessed through HTTP requests and not client-side JavaScript code
 *    - json: a JSON object containing the following properties:
 *      - success: a boolean value indicating the success of the operation
 *      - token: the JWT token*      - user: the user object passed as an argument to the function.
 */
