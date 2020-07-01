const asyncForEach = require('../../utils/asyncForEach.js');
const isEmpty = require('lodash/isEmpty');
const Shop = require('../../models/Shops.js');
const QTask = require('../../models/queuedTasks.js');
const CTask =require('../../models/CompletedTasks.js');
const mongoose = require('mongoose');

const updateProduts = async (ctx) => {
  try {
    const {
      editOption,
      editValue,
      variants,
      variantFilterOptions,
    } = ctx.request.body;
    const shopOrigin = ctx.session.shop;
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();
    let filteredVariants = variants;
    if (
      !(
        isEmpty(variantFilterOptions.filter) ||
        variantFilterOptions.filter === 'allVariants'
      )
    ) {
      filteredVariants = variants.filter((variant) =>
        shouldAdd(variant, variantFilterOptions)
      );
    }
    let response = {};
    let errors = [];
    const queuedTasks = new QTask({
      _id: new mongoose.Types.ObjectId(),
      shopOrigin: ctx.session.shop,
      type:"price",
      editOption: editOption,
      editValue:editValue,
      variantFilterOptions:variantFilterOptions,
      variants:filteredVariants,
      status:"queued",
      created_at: new Date(),
      updated_at: new Date()   
    });
    await queuedTasks.save();
    const variantList =  await QTask.findOne({
      shopOrigin: shopOrigin,
      _id:queuedTasks._id
    }).exec();
    async function updateFiltreedVariants() {
      await asyncForEach(variantList.variants, async (variant) => {
        const updatedPrice = getUpdatedPrice(
          editOption,
          Number(variant.price),
          Number(editValue)
        );
        const url = `https://${shopOrigin}/admin/api/2020-04/variants/${variant.id}.json`;
        const payload = {
          variant: {
            id: variant.id,
            price: `${updatedPrice}`,
          },
        };
         response = await fetch(url, {
          headers: {
            'Content-type': 'application/json; charset=UTF-8', // Indicates the content
            'X-Shopify-Access-Token': shopDetails[0].accessToken,
          },
          method: 'put',
          body: JSON.stringify(payload),
        });
        
        if (response.status !== 200) {
          errors.push({
            status: response.status,
            msg: response.statusText,
            data: variant,
          });
        }
        const completedTasks = new CTask({
          _id: new mongoose.Types.ObjectId(),
          queueId:queuedTasks._id,
          shopOrigin: ctx.session.shop,
          type:"price",
          editOption: editOption,
          editValue:editValue,
          variantFilterOptions:variantFilterOptions,
          variant:variant,
          status:response.status,
          status:response.statusText,
          created_at: new Date(),
          updated_at: new Date()   
        });
        await completedTasks.save();
      });
      console.log(queuedTasks._id ,"completed")
      await QTask.updateOne({ shopOrigin:shopOrigin,_id:queuedTasks._id }, {
        $set: {
            status:"completed",
            updated_at: new Date()
        }
    });
    }
    ctx.status = 200;
    ctx.body = {
      status: true,
      data: {id:variantList._id}
    };
    await updateFiltreedVariants();
    if (!isEmpty(errors)) {
      throw errors;
    }
    const result = [];
    ctx.status = 200;
    ctx.body = {
      status: true,
      data: {id:queuedTasks._id}
    };
  } catch (err) {
    console.log(err,"err")
    ctx.status = 400;
    ctx.body = {
      status: false,
      errors: err.msg,
    };
  }
};

module.exports = updateProduts;
//helpers
const getUpdatedPrice = (editOption, currentPrice, editValue) => {
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

const filterByProduct = (products, filterOptions) => {
  const { filter, filterAction } = filterOptions;
  const filteredProducts = products.filter((product) => {
    return shouldAdd(product, filterOptions);
  });
  return filteredProducts;
};

const filterByVariant = (products, filterOptions) => {
  const filteredProducts = products.reduce((acc, product) => {
    const { variants } = product;
    const filteredVariants = variants.filter((variant) =>
      shouldAdd(variant, filterOptions)
    );
    if (filteredVariants.length === variants.length) {
      acc.push(product);
    }
    return acc;
  }, []);
  return filteredProducts;
};

const shouldAdd = (product, filterOptions) => {
  const { filter, filterAction, filterValue } = filterOptions;
  switch (filterAction) {
    case 'n>':
      return Number(product[`${filter}`]) === Number(filterValue);
    case 'n!==':
      return !(Number(product[`${filter}`]) === Number(filterValue));
    case 'n===':
      return Number(product[`${filter}`]) === Number(filterValue);
    case 's===':
      return product[`${filter}`].indexOf(filterValue) !== -1;
    case 's!==':
      return !(product[`${filter}`].indexOf(filterValue) !== -1);
    case 's!':
      return isEmpty(product[`${filter}`]);
    default:
      return false;
  }
};
