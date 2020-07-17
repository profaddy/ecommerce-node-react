'use strict';
const { isEmpty } = require('lodash');
const Shop = require('../models/Shops.js');
const Router = require('koa-router');
const postBilling = require('../controller/billing/postBilling');
const adminApi = require('../../utils/adminApi.js');
const router = new Router({ prefix: '/api/v1/test' });

router.get('/', async (ctx) => {
  try {
    const shopOrigin = ctx.session.shop;
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();
    const accessToken = shopDetails[0].accessToken;
    const chargeDetails = shopDetails[0].chargeDetails;
    let confirmationUrl = null;
    let status = "success";
    if (!isEmpty(chargeDetails)) {
      adminApi.defaults.headers.common[
        'X-Shopify-Access-Token'
      ] = `${shopDetails[0].accessToken}`;
      const response = await adminApi.get(
        `https://${shopOrigin}/admin/api/2020-04/recurring_application_charges/${chargeDetails.id}.json`
      );
      console.log(response.data, 'getcharge daresponse');
      const chargeStatus = response.data.recurring_application_charge.status;
      if(chargeStatus !== 'active'){
        const response = await adminApi.post(
          `https://${shopOrigin}/admin/api/2020-04/recurring_application_charges/${chargeDetails.id}/activate.json`,
          chargeDetails
        );
        status = "activate";
        confirmationUrl = `https://${shopOrigin}/admin/apps`
      }
      if (chargeStatus !== 'active' &&  chargeStatus !== 'accepted') {
        const plan = {
          price: '4.99',
          name: 'Basic Plan',
        };
        const billingResponse = await postBilling(plan, shopOrigin,accessToken);
        confirmationUrl = billingResponse.confirmation_url;
        status = "billing"
        ctx.redirect(confirmationUrl);
      }
    } else {
      const plan = {
        price: '4.99',
        name: 'Basic Plan',
      };
      const billingResponse = await postBilling(plan, shopOrigin,accessToken);
       confirmationUrl = billingResponse.confirmation_url;
       status = "billing"
      ctx.redirect(confirmationUrl);
    }

    console.log('auth test');
    ctx.status = 200;
    ctx.body = {
      status: status,
      data: confirmationUrl,
    };
  } catch (err) {
    console.log(err,"error in test auth router")
    ctx.status = 400;
    ctx.body = {
      status: "failure",
      msg: err,
    };
    console.log(err);
  }
});

module.exports = router;

