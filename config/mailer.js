const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'tecnovenca2@gmail.com',
    pass:'rcmaupsdnjowjaja'
  }
});

module.exports = transporter;
