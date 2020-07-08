'use strict';
const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1/billing' });
const postBilling = require('../controller/billing/postBilling.js');

router.post('/', async (ctx) => {
  try {
    await postBilling(ctx);
  } catch (err) {
    ctx.status = err.status;
    ctx.body = {
      status: false,
      msg: err.statusText,
    };
  }
});
module.exports = router;
