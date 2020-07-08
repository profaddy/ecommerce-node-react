const Shop = require('../../models/Shops.js');
const adminApi = require('../../../utils/adminApi.js');

const postBilling = async (ctx) => {
  try {
    const { plan } = ctx.request.body;
    const shopOrigin = ctx.session.shop;
    console.log(shopOrigin, 'shopOrigin');
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();
    const payload = {
      recurring_application_charge: {
        name: plan.name,
        price: plan.price.split('$')[0],
        return_url: `${shopOrigin}`,
        test: true,
      },
    };
    // const response = await fetch(
    //   `https://${shopOrigin}/admin/api/2020-04/recurring_application_charges.json`,
    //   {
    //     headers: {
    //       'Content-type': 'application/json; charset=UTF-8', // Indicates the content
    //       'X-Shopify-Access-Token': shopDetails[0].accessToken,
    //     },
    //     method: 'post',
    //     body:payload
    //   }
    // );
    adminApi.defaults.headers.common[
      'X-Shopify-Access-Token'
    ] = `${shopDetails[0].accessToken}`;

    const response = await adminApi.post(
      `https://${shopOrigin}/admin/api/2020-04/recurring_application_charges.json`,
      payload
    );
    const resp = await response.json();
    if (response.status !== 200) {
      throw { status: response.status, msg: response.statusText };
    }
    ctx.status = response.status;
    ctx.body = {
      status: true,
      msg: resp,
    };
  } catch (err) {
    console.log(err, 'error');
    ctx.status = 400;
    ctx.body = {
      status: false,
      msg: err.msg || err,
    };
  }
};

module.exports = postBilling;
