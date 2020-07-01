'use strict';
const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1/ctasks' });
const fetchTasks = require('../controller/tasks/fetchCTasks.js');

router.get('/', async (ctx) => {
  try {
    await fetchTasks(ctx);
  } catch (err) {
    ctx.status = err.status;
    ctx.body = {
      status: false,
      msg: err.msg,
    };
  }
});
module.exports = router;
