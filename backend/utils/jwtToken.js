/**
 * sendToken function
 *
 * @param {object} user - The user object from which the JWT token is retrieved
 * @param {number} statusCode - The HTTP status code to be included in the response
 * @param {object} res - The response object used to send the token and other information to the client
 *
 * The function performs the following operations:
 * 1. Obtains the JWT token from the user object using the getJwtToken method.
 * 2. Computes the length of time for which the token will remain valid by multiplying the COOKIE_EXPIRES_TIME environment variable by various values to convert it into milliseconds.
 * 3. Sends the token to the client as a cookie and returns the user information along with a success status as a JSON response.
 *
 * The response includes the following properties:
 *  - status: the HTTP status code specified by the statusCode argument passed to the function
 *  - cookie: the JWT token, stored as a cookie with the following properties:
 *    - expires: the calculated expiration date for the token
 *    - httpOnly: a boolean value indicating whether the cookie can only be accessed through HTTP requests and not client-side JavaScript code
 *  - json: a JSON object containing the following properties:
 *    - success: a boolean value indicating the success of the operation
 *    - token: the JWT token
 *    - user: the user object passed as an argument to the function
 *
 * @example
 * const user = { getJwtToken: () => "JWT_TOKEN" };
 * const statusCode = 200;
 * const res = {
 *   status: (code) => {
 *     console.log(`Setting status code to: ${code}`);
 *     return res;
 *   },
 *   cookie: (name, value, options) => {
 *     console.log(`Setting cookie: ${name}=${value}, expires=${options.expires}, httpOnly=${options.httpOnly}`);
 *     return res;
 *   },
 *   json: (data) => {
 *     console.log(`Returning JSON response: ${JSON.stringify(data)}`);
 *     return res;
 *   },
 * };
 * sendToken(user, statusCode, res);
 *
 * Output:
 * Setting status code to: 200
 * Setting cookie: token=JWT_TOKEN, expires=2023-02-12T00:00:00.000Z, httpOnly=true
 * Returning JSON response: {"success":true,"token":"JWT_TOKEN","user":{...}}
 */

const sendToken = (user, statusCode, res) => {
  // Obtains the JWT token from the user object
  const token = user.getJwtToken();

  // Determines the duration for which the token will remain valid by computing the time in milliseconds
  const expiresInDays = process.env.COOKIE_EXPIRES_TIME;
  const expiresIn = expiresInDays * 24 * 60 * 60 * 1000;
  console.log(
    `The token will expire in ${expiresInDays} days, which is equivalent to ${expiresIn} milliseconds.`
  );
  console.log(statusCode);
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
