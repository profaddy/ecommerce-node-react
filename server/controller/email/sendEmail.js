const transporter = require('../../../utils/emailTransporter.js');
const templates = require('./templates.js');
const sendEmail = async (mailOptions) => {
  const { to, from, content } = mailOptions;
  const contacts = {
    from,
    to,
  };
  const email = Object.assign({}, content, contacts);
  const info = await transporter.sendMail(email);
  return info;
};

module.exports = sendEmail;
