const Shop = require('../../models/Shops.js');
const adminApi = require('../../../utils/adminApi.js');

const postBilling = async (plan, shopOrigin, accessToken) => {
  try {
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();
    const payload = {
      recurring_application_charge: {
        name: plan.name,
        price: plan.price.split('$')[0],
        return_url: `https://${shopOrigin}/admin/apps/`,
        trial_days: 3,
        test: true,
      },
    };
    adminApi.defaults.headers.common[
      'X-Shopify-Access-Token'
    ] = `${accessToken}`;

    const response = await adminApi.post(
      `https://${shopOrigin}/admin/api/2020-04/recurring_application_charges.json`,
      payload
    );
    console.log(
      response,
      response.data.recurring_application_charge.confirmation_url,
      'resonse'
    );
    return response.data.recurring_application_charge;
  } catch (err) {
    console.log(err, 'error');
  }
};

module.exports = postBilling;
