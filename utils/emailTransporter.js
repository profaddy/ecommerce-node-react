const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
      //TODO:need to import from .env file
      user: "info@vowelweb.com",
      pass: "Test@123",
    },
  });

  module.exports = transporter;