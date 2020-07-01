'use strict';
const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1/taskprogress' });
const fetchTasksProgress = require('../controller/tasks/fetchTaskProgress.js');

router.get('/', async (ctx) => {
  try {
    await fetchTasksProgress(ctx);
  } catch (err) {
    ctx.status = err.status;
    ctx.body = {
      status: false,
      msg: err.msg,
    };
  }
});
module.exports = router;
