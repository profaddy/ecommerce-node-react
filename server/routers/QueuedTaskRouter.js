'use strict';
const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1/qtasks' });
const fetchTasks = require('../controller/tasks/fetchTasks.js');

router.get('/:queueId', async (ctx) => {
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
