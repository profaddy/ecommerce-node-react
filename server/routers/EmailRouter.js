'use strict';
const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1/contactus' });
const sendEmail = require('../controller/email/sendEmail.js').default;

router.post('/', async (ctx) => {
  try {
    const { mailOptions } = ctx.request.body;
    console.log(mailOptions);
    // const response = await sendEmail(mailOptions);
    ctx.status = 200;
    ctx.body = {
        status:true,
        msg:"email sent successfully"
    }
  } catch (err) {
    ctx.status = err.status;
    ctx.body = {
      status: false,
      msg: err.statusText,
    };
  }
});
module.exports = router;
