'use strict';
const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1/products' });
const updateProducts = require('../controller/products/updateProducts.js');
const fetchProducts = require('../controller/products/fetchProducts.js');

router.get('/', async (ctx) => {
  try {
    await fetchProducts(ctx);
  } catch (err) {
    ctx.status = err.status;
    ctx.body = {
      status: false,
      msg: err.msg,
    };
  }
});
router.put('/', async (ctx) => {
  try {
    await updateProducts(ctx);

  } catch (err) {
    ctx.status = err.status;
    ctx.body = {
      status: false,
      errors: err,
    };
  }
});
module.exports = router;
