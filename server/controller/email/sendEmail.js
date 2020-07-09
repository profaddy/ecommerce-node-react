const transporter = require('../../../utils/emailTransporter.js');
const templates = require('./templates.js')
const sendEmail = async mailOptions => {
    
    const contacts = {
        from: `${mailOptions.userEmail}`,
        to: `info@vowelweb.com`,
    } 
    const content = templates.basic(mailOPtions.message)
    const email = Object.assign({}, content, contacts);
    const info = await transporter.sendMail(email);
    return info;
}

module.exports = sendEmail;