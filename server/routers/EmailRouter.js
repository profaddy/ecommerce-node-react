'use strict';
const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1/contactus' });
const sendEmail = require('../controller/email/sendEmail.js');
const templates = require('../controller/email/templates.js');

router.post('/', async (ctx) => {
  try {
    const { mailOptions } = ctx.request.body;
    console.log(mailOptions);
    const content = templates.basic(mailOptions);
    const to = 'contact@vowelweb.net';
    const from = 'contact@vowelweb.net';
    const mailOptionWithContent = {...mailOptions,to,from,content}
    const response = await sendEmail(mailOptionWithContent);
    const responseWithTicketId = {...response,ticketId:mailOptions.ticketId}
    console.log(response);
    ctx.status = 200;
    ctx.body = {
      status: true,
      msg: 'email sent successfully',
      data:responseWithTicketId
    };
  } catch (err) {
    console.log(err);
    ctx.status = err.status;
    ctx.body = {
      status: false,
      msg: err.statusText,
    };
  }
});
module.exports = router;
