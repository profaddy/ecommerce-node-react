'use strict';
// import Router from 'koa-router';
const Router = require('koa-router');
// const router = new Router();
const router = new Router({ prefix: '/auth' })

router.get('/', async (ctx) => {
  try {
    console.log("auth test",ctx,ctx.query)
    const endpoint = ctx.params.endpoint;
    const response = await fetch(
      `https://${ctx.cookies.get('shopOrigin')}/admin/api/2020-04/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ctx.cookies.get('accessToken'),
        },
      }
    );
    const result = await response.json();
    ctx.body = {
      status: 'success',
      data: result,
    };
  } catch (err) {
    console.log(err);
  }
});
router.put('/api/v1/:endpoint', async (ctx) => {
  try {
    console.log(ctx.request.body, 'ctx response');
    const { editOption, editValue, variants } = ctx.request.body;
    variants.forEach(async (variant) => {
      const updatedPrice = getUpdatedPrice(
        editOption,
        Number(variant.price),
        Number(editValue)
      );
      console.log(updatedPrice, 'updatedPrice>>');
      const url = `https://${ctx.cookies.get(
        'shopOrigin'
      )}/admin/api/2020-04/variants/${variant.id}.json`;
      const payload = {
        variant: {
          id: variant.id,
          price: `${updatedPrice}`,
        },
      };
      const response = await fetch(url, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8', // Indicates the content
          'X-Shopify-Access-Token': ctx.cookies.get('accessToken'),
        },
        method: 'put',
        body: JSON.stringify(payload),
      });
      const resp = await response.json();
      console.log(`reuqest completed for ${variant.title}`, resp);
    });
    const result = [];
    ctx.body = {
      status: 'success',
      data: result,
    };
  } catch (err) {
    console.log(err);
  }
});
module.exports = router

//helpers
const getUpdatedPrice = (editOption, currentPrice, editValue) => {
  console.log(editOption, 'editOption');
  switch (editOption) {
    case 'changeToCustomValue':
      return editValue;
    case 'addPriceByAmount':
      return currentPrice + editValue;
    case 'addPriceByPercentage':
      const offsetToBeAdded = (currentPrice * editValue) / 100;
      return currentPrice + offsetToBeAdded;
    default:
      return editValue;
  }
};
