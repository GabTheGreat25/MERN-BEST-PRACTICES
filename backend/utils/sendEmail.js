const nodemailer = require("nodemailer");

/**
 * This function sends an email to a specified recipient using the nodemailer library.
 *
 * @param {Object} options - An object that contains the options for the email.
 * @param {String} options.email - The email address of the recipient.
 * @param {String} options.subject - The subject line for the email.
 * @param {String} options.message - The message body for the email.
 *
 * The nodemailer library is required to send emails using this function. The function creates a transporter object using the nodemailer library, which is used to send emails via the Simple Mail Transfer Protocol (SMTP). The transporter object is created by providing the host and port for the SMTP server, as well as the authentication credentials for the SMTP server.
 *
 * A message object is defined to hold the details of the email being sent. The `from` field for the email is set to include both a name and an email address, with the `to` field set to the email address of the recipient. The subject line and message body for the email are specified in the `subject` and `text` fields of the message object, respectively.
 *
 * The email is then sent by calling the `sendMail` method on the transporter object and passing in the message object.
 *
 * @example
 * sendEmail({
 *   email: 'recipient@example.com',
 *   subject: 'Test Email',
 *   message: 'Hello, this is a test email'
 * });
 */

const sendEmail = async (options) => {
  // Create a transporter object using the nodemailer library
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // The host for the SMTP server
    port: process.env.SMTP_PORT, // The port for the SMTP server

    // The authentication credentials for the SMTP server
    auth: {
      user: process.env.SMTP_EMAIL, // The email address for authentication
      pass: process.env.SMTP_PASSWORD, // The password for authentication
    },
  });

  // Define the message object to be sent via email
  const message = {
    // The "from" field for the email, which includes both a name and an email address
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,

    // The recipient's email address
    to: options.email,

    // The subject line for the email
    subject: options.subject,

    // The message body for the email
    text: options.message,
  };

  // Send the email using the transporter and the message object
  await transporter.sendMail(message);
  console.log(transporter.options.host);
};

// Export the sendEmail function for use in other parts of the application
module.exports = sendEmail;
